"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class ShapeAnimatorManager {
  static nextTag() {
    this.tag += 1;
    return this.tag;
  }
}
exports.default = ShapeAnimatorManager;
_defineProperty(ShapeAnimatorManager, "tag", 42);
//# sourceMappingURL=ShapeAnimatorManager.js.map