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
var util_1 = require("./util");
var styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    row: {
        height: 1,
        backgroundColor: 'white',
        opacity: 0.3
    },
    column: {
        width: 1,
        backgroundColor: 'white',
        opacity: 0.3
    },
    item: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
};
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Grid.prototype.render = function () {
        var _a = this.props, rows = _a.rows, columns = _a.columns;
        return (React.createElement("div", { style: styles.container },
            React.createElement("div", { style: __assign({}, styles.item, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }) }, util_1.range(rows).map(function (i) { return React.createElement("div", { key: i, style: styles.row }); })),
            React.createElement("div", { style: __assign({}, styles.item, { display: 'flex', justifyContent: 'space-between' }) }, util_1.range(columns).map(function (i) { return React.createElement("div", { key: i, style: styles.column }); }))));
    };
    Grid.defaultProps = {
        rows: 20,
        columns: 32
    };
    return Grid;
}(React.Component));
exports.Grid = Grid;
//# sourceMappingURL=grid.js.map