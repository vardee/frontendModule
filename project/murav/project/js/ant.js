let points = [];
let number = 0;
let lines = [];

class Point {
  constructor(x , y, radius, color) {
      this.number=number;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.isSelected = false;
  }
}

canvas1.onmousedown = function(event){
  let x = event.offsetX || 0;
  let y = event.offsetY || 0;
  number= ++number;
  // Создаем новый круг
  let point = new Point(x, y, 15, "");
  // Сохраняем его в массиве
  points.push(point);
  console.log(points);
  drawLines();
  drawPoints();
}

function drawPoints() {
  // Перебираем все круги
  for(let i=0; i<points.length; i++) {
      let point = points[i];
      // Рисуем текущий круг
      context1.beginPath();
      context1.arc(point.x, point.y, point.radius, 0, Math.PI*2);
      context1.fillStyle = "grey";
      context1.fill();
      context1.stroke(); 
  }
}

function drawLines() {
  clearLines();
  // Перебираем все пары кругов
  for(let i=0; i<points.length-1; i++) {
      let point1 = points[i];
      for(let j=i+1; j<points.length; j++) {
          let point2 = points[j];
          // Рисуем линию между кругами
          context1.beginPath();
          context1.moveTo(point1.x, point1.y);
          context1.lineTo(point2.x, point2.y);
          context1.strokeStyle = "black";
          context1.lineWidth = "1";
          context1.stroke();
          // Сохраняем линию в массиве
      }
  }
}

function clearing() {
  flagFirst = true;
  clear(context1);
  pointsArr = [];
  points = [];
  number = 0;
  let cells = document.querySelector('cells');
  document.querySelector('.thead').style.display  = 'none';
  cells.parentNode.removeChild(cells);
}
function clearLines() {
  // Очищаем все линии
  for(let i=0; i<lines.length; i++) {
      let line = lines[i];
      context1.beginPath();
      context1.moveTo(line.start.x, line.start.y);
      context1.lineTo(line.end.x, line.end.y);
      context1.strokeStyle = "rgb(0, 0, 0)";
      context1.stroke();
  }
  lines = [];
}

class Coordinate {
  constructor(number, x, y, pher, dist) {
      this.number = number;
      this.x = x;
      this.y = y;
      this.pher = pher;
      this.dist = dist;
  }
} 

class Way {
  constructor(way, dist) {
      this.way = way;
      this.dist = dist;
  }
}

class Probability {
  constructor(probability, index) {
      this.probability = probability;
      this.index = index;
  }
}

let pointsArr = [];
window.onload = function() {
  // Определение контекста рисования
  canvas1 = document.getElementById("canvas1");
  context1 = canvas1.getContext("2d"); 
  context1.beginPath();
  context1.rect(0, 0, 900, 700);
  context1.fillStyle = "rgba(0, 0, 0, 0)";
  context1.fill();
}