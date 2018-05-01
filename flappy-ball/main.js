
var y = 400;
var g = 0;
var B_Array = [''];
var WINDOW_WIDTH = 1000;
var WINDOW_HEIGHT = 700;
var B_width = 70;
var B_top = 100;
var bbb = 0;
bbb = WINDOW_WIDTH - B_width;
var B_x = [];
var B_kind = [];
var nowTime = new Date();
var nowsecond = nowTime.getTime();
var btn = document.getElementById('btn');
var p = document.getElementsByTagName('p')[0];

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

var gameStrat = function() {
    if (btn.innerHTML == "重玩") { window.location.href = window.location.href; }
    btn.style.display = "none";
    ball = setInterval(function() {
        render(context);
    }, 7)
}

function mouseDown() {
    if (g = 3) g = -g * 5
}
document.onmousedown = mouseDown;

function keyDown() {
    if (g = 3) g = -g * 5
}
document.onkeydown = keyDown;

function render(cxt) {

    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    if (g < 3) { g++; }
    y += g; //  球掉落速度

    renderBall(cxt);
    renderBarrier(cxt)
    barrierAdd();
    collisionTest();

}

function barrierAdd() {
    var nextTime = new Date();
    var nextsecond = nextTime.getTime();
    var diff = nextsecond - nowsecond;
    if (diff >= 1500) { //障碍物出现间隔
        B_x.push(bbb);
        nowsecond = nextsecond;
        B_x.push(bbb);
        B_Array.push('');
    }
}

//  渲染个球
function renderBall(cxt) {

    cxt.fillStyle = "rgb(0,0,0)";
    cxt.fill();
    cxt.beginPath();
    cxt.arc(120, y, 30, 0, 2 * Math.PI, true);
    cxt.closePath();

}

// 渲染障碍物
function renderBarrier(cxt) {
    B_kind.push(Math.ceil(Math.random() * 4))

    cxt.fillStyle = "rgb(50,150,250)";

    for (var i = 0; i < B_Array.length; i++) {
        B_x[i] -= 3; //  障碍物移动速度
        cxt.fillRect(B_x[i], 0, 80, B_top * B_kind[i]);
        cxt.fillRect(B_x[i], B_top * B_kind[i] + 200, 80, WINDOW_HEIGHT - B_top * B_kind[i] - 200);
    }
}

function collisionTest() {
    for (var i = 0; i < B_Array.length; i++) {
        if (B_x[i] > 40 && B_x[i] < 120) {
            if (y < B_top * B_kind[i] + 28 || y > B_top * B_kind[i] + 200 - 28) {
                btn.style.display = "block";
                btn.innerHTML = "重玩";
                clearInterval(ball);
            } else { p.innerHTML = i; }
        }
        if (B_x[i] > 10 && B_x[i] < 40) {
            if (y < B_top * B_kind[i] + 15 || y > B_top * B_kind[i] + 200 - 15) {
                btn.style.display = "block";
                btn.innerHTML = "重玩";
                clearInterval(ball);
            }
        }
        if (B_x[i] > 120 && B_x[i] < 150) {
            if (y < B_top * B_kind[i] + 15 || y > B_top * B_kind[i] + 200 - 15) {
                btn.style.display = "block";
                btn.innerHTML = "重玩";
                clearInterval(ball);
            }
        }
    }
}