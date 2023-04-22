const table = document.getElementById('myTable');
const container = document.querySelector('.container');
container.appendChild(table);

let maze = [];

let createWallOrPointMode = null;
let sizeOfMaze = 10;
let start = null;
let end = null;
let information = "";
let startMode = 0;
let endMode = 0;
let crutch = 0;

function createTable() {
    for (let i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
        maze[i] = []
        start = null
        end = null
        startMode = 0
        endMode = 0
        information = ""
    }
    if (crutch !== 0) {
        sizeOfMaze = document.getElementById("myNumberInput").value;
    }
    crutch = 1;
    for (let i = 0; i < sizeOfMaze; i++) {
        maze[i] = [];
        for (let j = 0; j < sizeOfMaze; j++) {
            maze[i][j] = {
                value: 0,
                y: i,
                x: j,
                h: 0,
                d: 0,
                w: 0,
                neighbors: [],
                parent: null,
            };
        }
    }

    for (let y = 0; y < maze.length; y++) {
        const row = document.createElement('tr');
        table.appendChild(row);
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('td');
            row.appendChild(cell);
            cell.addEventListener('click', () => {
                switch (createWallOrPointMode) {
                    case "wall":
                        switch (maze[y][x].value) {
                            case 2:
                                if (start.y === maze[y][x].y && start.x === maze[y][x].x) {
                                    startMode = 0;
                                    start = null;
                                }
                                if (end.y === maze[y][x].y && end.x === maze[y][x].x) {
                                    endMode = 0;
                                    end = null;
                                }
                                maze[y][x].value = 1;
                                cell.className = '';
                                cell.classList.add('wall');
                                break;
                            case 1:
                                maze[y][x].value = 0;
                                cell.className = '';
                                cell.classList.add('maze');
                                break;
                            case 0:
                                maze[y][x].value = 1;
                                cell.className = '';
                                cell.classList.add('wall');
                                break;
                        }
                        break
                    case "start":
                        switch (maze[y][x].value) {
                            case 2:
                                if (start !== null && (start.y === maze[y][x].y && start.x === maze[y][x].x)) {
                                    startMode = 0;
                                    start = null;
                                }
                                if (end !== null && (end.y === maze[y][x].y && end.x === maze[y][x].x)) {
                                    endMode = 0;
                                    end = null;
                                }
                                maze[y][x].value = 0;
                                cell.className = '';
                                cell.classList.add('maze');
                                break;
                            case 1:
                                if (startMode === 1) {
                                    break;
                                }
                                maze[y][x].value = 2;
                                start = maze[y][x];
                                startMode = 1;
                                cell.className = '';
                                cell.classList.add('startPoint');
                                break;
                            case 0:
                                if (startMode === 1) {
                                    break;
                                }
                                maze[y][x].value = 2;
                                start = maze[y][x];
                                startMode = 1;
                                cell.className = '';
                                cell.classList.add('startPoint');
                                break;
                        }
                        break
                    case "end":
                        switch (maze[y][x].value) {
                            case 2:
                                if (start !== null && (start.y === maze[y][x].y && start.x === maze[y][x].x)) {
                                    startMode = 0;
                                    start = null;
                                }
                                if (end !== null && (end.y === maze[y][x].y && end.x === maze[y][x].x)) {
                                    endMode = 0;
                                    end = null;
                                }
                                maze[y][x].value = 0;
                                cell.className = '';
                                cell.classList.add('maze');
                                break;
                            case 1:
                                if (endMode === 1) {
                                    break;
                                }
                                maze[y][x].value = 2;
                                end = maze[y][x];
                                endMode = 1;
                                cell.className = '';
                                cell.classList.add('endPoint');
                                break;
                            case 0:
                                if (endMode === 1) {
                                    break;
                                }
                                maze[y][x].value = 2;
                                end = maze[y][x];
                                endMode = 1;
                                cell.className = '';
                                cell.classList.add('endPoint');
                                break;
                        }
                }
            });
            row.appendChild(cell);
        }
    }
}

createTable()

function createMaze(maze, sizeOfMaze, table) {

    for (let y = 0; y < sizeOfMaze; y++) {
        for (let x = 0; x < sizeOfMaze; x++) {
            table.rows[y].cells[x].className = '';
            table.rows[y].cells[x].classList.add('wall');
            maze[y][x].value = 1
            startMode = 0
            endMode = 0
            start = null
            end = null
            information = ""
        }
    }
    let neighboursList = []

    function getNeighbours(y, x, addBlockWalls, maze, table) {
        maze[y][x].value = 0;
        table.rows[y].cells[x].classList.remove('wall');
        table.rows[y].cells[x].classList.add('maze');
        if (addBlockWalls && valid(y + 1, x) && (maze[y + 1][x].value === 1))
            neighboursList.push([y + 1, x, [y, x]]);
        if (addBlockWalls && valid(y - 1, x) && (maze[y - 1][x].value === 1))
            neighboursList.push([y - 1, x, [y, x]]);
        if (addBlockWalls && valid(y, x + 1) && (maze[y][x + 1].value === 1))
            neighboursList.push([y, x + 1, [y, x]]);
        if (addBlockWalls && valid(y, x - 1) && (maze[y][x - 1].value === 1))
            neighboursList.push([y, x - 1, [y, x]]);
    }

    function valid(a, b) {
        return (a < sizeOfMaze && a >= 0 && b < sizeOfMaze && b >= 0);
    }

    function reproduceMaze() {
        if (neighboursList.length !== 0) {
            let randomWall = neighboursList[Math.floor(Math.random() * neighboursList.length)]
            let host = randomWall[2]
            let opposite = [(host[0] + (randomWall[0] - host[0]) * 2), (host[1] + (randomWall[1] - host[1]) * 2)]
            if (valid(opposite[0], opposite[1])) {
                if (maze[opposite[0]][opposite[1]].value === 0)
                    neighboursList.splice(neighboursList.indexOf(randomWall), 1);
                else
                    getNeighbours(randomWall[0], randomWall[1], false, maze, table),
                        getNeighbours(opposite[0], opposite[1], true, maze, table);

            } else
                neighboursList.splice(neighboursList.indexOf(randomWall), 1);

            setTimeout(reproduceMaze, 0.001);
        }
    }

    getNeighbours(2, 2, true, maze, table)
    reproduceMaze();
}

function findPath() {
    if (start === null || end === null) {
        return
    }
    for (let y = 0; y < sizeOfMaze; y++) {
        for (let x = 0; x < sizeOfMaze; x++) {
            if (maze[y][x].value === 0) {
                table.rows[y].cells[x].className = '';
                table.rows[y].cells[x].classList.add('maze');
            }
        }
    }

    function manhattanHeuristic(start, end) {
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    }

    function getNeighbours(y, x, maze, table, end, openList, closedList) {
        if (valid(y + 1, x) && (maze[y + 1][x].value !== 1) && !closedList.includes(maze[y + 1][x])) {
            maze[y + 1][x].h = manhattanHeuristic(maze[y + 1][x], end) * 10
            maze[y + 1][x].d = maze[x][y].d + 10
            maze[y + 1][x].w = maze[y + 1][x].h + maze[y + 1][x].d
            maze[y + 1][x].parent = maze[y][x]
            openList.add(maze[y + 1][x]);
        }
        if (valid(y - 1, x) && (maze[y - 1][x].value !== 1) && !closedList.includes(maze[y - 1][x])) {
            maze[y - 1][x].h = manhattanHeuristic(maze[y - 1][x], end) * 10
            maze[y - 1][x].d = maze[x][y].d + 10
            maze[y - 1][x].w = maze[y - 1][x].h + maze[y - 1][x].d
            maze[y - 1][x].parent = maze[y][x]
            openList.add(maze[y - 1][x]);
        }
        if (valid(y, x + 1) && (maze[y][x + 1].value !== 1) && !closedList.includes(maze[y][x + 1])) {
            maze[y][x + 1].h = manhattanHeuristic(maze[y][x + 1], end) * 10
            maze[y][x + 1].d = maze[x][y].d + 10
            maze[y][x + 1].w = maze[y][x + 1].h + maze[y][x + 1].d
            maze[y][x + 1].parent = maze[y][x]
            openList.add(maze[y][x + 1]);
        }
        if (valid(y, x - 1) && (maze[y][x - 1].value !== 1) && !closedList.includes(maze[y][x - 1])) {
            maze[y][x - 1].h = manhattanHeuristic(maze[y][x - 1], end) * 10
            maze[y][x - 1].d = maze[x][y].d + 10
            maze[y][x - 1].w = maze[y][x - 1].h + maze[y][x - 1].d
            maze[y][x - 1].parent = maze[y][x]
            openList.add(maze[y][x - 1]);
        }
    }

    function valid(a, b) {
        return (a < sizeOfMaze && a >= 0 && b < sizeOfMaze && b >= 0);
    }

    function getMin(openList) {
        let minValue = [...openList][0];
        [...openList].forEach((elem) => {
            if (elem.w < minValue.w) {
                minValue = elem;
            }
        });
        return minValue;
    }

    let openList = new Set();
    let closedList = [];

    getNeighbours(start.y, start.x, maze, table, end, openList, closedList)
    closedList.push(start)
    table.rows[start.y].cells[start.x].classList.replace('maze', 'active')

    async function visualizePathFinding() {
        while (openList.size > 0) {
            let current = getMin(openList);

            if (current.x === end.x && current.y === end.y) {
                information = ":D";
                document.getElementById("textArea").innerHTML = information;
                table.rows[start.y].cells[start.x].classList.replace('active', 'path');
                table.rows[current.y].cells[current.x].classList.replace('maze', 'path');

                async function visualizePath() {
                    while (current !== start) {
                        table.rows[current.y].cells[current.x].classList.replace('active', 'path');
                        current = current.parent;
                        await new Promise(resolve => setTimeout(resolve, 30));
                    }
                }

                visualizePath()
                return;
            }
            table.rows[current.y].cells[current.x].classList.replace('maze', 'active');
            getNeighbours(current.y, current.x, maze, table, end, openList, closedList);
            openList.delete(current);
            closedList.push(current);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        information = ":(";
        document.getElementById("textArea").innerHTML = information;
    }

    visualizePathFinding().then(r => console.log("cock"))
}


const createWallModeBtn = document.querySelector('#createWallModeBtn');
const setStartBtn = document.querySelector('#setStartBtn');
const setEndBtn = document.querySelector('#setEndBtn');
const createMazeBtn = document.querySelector('#createMazeBtn');
const findPathBtn = document.querySelector('#findPathBtn');

setEndBtn.addEventListener('click', () => {
    createWallOrPointMode = "end";
});

createWallModeBtn.addEventListener('click', () => {
    createWallOrPointMode = "wall";
});

setStartBtn.addEventListener('click', () => {
    createWallOrPointMode = "start";
});

createMazeBtn.addEventListener('click', () => {
    createMaze(maze, sizeOfMaze, table);
});

findPathBtn.addEventListener('click', () => {
    findPath(start, end, maze, table);
});