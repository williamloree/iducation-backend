declare namespace NodeJS {
  export interface ProcessEnv {
    TYPEORM_CONNECTION: string;
    TYPEORM_HOST: string;
    TYPEORM_USERNAME: string;
    TYPEORM_PASSWORD: string;
    TYPEORM_DATABASE: string;
    TYPEORM_PORT: string;
    TYPEORM_SYNCHRONIZE: string;
    TYPEORM_LOGGING: string;
    TYPEORM_ENTITIES: string;
    TYPEORM_SUSCRIBERS: string;
    TYPEORM_MIGRATIONS: string;
    SMTP_TEMPLATE_ROOT: string;
    SMTP_SEND_EMAIL: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    APP_EMAIL: string;
    SENTRY_DSN: string;
    APP_ENV: string;
    APP_NOREPLY: string;
    APP_PORT: string;
    FRONT_CLIENT_URL: string;
    ACCESS_TOKEN_SECRET: string;
    TEAM_PICTURE_PATH: string;
  }
}

export type Nullable<T> = T | undefined | null;
