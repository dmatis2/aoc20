const fs = require("fs");

const adjacentSeatsCount = (row, col, input) => {
  const [rows, cols] = [input.length, input[row].length];
  let count = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      if (row + i < 0 || row + i >= rows) continue;
      if (col + j < 0 || col + j >= cols) continue;
      if (input[row + i][col + j] === "#") count++;
    }
  }
  return count;
};

const firstSeatsCount = (row, col, input) => {
  const [rows, cols] = [input.length, input[row].length];
  let count = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      let [x1, y1] = [i, j];
      while (
        row + x1 >= 0 &&
        row + x1 < rows &&
        col + y1 >= 0 &&
        col + y1 < cols
      ) {
        if (input[row + x1][col + y1] === "#") {
          count++;
          break;
        } else if (input[row + x1][col + y1] === "L") {
          break;
        }
        x1 += i;
        y1 += j;
      }
    }
  }
  return count;
};

const changeState = (old) => {
  let view = JSON.parse(JSON.stringify(old));
  let tmp = JSON.parse(JSON.stringify(view));
  for (let i = 0; i < tmp.length; i++) {
    for (let j = 0; j < tmp[i].length; j++) {
      if (view[i][j] === ".") continue;
      let occ = adjacentSeatsCount(i, j, tmp);
      if (tmp[i][j] === "L" && occ === 0) {
        let q = Array.from(view[i]);
        view[i] = [...q.slice(0, j), "#", ...q.slice(j + 1)].join("");
      } else if (tmp[i][j] === "#" && occ >= 4) {
        let q = Array.from(view[i]);
        view[i] = [...q.slice(0, j), "L", ...q.slice(j + 1)].join("");
      }
    }
  }
  return view;
};

const changeStatePart2 = (old) => {
  let view = JSON.parse(JSON.stringify(old));
  let tmp = JSON.parse(JSON.stringify(view));
  for (let i = 0; i < tmp.length; i++) {
    for (let j = 0; j < tmp[i].length; j++) {
      if (view[i][j] === ".") continue;
      let occ = firstSeatsCount(i, j, tmp);
      if (tmp[i][j] === "L" && occ === 0) {
        let q = Array.from(view[i]);
        view[i] = [...q.slice(0, j), "#", ...q.slice(j + 1)].join("");
      } else if (tmp[i][j] === "#" && occ >= 5) {
        let q = Array.from(view[i]);
        view[i] = [...q.slice(0, j), "L", ...q.slice(j + 1)].join("");
      }
    }
  }
  return view;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let rows = data.split("\n");
  let oldView = [...rows];
  let newView = changeState(oldView);
  while (newView.join() !== oldView.join()) {
    oldView = [...newView];
    newView = changeState(oldView);
  }
  console.log(
    newView.reduce(
      (acc, row) => acc + row.split("").filter((x) => x === "#").length,
      0
    )
  );

  oldView = [...rows];
  newView = changeStatePart2(oldView);
  while (newView.join() !== oldView.join()) {
    oldView = [...newView];
    newView = changeStatePart2(oldView);
  }
  console.log(
    newView.reduce(
      (acc, row) => acc + row.split("").filter((x) => x === "#").length,
      0
    )
  );
});
