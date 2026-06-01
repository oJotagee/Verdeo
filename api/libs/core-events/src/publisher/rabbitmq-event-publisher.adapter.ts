import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';

import { EventEnvelope, EventPublisher } from '@app/core-domain';
import { correlationStorage } from '@app/core-shared';
import { DomainException } from '@app/core-shared';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';

const EXCHANGE_NAME = 'plant.events';
const EXCHANGE_TYPE = 'topic';

@Injectable()
export class RabbitMQEventPublisherAdapter
  implements EventPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQEventPublisherAdapter.name);

  private connection: amqplib.ChannelModel | null = null;
  private channel: amqplib.Channel | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  constructor(private readonly rabbitmqUrl: string) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.isDestroyed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
    } catch {
      // Ignora erros ao fechar channel que já pode estar fechado
    }

    try {
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
    } catch {
      // Ignora erros ao fechar conexão que já pode estar fechada
    }
  }

  private async connect(): Promise<void> {
    try {
      this.logger.log(`Conectando ao RabbitMQ: ${this.rabbitmqUrl}`);

      this.connection = await amqplib.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });

      this.logger.log(
        `Conexão RabbitMQ estabelecida. Exchange '${EXCHANGE_NAME}' (${EXCHANGE_TYPE}) pronto.`,
      );

      this.connection.on('error', (err: Error) => {
        this.logger.error(`Erro na conexão RabbitMQ: ${err.message}`);
        this.scheduleReconnect();
      });

      this.connection.on('close', () => {
        if (!this.isDestroyed) {
          this.logger.warn('Conexão RabbitMQ fechada inesperadamente. Reconectando...');
          this.scheduleReconnect();
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Falha ao conectar ao RabbitMQ: ${message}`);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.isDestroyed || this.reconnectTimer) {
      return;
    }

    this.connection = null;
    this.channel = null;

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      await this.connect();
    }, 5_000);
  }

  async publish(event: EventEnvelope): Promise<void> {
    if (!this.channel) {
      throw new DomainException(
        `Canal RabbitMQ não disponível ao publicar evento '${event.eventType}'`,
        'EVENT_PUBLISH_FAILED',
      );
    }

    const correlationId = event.correlationId || correlationStorage.getStore()?.correlationId || '';
    const enrichedEvent: EventEnvelope = { ...event, correlationId };

    try {
      const buffer = Buffer.from(JSON.stringify(enrichedEvent));

      const published = this.channel.publish(EXCHANGE_NAME, enrichedEvent.eventType, buffer, {
        persistent: true,
        contentType: 'application/json',
        headers: {
          correlationId: enrichedEvent.correlationId,
          eventType: enrichedEvent.eventType,
        },
      });

      if (!published) {
        this.logger.warn(
          `Buffer do channel cheio ao publicar evento '${enrichedEvent.eventType}'.`,
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new DomainException(
        `Falha ao publicar evento '${enrichedEvent.eventType}': ${message}`,
        'EVENT_PUBLISH_FAILED',
      );
    }
  }

  async publishAll(events: EventEnvelope[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
