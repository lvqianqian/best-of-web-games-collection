function Map(width, height) {
    this.width = width;
    this.height = height;
    this.deleteType;
    this.CurI;
    this.CurJ;
    this.score;
    this.mapArr = [];
    this.markArr = [];
    for (let i = 0; i < this.width; i++) {
        this.mapArr[i] = new Array(2);
        this.markArr[i] = new Array(2);
    }
}

Map.prototype = {
    initMap: function (id) {
        const getWrap = document.getElementById(id);
        const tBody = document.createElement('tbody');
        for (let i = 0; i < this.height; i++) {
            const col = document.createElement("tr");
            for (let j = 0; j < this.width; j++) {
                const row = document.createElement("td");
                this.mapArr[i][j] = col.appendChild(row);
            }
            tBody.appendChild(col);
        }
        const tTable = document.createElement('table');
        tTable.appendChild(tBody);
        getWrap.appendChild(tTable);
    },
    iniMarkArr: function () {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.markArr[i][j] = -1;
            }
        }
    },
    deleteLine: function () {
        if (this.deleteType === 'bottom') {
            for (let l = this.CurI + 2; l >= 3; l--) {
                this.markArr[l][this.CurJ] = this.markArr[l - 3][this.CurJ];
            }
            this.markArr[0][this.CurJ] = -1;
            this.markArr[1][this.CurJ] = -1;
            this.markArr[2][this.CurJ] = -1;
        } else if (this.deleteType === "top") {
            for (let l = this.CurI; l >= 3; l--) {
                this.markArr[l][this.CurJ] = this.markArr[l - 3][this.CurJ];
            }
            this.markArr[0][this.CurJ] = -1;
            this.markArr[1][this.CurJ] = -1;
            this.markArr[2][this.CurJ] = -1;
        } else if (this.deleteType === "right") {
            for (let n = this.CurI; n >= 1; n--) {
                for (let k = this.CurJ; k < this.CurJ + 3; k++) {
                    this.markArr[n][k] = this.markArr[n - 1][k];
                }
            }
            this.markArr[0][this.CurJ] = -1;
            this.markArr[0][this.CurJ + 1] = -1;
            this.markArr[0][this.CurJ + 2] = -1;
        } else if (this.deleteType === "left") {
            for (let n = this.CurI; n > 0; n--) {
                for (let k = this.CurJ; k > this.CurJ - 3; k--) {
                    this.markArr[n][k] = this.markArr[n - 1][k];
                }
            }
            this.markArr[0][this.CurJ] = -1;
            this.markArr[0][this.CurJ - 1] = -1;
            this.markArr[0][this.CurJ - 2] = -1;
        }
        this.score += 30;
    },
    judge: function () {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (i <= this.height - 3
                    && this.markArr[i][j] !== -1
                    && this.markArr[i][j] === this.markArr[i + 1][j]
                    && this.markArr[i][j] === this.markArr[i + 2][j]) {
                    this.deleteType = "bottom";
                    //alert(i + ' ' + j +' '+this.deleteType);
                    this.CurI = i;
                    this.CurJ = j;
                    return true;
                } else if (j <= this.width - 3
                    && this.markArr[i][j] !== -1
                    && this.markArr[i][j] === this.markArr[i][j + 1]
                    && this.markArr[i][j] === this.markArr[i][j + 2]) {
                    this.deleteType = "right";
                    //alert(i + ' ' + j +' '+this.deleteType);
                    this.CurI = i;
                    this.CurJ = j;
                    return true;
                } else if (i >= 2
                    && this.markArr[i][j] !== -1
                    && this.markArr[i][j] === this.markArr[i - 1][j]
                    && this.markArr[i][j] === this.markArr[i - 2][j]) {
                    this.deleteType = "top";
                    //alert(i + ' ' + j +' '+this.deleteType);
                    this.CurI = i;
                    this.CurJ = j;
                    return true;
                } else if (j >= 2
                    && this.markArr[i][j] !== -1
                    && this.markArr[i][j] === this.markArr[i][j - 1]
                    && this.markArr[i][j] === this.markArr[i][j - 2]) {
                    this.deleteType = "left";
                    //alert(i + ' ' + j +' '+this.deleteType);
                    this.CurI = i;
                    this.CurJ = j;
                    return true;
                }
            }
        }
        return false;
    },
    clearBorder: function () {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.mapArr[i][j].style.border = "2px solid #336699";
            }
        }
    },
    drawAnimal: function (animal) {
        const that = this;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.mapArr[i][j].className = animal.types[this.markArr[i][j]];
            }
        }
        let timeOutFun = function () {
            for (let i = 0; i < that.height; i++) {
                for (let j = 0; j < that.width; j++) {
                    if (that.markArr[i][j] === -1) {
                        that.markArr[i][j] = Math.floor(Math.random() * 6);
                        that.mapArr[i][j].className = animal.types[that.markArr[i][j]];
                    }
                }
            }
        };
        setTimeout(timeOutFun, 1000);
    }
};

function Animal(width, height) {
    this.types = ['bare', 'chicken', 'dog', 'fish', 'forg', 'pig'];
    this.xNum = width;
    this.yNum = height;
}

Animal.prototype =
    {
        initAnimal: function (map) {
            for (let i = 0; i < map.height; i++) {
                for (let j = 0; j < map.width; j++) {
                    map.markArr[i][j] = Math.floor(Math.random() * 6);
                    while (map.judge()) {
                        map.markArr[i][j] = Math.floor(Math.random() * 6);
                    }

                    map.mapArr[i][j].className = this.types[map.markArr[i][j]];
                }
            }
        },
        move: function (lastI, lastJ, CurI, CurJ, map) {
            //this.check(map);

            let c = map.markArr[CurI][CurJ];
            map.markArr[CurI][CurJ] = map.markArr[lastI][lastJ];
            map.markArr[lastI][lastJ] = c;

            if (map.judge()) {
                while (map.judge()) {
                    map.deleteLine();
                }
            } else {
                c = map.markArr[lastI][lastJ];
                map.markArr[lastI][lastJ] = map.markArr[CurI][CurJ];
                map.markArr[CurI][CurJ] = c;
            }

            //this.check(map);
        },
        /*	check:function(map)
            {
                let output = ' ';
                for (let i = 0; i < map.height; i++)
                {
                    for (let j = 0; j < map.width; j++)
                    {
                            output += this.types[map.markArr[i][j]] + "," ;
                    }
                    output += "\n ";
                }
                console.log(output);
            }*/
    };


function GameMgr() {
    this.map = new Map(9, 9);
    this.animal = new Animal();
    this.initGameMgr.apply(this, arguments);
}

GameMgr.prototype = {
    initGameMgr: function () {
        const that = this;
        this.map.initMap('wrap');
        this.map.iniMarkArr();
        this.animal.initAnimal(this.map);

        //this.animal.check(this.map);


        let chosen = false;
        let lastI;
        let lastJ;

        for (let i = 0; i < this.map.height; i++) {
            for (let j = 0; j < this.map.width; j++) {
                (function (i, j) {

                    that.addEvent(that.map.mapArr[i][j], 'click', function () {
                        if (!chosen) {
                            lastI = i;
                            lastJ = j;
                            chosen = true;
                            this.style.border = "2px solid #5CACEE";
                        } else {
                            if ((i - lastI === 1 && j === lastJ)    //成功匹配三个
                                || (i - lastI === -1 && j === lastJ)
                                || (j - lastJ === 1 && i === lastI)
                                || (j - lastJ === -1 && i === lastI)) {
                                that.map.clearBorder();
                                that.animal.move(lastI, lastJ, i, j, that.map);
                                that.map.drawAnimal(that.animal);
                                chosen = false;
                            } else {
                                that.map.clearBorder();
                                lastI = i;
                                lastJ = j;
                                this.style.border = "2px solid #5CACEE";
                                chosen = true;
                            }
                        }
                    });
                })(i, j);
            }
        }
    },
    addEvent: (ele, type, handler) => ele.addEventListener(type, handler, false)
};

new GameMgr;    //可以不加括号...