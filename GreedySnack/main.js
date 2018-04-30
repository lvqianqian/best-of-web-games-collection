let timer;
let speed = 10;   //速度单位:格子/s
let trail = [];
let tail = 1;     //蛇的长度
let canv;
let ctx;
let len;
let gap = 1;      //蛇身之间的间隙/px
let px = 10, py = 10;   //下一步的位置
let ax = 15, ay = 15;   //食物位置
let gs = 20;    //格子宽度(px)
let tc = 25;    //画布边长/格
let xv = 0, yv = 0;    //方向的增量

window.onload = function () {
    canv = document.getElementById("canvas");
    len = document.getElementById("length");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    init();
    timer = setInterval(game, 1000 / speed);
};


function init() {
    canv.width = canv.height = tc * gs;
    trail.push({x: px, y: py});
    ctx.fillStyle = "green";
    ctx.fillRect(trail[0].x * gs, trail[0].y * gs, gs - gap, gs - gap);
}

function game() {
    px += xv;
    py += yv;

    //边界判断
    if (px < 0) {
        px = tc - 1;
    }
    if (px > tc - 1) {
        px = 0;
    }
    if (py < 0) {
        py = tc - 1;
    }
    if (py > tc - 1) {
        py = 0;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);    //清屏
    ctx.fillStyle = "green";
    for (let i = 0; i < trail.length; i++) {
        if (i === trail.length - 1) ctx.fillStyle = "lime";    //画蛇头
        ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - gap, gs - gap);
        if ((xv || yv) && trail[i].x === px && trail[i].y === py) {
            tail--;   //发生追尾
        }
    }
    if (xv || yv) {     //非暂停状态下
        trail.push({x: px, y: py});
        while (trail.length > tail) {
            trail.shift();
        }
    }
    if (ax === px && ay === py) {
        tail++;
        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(ax * gs, ay * gs, gs - gap, gs - gap);

    len.innerHTML = tail;
}


function keyPush(evt) {
    switch (evt.keyCode) {
        case 16:    //shift
            game();
            break;
        case 32:    //space
            [xv, yv] = [0, 0];
            break;
        case 37:    //左
            [xv, yv] = [-1, 0];
            break;
        case 38:    //上
            [xv, yv] = [0, -1];
            break;
        case 39:    //右
            [xv, yv] = [1, 0];
            break;
        case 40:    //下
            [xv, yv] = [0, 1];
            break;
        default:
            break;
    }
}

//shift加速
function accelerate(ctrl) {
    speed = ctrl.value;
    clearInterval(timer);
    timer = setInterval(game, 1000 / speed);
}

//调整地图大小
function extend(ctrl) {
    tc = ctrl.value;
    canv.width = canv.height = tc * gs;
}