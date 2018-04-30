window.onload = function () {
};
let grid=30;    //格点边长(px)
let scale=20;   //边长数量
let chess = document.getElementById("chess");

let context = chess.getContext('2d');
let me = true;
let chessBoard = [];
let over = false;
//  AI 赢法的数组
let wins = [];
// 赢法的统计数组
let myWin = [];  //  我方
let computerWin = [];  //计算机方

for (let i = 0; i < scale; i++) {
    chessBoard[i] = [];
    for (let j = 0; j < scale; j++) {
        chessBoard[i][j] = 0;
    }
}

for (let i = 0; i < scale; i++) {
    wins[i] = [];
    for (let j = 0; j < scale; j++) {
        wins[i][j] = [];
    }
}

// 赢法总类的索引
let count = 0;
// 初始化所有的横线
for (let i = 0; i < scale; i++) {
    for (let j = 0; j < scale-4; j++) {
        // 第0种赢法
        //wins[0][0][0] = true
        //wins[0][1][0] = true
        //wins[0][2][0] = true
        //wins[0][3][0] = true
        //wins[0][4][0] = true
        // 第0种赢法
        //wins[0][1][1] = true
        //wins[0][2][1] = true
        //wins[0][3][1] = true
        //wins[0][4][1] = true
        //wins[0][5][1] = true
        for (let k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 统计所有的竖线
for (let i = 0; i < scale; i++) {
    for (let j = 0; j < scale-4; j++) {
        for (let k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

// 统计所有的斜线
for (let i = 0; i < scale-4; i++) {
    for (let j = 0; j < scale-4; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}


// 统计所有的反斜线
for (let i = 0; i < scale-4; i++) {
    for (let j = scale-1; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log("count:" + count);

for (let i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

context.strokeStyle = "#BFBFBF";

let logo = new Image();
logo.src = "img/logo.jpg";
logo.onload = function () {
    context.drawImage(logo, 0, 0, chess.width, chess.height);
    drawChessBoard();
};

//以下是核心方法

let drawChessBoard = function () {
    for (let i = 0; i < scale; i++) {
        context.moveTo(grid/2 + i * grid, grid/2);
        context.lineTo(grid/2 + i * grid, grid/2 + grid * (scale-1));
        context.stroke();
        context.moveTo(grid/2, grid/2 + i * grid);
        context.lineTo(grid/2 + grid * (scale-1), grid/2 + i * grid);
        context.stroke();
    }
};

let oneStep = function (i, j, me) {
    context.beginPath();
    context.arc(grid/2 + i * grid, grid/2 + j * grid, 13, 0, 2 * Math.PI);
    context.closePath();
    let gradient = context.createRadialGradient(grid/2 + i * grid + 2, grid/2 + j * grid - 2, 13, grid/2 + i * grid + 2, grid/2 + j * grid - 2, 0);
    if (me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }

    context.fillStyle = gradient;
    context.fill();
};

chess.onclick = function (e) {
    if (over)
        return;
    if (!me)
        return;
    let x = e.offsetX;
    let y = e.offsetY;
    let i = Math.floor(x / grid);
    let j = Math.floor(y / grid);
    if (chessBoard[i][j] === 0) {
        oneStep(i, j, me);
        chessBoard[i][j] = 1;
        for (let k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;  // 表示计算机在第k种赢法种类上不可能赢
                if (myWin[k] === 5) {
                    window.alert("槽,你赢了");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }
};

let computerAI = function () {
    let myScore = [];
    let computerScore = [];
    let max = 0; // 保存最高的分数
    let u = v = 0; //保存最高分点的坐标
    for (let i = 0; i < scale; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (let j = 0; j < scale; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }

    for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
            if (chessBoard[i][j] === 0) {
                for (let k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] === 1) {
                            myScore[i][j] += 200;
                        }
                        else if (myWin[k] === 2) {
                            myScore[i][j] += 400;
                        }
                        else if (myWin[k] === 3) {
                            myScore[i][j] += 2000;
                        }
                        else if (myWin[k] === 4) {
                            myScore[i][j] += 10000;
                        }

                        if (computerWin[k] === 1) {
                            computerScore[i][j] += 220;
                        }
                        else if (computerWin[k] === 2) {
                            computerScore[i][j] += 420;
                        }
                        else if (computerWin[k] === 3) {
                            computerScore[i][j] += 2100
                        }
                        else if (computerWin[k] === 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }
                else if (myScore[i][j] === max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }
                else if (computerScore[i][j] === max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    // if (u===undefined || v===undefined)alert('平局!');
    console.log('AI: '+u+','+v);
    oneStep(u, v, false);
    chessBoard[u][v] = 2;

    for (let k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6;  // 表示计算机在第k种赢法种类上不可能赢
            if (computerWin[k] === 5) {
                window.alert("你特么死了");
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
};