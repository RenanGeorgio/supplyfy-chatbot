export enum Events {
  SERVICE_STARTED = "service_started",
  SERVICE_STOPPED = "service_stopped",
  SERVICE_CONNECTED = "service_connected",
  SERVICE_DISCONNECTED = "service_disconnected",
  SERVICE_ERROR = "service_error",
  SERVICE_ALREADY_RUNNING = "service_already_running",
  SERVICE_NOT_RUNNING = "service_not_running",
  CHAT_CREATED = "chat_created",
  CHAT_ENDED = "chat_ended",
  CHAT_UPDATED = "chat_updated",
  CHAT_DELETED = "chat_deleted",
  MESSAGE_SENT = "message_sent",
  MESSAGE_RECEIVED = "message_received",
}

export enum Platforms {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  TELEGRAM = "telegram",
  WEB = "web",
  WHATSAPP = "whatsapp",
  TYPEBOT = "typebot",
}