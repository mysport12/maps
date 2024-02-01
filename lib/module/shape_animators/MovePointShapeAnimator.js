import NativeRNMBXMovePointShapeAnimatorModule from '../specs/NativeRNMBXMovePointShapeAnimatorModule';
import ShapeAnimatorManager from './ShapeAnimatorManager';
export default class MovePointShapeAnimator {
  constructor(from) {
    const tag = ShapeAnimatorManager.nextTag();
    NativeRNMBXMovePointShapeAnimatorModule.create(tag, [from[0], from[1]]);
    this.__nativeTag = tag;
  }
  start() {
    NativeRNMBXMovePointShapeAnimatorModule.start(this.__nativeTag);
  }
}
//# sourceMappingURL=MovePointShapeAnimator.js.map