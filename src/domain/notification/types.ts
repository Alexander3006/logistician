export enum Locales {
  UA = 'UA',
  EN = 'EN',
  RU = 'RU',
  DEFAULT = 'EN',
}

export enum NotificationTransport {
  MAIL = 'MAIL',
  WEBSOCKET = 'WEBSOCKET',
}

export type NotificationPayload = {
  recipients?: string[];
  event: string;
  locale: Locales;
  data: any;
  indexed: boolean;
};

export const RABBITMQ = {
  EXCHANGE: 'notification-exchange',
  EMAIL_NOTIFICATION_QUEUE: 'email-notifications-queue',
  WEBSOCKET_NOTIFICATION_QUEUE: 'websocket-notifications-queue',
  CHANNEL: 'notification',
};
