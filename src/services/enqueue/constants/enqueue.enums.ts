export enum CALL_STATUS {
  QUEUED = 'queued', 
  RINGING = 'ringing', 
  IN_PROGRESS = 'in-progress', 
  COMPLETED = 'completed', 
  BUSY = 'busy', 
  FAILED = 'failed', 
  NO_ANSWER = 'no-answer',
  CANCELED = 'canceled'
}

export enum QUEUE_RESULT_STATUS {
  BRIDGED = 'bridged',
  BRIDGING_PROCESS = 'bridging-in-process',
  ERROR = 'error',
  HANGUP = 'hangup',
  LEAVE = 'leave',
  REDIRECTED = 'redirected',
  REDIRECTED_BRIDGED = 'redirected-from-bridged',
  QUEUE_FULL = 'queue-full',
  SYSTEM_ERROR = 'system-error'
}

export enum ENQUEUE_STATUS {
  QUEUED = 'queued',
  ON_CALL = 'on-call',
  TRANSFER = 'transfering',
  FINISH = 'finish'
}