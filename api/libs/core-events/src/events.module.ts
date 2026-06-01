import { DynamicModule, InjectionToken, Module, OptionalFactoryDependency } from '@nestjs/common';

import {
  RabbitMQEventPublisherAdapter,
  RABBITMQ_CLIENT,
} from './publisher/rabbitmq-event-publisher.adapter';

export interface EventsModuleOptions {
  rabbitmqUrl: string;
}

export interface EventsModuleAsyncOptions<T extends Array<any> = Array<any>> {
  useFactory: (...args: T) => EventsModuleOptions | Promise<EventsModuleOptions>;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  imports?: DynamicModule[];
}

@Module({})
export class EventsModule {
  static forRoot(options: EventsModuleOptions): DynamicModule {
    return {
      module: EventsModule,
      providers: [
        { provide: RABBITMQ_CLIENT, useValue: options.rabbitmqUrl },
        {
          provide: RabbitMQEventPublisherAdapter,
          useFactory: (rabbitmqUrl: string) => new RabbitMQEventPublisherAdapter(rabbitmqUrl),
          inject: [RABBITMQ_CLIENT],
        },
      ],
      exports: [RabbitMQEventPublisherAdapter],
    };
  }

  static forRootAsync<T extends Array<any> = Array<any>>(
    asyncOptions: EventsModuleAsyncOptions<T>,
  ): DynamicModule {
    return {
      module: EventsModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        {
          provide: RABBITMQ_CLIENT,
          useFactory: async (...args: T) => {
            const options = await asyncOptions.useFactory(...args);
            return options.rabbitmqUrl;
          },
          inject: asyncOptions.inject ?? [],
        },
        {
          provide: RabbitMQEventPublisherAdapter,
          useFactory: (rabbitmqUrl: string) => new RabbitMQEventPublisherAdapter(rabbitmqUrl),
          inject: [RABBITMQ_CLIENT],
        },
      ],
      exports: [RabbitMQEventPublisherAdapter],
    };
  }
}
