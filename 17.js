const fs = require("fs");

const gridSize = 20;

const isIndexValid = (idx) => idx >= 0 && idx < gridSize;

const getNeigh = (z, y, x, matrix) => {
  let activeNeigh = [];
  for (let a = z - 1; a < z + 2; a++) {
    for (let b = y - 1; b < y + 2; b++) {
      for (let c = x - 1; c < x + 2; c++) {
        if (isIndexValid(a) && isIndexValid(b) && isIndexValid(c)) {
          if (a === z && b === y && c === x) continue;
          if (matrix[a][b][c] === "#")
            activeNeigh = [...activeNeigh, matrix[a][b][c]];
        }
      }
    }
  }
  return activeNeigh;
};

const getNeigh4D = (z, y, x, w, set) => {
  let activeNeigh = 0;
  for (let a = z - 1; a < z + 2; a++) {
    for (let b = y - 1; b < y + 2; b++) {
      for (let c = x - 1; c < x + 2; c++) {
        for (let d = w - 1; d < w + 2; d++) {
          if (a === z && b === y && c === x && d === w) continue;
          if (set.has(`${a},${b},${c},${d}`)) {
            activeNeigh++;
          }
        }
      }
    }
  }
  return activeNeigh;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let grid = data.split("\n");
  const gridMid = Math.floor(gridSize / 2);
  let matrix = [...new Array(gridSize)].map((_) =>
    [...new Array(gridSize)].map((_) =>
      [...new Array(gridSize)].map((_) => ".")
    )
  );
  let [x, y, z] = [gridMid, gridMid, gridMid];
  const mid = Math.floor(grid[0].length / 2);
  x -= mid;
  y -= mid;
  for (let a = 0; a < grid[0].length; a++) {
    for (let b = 0; b < grid[0].length; b++) {
      matrix[z][y + a][x + b] = grid[a][b];
    }
  }

  let tmpMatrix = JSON.parse(JSON.stringify(matrix));
  for (let turn = 1; turn <= 6; turn++) {
    for (let a = 0; a < gridSize; a++) {
      for (let b = 0; b < gridSize; b++) {
        for (let c = 0; c < gridSize; c++) {
          const activeNeigh = getNeigh(a, b, c, matrix).filter(
            (x) => x === "#"
          ).length;
          if (matrix[a][b][c] === "#") {
            if (activeNeigh !== 2 && activeNeigh !== 3) {
              tmpMatrix[a][b][c] = ".";
            }
          } else {
            if (activeNeigh === 3) {
              tmpMatrix[a][b][c] = "#";
            }
          }
        }
      }
    }
    matrix = JSON.parse(JSON.stringify(tmpMatrix));
  }

  console.log(JSON.stringify(matrix).match(/#/g).length);

  //   part 2
  let matrixSet = new Set();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === "#") {
        matrixSet.add(`0,0,${i},${j}`);
      }
    }
  }

  for (let turn = 0; turn < 6; turn++) {
    let tmpSet = new Set();
    for (let z = -8; z < 8; z++) {
      for (let y = -8; y < 8; y++) {
        for (let x = -15; x < 15; x++) {
          for (let w = -15; w < 15; w++) {
            const neigh = getNeigh4D(z, y, x, w, matrixSet);
            if (matrixSet.has(`${z},${y},${x},${w}`)) {
              if (neigh === 2 || neigh === 3) {
                tmpSet.add(`${z},${y},${x},${w}`);
              }
            } else {
              if (neigh === 3) {
                tmpSet.add(`${z},${y},${x},${w}`);
              }
            }
          }
        }
      }
    }
    matrixSet = new Set([...tmpSet]);
  }
  console.log(matrixSet.size);
});
