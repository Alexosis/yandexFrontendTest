let method = process.argv[2];
let path = process.argv[3];

switch (method) {
    case '-F':
        try {
            fileInit()
        } catch (err) {
            console.error(err);
        }
        break;
    case '-R':
    default:
        randomInit();
        break;
}

function fileInit() {
    if (path === undefined) {
        path = 'input.txt';
    }
    const fs = require("fs");
    let fileContent = fs.readFileSync(path, "utf8");
    let lines = fileContent.split('\r\n');
    let items;
    let status = [];
    let height = lines.length;
    let width = lines[0].split(' ').length;

    if(width<2 || height<2){
        throw new SyntaxError('Wrong input! Board size is too small!')
    }


    for (let iLines = 0; iLines < lines.length; iLines++) {
        items = lines[iLines].split(' ').map(item => +item);
        if (width !== items.length) {
            throw new SyntaxError('Wrong input! Length  of rows is different!');
        }

        width = items.length;
        status.push(items);
    }

    if (!status.flat().every(elem => elem === 1 || elem === 0)) {
        throw new SyntaxError('Wrong input! File has incorrect values!');
    }

    setInterval(life, 1000, status, height, width);
}

function randomInit() {
    const height = Math.floor(Math.random() * 5) + 5,
        width = Math.floor(Math.random() * 2) + 5;
    let status = Array.from({length: height}, () =>
        Array.from({length: width}, () => Math.round(Math.random())));
    setInterval(life, 1000, status, height, width);
}

function life(status, height, width) {
    console.log(status);
    let linearizedArray = status.flat();
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            let neighbours = countNeighbours(row, column, linearizedArray, width)
            if (status[row][column]) {
                switch (neighbours) {
                    case 2:
                    case 3:
                        break;
                    default: {
                        status[row][column] = 0;
                    }
                }
            } else {
                if (neighbours === 3) {
                    status[row][column] = 1;
                }
            }
        }
    }
}

function countNeighbours(row, column, statusArray, width) {
    let sum = 0;
    let elemNum = row * width + column;
    let neighbors = [-width - 1, -width, -width + 1, -1, +1, width - 1, width, width + 1];
    if (elemNum % width === 0) {
        neighbors = [-width, -width + 1, +1, width, width + 1]
    }
    if (elemNum % width === width - 1) {
        neighbors = [-width - 1, -width, -1, width - 1, width]
    }
    for (let pos of neighbors) {
        if (statusArray[elemNum + pos] !== undefined) {
            sum += statusArray[elemNum + pos];
        }
    }
    return sum;
}