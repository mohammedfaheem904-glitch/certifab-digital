import { T as React, r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, l as clsx, T as TriangleAlert, L as Link, b as useAuth, s as supabase, u as useI18n } from "./router-DGN8uIPq.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { S as Skeleton } from "./skeleton-DxehOMK1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { C as ClipboardCheck } from "./clipboard-check-uPHKjRWU.js";
import { S as ScrollText } from "./scroll-text-CftZHGq2.js";
import { G as Gauge } from "./gauge-BpPoZNdd.js";
import { W as WeldStatusBadge } from "./WeldStatusBadge-B_9QG7hG.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { S as SpotlightTip } from "./SpotlightTip-BmgKr8d3.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { F as FolderKanban } from "./folder-kanban-BIlSTZgZ.js";
import { f as filterProps, L as Layer, m as max, i as isNumber, C as Curve, A as Animate, a as interpolateNumber, b as isNil, c as isNan, d as isEqual, h as hasClipDot, e as LabelList, u as uniqueId, g as isFunction, G as Global, j as getValueByDataKey, k as getCateCoordinateOfLine, D as Dot, l as generateCategoricalChart, X as XAxis, Y as YAxis, n as formatAxisMap, R as ResponsiveContainer, o as CartesianGrid, T as Tooltip, P as PieChart, p as Pie, q as Cell, B as BarChart, r as Bar } from "./PieChart-AboGOAhm.js";
import { W as Wrench } from "./wrench-CmqB68Gm.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { A as ArrowUpRight } from "./arrow-up-right-SlsiFPJV.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./octagon-alert-CjvTeUly.js";
import "./search-DlrNhFVp.js";
import "./discovery-D5siu6b6.js";
import "./x-CQcD6R0Y.js";
import "./index-DybbMtR3.js";
const __iconNode$2 = [
  ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
  ["path", { d: "M20 7H4", key: "zbl0bi" }],
  ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
  ["path", { d: "M4 17h16", key: "g4d7ey" }]
];
const ArrowRightLeft = createLucideIcon("arrow-right-left", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 14v2.2l1.6 1", key: "fo4ql5" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34",
      key: "o6klzx"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  [
    "path",
    {
      d: "M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z",
      key: "zhnas1"
    }
  ]
];
const FilePen = createLucideIcon("file-pen", __iconNode);
var _excluded = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"], _excluded2 = ["key"];
var _Area;
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Area = /* @__PURE__ */ (function(_PureComponent) {
  function Area2() {
    var _this;
    _classCallCheck(this, Area2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Area2, [].concat(args));
    _defineProperty(_this, "state", {
      isAnimationFinished: true
    });
    _defineProperty(_this, "id", uniqueId("recharts-area-"));
    _defineProperty(_this, "handleAnimationEnd", function() {
      var onAnimationEnd = _this.props.onAnimationEnd;
      _this.setState({
        isAnimationFinished: true
      });
      if (isFunction(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      var onAnimationStart = _this.props.onAnimationStart;
      _this.setState({
        isAnimationFinished: false
      });
      if (isFunction(onAnimationStart)) {
        onAnimationStart();
      }
    });
    return _this;
  }
  _inherits(Area2, _PureComponent);
  return _createClass(Area2, [{
    key: "renderDots",
    value: function renderDots(needClip, clipDot, clipPathId) {
      var isAnimationActive = this.props.isAnimationActive;
      var isAnimationFinished = this.state.isAnimationFinished;
      if (isAnimationActive && !isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, dot = _this$props.dot, points = _this$props.points, dataKey = _this$props.dataKey;
      var areaProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread(_objectSpread(_objectSpread({
          key: "dot-".concat(i),
          r: 3
        }, areaProps), customDotProps), {}, {
          index: i,
          cx: entry.x,
          cy: entry.y,
          dataKey,
          value: entry.value,
          payload: entry.payload,
          points
        });
        return Area2.renderDotItem(dot, dotProps);
      });
      var dotsProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React.createElement(Layer, _extends({
        className: "recharts-area-dots"
      }, dotsProps), dots);
    }
  }, {
    key: "renderHorizontalRect",
    value: function renderHorizontalRect(alpha) {
      var _this$props2 = this.props, baseLine = _this$props2.baseLine, points = _this$props2.points, strokeWidth = _this$props2.strokeWidth;
      var startX = points[0].x;
      var endX = points[points.length - 1].x;
      var width = alpha * Math.abs(startX - endX);
      var maxY = max(points.map(function(entry) {
        return entry.y || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxY = Math.max(baseLine, maxY);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxY = Math.max(max(baseLine.map(function(entry) {
          return entry.y || 0;
        })), maxY);
      }
      if (isNumber(maxY)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: startX < endX ? startX : startX - width,
          y: 0,
          width,
          height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
        });
      }
      return null;
    }
  }, {
    key: "renderVerticalRect",
    value: function renderVerticalRect(alpha) {
      var _this$props3 = this.props, baseLine = _this$props3.baseLine, points = _this$props3.points, strokeWidth = _this$props3.strokeWidth;
      var startY = points[0].y;
      var endY = points[points.length - 1].y;
      var height = alpha * Math.abs(startY - endY);
      var maxX = max(points.map(function(entry) {
        return entry.x || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxX = Math.max(baseLine, maxX);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxX = Math.max(max(baseLine.map(function(entry) {
          return entry.x || 0;
        })), maxX);
      }
      if (isNumber(maxX)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: 0,
          y: startY < endY ? startY : startY - height,
          width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
          height: Math.floor(height)
        });
      }
      return null;
    }
  }, {
    key: "renderClipRect",
    value: function renderClipRect(alpha) {
      var layout = this.props.layout;
      if (layout === "vertical") {
        return this.renderVerticalRect(alpha);
      }
      return this.renderHorizontalRect(alpha);
    }
  }, {
    key: "renderAreaStatically",
    value: function renderAreaStatically(points, baseLine, needClip, clipPathId) {
      var _this$props4 = this.props, layout = _this$props4.layout, type = _this$props4.type, stroke = _this$props4.stroke, connectNulls = _this$props4.connectNulls, isRange = _this$props4.isRange;
      _this$props4.ref;
      var others = _objectWithoutProperties(_this$props4, _excluded);
      return /* @__PURE__ */ React.createElement(Layer, {
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
      }, /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(others, true), {
        points,
        connectNulls,
        type,
        baseLine,
        layout,
        stroke: "none",
        className: "recharts-area-area"
      })), stroke !== "none" && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points
      })), stroke !== "none" && isRange && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points: baseLine
      })));
    }
  }, {
    key: "renderAreaWithAnimation",
    value: function renderAreaWithAnimation(needClip, clipPathId) {
      var _this2 = this;
      var _this$props5 = this.props, points = _this$props5.points, baseLine = _this$props5.baseLine, isAnimationActive = _this$props5.isAnimationActive, animationBegin = _this$props5.animationBegin, animationDuration = _this$props5.animationDuration, animationEasing = _this$props5.animationEasing, animationId = _this$props5.animationId;
      var _this$state = this.state, prevPoints = _this$state.prevPoints, prevBaseLine = _this$state.prevBaseLine;
      return /* @__PURE__ */ React.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "area-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        if (prevPoints) {
          var prevPointsDiffFactor = prevPoints.length / points.length;
          var stepPoints = points.map(function(entry, index) {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevPoints[prevPointIndex]) {
              var prev = prevPoints[prevPointIndex];
              var interpolatorX = interpolateNumber(prev.x, entry.x);
              var interpolatorY = interpolateNumber(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            return entry;
          });
          var stepBaseLine;
          if (isNumber(baseLine) && typeof baseLine === "number") {
            var interpolator = interpolateNumber(prevBaseLine, baseLine);
            stepBaseLine = interpolator(t);
          } else if (isNil(baseLine) || isNan(baseLine)) {
            var _interpolator = interpolateNumber(prevBaseLine, 0);
            stepBaseLine = _interpolator(t);
          } else {
            stepBaseLine = baseLine.map(function(entry, index) {
              var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
              if (prevBaseLine[prevPointIndex]) {
                var prev = prevBaseLine[prevPointIndex];
                var interpolatorX = interpolateNumber(prev.x, entry.x);
                var interpolatorY = interpolateNumber(prev.y, entry.y);
                return _objectSpread(_objectSpread({}, entry), {}, {
                  x: interpolatorX(t),
                  y: interpolatorY(t)
                });
              }
              return entry;
            });
          }
          return _this2.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
        }
        return /* @__PURE__ */ React.createElement(Layer, null, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
          id: "animationClipPath-".concat(clipPathId)
        }, _this2.renderClipRect(t))), /* @__PURE__ */ React.createElement(Layer, {
          clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
        }, _this2.renderAreaStatically(points, baseLine, needClip, clipPathId)));
      });
    }
  }, {
    key: "renderArea",
    value: function renderArea(needClip, clipPathId) {
      var _this$props6 = this.props, points = _this$props6.points, baseLine = _this$props6.baseLine, isAnimationActive = _this$props6.isAnimationActive;
      var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, prevBaseLine = _this$state2.prevBaseLine, totalLength = _this$state2.totalLength;
      if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !isEqual(prevPoints, points) || !isEqual(prevBaseLine, baseLine))) {
        return this.renderAreaWithAnimation(needClip, clipPathId);
      }
      return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
    }
  }, {
    key: "render",
    value: function render() {
      var _filterProps;
      var _this$props7 = this.props, hide = _this$props7.hide, dot = _this$props7.dot, points = _this$props7.points, className = _this$props7.className, top = _this$props7.top, left = _this$props7.left, xAxis = _this$props7.xAxis, yAxis = _this$props7.yAxis, width = _this$props7.width, height = _this$props7.height, isAnimationActive = _this$props7.isAnimationActive, id = _this$props7.id;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var hasSinglePoint = points.length === 1;
      var layerClass = clsx("recharts-area", className);
      var needClipX = xAxis && xAxis.allowDataOverflow;
      var needClipY = yAxis && yAxis.allowDataOverflow;
      var needClip = needClipX || needClipY;
      var clipPathId = isNil(id) ? this.id : id;
      var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
        r: 3,
        strokeWidth: 2
      }, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
      var _ref3 = hasClipDot(dot) ? dot : {}, _ref3$clipDot = _ref3.clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
      var dotSize = r * 2 + strokeWidth;
      return /* @__PURE__ */ React.createElement(Layer, {
        className: layerClass
      }, needClipX || needClipY ? /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: needClipX ? left : left - width / 2,
        y: needClipY ? top : top - height / 2,
        width: needClipX ? width : width * 2,
        height: needClipY ? height : height * 2
      })), !clipDot && /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-dots-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: left - dotSize / 2,
        y: top - dotSize / 2,
        width: width + dotSize,
        height: height + dotSize
      }))) : null, !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null, (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine,
          prevPoints: prevState.curPoints,
          prevBaseLine: prevState.curBaseLine
        };
      }
      if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) {
        return {
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine
        };
      }
      return null;
    }
  }]);
})(reactExports.PureComponent);
_Area = Area;
_defineProperty(Area, "displayName", "Area");
_defineProperty(Area, "defaultProps", {
  stroke: "#3182bd",
  fill: "#3182bd",
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: "line",
  connectNulls: false,
  // points of area
  points: [],
  dot: false,
  activeDot: true,
  hide: false,
  isAnimationActive: !Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
});
_defineProperty(Area, "getBaseValue", function(props, item, xAxis, yAxis) {
  var layout = props.layout, chartBaseValue = props.baseValue;
  var itemBaseValue = item.props.baseValue;
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue) && typeof baseValue === "number") {
    return baseValue;
  }
  var numericAxis = layout === "horizontal" ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === "number") {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === "dataMin") {
      return domainMin;
    }
    if (baseValue === "dataMax") {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === "dataMin") {
    return domain[0];
  }
  if (baseValue === "dataMax") {
    return domain[1];
  }
  return domain[0];
});
_defineProperty(Area, "getComposedData", function(_ref4) {
  var props = _ref4.props, item = _ref4.item, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, bandSize = _ref4.bandSize, dataKey = _ref4.dataKey, stackedData = _ref4.stackedData, dataStartIndex = _ref4.dataStartIndex, displayedData = _ref4.displayedData, offset = _ref4.offset;
  var layout = props.layout;
  var hasStack = stackedData && stackedData.length;
  var baseValue = _Area.getBaseValue(props, item, xAxis, yAxis);
  var isHorizontalLayout = layout === "horizontal";
  var isRange = false;
  var points = displayedData.map(function(entry, index) {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(function(entry) {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return _objectSpread({
    points,
    baseLine,
    layout,
    isRange
  }, offset);
});
_defineProperty(Area, "renderDotItem", function(option, props) {
  var dotItem;
  if (/* @__PURE__ */ React.isValidElement(option)) {
    dotItem = /* @__PURE__ */ React.cloneElement(option, props);
  } else if (isFunction(option)) {
    dotItem = option(props);
  } else {
    var className = clsx("recharts-area-dot", typeof option !== "boolean" ? option.className : "");
    var key = props.key, rest = _objectWithoutProperties(props, _excluded2);
    dotItem = /* @__PURE__ */ React.createElement(Dot, _extends({}, rest, {
      key,
      className
    }));
  }
  return dotItem;
});
var AreaChart = generateCategoricalChart({
  chartName: "AreaChart",
  GraphicalChild: Area,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
function OperationalAlertStrip() {
  const welds = useCompanyRows("welds");
  const ncrs = useCompanyRows("ncrs");
  const quals = useCompanyRows("qualifications");
  const insts = useCompanyRows("instruments");
  const today = /* @__PURE__ */ new Date();
  const in30 = new Date(today.getTime() + 30 * 864e5);
  const blocked = (welds.data ?? []).filter(
    (w) => ["Blocked", "Rejected", "NCR Open"].includes(w.workflow_status ?? "")
  ).length;
  const awaitingInsp = (welds.data ?? []).filter((w) => w.workflow_status === "Awaiting Inspection").length;
  const pendingApproval = (welds.data ?? []).filter((w) => w.workflow_status === "Ready for Release").length;
  const openNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed").length;
  const criticalNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed" && n.severity === "Critical").length;
  const expiringQuals = (quals.data ?? []).filter((q) => {
    const d = new Date(q.expiry_date);
    return d <= in30;
  }).length;
  const calDue = (insts.data ?? []).filter(
    (i) => i.calibration_due && new Date(i.calibration_due) <= in30
  ).length;
  const items = [
    {
      key: "blocked",
      label: "Blocked / rejected welds",
      value: blocked,
      hint: blocked ? "Engineering attention required" : "All welds progressing",
      Icon: ShieldAlert,
      tone: blocked ? "danger" : "ok",
      to: "/app/welds",
      search: { workflow: "Blocked" }
    },
    {
      key: "awaiting",
      label: "Awaiting inspection",
      value: awaitingInsp,
      hint: awaitingInsp ? "Schedule NDT to keep flow" : "Inspection backlog clear",
      Icon: ClipboardCheck,
      tone: awaitingInsp > 5 ? "warning" : awaitingInsp ? "info" : "ok",
      to: "/app/welds",
      search: { workflow: "Awaiting Inspection" }
    },
    {
      key: "approval",
      label: "Pending approval",
      value: pendingApproval,
      hint: pendingApproval ? "Welds ready — needs engineering sign-off" : "No approval queue",
      Icon: TriangleAlert,
      tone: pendingApproval ? "warning" : "ok",
      to: "/app/welds",
      search: { workflow: "Ready for Release" }
    },
    {
      key: "ncrs",
      label: "Open NCRs",
      value: openNcrs,
      hint: criticalNcrs ? `${criticalNcrs} critical` : openNcrs ? "Resolve to release" : "No NCRs open",
      Icon: ScrollText,
      tone: criticalNcrs ? "danger" : openNcrs ? "warning" : "ok",
      to: "/app/ncrs"
    },
    {
      key: "quals",
      label: "Qualifications expiring 30d",
      value: expiringQuals,
      hint: expiringQuals ? "Schedule renewals" : "All qualifications current",
      Icon: CalendarClock,
      tone: expiringQuals ? "warning" : "ok",
      to: "/app/qualifications"
    },
    {
      key: "cal",
      label: "Calibration due 30d",
      value: calDue,
      hint: calDue ? "Recalibrate to keep measurements admissible" : "All instruments in tolerance",
      Icon: Gauge,
      tone: calDue ? "warning" : "ok",
      to: "/app/instruments"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: items.map(({ key, ...rest }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1, { ...rest }, key)) });
}
function Card$1({
  Icon,
  label,
  value,
  hint,
  tone,
  to,
  search
}) {
  const palette = {
    ok: "border-success/30 bg-success/5 text-success",
    info: "border-info/30 bg-info/5 text-info",
    warning: "border-warning/40 bg-warning/5 text-warning",
    danger: "border-destructive/40 bg-destructive/5 text-destructive"
  }[tone];
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border ${palette} p-3 h-full transition-all hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 opacity-80" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1.5 leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1.5 leading-tight", children: hint })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, search, children: inner });
}
function WorkflowBottlenecks() {
  const welds = useCompanyRows("welds");
  const rows = welds.data ?? [];
  const total = rows.length;
  const stages = [
    "Draft",
    "Pending Validation",
    "Awaiting Inspection",
    "NCR Open",
    "Ready for Release",
    "Approved",
    "Released",
    "Rejected",
    "Blocked"
  ];
  const counts = stages.map((s) => ({
    stage: s,
    count: rows.filter((r) => (r.workflow_status ?? "Draft") === s).length
  }));
  const max2 = Math.max(1, ...counts.map((c) => c.count));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
    counts.map(({ stage, count }) => {
      const pct = total ? count / total * 100 : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/app/welds",
          search: { workflow: stage },
          className: "group block rounded-md hover:bg-muted/40 px-2 py-1.5",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WeldStatusBadge, { status: stage }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-primary/60 group-hover:bg-primary transition-all",
                style: { width: `${count / max2 * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-16 text-right text-xs tabular-nums", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: count }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                " · ",
                pct.toFixed(0),
                "%"
              ] })
            ] })
          ] })
        }
      ) }, stage);
    }),
    total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-center text-sm text-muted-foreground py-6", children: "No welds yet — workflow distribution will appear here as production starts." })
  ] });
}
function RecentActivityFeed({ limit = 12 }) {
  const { profile } = useAuth();
  const cid = profile?.company_id;
  const q = useQuery({
    queryKey: ["dashboard-audit", cid, limit],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("id, created_at, table_name, record_id, action, actor_id").eq("company_id", cid).order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data ?? [];
    }
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 w-full" });
  const rows = q.data ?? [];
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "No activity yet. As welds, NCRs and qualifications change, you'll see them here." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { r }, r.id)) });
}
function Row({ r }) {
  const Icon = r.action === "INSERT" ? Plus : r.action === "UPDATE" ? FilePen : r.action === "DELETE" ? Trash2 : r.action.includes("soft") ? Trash2 : r.action.includes("restore") ? ArrowRightLeft : Activity;
  const verb = r.action === "INSERT" ? "created" : r.action === "UPDATE" ? "updated" : r.action === "DELETE" ? "deleted" : r.action.replace(/_/g, " ");
  const target = humanizeTable(r.table_name);
  const link = recordLink(r.table_name, r.record_id);
  const time = relTime(r.created_at);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 size-7 rounded-md grid place-items-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium capitalize", children: verb }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: target })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: time })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link.to, params: link.params, children: content }) : content });
}
function humanizeTable(t) {
  const map = {
    welds: "weld",
    ncrs: "NCR",
    qualifications: "qualification",
    procedures: "WPS / procedure",
    inspections: "inspection",
    instruments: "instrument",
    projects: "project",
    procedure_revisions: "procedure revision",
    procedure_approvals: "procedure approval",
    qualification_signatures: "qualification signature"
  };
  return map[t] ?? t.replace(/_/g, " ");
}
function recordLink(table, id) {
  if (!id) return null;
  switch (table) {
    case "welds":
      return { to: "/app/welds/$weldId", params: { weldId: id } };
    case "ncrs":
      return { to: "/app/ncrs/$ncrId", params: { ncrId: id } };
    case "qualifications":
      return { to: "/app/qualifications/$qualId", params: { qualId: id } };
    case "procedures":
      return { to: "/app/procedures/$procedureId", params: { procedureId: id } };
    case "instruments":
      return { to: "/app/instruments/$instrumentId", params: { instrumentId: id } };
    default:
      return null;
  }
}
function relTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.round(ms / 1e3);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
function Dashboard() {
  const {
    t
  } = useI18n();
  const welds = useCompanyRows("welds", {
    realtime: true
  });
  const insps = useCompanyRows("inspections", {
    realtime: true
  });
  const ncrs = useCompanyRows("ncrs", {
    realtime: true
  });
  const quals = useCompanyRows("qualifications", {
    realtime: true
  });
  const insts = useCompanyRows("instruments", {
    realtime: true
  });
  const projects = useCompanyRows("projects");
  const loading = welds.isLoading || insps.isLoading || quals.isLoading || ncrs.isLoading;
  const stats = reactExports.useMemo(() => {
    const w = welds.data ?? [];
    const total = w.length;
    const accepted = w.filter((x) => x.status === "Accepted").length;
    const rejected = w.filter((x) => x.status === "Rejected").length;
    const repair = w.filter((x) => x.status === "Repair").length;
    const pending = w.filter((x) => x.status === "Pending").length;
    const acceptance = total ? accepted / total * 100 : 0;
    const repairRate = total ? (repair + rejected) / total * 100 : 0;
    const today = /* @__PURE__ */ new Date();
    const in30 = new Date(today.getTime() + 30 * 864e5);
    const expiringQuals = (quals.data ?? []).filter((q) => {
      const d = new Date(q.expiry_date);
      return d <= in30;
    }).length;
    const expiredQuals = (quals.data ?? []).filter((q) => new Date(q.expiry_date) < today).length;
    const calDue = (insts.data ?? []).filter((i) => i.calibration_due && new Date(i.calibration_due) <= in30).length;
    const openNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed").length;
    const criticalNcrs = (ncrs.data ?? []).filter((n) => n.severity === "Critical" && n.status !== "Closed").length;
    const activeWelders = new Set(w.map((x) => x.welder_name).filter(Boolean)).size;
    const compliance = Math.round(Math.max(0, 100 - repairRate * 0.6 - expiringQuals * 1.5 - calDue * 1.2 - criticalNcrs * 4));
    return {
      total,
      accepted,
      rejected,
      repair,
      pending,
      acceptance,
      repairRate,
      expiringQuals,
      expiredQuals,
      calDue,
      openNcrs,
      criticalNcrs,
      activeWelders,
      compliance
    };
  }, [welds.data, quals.data, insts.data, ncrs.data]);
  const weldTrend = reactExports.useMemo(() => {
    const days = {};
    const today = /* @__PURE__ */ new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 864e5);
      const key = d.toISOString().slice(5, 10);
      days[key] = {
        day: key,
        welds: 0,
        rejected: 0
      };
    }
    (welds.data ?? []).forEach((w) => {
      const key = w.weld_date?.slice(5, 10);
      if (days[key]) {
        days[key].welds += 1;
        if (w.status === "Rejected" || w.status === "Repair") days[key].rejected += 1;
      }
    });
    return Object.values(days);
  }, [welds.data]);
  const ndtBreakdown = reactExports.useMemo(() => {
    const counts = {};
    (insps.data ?? []).forEach((i) => {
      counts[i.inspection_type] = (counts[i.inspection_type] ?? 0) + 1;
    });
    const palette = ["oklch(0.68 0.16 60)", "oklch(0.7 0.16 155)", "oklch(0.7 0.13 240)", "oklch(0.78 0.16 80)", "oklch(0.62 0.22 25)"];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: palette[i % palette.length]
    }));
  }, [insps.data]);
  const welderPerf = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    (welds.data ?? []).forEach((w) => {
      const name = w.welder_name ?? "Unassigned";
      const r = map.get(name) ?? {
        name,
        accepted: 0,
        repair: 0,
        rejected: 0
      };
      if (w.status === "Accepted") r.accepted += 1;
      else if (w.status === "Repair") r.repair += 1;
      else if (w.status === "Rejected") r.rejected += 1;
      map.set(name, r);
    });
    return Array.from(map.values()).sort((a, b) => b.accepted + b.repair + b.rejected - (a.accepted + a.repair + a.rejected)).slice(0, 6);
  }, [welds.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-success animate-pulse" }),
          "Live · synced just now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: t("overview") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Real-time QA/QC posture across all active projects." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ComplianceRing, { score: stats.compliance })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SpotlightTip, { id: "dashboard-operational-v1", title: "Operational alerts now live", body: "The strip below surfaces overdue NCRs, expiring qualifications, calibration due dates and blocked welds across every project. Click any chip to jump to the source record. Press ⌘K to open the new command palette anywhere." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OperationalAlertStrip, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Flame, label: "Total welds", value: stats.total.toLocaleString(), delta: `${stats.pending} pending`, tone: "primary", loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: CircleCheck, label: "Acceptance", value: `${stats.acceptance.toFixed(1)}%`, delta: `${stats.accepted} accepted`, tone: "success", loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: CircleX, label: "Repair / Reject rate", value: `${stats.repairRate.toFixed(1)}%`, delta: `${stats.repair + stats.rejected} items`, tone: "warning", loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Users, label: "Active welders", value: String(stats.activeWelders), delta: `${(quals.data ?? []).length} qualified`, tone: "info", loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: ScrollText, label: "Open NCRs", value: String(stats.openNcrs), delta: `${stats.criticalNcrs} critical`, tone: stats.criticalNcrs ? "danger" : "warning", loading, link: "/app/ncrs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: TriangleAlert, label: "Quals expiring 30d", value: String(stats.expiringQuals), delta: `${stats.expiredQuals} expired`, tone: "warning", loading, link: "/app/qualifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: Gauge, label: "Calibration due 30d", value: String(stats.calDue), delta: `${(insts.data ?? []).length} instruments`, tone: "info", loading, link: "/app/instruments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: FolderKanban, label: "Active projects", value: String((projects.data ?? []).filter((p) => p.status === "Active").length), delta: `${(projects.data ?? []).length} total`, tone: "primary", loading, link: "/app/projects" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "lg:col-span-2", title: "Weld activity — last 14 days", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}), children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: weldTrend, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g1", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.68 0.16 60)", stopOpacity: 0.6 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.68 0.16 60)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "oklch(0.32 0.02 252)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "oklch(0.7 0.02 250)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "oklch(0.7 0.02 250)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "welds", stroke: "oklch(0.68 0.16 60)", strokeWidth: 2, fill: "url(#g1)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "rejected", stroke: "oklch(0.62 0.22 25)", strokeWidth: 2, fill: "transparent" })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "NDT inspection mix", children: loading || ndtBreakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyChart, { label: "No inspections yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: ndtBreakdown, dataKey: "value", innerRadius: 50, outerRadius: 80, paddingAngle: 2, stroke: "none", children: ndtBreakdown.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.color }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mt-3 text-xs", children: ndtBreakdown.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
            background: d.color
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-auto font-medium", children: d.value })
        ] }, d.name)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "lg:col-span-2", title: "Recent welds", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds", className: "text-xs text-primary hover:underline", children: "View all" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Weld No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Welder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (welds.data ?? []).slice(0, 6).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds/$weldId", params: {
              weldId: w.id
            }, className: "hover:text-primary", children: w.weld_no }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: w.welder_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: w.weld_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: w.status }) })
          ] }, w.id)),
          (welds.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-5 py-10 text-center text-muted-foreground text-sm", children: "No welds yet — load demo data from the header." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Qualification alerts", right: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-warning", children: stats.expiringQuals + stats.expiredQuals }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          (quals.data ?? []).filter((q) => new Date(q.expiry_date) <= new Date(Date.now() + 60 * 864e5)).slice(0, 4).map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-muted grid place-items-center text-xs font-medium", children: q.welder_name.split(" ").map((p) => p[0]).slice(0, 2).join("") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate", children: q.welder_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                q.process,
                " · exp ",
                q.expiry_date
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: q.status })
          ] }, q.id)),
          stats.expiringQuals + stats.expiredQuals === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "All certifications current" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Open NCRs", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/ncrs", className: "text-xs text-primary hover:underline", children: "View" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          (ncrs.data ?? []).filter((n) => n.status !== "Closed").slice(0, 4).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 size-2 rounded-full ${n.severity === "Critical" ? "bg-destructive" : "bg-warning"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/ncrs/$ncrId", params: {
                ncrId: n.id
              }, className: "text-sm hover:text-primary truncate block", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                n.ncr_no,
                " · ",
                n.due_date ? `due ${n.due_date}` : "no due date"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: n.severity ?? n.status })
          ] }, n.id)),
          stats.openNcrs === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No open NCRs" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Calibration due", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instruments", className: "text-xs text-primary hover:underline", children: "View" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          (insts.data ?? []).filter((i) => i.calibration_due && new Date(i.calibration_due) <= new Date(Date.now() + 60 * 864e5)).slice(0, 4).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "size-4 text-warning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instruments/$instrumentId", params: {
                instrumentId: i.id
              }, className: "text-sm hover:text-primary truncate block", children: i.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                i.asset_id,
                " · due ",
                i.calibration_due
              ] })
            ] })
          ] }, i.id)),
          stats.calDue === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "All instruments in tolerance" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Welder performance — top 6", children: loading || welderPerf.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyChart, { label: "No welds yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: welderPerf, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "oklch(0.32 0.02 252)", strokeDasharray: "3 3", vertical: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", stroke: "oklch(0.7 0.02 250)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "oklch(0.7 0.02 250)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "accepted", stackId: "a", fill: "oklch(0.7 0.16 155)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "repair", stackId: "a", fill: "oklch(0.78 0.16 80)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "rejected", stackId: "a", fill: "oklch(0.62 0.22 25)", radius: [4, 4, 0, 0] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "lg:col-span-2", title: "Workflow bottlenecks", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds", className: "text-xs text-primary hover:underline", children: "All welds" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(WorkflowBottlenecks, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Recent activity", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/audit", className: "text-xs text-primary hover:underline", children: "Full audit log" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecentActivityFeed, { limit: 12 }) })
    ] })
  ] });
}
const tooltipStyle = {
  background: "oklch(0.22 0.022 252)",
  border: "1px solid oklch(0.32 0.02 252)",
  borderRadius: 8,
  fontSize: 12
};
function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  tone = "primary",
  loading,
  link
}) {
  const toneClass = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10"
  }[tone];
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-lg grid place-items-center ${toneClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3" }),
        delta
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-4 h-7 w-20" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-2xl font-semibold tracking-tight", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: label })
  ] });
  return link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link, children: inner }) : inner;
}
function Card({
  title,
  right,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border border-border bg-card p-5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: title }),
      right
    ] }),
    children
  ] });
}
function Legend() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-primary" }),
      "Welds"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-destructive" }),
      "Rejected/Repair"
    ] })
  ] });
}
function Empty({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground py-6 text-center inline-flex items-center justify-center w-full gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-success" }),
    " ",
    label
  ] });
}
function EmptyChart({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 grid place-items-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-6 mx-auto mb-2 opacity-50" }),
    label
  ] }) });
}
function ComplianceRing({
  score
}) {
  const c = 2 * Math.PI * 28;
  const offset = c - score / 100 * c;
  const tone = score >= 90 ? "oklch(0.7 0.16 155)" : score >= 70 ? "oklch(0.78 0.16 80)" : "oklch(0.62 0.22 25)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "64", height: "64", viewBox: "0 0 64 64", className: "-rotate-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "32", r: "28", fill: "none", stroke: "oklch(0.32 0.02 252)", strokeWidth: "6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "32", r: "28", fill: "none", stroke: tone, strokeWidth: "6", strokeDasharray: c, strokeDashoffset: offset, strokeLinecap: "round", className: "transition-all duration-700" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "QA/QC compliance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-semibold tabular-nums", children: [
        score,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: " / 100" })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
