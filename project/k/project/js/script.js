import { kMiddle } from './kMiddle.js';
import { height, width } from './app.js';

const pointContainer = document.getElementById('point-container');
const kmeansBtn = document.getElementById('clusterize-button');
const pointsCollection = document.getElementsByClassName('point');

const points = [];
pointContainer.addEventListener('click', function(event) {
  const x = event.clientX - pointContainer.offsetLeft;
  const y = event.clientY - pointContainer.offsetTop;

  const point = document.createElement('div');
  point.classList.add('point');
  
  // Проверяем, что точка не выходит за пределы контейнера
  const maxX = pointContainer.clientWidth - point.clientWidth;
  const maxY = pointContainer.clientHeight - point.clientHeight;
  point.style.left = `${Math.min(maxX, Math.max(0, x))}px`;
  point.style.top = `${Math.min(maxY, Math.max(0, y))}px`;
  
  pointContainer.appendChild(point);

  points.push({ x, y });
});

kmeansBtn.addEventListener('click', function() {
  const k = parseInt(document.getElementById('num-clusters').valueAsNumber);
  const clusterColors = generateClusterColors(k);
  console.log(points);
  const clusters = kMiddle(generateClusters(k, width, height), points);
  for (let index = 0; index < pointsCollection.length;) {
    pointsCollection[index].remove();
  }
  console.log(pointsCollection.length);
  for (const index in clusters) {
    for (const element of clusters[index]) {
      const point = document.createElement('div');
      point.classList.add('point');
      point.style.left = `${element.x}px`;
      point.style.top = `${element.y}px`;
      point.style.backgroundColor = clusterColors[index];
      pointContainer.appendChild(point);
    }
  }

  console.log(clusters);
});

function generateClusters(k, width, height) {
  const clusters = [];

  for (let i = 0; i < k; i++) {
    clusters.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    });
  }

  return clusters;
}

function generateClusterColors(k) {
  const colors = [];
  for (let i = 0; i < k; i++) {
    colors.push(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
  }
  return colors;
}
