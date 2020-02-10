"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var anchor_1 = require("./anchor");
var util_1 = require("./util");
var styles = {
    container: {
        position: 'relative'
    }
};
var anchors = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
var defaultMatrix = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1 // second and third for x and y position of element
];
var Layer = /** @class */ (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isAnchorDragging = false;
        _this.namespace = 'react-mapping-';
        _this.identifier = _this.namespace + _this.props.label;
        _this.data = window.localStorage.getItem(_this.identifier);
        _this.getDefaultState = function () { return ({
            matrix: defaultMatrix,
            translateDelta: anchors.reduce(function (acc, key) { return ((acc[key] = [0, 0]), acc); }, {}),
            sourcePoints: undefined,
            transformOrigin: [0, 0],
            containerTranslate: [_this.props.x || 0, _this.props.y || 0]
        }); };
        _this.initialize = function () {
            if (_this.container) {
                var _a = _this.container.getBoundingClientRect(), width = _a.width, height = _a.height;
                var sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]];
                _this.targetPoints = sourcePoints.slice();
                _this.setState({ sourcePoints: sourcePoints });
            }
            else {
                throw new Error("Couldn't get a reference of the container element");
            }
        };
        _this.state = __assign({}, (_this.data ? JSON.parse(_this.data) : _this.getDefaultState()), { hover: false });
        _this.onAnchorMouseDown = function (evt, position) {
            evt.stopPropagation();
            _this.anchorTranslateDelta = [
                evt.pageX - _this.state.translateDelta[position][0],
                evt.pageY - _this.state.translateDelta[position][1]
            ];
            _this.anchorMoving = position;
        };
        _this.onAnchorMouseMove = function (evt) {
            var _a;
            if (!_this.anchorTranslateDelta || !_this.state.sourcePoints || !_this.anchorMoving) {
                return;
            }
            evt.preventDefault();
            evt.stopPropagation();
            var vectorIndexToModify = anchors.indexOf(_this.anchorMoving);
            var deltaX = evt.pageX - _this.anchorTranslateDelta[0];
            var deltaY = evt.pageY - _this.anchorTranslateDelta[1];
            _this.targetPoints[vectorIndexToModify] = [
                _this.state.sourcePoints[vectorIndexToModify][0] + deltaX,
                _this.state.sourcePoints[vectorIndexToModify][1] + deltaY
            ];
            _this.setState({
                matrix: util_1.transformPointsToMatrix(_this.state.sourcePoints, _this.targetPoints),
                translateDelta: __assign({}, _this.state.translateDelta, (_a = {}, _a[_this.anchorMoving] = [deltaX, deltaY], _a))
            });
        };
        _this.onAnchorMouseUp = function (position) {
            _this.anchorTranslateDelta = undefined;
            _this.anchorMoving = undefined;
        };
        _this.onMouseUp = function () {
            _this.layerTranslateDelta = undefined;
        };
        _this.onMouseMove = function (evt) {
            if (!_this.layerTranslateDelta || !_this.props.isEditMode) {
                return;
            }
            var newVector = [
                evt.pageX - _this.layerTranslateDelta[0],
                evt.pageY - _this.layerTranslateDelta[1]
            ];
            _this.setState({
                containerTranslate: newVector
            });
        };
        _this.onMouseDown = function (evt) {
            var containerTranslate = _this.state.containerTranslate;
            _this.layerTranslateDelta = [
                evt.pageX - containerTranslate[0],
                evt.pageY - containerTranslate[1]
            ];
        };
        _this.onMouseEnter = function () {
            _this.setState({
                hover: true
            });
        };
        _this.onMouseLeave = function () {
            _this.setState({
                hover: false
            });
        };
        return _this;
    }
    Layer.prototype.componentWillMount = function () {
        window.addEventListener('mousemove', this.onAnchorMouseMove);
        window.addEventListener('mousemove', this.onMouseMove);
    };
    Layer.prototype.componentDidMount = function () {
        this.initialize();
    };
    Layer.prototype.componentWillUnmount = function () {
        window.removeEventListener('mousemove', this.onAnchorMouseMove);
        window.removeEventListener('mousemove', this.onMouseMove);
    };
    Layer.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.save && this.props.save !== prevProps.save) {
            var key = this.namespace + this.props.label;
            var data = JSON.stringify(this.state);
            window.localStorage.setItem(key, data);
        }
        if (this.props.reset && this.props.reset !== prevProps.reset) {
            var key = this.namespace + this.props.label;
            var state = this.getDefaultState();
            window.localStorage.removeItem(key);
            this.setState(state);
            this.initialize();
        }
        if (this.props.reload && this.props.reload !== prevProps.reload && this.data) {
            var state = this.data ? JSON.parse(this.data) : this.getDefaultState();
            var sourcePoints = state.sourcePoints;
            this.targetPoints = sourcePoints.slice();
            this.setState(state);
        }
    };
    Layer.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, isEditMode = _a.isEditMode, className = _a.className, anchorStyle = _a.anchorStyle, anchorClassName = _a.anchorClassName;
        var _b = this.state, translateDelta = _b.translateDelta, matrix = _b.matrix, containerTranslate = _b.containerTranslate, transformOrigin = _b.transformOrigin, hover = _b.hover;
        return (React.createElement("div", { onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, style: {
                cursor: isEditMode ? 'all-scroll' : 'inherit',
                position: 'relative',
                display: 'inline-block',
                transform: util_1.vectorToTransform(containerTranslate)
            } },
            React.createElement("div", { ref: function (ref) {
                    _this.container = ref;
                }, style: __assign({}, styles.container, style, { pointerEvents: isEditMode ? 'none' : 'all', transform: util_1.matrixToTransform(matrix), transformOrigin: transformOrigin[0] + "px " + transformOrigin[1] + "px 0px" }), className: className }, this.props.children),
            isEditMode && (React.createElement("div", null, anchors.map(function (anchor, index) { return (React.createElement(anchor_1.AnchorComponent, { style: anchorStyle, className: anchorClassName, key: anchor, translation: translateDelta[anchor], position: anchor, onMouseDown: _this.onAnchorMouseDown, onMouseUp: _this.onAnchorMouseUp, highlight: hover })); })))));
    };
    return Layer;
}(React.Component));
exports.Layer = Layer;
//# sourceMappingURL=layer.js.map