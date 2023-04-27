const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  const [rows, cols] = [lines.length, lines[0].length];
  let dir = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1],
  ];
  console.log(
    dir.reduce((acc, arr) => {
      let [count, row, col] = [0, 0, 0];
      while (row < rows) {
        if (lines[row][col] === "#") count++;
        row += arr[0];
        col = (col + arr[1]) % cols;
      }
      if (arr[0] === 1 && arr[1] === 3) console.log(count);
      return acc * count;
    }, 1)
  );
});
