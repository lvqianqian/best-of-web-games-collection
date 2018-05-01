
let x = y = 12;     //格子数量
let num = 6;
let container = document.querySelector('#id-content');
let emoji = document.getElementById('emoji');

let drawGrid = function () {
    container.innerHTML = '';
    for (let i = 0; i < y; i++) {
        let line = document.createElement('div');
        line.setAttribute('class', 'square-line');
        container.appendChild(line);
        for (let j = 0; j < x; j++) {
            let square = document.createElement('div');
            let value = document.createElement('span');
            square.setAttribute('class', 'square');
            square.setAttribute('id', `id-cell-${i}-${j}`);
            value.setAttribute('class', 'value');
            line.appendChild(square).appendChild(value);
        }
    }
};

let random01 = function () {
    /*
    返回 0 或 1
    */
    let a = Math.random();
    if (a > 0.85) {
        return 1
    } else {
        return 0
    }
};


let randomLine09 = function (n) {
    /*
    返回一个只包含了 0 9 的随机 array, 长度为 n
    假设 n 为 5, 返回的数据格式如下(这是格式范例, 真实数据是随机的)
    [0, 0, 9, 0, 9]
    */
    let l = [];
    for (let i = 0; i < n; i++) {
        l.push(random01() * 9)
    }
    return l
};

let shuffle = function (array) {
    let len = array.length;
    for (let i = 0; i < len - 1; i++) {
        let temp = array[i];
        let index = Math.floor(Math.random() * (len - i) + i);
        array[i] = array[index];
        array[index] = temp
    }
};

let randomArray09 = function (len, num) {
    let l = [];
    for (let i = 0; i < num; i++) {
        l.push(9)
    }
    while (l.length < len) {
        l.push(0)
    }
    shuffle(l);
    return l
};

let randomSquare09 = function (x, y, num) {
    let l = [];
    let len = x * y;
    let array = randomArray09(len, num);
    for (let i = 0; i < x; i++) {
        let a = array.slice(i * y, (i + 1) * y);
        l.push(a)
    }
    return l
};

let clonedSquare = function (array) {
    let s = [];
    for (let i = 0; i < array.length; i++) {
        let line = [];
        for (let j = 0; j < array[i].length; j++) {
            line.push(array[i][j])
        }
        s.push(line)
    }
    return s
};

/*
    array 是一个「包含了『只包含了 0 9 的 array』的 array」
    返回一个标记过的 array
    ** 注意, 使用一个新数组来存储结果, 不要直接修改老数组

    范例如下, 这是 array
    [
        [0, 9, 0, 0],
        [0, 0, 9, 0],
        [9, 0, 9, 0],
        [0, 9, 0, 0],
    ]

    这是标记后的结果
    [
        [1, 9, 2, 1],
        [2, 4, 9, 2],
        [9, 4, 9, 2],
        [2, 9, 2, 1],
    ]

    规则是, 0 会被设置为四周 8 个元素中 9 的数量
*/
let markedSquare = function (array) {
    let result = clonedSquare(array);
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] == 0) {
                countNines(result, i, j)
            }
        }
    }
    return result
};

let countNines = function (result, i, j) {
    for (let a = i - 1; a <= i + 1; a++) {
        for (let b = j - 1; b <= j + 1; b++) {
            if (a < 0 || a >= result.length) {
                continue
            }
            if (b < 0 || b >= result[i].length) {
                continue
            }
            if (result[a][b] == 9) {
                result[i][j]++
            }
        }
    }
};

let area = function (x, y, num) {
    let a = randomSquare09(x, y, num);
    return markedSquare(a)
};


let scaleChange = function () {
    document.querySelectorAll('.buttons-right button').forEach(function (item) {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    x = y = parseInt(event.target.value);
    main();
};