function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
export default class ShapeAnimatorManager {
  static nextTag() {
    this.tag += 1;
    return this.tag;
  }
}
_defineProperty(ShapeAnimatorManager, "tag", 42);
//# sourceMappingURL=ShapeAnimatorManager.js.map