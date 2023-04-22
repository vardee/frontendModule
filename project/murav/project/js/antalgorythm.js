
function print(way, flag) {
    let temp = way.way.slice(way.way.findIndex(i => i == pointsArr[0]));
    for(let i = 1; i <= way.way.findIndex(i => i == pointsArr[0]); i++) {
        temp.push(way.way[i]);
    }
    let resultDistance = [];
    for (let i=0; i<temp.length; i++){
        resultDistance.push(temp.map(elem => elem.number).join(" "));
    }
    let fullDistance = Math.round(way.dist);
    let arr =[]
    let cells = document.createElement('cells');
    let tbody = document.createElement('tbody');
    cells.appendChild(tbody);
    document.getElementById('print').appendChild(cells);
    document.querySelector('.thead').style.display  = 'point';
        let tr = document.createElement('tr');
        let cellWithResult2 = document.createElement('cellWithResult');
        cellWithResult2.innerHTML = fullDistance;
        if(flag == true) {
            cellWithResult2.innerHTML = fullDistance;
        }
        tr.appendChild(cellWithResult2);
        tbody.appendChild(tr);
  }
  


  function checkingDistance(array, way) {
    for(let i = 0; i < array.length; i++) {
        if(array[i].dist == way.dist) {
            return false;
        }
    }
    return true;
  }

  

  async function drawLine(way) {
    for(let i = 0; i < way.way.length - 1; i++) {   
        let x0 = way.way[i].x;
        let y0 = way.way[i].y;
        let x1 = way.way[i + 1].x;
        let y1 = way.way[i + 1].y;
        // Рисуем линии
        context1.beginPath();
        context1.moveTo(x0, y0); 
        context1.lineTo(x1, y1);
        context1.lineWidth = 3;         // толщина
        context1.strokeStyle = 'green'; // цвет
        context1.fill();
        context1.stroke(); 
    }
  }
  

  
  async function clear(ctx) {
    ctx.clearRect(0, 0, 900, 700);
  }
  

  function check() {
    let way = [];
    let index = 0;
    way.push(pointsArr[index]);
    while(way.length != points.length) {
        let probability = probabilityPoints(way, index);
        let choice = choicePoint(probability);
        index = choice;
        way.push(pointsArr[choice]);
    }
    way.push(way[0]);
    let resultDistance = new Way(way, distance(way));
    return resultDistance;
  }




  //меняем кол-во феромонов
  function changePheromone(ways) {
    let Q = 70; //константа для расстояния
    let p = 0.64; //коэф испарения
    let i = 0;
    //испарение
    while (i < pointsArr.length) {
        for(let j = 0; j < pointsArr[i].pher.length; j++) {
            let tmp = pointsArr[i].pher[j] * p;
            pointsArr[i].pher[j] = tmp;
        }
        i++;
    }
    //добавление на пути где ходили муравьи
    for(let i = 0; i < ways.length; i++) {
        let pheromone = Q / ways[i].dist;
        for(let j = 0; j < ways[i].way.length - 1; j++) {
            let index = ways[i].way[j].number - 1;
            let index1 = ways[i].way[j + 1].number - 1;
            pointsArr[index].pher[index1] += pheromone;
            pointsArr[index1].pher[index] += pheromone;
        }
    }
  }



  
  //выбор вершины 
  function choicePoint(probability) {
    let random = Math.random();
    let check = 0;
    for(let i = 0; i < probability.length; i++) {
        check += probability[i].probability;
        if(check >= random) {
            return probability[i].index -  1;
        }
    }
  }
  


  //подсчет вероятности перейти в след вершину
  function probabilityPoints(way, start) {
    let sumProbability = 0;
    let array = [];
    for(let i = 0; i < points.length; i++) {
        if(way.includes(pointsArr[i]) || i == start) {
            continue;
        }
        let tmp = new Probability(Math.pow(pointsArr[start].dist[i], 2) * Math.pow(pointsArr[start].pher[i], 1), i + 1);
        sumProbability += tmp.probability;
        array.push(tmp);
    }
    for(let i = 0; i < array.length; i++) {
        array[i].probability = array[i].probability / sumProbability;
    }
    return array;
  }
  


  //начальное заполнение массива вершин
  function fillingPoints() {
    let temp1 = [];
    for(let j = 0; j < points.length; j++) {
        let temp = [];
        for (let i = 0; i < points.length; i++) {
        temp[i] = 0.02;
        }
        temp1 = distanceTwo(points[j]);
        let point = new Coordinate(points[j].number, points[j].x, points[j].y, temp, temp1);
        pointsArr.push(point);
    }
  }
  


  //вычисление расстояния от одной точки до всех остальных
  function distanceTwo(point) {
    let distance = [];
    for(let i = 0; i < points.length; i++) {
        xDist = Math.abs(point.x - points[i].x);
        yDist = Math.abs(point.y - points[i].y);
        distance.push(200/(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))));
    }
    return distance;
  }
  //нахождение дистанции
  function distance(way) {
    let resultDistance = 0;
    //расстояние от точки до точки
    for (let i = 0; i < way.length - 1; i++) { 
        let xDist;
        let yDist;
        let Dist;
        xDist = Math.abs(way[i].x - way[i + 1].x);
        yDist = Math.abs(way[i].y - way[i + 1].y);
        Dist = Math.sqrt((Math.pow(xDist, 2)) + (Math.pow(yDist, 2)));
        resultDistance += Dist;
    }
    return resultDistance;
  }

let flagFirst = true;

async function antAlgorithm() {
    if (!flagFirst) {
        let cells = document.querySelector('table')
        cells.remove();
    }
    let antCount = points.length;
    fillingPoints();
    let repeat = 0;
    let minimalLengthOfWay;
    while(repeat <= antCount * antCount) {
        let ways = []; //хранение путей с расстоянием
        for(let i = 0; i < antCount; i++) {
            let way = [];
            let index = i;
            way.push(pointsArr[index])
            while(way.length != points.length) {
                let probability = probabilityPoints(way, index);
                let choice = choicePoint(probability);
                index = choice;
                way.push(pointsArr[choice]);
            }
            way.push(way[0]);
            let temp = new Way(way, distance(way));
            if(minimalLengthOfWay == undefined || temp.dist < minimalLengthOfWay.dist) {
                if(minimalLengthOfWay != undefined){
                    let cells = document.querySelector('cells');
                    document.querySelector('.thead').style.display  = 'none';
                    cells.parentNode.removeChild(cells);
                }
                minimalLengthOfWay = temp;
                print(minimalLengthOfWay, false);
                await new Promise((resolve, reject) => setTimeout(resolve, 200));
                clear(context1);
                drawLine(minimalLengthOfWay);
                drawPoints();
            }
            ways.push(temp);
        }
        changePheromone(ways);
        ways = [];
        repeat+=1;
        drawLine(minimalLengthOfWay);
        drawPoints();
    }
    let cells = document.querySelector('cells');
    document.querySelector('.thead').style.display  = 'none';
    cells.parentNode.removeChild(cells);
    print(minimalLengthOfWay, true);
    flagFirst = false;
  }