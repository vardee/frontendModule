function getDistace(x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
  export const kMiddle = (klasters, points) => {
    let groups  = Array(klasters.length).fill(Array(0));
    let minElement = 0,
      oldDistance = 160000;
    while (true) {
      let newGroups = Array(klasters.length).fill(Array(0));
      console.log(points)
      points.forEach((element, index) => {
        (minElement = 0), (oldDistance = 160000);
        klasters.forEach((element2, index2) => {
          if (
            getDistace(element.x, element2.x, element.y, element2.y) < oldDistance
          ) {
            minElement = index2;
            oldDistance = getDistace(
              element.x,
              element2.x,
              element.y,
              element2.y
            );
          }
        });
        newGroups[minElement] = [
          ...newGroups[minElement],
          { x: element.x, y: element.y },
        ];
      });
      if (JSON.stringify(groups) == JSON.stringify(newGroups)) break;
      groups = newGroups.slice(0);
      klasters = klasters.map((element, index) => {
        element.x = 0;
        element.y = 0;
        newGroups[index].forEach((element2) => {
          element.x += element2.x;
          element.y += element2.y;
        });
        return {
          x: element.x / newGroups[index].length,
          y: element.y / newGroups[index].length,
        };
      });
    }
    return groups;
  };