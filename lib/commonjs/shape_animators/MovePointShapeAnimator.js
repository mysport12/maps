"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NativeRNMBXMovePointShapeAnimatorModule = _interopRequireDefault(require("../specs/NativeRNMBXMovePointShapeAnimatorModule"));
var _ShapeAnimatorManager = _interopRequireDefault(require("./ShapeAnimatorManager"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MovePointShapeAnimator {
  constructor(from) {
    const tag = _ShapeAnimatorManager.default.nextTag();
    _NativeRNMBXMovePointShapeAnimatorModule.default.create(tag, [from[0], from[1]]);
    this.__nativeTag = tag;
  }
  start() {
    _NativeRNMBXMovePointShapeAnimatorModule.default.start(this.__nativeTag);
  }
}
exports.default = MovePointShapeAnimator;
//# sourceMappingURL=MovePointShapeAnimator.js.map