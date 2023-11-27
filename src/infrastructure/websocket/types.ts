export type WebsocketNotificationPayload<T> = {
  event: WebsocketEvent;
  body: T;
  users?: string[];
};

export type WebsocketEvent = `${string}:${string}`;
