import { Injectable, Logger } from '@nestjs/common';
import { MailPort } from './mail.port';

@Injectable()
export class MockMailAdapter implements MailPort {
  private readonly logger = new Logger(MockMailAdapter.name);

  async sendResetPasswordEmail(email: string, token: string, username?: string): Promise<void> {
    this.logger.debug(
      `[MOCK] Reset password para ${email} (user: ${username ?? 'N/A'}), token: ${token}`,
    );
  }

  async sendSignatureLink(email: string, token: string): Promise<void> {
    this.logger.debug(`[MOCK] Signature link para ${email}, token: ${token}`);
  }

  async sendRefreshTokenSecurityAlert(
    email: string,
    name: string,
    dateTime: string,
    ip?: string,
  ): Promise<void> {
    this.logger.debug(
      `[MOCK] Security alert para ${email} (${name}) em ${dateTime}, ip: ${ip ?? 'N/A'}`,
    );
  }

  async sendSessionRenewedEmail(email: string, name: string, dateTime: string): Promise<void> {
    this.logger.debug(`[MOCK] Session renewed para ${email} (${name}) em ${dateTime}`);
  }

  async sendTokensRevokedEmail(email: string, name: string): Promise<void> {
    this.logger.debug(`[MOCK] Tokens revogados para ${email} (${name})`);
  }
}
