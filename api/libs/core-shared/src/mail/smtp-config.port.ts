export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
}

export interface SmtpConfigPort {
  load(): Promise<SmtpConfig | null>;
}

export const SMTP_CONFIG_PORT = Symbol('SMTP_CONFIG_PORT');
