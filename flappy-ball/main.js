let B_Array = [0];  //障碍物(待优化:没有shift()
//画布宽高
let cw = 1000;
let ch = 700;
let B_width = 70;
let B_top = 100;
let B_x = [];
let B_kind = [];
let nowTime = new Date();
// let score = document.querySelector('#score');     //分数
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let id = 0;
let y = 400;    //Y轴方向速度
let g = 0;  //加速度?
let bbb = cw - B_width;
let nowsecond = nowTime.getTime();
let isPaused = true;

canvas.width = cw;
canvas.height = ch;
// canvas.focus();

ctx.fillStyle = 'rgba(0,0,0,0.4)';
ctx.fillRect(0, 0, cw, ch);
ctx.font = "80px Georgia";
ctx.fillStyle = 'white';
ctx.textAlign = "center";     //相对于下面的x坐标居中
ctx.fillText('>> START <<', 500, 380);


let gameStrat = function () {
    canvas.onmousedown = document.onkeydown = flap;
    render(ctx);
};

function flap() {
    if (g = 3) g = -g * 4
}

canvas.onmousedown = document.onkeydown = gameStrat;

function render() {

    ctx.clearRect(0, 0, cw, ch);
    if (g < 3) {
        g++;
    }
    y += g; //  球掉落速度

    renderBall(ctx);
    renderBarrier(ctx);
    barrierAdd();
    collisionTest();


    // score.innerHTML = B_Array.length;
    requestAnimationFrame(render)
}

//生成新的障碍物
function barrierAdd() {
    let nextTime = new Date();
    let nextsecond = nextTime.getTime();
    let diff = nextsecond - nowsecond;
    if (diff >= 1500) { //障碍物出现间隔
        B_x.push(bbb);
        nowsecond = nextsecond;
        B_x.push(bbb);
        B_Array.push(++id);
        // if (B_Array.length > 5)
        //     B_Array.shift();
    }
}

//  渲染个球
function renderBall(ctx) {

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, y, 30, 0, 2 * Math.PI, true);
    ctx.closePath();

}

// 渲染障碍物
function renderBarrier(ctx) {
    B_kind.push(Math.ceil(Math.random() * 4));

    ctx.font = "30px Georgia";

    for (let i = 0; i < B_Array.length; i++) {
        B_x[i] -= 3; //  障碍物移动速度
        ctx.fillStyle = "rgb(50,150,250)";
        ctx.fillRect(B_x[i], 0, 80, B_top * B_kind[i]);
        ctx.fillRect(B_x[i], B_top * B_kind[i] + 200, 80, ch - B_top * B_kind[i] - 200);
        ctx.fillStyle = 'white';
        ctx.fillText(B_Array[i], B_x[i] + 40, 30);
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
                // score.innerHTML = i;
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
        location.reload();
    }
}