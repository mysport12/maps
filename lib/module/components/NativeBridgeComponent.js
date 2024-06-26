import { runNativeMethod } from '../utils';
const NativeBridgeComponent = (Base, turboModule) => class extends Base {
  constructor() {
    super(...arguments);
    this._turboModule = turboModule;
    this._preRefMapMethodQueue = [];
  }
  async _runPendingNativeMethods(nativeRef) {
    if (nativeRef) {
      while (this._preRefMapMethodQueue.length > 0) {
        const item = this._preRefMapMethodQueue.pop();
        if (item && item.method && item.resolver) {
          const res = await this._runNativeMethod(item.method.name, nativeRef, item.method.args);
          item.resolver(res);
        }
      }
    }
  }
  _runNativeMethod(methodName, nativeRef) {
    let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    if (!nativeRef) {
      return new Promise(resolve => {
        this._preRefMapMethodQueue.push({
          method: {
            name: methodName,
            args
          },
          resolver: resolve
        });
      });
    }
    return runNativeMethod(this._turboModule, methodName, nativeRef, args);
  }
};
export default NativeBridgeComponent;
//# sourceMappingURL=NativeBridgeComponent.js.map