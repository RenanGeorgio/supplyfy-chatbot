export interface FaceMsgData {
  messaging_type?: string;
  recipient: {
    id: string;
  };
  message: {};
  sender_action?: string;
  notification_type?: string;
  tag?: string;
};

export interface SendFaceMsgBody {
  recipient_id: string;
  message_id: string;
  error: string;
};

interface FaceMsgReferral {
  source: string;
  type: string;
  ref: string;
  referer_uri: string;
};

interface FaceMsgPostback {
  title: string;
  payload:string;
  referral: FaceMsgReferral;
};

interface FaceMsgDelivery {
  mids: string[];
  watermark: number;
  seq?: number;
};

export interface FaceMessagingEvent {
  message: {
    is_echo: boolean;
    app_id: string;
    metadata: string;
    mid: string;
    text: string;
    attachments: FaceMsgAttachment;
    quick_reply: FaceMsgQuick_Reply;
  };
  delivery: FaceMsgDelivery;
  postback: FaceMsgPostback;
  read: {
    watermark: number;
    seq?: number;
  }
  optin: {
    ref: string;
    user_ref: string;
  };
  account_linking: {
    status: 'linked' | 'unlinked',
    authorization_code: string;
  };
  sender: {
    id: string;
  }
  recipient: {
    id: string;
  };
  timestamp: string;
};

export interface PageEntry {
  id: string;
  time: string;
  messaging: [];
  changes?: any[];
};

export interface FaceMsgSender {
  id: string;
};

export interface FaceMsgRecipient {
  id: string;
};

interface FaceMsgAttachment {
  type: string;
  payload: string;
};

interface FaceMsgQuick_Reply {
  payload: string;
};

export interface FaceMessage {
  mid: string;
  text: string;
  attachments: Array<FaceMsgAttachment>;
  quick_reply: FaceMsgQuick_Reply;
};