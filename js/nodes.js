/*
 * nodes.js is a nodes/particles animation useable for backgrounds
 *
 * http://oguzhaneroglu.com/projects/nodes.js/
 * https://github.com/rohanrhu/nodes.js
 *
 * Copyright (C) 2018, Oğuzhan Eroğlu <rohanrhu2@gmail.com>
 * Licensed under MIT
 */

var NodesJs = (function (parameters) {
    t_NodesJs = this;
    t_NodesJs.id = parameters.id;
    t_NodesJs.width = parameters.width;
    t_NodesJs.height = parameters.height;
    t_NodesJs.particleSize = parameters.particleSize ? parameters.particleSize: 2;
    t_NodesJs.lineSize = parameters.lineSize ? parameters.lineSize: 1;
    t_NodesJs.particleColor = parameters.particleColor ? 'rgba('+parameters.particleColor.join(',')+')': 'rgba(255,255,255,0.3)';
    t_NodesJs.lineColor = parameters.lineColor ? parameters.lineColor: '255,255,255';
    t_NodesJs.backgroundFrom = parameters.backgroundFrom;
    t_NodesJs.backgroundTo = parameters.backgroundTo;
    t_NodesJs.backgroundDuration = parameters.backgroundDuration;
    t_NodesJs.number = parameters.number ? parameters.number: 100;
    t_NodesJs.speed = parameters.speed ? parameters.speed: 20;
    t_NodesJs.nobg = parameters.nobg ? parameters.nobg: false;
    t_NodesJs.pointerCircleRadius = parameters.pointerCircleRadius ? parameters.pointerCircleRadius: 150;

    var canvas;
    var ctx;
    var cw;
    var ch;

    var t0 = Date.now();
    var dt = 0;

    t_NodesJs.nodes = [];

    t_NodesJs.setWidth = function (width) {
        canvas.width = width;
        cw = width;
    };

    t_NodesJs.setHeight = function (height) {
        canvas.height = height;
        ch = height;
    };

    t_NodesJs.placeNodes = function (number) {
        t_NodesJs.nodes = [];

        for (var i=0; i < number; i++) {
            t_NodesJs.nodes.push([
                Math.floor(Math.random() * (cw - 0 + 1)) + 0,
                Math.floor(Math.random() * (ch - 0 + 1)) + 0,
                Math.random() * (Math.PI * 2 - 0 + 1) + 0,
                []
            ]);
        }
    };

    var isPositive = function (num) {
        return num >= 0;
    };

    var isNetagive = function (num) {
        return num <= -1;
    };

    t_NodesJs.pointerCircleRadius
    &&
    window.addEventListener('mousemove', function (event) {
        if (!t_NodesJs.nodes.length) {
            return;
        }

        var mx = event.clientX;
        var my = event.clientY;

        t_NodesJs.nodes.forEach(function (_node, _node_i) {
            var nx = _node[0];
            var ny = _node[1];

            var xsig = nx - mx;
            var ysig = ny - my;

            var ndx = Math.abs(xsig);
            var ndy = Math.abs(ysig);

            var nh = Math.sqrt(Math.pow(ndx, 2) + Math.pow(ndy, 2));

            var angle = Math.acos(ndx / nh);
            if (isPositive(xsig) && isNetagive(ysig)) {
            } else if (isNetagive(xsig) && isNetagive(ysig)) {
                angle = ((Math.PI/2) - angle) + (Math.PI/2);
            } else if (isNetagive(xsig) && isPositive(ysig)) {
                angle = angle + Math.PI;
            } else if (isPositive(xsig) && isPositive(ysig)) {
                angle = ((Math.PI/2) - angle) + (Math.PI*(3/2));
            }

            angle = (Math.PI*2) - angle;

            var rx = mx + Math.cos(angle) * t_NodesJs.pointerCircleRadius;
            var ry = my + Math.sin(angle) * t_NodesJs.pointerCircleRadius;

            var mdx = Math.abs(rx - mx);
            var mdy = Math.abs(ry - my);

            var mh = Math.sqrt(Math.pow(mdx, 2) + Math.pow(mdy, 2));

            if (nh < mh) {
                _node[0] = Math.floor(rx);
                _node[1] = Math.floor(ry);
            }
        });
    });

    window[window.addEventListener ? 'addEventListener': 'attachEvent']
    (window.addEventListener ? 'load': 'onload', function () {
        canvas = document.getElementById(t_NodesJs.id);
        ctx = canvas.getContext('2d');

        canvas.width = t_NodesJs.width;
        canvas.height = t_NodesJs.height;

        cw = canvas.width;
        ch = canvas.height;

        t_NodesJs.placeNodes(t_NodesJs.number);

        var step = function () {
            window.requestAnimationFrame(step);

            ctx.clearRect(0, 0, cw, ch);

            if (!t_NodesJs.nobg) {
                var r = Math.floor(((Math.sin(Math.PI * 2 * Date.now() / t_NodesJs.backgroundDuration - Math.PI/2)+1)/2) * (t_NodesJs.backgroundFrom[0] - t_NodesJs.backgroundTo[0] + 1) + t_NodesJs.backgroundTo[0]);
                var g = Math.floor(((Math.sin(Math.PI * 2 * Date.now() / t_NodesJs.backgroundDuration - Math.PI/2)+1)/2) * (t_NodesJs.backgroundFrom[1] - t_NodesJs.backgroundTo[1] + 1) + t_NodesJs.backgroundTo[1]);
                var b = Math.floor(((Math.sin(Math.PI * 2 * Date.now() / t_NodesJs.backgroundDuration - Math.PI/2)+1)/2) * (t_NodesJs.backgroundFrom[2] - t_NodesJs.backgroundTo[2] + 1) + t_NodesJs.backgroundTo[2]);

                ctx.beginPath();
                ctx.fillStyle = 'rgb('+r+', '+g+', '+b+')';
                ctx.fillRect(0, 0, cw, ch);
                ctx.fill();
            }
            
            t_NodesJs.nodes.forEach(function (_node, _node_i) {
                _node[0] += Math.cos(_node[2]) * t_NodesJs.speed * (dt/1000.0);
                _node[1] += Math.sin(_node[2]) * t_NodesJs.speed * (dt/1000.0);

                if (_node[0] < 0) {
                    _node[0] = cw + (_node[0] % cw);
                }

                if (_node[0] > cw) {
                    _node[0] = _node[0] % cw;
                }

                if (_node[1] < 0) {
                    _node[1] = ch + (_node[1] % ch);
                }

                if (_node[1] > ch) {
                    _node[1] = _node[1] % ch;
                }

                ctx.fillStyle = t_NodesJs.particleColor;

                ctx.beginPath();
                ctx.arc(
                    _node[0],
                    _node[1],
                    t_NodesJs.particleSize,
                    0,
                    Math.PI * 2,
                    true
                );
                ctx.fill();

                _node[3] = [];

                t_NodesJs.nodes.forEach(function (_node2, _node2_i) {
                    if (_node_i == _node2_i) {
                        return true;
                    }

                    if (_node[3].indexOf(_node2_i) > -1) {
                        return true;
                    }

                    var dx = Math.abs(_node[0] - _node2[0]);
                    var dy = Math.abs(_node[1] - _node2[1]);
                    var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

                    var alpha = 0;

                    if (d <= 300) {
                        alpha = 0.3 - ((0.3 * d) / 200);
                    }

                    if (alpha == 0) {
                        return true;
                    }

                    _node2[3].push(_node_i);

                    ctx.strokeStyle = 'rgba('+t_NodesJs.lineColor+','+alpha+')';
                    ctx.lineWidth = t_NodesJs.lineSize;

                    ctx.beginPath();
                    ctx.moveTo(_node[0], _node[1]);
                    ctx.lineTo(_node2[0], _node2[1]);
                    ctx.stroke();
                });
            });

            dt = Date.now() - t0;
            t0 = Date.now();
        };

        step();
    });
});