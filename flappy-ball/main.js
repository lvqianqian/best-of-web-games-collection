const B_Array = [''];
//画布宽高
const cw = 1000;
const ch = 700;
const B_width = 70;
const B_top = 100;
const B_x = [];
const B_kind = [];
const nowTime = new Date();
const btn = document.getElementById('btn');
const score = document.querySelector('#score');     //分数

const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

let y = 400;
let g = 0;
let bbb = cw - B_width;
let nowsecond = nowTime.getTime();
let isPaused = true;

canvas.width = cw;
canvas.height = ch;
// canvas.focus();

context.fillStyle = 'rgba(0,0,0,0.6)';
context.fillRect(0, 0, cw, ch);

const gameStrat = function () {
    if (btn.innerHTML === "重玩") {
        // window.location.href = window.location.href;
        location.reload();
    }
    btn.style.display = "none";
    canvas.onmousedown = document.onkeydown = flap;
    ball = setInterval(function () {
        render(context);
    }, 7)
};

function flap() {
    if (g = 3) g = -g * 5
}
canvas.onmousedown = document.onkeydown = gameStrat;

function render(cxt) {

    cxt.clearRect(0, 0, cw, ch);
    if (g < 3) {
        g++;
    }
    y += g; //  球掉落速度

    renderBall(cxt);
    renderBarrier(cxt);
    barrierAdd();
    collisionTest();

}

function barrierAdd() {
    const nextTime = new Date();
    const nextsecond = nextTime.getTime();
    const diff = nextsecond - nowsecond;
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

    for (let i = 0; i < B_Array.length; i++) {
        B_x[i] -= 3; //  障碍物移动速度
        cxt.fillRect(B_x[i], 0, 80, B_top * B_kind[i]);
        cxt.fillRect(B_x[i], B_top * B_kind[i] + 200, 80, ch - B_top * B_kind[i] - 200);
    }
}

//碰撞检测
function collisionTest() {
    let collided = false;
    for (let i = 0; i < B_Array.length; i++) {
        if (B_x[i] > 40 && B_x[i] < 120) {
            if (y < B_top * B_kind[i] + 28 || y > B_top * B_kind[i] + 200 - 28) {
                collided = true;
            } else {
                score.innerHTML = i;
            }
        }
        if (B_x[i] > 10 && B_x[i] < 40) {
            if (y < B_top * B_kind[i] + 15 || y > B_top * B_kind[i] + 200 - 15) {
                collided = true;
            }
        }
        if (B_x[i] > 120 && B_x[i] < 150) {
            if (y < B_top * B_kind[i] + 15 || y > B_top * B_kind[i] + 200 - 15) {
                collided = true;
            }
        }
    }
    if (collided) {
        context.fillStyle = 'rgba(0,0,0,0.6)';
        context.fillRect(0, 0, cw, ch);
        btn.style.display = "block";
        btn.innerHTML = "重玩";
        clearInterval(ball);
        canvas.onmousedown = document.onkeydown = gameStrat;
    }
}