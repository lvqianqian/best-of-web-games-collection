let log = function () {
    console.log.apply(console, arguments)
};

let e = function (selector) {
    return document.querySelector(selector)
};

let es = function (selector) {
    return document.querySelectorAll(selector)
};

let appendHtml = function (element, html) {
    element.insertAdjacentHTML('beforeend', html)
};

let bindEvent = function (element, eventName, callback) {
    element.addEventListener(eventName, callback)
};


let toggleClass = function (element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
};

let testWin = function () {
    let mines = e('#id-span-mines');
    let squares = es('.square');
    let squareMine = es('.mine').length;
    let minesNums = Number(mines.innerHTML);
    if (minesNums + squareMine == squareLeft) {
        alert('U win！😎');
        emoji.innerHTML='😎';
        clickedAll();
        stopTimer();
    }
};

let testLose = function () {
    if (squareLeft == x * y - 1) {
        refresh();
        clicked(event)
    } else {
        clickedAll();
        alert('game over 😳');
        emoji.innerHTML = '😳';
        stopTimer()
    }
};

let removeMine = function (target) {
    if (target.classList.contains('mine')) {
        target.classList.remove('mine');
        let mines = e('#id-span-mines');
        let num = parseInt(mines.innerHTML);
        mines.innerHTML = num + 1
    }
};

let clickedShow = function (target) {
    let value = target.children[0];
    if (!target.classList.contains('clicked')) {
        target.classList.add('clicked');
        if (value.innerHTML != 0) {
            value.classList.add('show')
        }
        squareLeft -= 1
    }
    removeMine(target);

    if (value.innerHTML == '雷') {
        testLose()
    } else {
        testWin()
    }
    return value.innerHTML
};

let indexOf = function (target) {
    let id = target.id;
    let l = id.split('-');
    let result = [];
    result.push(parseInt(l[2]));
    result.push(parseInt(l[3]));
    return result
};

let clickPos = function (xx, yy) {
    if (xx < 0 || xx > x-1) {
        return
    }
    if (yy < 0 || yy > y-1) {
        return
    }
    let id = `#id-cell-${xx}-${yy}`;
    let a = e(id);
    if (!a.classList.contains('clicked')) {
        leftClicked(a)
    }
};

let roundClick = function (pos) {
    let x = pos[0];
    let y = pos[1];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            clickPos(i, j)
        }
    }
};

let leftClicked = function (target) {
    let a = clickedShow(target);
    if (a == 0) {
        let pos = indexOf(target);
        roundClick(pos)
    }
};

let rightClicked = function (target) {
    let mines = e('#id-span-mines');
    let num = parseInt(mines.innerHTML);
    if (target.classList.contains('clicked')) {
        return
    }
    if (target.classList.contains('mine')) {
        target.classList.remove('mine');
        mines.innerHTML = num + 1
    } else {
        target.classList.add('mine');
        mines.innerHTML = num - 1
    }
    testWin()
};

let clicked = function (event) {
    ticTok();
    let target = event.target;
    if (target.classList[0] == 'value') {
        target = target.parentElement
    }
    if (event.button == 0) {
        leftClicked(target)
    } else if (event.button == 2) {
        rightClicked(target)
    }
};

let clickedAll = function () {
    let squares = es('.square');
    for (let i = 0; i < squares.length; i++) {
        let target = squares[i];
        if (target.classList.contains('mine') == false) {
            target.classList.add('clicked')
        }
        let value = target.children[0];
        if (value.innerHTML != '0') {
            value.classList.add('show')
        }
    }
};

let removeClassAll = function (events, className) {
    for (let i = 0; i < events.length; i++) {
        let e = events[i];
        if (e.classList.contains(className)) {
            e.classList.remove(className)
        }
    }
};

let refresh = function () {
    let values = es('.value');
    removeClassAll(values, 'show');
    let squares = es('.square');
    removeClassAll(squares, 'clicked');
    removeClassAll(squares, 'mine');
    if (event != undefined) {
        let target = event.target;
        if (target.classList.contains('start')) {
            num = Number(target.value);
            for(let ele of document.querySelectorAll('.start')){
                ele.classList.remove('active');
            }
            target.classList.add('active');
        }
    }
    refreshValue(num);
    let mines = e('#id-span-mines');
    mines.innerHTML = num;
    squareLeft = x * y;
    resetTimer()
};

let bindAll = function (selector, eventName, callback, responseClass) {
    let elements = document.querySelectorAll(selector);
    if (responseClass == null) {
        for (let i = 0; i < elements.length; i++) {
            let e = elements[i];
            bindEvent(e, eventName, callback)
        }
    } else {
        for (let i = 0; i < elements.length; i++) {
            let e = elements[i];
            bindEventDelegate(e, eventName, callback, responseClass)
        }
    }
};

let modifyLine = function (line, nums) {
    let nodes = line.children;
    for (let i = 0; i < nodes.length; i++) {
        let span = nodes[i].children[0];
        if (nums[i] != 9) {
            span.innerHTML = nums[i]
        } else {
            span.innerHTML = '雷'
        }
    }
};

let countMineLine = function (array) {
    let num = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == 9) {
            num++
        }
    }
    return num
};

let refreshValue = function (num) {
    let a = area(x, y, num);
    let valuesLine = es('.square-line');
    for (let i = 0; i < a.length; i++) {
        let nums = a[i];
        let line = valuesLine[i];
        modifyLine(line, nums)
    }
    num = 0;
    for (let i = 0; i < a.length; i++) {
        num += countMineLine(a[i])
    }
};


let ticTok = function () {
    let time = e('#id-span-time');
    if (!time.classList.contains("time")) {
        time.classList.add("time");
        time.interval = setInterval(function () {
            let t = parseInt(time.innerHTML) + 1;
            time.innerHTML = t
        }, 1000)
    }
};

let resetTimer = function () {
    let time = e('#id-span-time');
    time.innerHTML = 0
};

let stopTimer = function () {
    let time = e('#id-span-time');
    if (time.classList.contains("time")) {
        clearInterval(time.interval);
        time.classList.remove("time")
    }
};

let main = function () {
    drawGrid();
    stopTimer();
    document.oncontextmenu = function () {
        return false;   //禁用右键菜单
    };
    squareLeft = x * y;
    // num = 15;
    bindAll('.buttons-left', 'click', refresh);
    bindAll('.buttons-right button', 'click', scaleChange);
    bindAll('.square', 'mousedown', clicked);
    bindAll('.square', 'touchstart', function () {
        log(event)
    });
    bindAll('.square', 'touchend', function () {
        log(event)
    });
    refresh()
};

main();