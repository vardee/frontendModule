window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.beginPath();
    context.rect(0, 0, 900, 700);
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fill();
}

let circles = [];
let id=0;
let flagFirst = true;

class Circle {
    constructor(x , y, radius, color) {
        this.id=id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
}

canvas.onmousedown = function(event){
    let x = event.offsetX || 0;
    let y = event.offsetY || 0;
    id= ++id;
    let circle = new Circle(x, y, 20, "");
    circles.push(circle);
    console.log(circles);
    drawCircles();
    circles.forEach(function(item) {
        drawCircleText(item);
    })
}

function drawCircles() {
    for(let i=0; i<circles.length; i++) {
        let circle = circles[i];
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.fill();
        context.stroke();
    }
}
function drawCircleText(item) {
    console.log(item);
        context.beginPath();
        context.textAlign = "center"
        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.font = "26px Courier New bald";
        context.fillText(item.id, item.x,  item.y+(item.radius/2));
        context.fill();
        context.stroke();
}

class Way {
    constructor(way, dist) {
        this.way = way;
        this.dist = dist;
    }
}

function erase() {
    flagFirst = true;
    clear(context);
    points = [];
    circles = [];
    id = 0;
    let table = document.querySelector('table');
    document.querySelector('.thead').style.display  = 'none';
    table.parentNode.removeChild(table);
}

async function geneticAlgorithm(){
    if (!flagFirst) {
        let table = document.querySelector('table')
        table.remove();
    }
    let generations = []; //массив где будут храниться все наши поколения
    let countElement = circles.length; //генерация кол-ва предков
     //генерация первого поколения 
     let i = 0;
     while(i < countElement) {
        let tempWay = firstGeneration();
        let temp = new Way(tempWay, distance(tempWay));
        if(!generations.includes(temp)){
            generations.push(temp);
            i++;
        }
    }
    let outputFitness = [];
    let outputId = [];

    if(circles.length <= 3) {
        outputId.push(generations[0].way);
        outputFitness.push(generations[0].dist);
    }
    let countRepeat = 0;
    let preMinWay;

    while(countRepeat <= circles.length * circles.length * circles.length) {
        crossover(generations);
        let minWay = new Way(generations[outputMinIndex(generations, 0)].way, generations[outputMinIndex(generations, 0)].dist);
        if(preMinWay == undefined || preMinWay.dist > minWay.dist) {
            outputId.push(minWay.way);
            outputFitness.push(minWay.dist);
            if(preMinWay != undefined){
                let table = document.querySelector('table');
                document.querySelector('.thead').style.display  = 'none';
                table.parentNode.removeChild(table);
            }
            preMinWay = minWay;
            output(minWay, false);
            await new Promise((resolve, reject) => setTimeout(resolve, 200));
            clear(context);
            drawLine(outputId[outputId.length - 1]);
            console.log(circles);
            drawCircles();
            circles.forEach(function(item) {
                drawCircleText(item);
            })
            countRepeat = 0;
        }
        else{
            countRepeat+=1;
        }
    } 
    let table = document.querySelector('table');
    document.querySelector('.thead').style.display  = 'none';
    table.parentNode.removeChild(table);
    output(preMinWay, true);
    flagFirst = false;
}
function output(way, flag) {
    let result = [];
    for (let i=0; i<way.way.length; i++){
        result.push(way.way.map(elem => elem.id).join(" "));
    }
    let floorFitness = Math.round(way.dist);
    let arr =[]

     let table = document.createElement('table');
     let tbody = document.createElement('tbody');
     table.appendChild(tbody);
     document.getElementById('output').appendChild(table);
     document.querySelector('.thead').style.display  = 'block';
     let tr = document.createElement('tr');
     let td = document.createElement('td');
     td.innerHTML = floorFitness;
     tr.appendChild(td);
     tbody.appendChild(tr);
}

async function drawLine(way) {
    for(let i = 0; i < way.length - 1; i++) {   
        let x0 = way[i].x;
        let y0 = way[i].y;
        let x1 = way[i + 1].x;
        let y1 = way[i + 1].y;
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineWidth = 3;
        context.strokeStyle = 'black';
        context.stroke();
    }
}

async function clear(ctx) {
    ctx.clearRect(0, 0, 650, 650);
}

//генерация первого поколения
function firstGeneration () {
    let editChromosome = [];
    editChromosome = circles.slice();
    editChromosome.shift();
    shuffle(editChromosome);
    editChromosome.push(circles[0]);
    editChromosome.unshift(circles[0]);
    return editChromosome;
}

//скрещивание
function crossover(generations) {
    //рандомный выбор родителей
    let ancestor1 = generations[getRandomInt(0, generations.length - 1)].way;
    let ancestor2 = generations[getRandomInt(0, generations.length - 1)].way;
    while(ancestor1 == ancestor2) {
        ancestor2 = generations[getRandomInt(0, generations.length - 1)].way;
    }
    //заполняем геном
    let child1 = fillingGenes(ancestor1, ancestor2); 
    let child2 = fillingGenes(ancestor2, ancestor1);
    while(child1 == child2) {
        child2 = fillingGenes(ancestor2, ancestor1);
    }
    //вычисляем длины путей
    //добавляем потомков в наше поколение, добавляем длины путей(фитнесс)
    let temp1 = new Way(child1, distance(child1));
    let temp2 = new Way(child2, distance(child2));
    generations.push(temp1);
    generations.push(temp2);
    //находим 2 наихудшие хромомсомы
    let indexMax = outputMinIndex(generations, generations.length - 1);
    let indexPreMax = outputMinIndex(generations, generations.length - 2);
    if(indexMax == indexPreMax) {
        let copy = [];
        for(let i = 0; i < generations.length; i++) {
            copy.push(generations[i].dist);
        }
        copy.sort(function(a, b) {
            return a - b;
        });
        for(let i = 0; i < generations.length; i++) {
            if(generations[i].dist == copy[generations.length - 2] && i != indexMax) {
                indexPreMax = i;
                break;
            }
        }
    }
    //удаляем их из поколения и фитнессов
    generations.splice(Math.max(indexMax, indexPreMax), 1);
    generations.splice(Math.min(indexPreMax, indexMax), 1);
}

//заполняем геном
function fillingGenes(ancestor1, ancestor2) {
    //выбирая точку разрыва заполняем первый сектор генами родителей
    let averageGenes = getRandomInt(1, ancestor1.length - 2);
    let child = ancestor1.slice(0, averageGenes + 1);
    let i = averageGenes;
    //заполняем гены потомков генами противополжных родителей после точки разрыва
    while(i < ancestor2.length) {
        if(!child.includes(ancestor2[i])){
            child.push(ancestor2[i]);
        }
        i++;
    }
    //если хромомсома потомка заполнена не до конца, заполняем генами начального родителя после точки разрыва
    i = averageGenes; 
    if(child.length != ancestor1.length - 1) {
        while(i < ancestor1.length) {
            if(!child.includes(ancestor1[i])){
            child.push(ancestor1[i]);
            }
            i++;
        }
    }
    //вставляем конец(из начала)
    child.push(child[0]);
    child = mutation(child);
    return child;
}

//мутация
function mutation(child) {
    //генерируем число для процента мутаций
    let mutationPercentage1 = 40;
    let mutationPercentage2 = 50;
    let number = getRandomInt(0, 100);
    
    let index1 = getRandomInt(1, child.length - 2);
    let index2 = getRandomInt(1, child.length - 2);
    while (index1 == index2) {
        index2 = getRandomInt(1, child.length - 2);
    }
    //выполянем ее сменой двух любых генов
    if(number < mutationPercentage1) {
        child = swap(child, index1, index2);
    }
    //генерируем начало и конец реверса
    index1 = getRandomInt(1, child.length - 2);
    index2 = getRandomInt(1, child.length - 2);
    while (index1 == index2) {
        index2 = getRandomInt(1, child.length - 2);
    }
    if(index2 < index1) {
        let t = index2;
        index2 = index1;
        index1 = t;
    }
    //делаем реверс куска
    if(number < mutationPercentage2) {
        let j = index2;
        let copy = child.slice();
        for(let i = index1; i < (index1 + index2) / 2; i++) {
            child[i] = copy[j];
            child[j--] = copy[i];
        }
    }
    return child;
}

function distance(chromosome) { //расстояние от точки до точки
    let resultDistance = 0;
    for (let i = 0; i < chromosome.length - 1; i++) { 
        let xDist, yDist, Dist;
        xDist = Math.abs(chromosome[i].x - chromosome[i + 1].x);
        yDist = Math.abs(chromosome[i].y - chromosome[i + 1].y);
        Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
        resultDistance += Dist;
    }
    return resultDistance;
}

function shuffle(array) { //перемешивание массива
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    return array;
}

function outputMinIndex(array, index) { //мндекс минимального пути
    let tmp = [];
    for(let i = 0; i < array.length; i++) {
        tmp.push(array[i].dist);
    }
    tmp.sort(function(a, b) {
        return a - b;
    });
    for(let i = 0; i < array.length; i++) {
        if(array[i].dist == tmp[index]) {
            minIndex = i;
            break;
        }
    }
    return minIndex;
}