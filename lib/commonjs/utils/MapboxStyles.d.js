"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* This file was generated from MapboxStyle.ts.ejs do not modify */
/* TODO */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var VisibilityEnum;
(function (VisibilityEnum) {
  VisibilityEnum["Visible"] = "visible";
  VisibilityEnum["None"] = "none";
})(VisibilityEnum || (VisibilityEnum = {}));
var FillTranslateAnchorEnum;
(function (FillTranslateAnchorEnum) {
  FillTranslateAnchorEnum["Map"] = "map";
  FillTranslateAnchorEnum["Viewport"] = "viewport";
})(FillTranslateAnchorEnum || (FillTranslateAnchorEnum = {}));
var LineCapEnum;
(function (LineCapEnum) {
  LineCapEnum["Butt"] = "butt";
  LineCapEnum["Round"] = "round";
  LineCapEnum["Square"] = "square";
})(LineCapEnum || (LineCapEnum = {}));
var LineJoinEnum;
(function (LineJoinEnum) {
  LineJoinEnum["Bevel"] = "bevel";
  LineJoinEnum["Round"] = "round";
  LineJoinEnum["Miter"] = "miter";
})(LineJoinEnum || (LineJoinEnum = {}));
var LineTranslateAnchorEnum;
(function (LineTranslateAnchorEnum) {
  LineTranslateAnchorEnum["Map"] = "map";
  LineTranslateAnchorEnum["Viewport"] = "viewport";
})(LineTranslateAnchorEnum || (LineTranslateAnchorEnum = {}));
var SymbolPlacementEnum;
(function (SymbolPlacementEnum) {
  SymbolPlacementEnum["Point"] = "point";
  SymbolPlacementEnum["Line"] = "line";
  SymbolPlacementEnum["LineCenter"] = "line-center";
})(SymbolPlacementEnum || (SymbolPlacementEnum = {}));
var SymbolZOrderEnum;
(function (SymbolZOrderEnum) {
  SymbolZOrderEnum["Auto"] = "auto";
  SymbolZOrderEnum["ViewportY"] = "viewport-y";
  SymbolZOrderEnum["Source"] = "source";
})(SymbolZOrderEnum || (SymbolZOrderEnum = {}));
var IconRotationAlignmentEnum;
(function (IconRotationAlignmentEnum) {
  IconRotationAlignmentEnum["Map"] = "map";
  IconRotationAlignmentEnum["Viewport"] = "viewport";
  IconRotationAlignmentEnum["Auto"] = "auto";
})(IconRotationAlignmentEnum || (IconRotationAlignmentEnum = {}));
var IconTextFitEnum;
(function (IconTextFitEnum) {
  IconTextFitEnum["None"] = "none";
  IconTextFitEnum["Width"] = "width";
  IconTextFitEnum["Height"] = "height";
  IconTextFitEnum["Both"] = "both";
})(IconTextFitEnum || (IconTextFitEnum = {}));
var IconAnchorEnum;
(function (IconAnchorEnum) {
  IconAnchorEnum["Center"] = "center";
  IconAnchorEnum["Left"] = "left";
  IconAnchorEnum["Right"] = "right";
  IconAnchorEnum["Top"] = "top";
  IconAnchorEnum["Bottom"] = "bottom";
  IconAnchorEnum["TopLeft"] = "top-left";
  IconAnchorEnum["TopRight"] = "top-right";
  IconAnchorEnum["BottomLeft"] = "bottom-left";
  IconAnchorEnum["BottomRight"] = "bottom-right";
})(IconAnchorEnum || (IconAnchorEnum = {}));
var IconPitchAlignmentEnum;
(function (IconPitchAlignmentEnum) {
  IconPitchAlignmentEnum["Map"] = "map";
  IconPitchAlignmentEnum["Viewport"] = "viewport";
  IconPitchAlignmentEnum["Auto"] = "auto";
})(IconPitchAlignmentEnum || (IconPitchAlignmentEnum = {}));
var TextPitchAlignmentEnum;
(function (TextPitchAlignmentEnum) {
  TextPitchAlignmentEnum["Map"] = "map";
  TextPitchAlignmentEnum["Viewport"] = "viewport";
  TextPitchAlignmentEnum["Auto"] = "auto";
})(TextPitchAlignmentEnum || (TextPitchAlignmentEnum = {}));
var TextRotationAlignmentEnum;
(function (TextRotationAlignmentEnum) {
  TextRotationAlignmentEnum["Map"] = "map";
  TextRotationAlignmentEnum["Viewport"] = "viewport";
  TextRotationAlignmentEnum["Auto"] = "auto";
})(TextRotationAlignmentEnum || (TextRotationAlignmentEnum = {}));
var TextJustifyEnum;
(function (TextJustifyEnum) {
  TextJustifyEnum["Auto"] = "auto";
  TextJustifyEnum["Left"] = "left";
  TextJustifyEnum["Center"] = "center";
  TextJustifyEnum["Right"] = "right";
})(TextJustifyEnum || (TextJustifyEnum = {}));
var TextVariableAnchorEnum;
(function (TextVariableAnchorEnum) {
  TextVariableAnchorEnum["Center"] = "center";
  TextVariableAnchorEnum["Left"] = "left";
  TextVariableAnchorEnum["Right"] = "right";
  TextVariableAnchorEnum["Top"] = "top";
  TextVariableAnchorEnum["Bottom"] = "bottom";
  TextVariableAnchorEnum["TopLeft"] = "top-left";
  TextVariableAnchorEnum["TopRight"] = "top-right";
  TextVariableAnchorEnum["BottomLeft"] = "bottom-left";
  TextVariableAnchorEnum["BottomRight"] = "bottom-right";
})(TextVariableAnchorEnum || (TextVariableAnchorEnum = {}));
var TextAnchorEnum;
(function (TextAnchorEnum) {
  TextAnchorEnum["Center"] = "center";
  TextAnchorEnum["Left"] = "left";
  TextAnchorEnum["Right"] = "right";
  TextAnchorEnum["Top"] = "top";
  TextAnchorEnum["Bottom"] = "bottom";
  TextAnchorEnum["TopLeft"] = "top-left";
  TextAnchorEnum["TopRight"] = "top-right";
  TextAnchorEnum["BottomLeft"] = "bottom-left";
  TextAnchorEnum["BottomRight"] = "bottom-right";
})(TextAnchorEnum || (TextAnchorEnum = {}));
var TextWritingModeEnum;
(function (TextWritingModeEnum) {
  TextWritingModeEnum["Horizontal"] = "horizontal";
  TextWritingModeEnum["Vertical"] = "vertical";
})(TextWritingModeEnum || (TextWritingModeEnum = {}));
var TextTransformEnum;
(function (TextTransformEnum) {
  TextTransformEnum["None"] = "none";
  TextTransformEnum["Uppercase"] = "uppercase";
  TextTransformEnum["Lowercase"] = "lowercase";
})(TextTransformEnum || (TextTransformEnum = {}));
var IconTranslateAnchorEnum;
(function (IconTranslateAnchorEnum) {
  IconTranslateAnchorEnum["Map"] = "map";
  IconTranslateAnchorEnum["Viewport"] = "viewport";
})(IconTranslateAnchorEnum || (IconTranslateAnchorEnum = {}));
var TextTranslateAnchorEnum;
(function (TextTranslateAnchorEnum) {
  TextTranslateAnchorEnum["Map"] = "map";
  TextTranslateAnchorEnum["Viewport"] = "viewport";
})(TextTranslateAnchorEnum || (TextTranslateAnchorEnum = {}));
var CircleTranslateAnchorEnum;
(function (CircleTranslateAnchorEnum) {
  CircleTranslateAnchorEnum["Map"] = "map";
  CircleTranslateAnchorEnum["Viewport"] = "viewport";
})(CircleTranslateAnchorEnum || (CircleTranslateAnchorEnum = {}));
var CirclePitchScaleEnum;
(function (CirclePitchScaleEnum) {
  CirclePitchScaleEnum["Map"] = "map";
  CirclePitchScaleEnum["Viewport"] = "viewport";
})(CirclePitchScaleEnum || (CirclePitchScaleEnum = {}));
var CirclePitchAlignmentEnum;
(function (CirclePitchAlignmentEnum) {
  CirclePitchAlignmentEnum["Map"] = "map";
  CirclePitchAlignmentEnum["Viewport"] = "viewport";
})(CirclePitchAlignmentEnum || (CirclePitchAlignmentEnum = {}));
var FillExtrusionTranslateAnchorEnum;
(function (FillExtrusionTranslateAnchorEnum) {
  FillExtrusionTranslateAnchorEnum["Map"] = "map";
  FillExtrusionTranslateAnchorEnum["Viewport"] = "viewport";
})(FillExtrusionTranslateAnchorEnum || (FillExtrusionTranslateAnchorEnum = {}));
var RasterResamplingEnum;
(function (RasterResamplingEnum) {
  RasterResamplingEnum["Linear"] = "linear";
  RasterResamplingEnum["Nearest"] = "nearest";
})(RasterResamplingEnum || (RasterResamplingEnum = {}));
var HillshadeIlluminationAnchorEnum;
(function (HillshadeIlluminationAnchorEnum) {
  HillshadeIlluminationAnchorEnum["Map"] = "map";
  HillshadeIlluminationAnchorEnum["Viewport"] = "viewport";
})(HillshadeIlluminationAnchorEnum || (HillshadeIlluminationAnchorEnum = {}));
var ModelTypeEnum;
(function (ModelTypeEnum) {
  ModelTypeEnum["Common3d"] = "common-3d";
  ModelTypeEnum["LocationIndicator"] = "location-indicator";
})(ModelTypeEnum || (ModelTypeEnum = {}));
var SkyTypeEnum;
(function (SkyTypeEnum) {
  SkyTypeEnum["Gradient"] = "gradient";
  SkyTypeEnum["Atmosphere"] = "atmosphere";
})(SkyTypeEnum || (SkyTypeEnum = {}));
var AnchorEnum;
(function (AnchorEnum) {
  AnchorEnum["Map"] = "map";
  AnchorEnum["Viewport"] = "viewport";
})(AnchorEnum || (AnchorEnum = {}));
//# sourceMappingURL=MapboxStyles.d.js.map