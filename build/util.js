"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var solve = require('numeric').solve;
exports.round = function (num, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = num * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};
// tslint:disable-next-line:no-any
exports.range = function (num) {
    return Array(num)
        .fill()
        .map(function (_, i) { return i * i; });
};
exports.transformPointsToMatrix = function (sourcePoints, targetPoints) {
    var a = [];
    var b = [];
    for (var i = 0, n = sourcePoints.length; i < n; ++i) {
        var _a = sourcePoints[i], fromX = _a[0], fromY = _a[1];
        var _b = targetPoints[i], toX = _b[0], toY = _b[1];
        a.push([fromX, fromY, 1, 0, 0, 0, -fromX * toX, -fromY * toX], [0, 0, 0, fromX, fromY, 1, -fromX * toY, -fromY * toY]);
        b.push(toX, toY);
    }
    var h = solve(a, b, true);
    return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].map(function (num) {
        return exports.round(num, 10);
    });
};
exports.matrixToTransform = function (matrix) { return "matrix3d(" + matrix.join(', ') + ")"; };
exports.vectorToTransform = function (vector) { return "translate(" + vector[0] + "px, " + vector[1] + "px)"; };
//# sourceMappingURL=util.js.map