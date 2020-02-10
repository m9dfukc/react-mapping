"use strict";
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
var util_1 = require("./util");
var anchorSize = 20;
var halfAnchor = anchorSize / 2;
var styles = {
    container: {
        width: anchorSize,
        height: anchorSize,
        borderRadius: '50%',
        position: 'absolute',
        border: '2px solid white',
        cursor: 'pointer'
    },
    highlight: {
        border: '2px solid red',
    },
    'top-left': {
        left: -halfAnchor,
        top: -halfAnchor
    },
    'bottom-left': {
        left: -halfAnchor,
        bottom: -halfAnchor
    },
    'top-right': {
        top: -halfAnchor,
        right: -halfAnchor
    },
    'bottom-right': {
        bottom: -halfAnchor,
        right: -halfAnchor
    }
};
exports.AnchorComponent = function (_a) {
    var position = _a.position, translation = _a.translation, onMouseEnter = _a.onMouseEnter, onMouseDown = _a.onMouseDown, onMouseUp = _a.onMouseUp, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.style, style = _c === void 0 ? {} : _c, _d = _a.highlight, highlight = _d === void 0 ? false : _d;
    return (React.createElement("div", { onMouseEnter: function () { return onMouseEnter && onMouseEnter(position); }, onMouseDown: function (evt) { return onMouseDown(evt, position); }, onMouseUp: function () { return onMouseUp(position); }, className: className, style: __assign({}, styles.container, styles[position], style, (highlight ? styles.highlight : null), { transform: util_1.vectorToTransform(translation) }) }));
};
//# sourceMappingURL=anchor.js.map