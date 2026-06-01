export interface MailPort {
  sendResetPasswordEmail(email: string, token: string, username?: string): Promise<void>;
  sendSignatureLink(email: string, token: string): Promise<void>;
  sendRefreshTokenSecurityAlert(
    email: string,
    name: string,
    dateTime: string,
    ip?: string,
  ): Promise<void>;
  sendSessionRenewedEmail(email: string, name: string, dateTime: string): Promise<void>;
  sendTokensRevokedEmail(email: string, name: string): Promise<void>;
}

export const MAIL_PORT = Symbol('MAIL_PORT');
