//生成选关下拉列表
let chooser = document.getElementById('chooser');
for (let i = 0; i < levels.length; i++) {
    let option = document.createElement('option');
    option.innerHTML = i + '';
    option.value = i + '';
    chooser.appendChild(option);
}
let [win, stuck, refresh, regret] = document.querySelectorAll('#sounds audio');

let lock = false;   //键盘锁
let history = 10;  //历史保留的地图数量
let can = document.getElementById("canvas");
let revoker = document.querySelector('#revoker');   //撤销键
let msg = document.getElementById("msg");
let cxt = can.getContext("2d");
let w = 35, h = 35;
let mapLine = [];   //地图时间轴:用于存放历史记录
let curMap;//当前时间点的地图
let curLevel;//当前等级的地图(常量)
let curMan;//某个方向上的小人图像
let iCurlevel = 0;//关卡数
let moveTimes = 0;//移动了多少次
//预加载所有图片
let oImgs = {
    "floor": "images/floor.gif",
    "wall": "images/wall.png",
    "box": "images/box.png",
    "box_shining": "images/box-shining.png",
    "Hexagram": "images/Hexagram.png",  //六芒星
    "up": "images/up.png",
    "down": "images/down.png",
    "left": "images/left.png",
    "right": "images/right.png",
};

let images = {};

//oImgs-->images 图片预处理
(() => {
    let count = 0;
    let imgNum = Object.getOwnPropertyNames(oImgs).length;
    for (let src in oImgs) {
        images[src] = new Image();
        images[src].onload = function () {
            //判断是否所有的图片都预加载完成
            if (++count >= imgNum)
                init();
        };
        images[src].src = oImgs[src];    //图片开始装载
    }
})();

let {floor, wall, box, box_shining, Hexagram, up, down, left, right} = images;  //对象解构

//撤销
function undo() {
    if (mapLine.length > 0) {
        moveTimes--;
        curMap = mapLine.pop().concat();
        updateInfo();
        DrawMap(curMap);
        regret.play();
    }

}

//初始化游戏
function init() {
    initLevel();//初始化对应等级的游戏
    updateInfo();//初始化对应等级的游戏数据
}

class Point {//小人位置坐标
    constructor(x, y) {
        [this.x, this.y] = [x, y];
    }
}

let perPosition = new Point(5, 5);//小人的初始标值

//绘制每个游戏关卡地图
function DrawMap(level) {
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            cxt.drawImage(floor, w * j, h * i, w, h);
            let pic = floor;
            switch (level[i][j]) {
                case 0://地面
                    break;
                case 1://绘制墙壁
                    pic = wall;
                    break;
                case 2://绘制陷进
                    pic = Hexagram;
                    break;
                case 3://绘制箱子
                    pic = box;
                    break;
                case 4://绘制小人
                    pic = curMan;//小人有四个方向 具体显示哪个图片需要和上下左右方位值关联
                    //获取小人的坐标位置
                    perPosition.x = i;
                    perPosition.y = j;
                    break;
                case 5://绘制箱子及陷进位置
                    pic = box_shining;
                    break;
            }
            //每个图片不一样宽 需要在对应地板的中心绘制地图
            cxt.drawImage(pic, w * j - (pic.width - w) / 2, h * i - (pic.height - h), pic.width, pic.height)
        }
    }
}

//初始化游戏等级
function initLevel() {
    curMap = copyArray(levels[iCurlevel]);//当前移动过的游戏地图
    // mapLine.push(curMap.concat([]));
    curLevel = levels[iCurlevel];//当前等级的初始地图
    curMan = down;//初始化小人
    DrawMap(curMap);//绘制出当前等级的地图
}

//切换关卡
function nextLevel(i) {
    //iCurlevel当前的地图关数
    iCurlevel = iCurlevel + i;
    if (iCurlevel < 0) {
        iCurlevel = 0;
        return;
    }
    let len = levels.length;
    if (iCurlevel > len - 1)
        iCurlevel = len - 1;
    initLevel();//初始当前等级关卡
    moveTimes = 0;//游戏关卡移动步数清零
    mapLine = []; //清空
    updateInfo();//初始化当前关卡数据
    // can.focus();
    refresh.play();
}

//小人移动
function doKeyDown(event) {
    if (lock) return;
    let p1, p2;
    let [x, y] = [perPosition.x, perPosition.y];
    //获取小人前面的两个坐标位置来进行判断小人是否能够移动
    switch (event.keyCode) {
        case 38:    //上
            curMan = up;
            [p1, p2] = [new Point(x - 1, y), new Point(x - 2, y)];
            break;
        case 40:    //下
            curMan = down;
            [p1, p2] = [new Point(x + 1, y), new Point(x + 2, y)];
            break;
        case 37:    //左
            curMan = left;
            [p1, p2] = [new Point(x, y - 1), new Point(x, y - 2)];
            break;
        case 39:    //右
            curMan = right;
            [p1, p2] = [new Point(x, y + 1), new Point(x, y + 2)];
            break;
        default:
            return;
    }

    mapLine.push(copyArray(curMap));
    //若果小人能够移动的话，更新游戏数据，并重绘地图
    if (Trygo(p1, p2))
        moveTimes++;
    else {  //即使不嗯呢移动,也别return了吧,因为小人可能要转向啊:-)
        stuck.play();
        mapLine.pop();
    }

    if (mapLine.length > history) mapLine.shift();
    updateInfo();
    //重绘当前更新了数据的地图
    DrawMap(curMap);
    //若果移动完成了进入下一关
    //设置延时执行是为了同步上一步的canvas画图
    if (checkFinish()) {
        lock = true;  //防止重复按键(同步锁)
        win.play();
        setTimeout(function () {
            alert("成功!");
            nextLevel(1);
            lock = false;
        }, 100);
    }
}

//判断是否推成功
function checkFinish() {
    for (let i = 0; i < curMap.length; i++) {
        for (let j = 0; j < curMap[i].length; j++) {
            //当前移动过的地图和初始地图进行比较，若果初始地图上的陷进参数在移动之后不是箱子的话就指代没推成功
            if ((curLevel[i][j] === 2 || curLevel[i][j] === 5) && curMap[i][j] !== 5)
                return false;
        }
    }
    return true;
}

/**
 * 判断小人是否能够移动
 * @return {boolean}
 */
function Trygo(p1, p2) {
    if (p1.x < 0) return false;//若果超出地图的上边，不通过
    if (p1.y < 0) return false;//若果超出地图的左边，不通过
    if (p1.x > curMap.length) return false;//若果超出地图的下边，不通过
    if (p1.y > curMap[0].length) return false;//若果超出地图的右边，不通过
    if (curMap[p1.x][p1.y] === 1) return false;//若果前面是墙，不通过
    if (curMap[p1.x][p1.y] === 3 || curMap[p1.x][p1.y] === 5) {//若果小人前面是箱子那就还需要判断箱子前面有没有障碍物(箱子/墙)
        if (curMap[p2.x][p2.y] === 1 || curMap[p2.x][p2.y] === 3 || curMap[p2.x][p2.y] === 5)
            return false;
        //若果判断不成功小人前面的箱子前进一步
        if (curLevel[p2.x][p2.y] === 2 || curLevel[p2.x][p2.y] === 5)
            curMap[p2.x][p2.y] = 5;
        else curMap[p2.x][p2.y] = 3;//更改地图对应坐标点的值
    }
    //若果都没判断成功小人前进一步
    curMap[p1.x][p1.y] = 4;//更改地图对应坐标点的值
    //若果小人前进了一步，小人原来的位置如何显示
    let v = curLevel[perPosition.x][perPosition.y];
    if (v !== 2) {//若果刚开始小人位置不是陷进的话
        if (v === 5)//可能是5 既有箱子又陷进
            v = 2;//若果小人本身就在陷进里面的话移开之后还是显示陷进
        else v = 0;//小人移开之后之前小人的位置改为地板
    }
    //重置小人位置的地图参数
    curMap[perPosition.x][perPosition.y] = v;
    //若果判断小人前进了一步，更新坐标值
    //若果小动了 返回true 指代能够移动小人
    return true;
}

//更新关卡数据及游戏说明
function updateInfo() {
    msg.innerHTML = `第${iCurlevel}关 步数:${moveTimes}`;
    revoker.value = `撤销(${mapLine.length})`;
}

//二维数组深拷贝    //一维数组直接可以通过concat()
function copyArray(arr) {
    let b = [];//每次移动更新地图数据都先清空再添加新的地图
    for (let i = 0; i < arr.length; i++) {
        b[i] = arr[i].concat();//链接两个数组
    }
    return b;
}