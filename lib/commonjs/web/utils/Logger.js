"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/* eslint-disable @typescript-eslint/no-empty-function */

class Logger {
  static sharedInstance() {
    if (this.instance === null) {
      this.instance = new Logger();
    }
    return this.instance;
  }
  constructor() {
    _defineProperty(this, "level", 'info');
    _defineProperty(this, "startedCount", 0);
    this.logCallback = null;
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
    this.sharedInstance().level = level;
  }
  start() {}
  stop() {}
  subscribe() {
    //TODO
  }
  unsubscribe() {
    //TODO
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
var _default = Logger;
exports.default = _default;
//# sourceMappingURL=Logger.js.map