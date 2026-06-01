import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { SmtpConfigPort, SmtpConfig, SMTP_CONFIG_PORT } from './smtp-config.port';
import { MailPort } from './mail.port';

@Injectable()
export class NodemailerMailAdapter implements MailPort, OnModuleInit {
  private readonly logger = new Logger(NodemailerMailAdapter.name);
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail = 'noreply@planta.com';

  constructor(
    @Inject(SMTP_CONFIG_PORT) private readonly smtpConfigPort: SmtpConfigPort,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const config = await this.smtpConfigPort.load();
    if (config) {
      this.setupTransporter(config);
    } else {
      this.setupFromEnv();
    }
  }

  private setupTransporter(config: SmtpConfig): void {
    this.fromEmail = config.fromEmail;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
    this.logger.log('SMTP configurado via banco de dados');
  }

  private setupFromEnv(): void {
    this.fromEmail = this.configService.get('SMTP_FROM', 'noreply@planta.com');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'localhost'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get('SMTP_USER', ''),
        pass: this.configService.get('SMTP_PASS', ''),
      },
    });
    this.logger.log('SMTP configurado via variáveis de ambiente');
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Transporter SMTP não inicializado — email não enviado');
      return;
    }
    await this.transporter.sendMail({ from: this.fromEmail, to, subject, html });
  }

  async sendResetPasswordEmail(email: string, token: string, username?: string): Promise<void> {
    const html = `<p>Olá${username ? ` ${username}` : ''}! Clique abaixo para redefinir sua senha:</p>
      <a href="${this.configService.get('APP_URL')}/reset-password?token=${token}">Redefinir senha</a>`;
    await this.send(email, 'Redefinição de senha', html);
  }

  async sendSignatureLink(email: string, token: string): Promise<void> {
    const html = `<p>Use o link abaixo para completar seu cadastro:</p>
      <a href="${this.configService.get('APP_URL')}/signup?token=${token}">Completar cadastro</a>`;
    await this.send(email, 'Complete seu cadastro', html);
  }

  async sendRefreshTokenSecurityAlert(
    email: string,
    name: string,
    dateTime: string,
    ip?: string,
  ): Promise<void> {
    const html = `<p>Olá ${name}, sua sessão foi renovada em ${dateTime}${ip ? ` a partir do IP ${ip}` : ''}. Se não foi você, revogue seus tokens imediatamente.</p>`;
    await this.send(email, 'Alerta de segurança — sessão renovada', html);
  }

  async sendSessionRenewedEmail(email: string, name: string, dateTime: string): Promise<void> {
    const html = `<p>Olá ${name}, sua sessão foi renovada com sucesso em ${dateTime}.</p>`;
    await this.send(email, 'Sessão renovada', html);
  }

  async sendTokensRevokedEmail(email: string, name: string): Promise<void> {
    const html = `<p>Olá ${name}, todos os seus tokens de acesso foram revogados. Faça login novamente.</p>`;
    await this.send(email, 'Tokens revogados', html);
  }
}
