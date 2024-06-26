function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import { NativeEventEmitter, NativeModules } from 'react-native';
const {
  RNMBXLogging
} = NativeModules;
class Logger {
  static sharedInstance() {
    if (this.instance === null) {
      this.instance = new Logger();
    }
    return this.instance;
  }
  constructor() {
    this.loggerEmitter = new NativeEventEmitter(RNMBXLogging);
    this.startedCount = 0;
    this.logCallback = undefined;
  }

  /**
   * Set custom logger function.
   * @param {Logger~logCallback} logCallback - callback taking a log object as param. If callback return falsy value then
   * default logging will take place.
   */
  static setLogCallback(logCallback) {
    this.sharedInstance().setLogCallback(logCallback);
  }

  /**
   * Set custom logger function.
   * @param {Logger~logCallback} logCallback - callback taking a log object as param. If callback return falsy value then
   * default logging will take place.
   */
  setLogCallback(logCallback) {
    this.logCallback = logCallback;
  }

  /**
   * This callback is displayed as part of the Requester class.
   * @callback Logger~logCallback
   * @param {object} log
   * @param {string} log.message - the message of the log
   * @param {string} log.level - log level
   * @param {string} log.tag - optional tag used on android
   */

  /**
   * setLogLevel
   * @param {LogLevel} level
   */
  static setLogLevel(level) {
    RNMBXLogging.setLogLevel(level);
  }

  /**
   * @type {('error'|'warning'|'info'|'debug'|'verbose')} LogLevel - Supported log levels
   */
  start() {
    if (this.startedCount === 0) {
      this.subscribe();
    }
    this.startedCount += 1;
  }
  stop() {
    this.startedCount -= 1;
    if (this.startedCount === 0) {
      this.unsubscribe();
    }
  }
  subscribe() {
    this.subscription = this.loggerEmitter.addListener('LogEvent', log => {
      this.onLog(log);
    });
  }
  unsubscribe() {
    var _this$subscription;
    (_this$subscription = this.subscription) === null || _this$subscription === void 0 ? void 0 : _this$subscription.remove();
    this.subscription = undefined;
  }
  effectiveLevel(log) {
    const {
      level,
      message,
      tag
    } = log;
    if (level === 'warning') {
      if (tag === 'Mbgl-HttpRequest' && message.startsWith('Request failed due to a permanent error: Canceled')) {
        // this seems to happening too much to show a warning every time
        return 'info';
      }
    }
    return level;
  }
  onLog(log) {
    if (!this.logCallback || !this.logCallback(log)) {
      const {
        message
      } = log;
      const level = this.effectiveLevel(log);
      if (level === 'error') {
        console.error('Mapbox error', message, log);
      } else if (level === 'warning') {
        console.warn('Mapbox warning', message, log);
      } else {
        console.log(`Mapbox [${level}]`, message, log);
      }
    }
  }
}
_defineProperty(Logger, "instance", null);
Logger.sharedInstance().start();
export default Logger;
//# sourceMappingURL=Logger.js.map