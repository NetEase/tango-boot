const MESSAGE = Symbol('message');

const message = {
  error(msg: string) {
    console.error('[error] %s', msg);
  },
  warn(msg: string) {
    console.warn('[warn] %s', msg);
  },
  success(msg: string) {
    console.log('[success] %s', msg);
  },
};

class GlobalConfig {
  constructor() {
    this[MESSAGE] = message;
  }

  get message() {
    return this[MESSAGE];
  }

  set message(messageInstance) {
    if (
      messageInstance &&
      messageInstance.error &&
      messageInstance.warn &&
      messageInstance.success
    ) {
      this[MESSAGE] = message;
    } else {
      console.error('invalid message, should have error, warn, success method');
    }
  }
}

export default new GlobalConfig();
