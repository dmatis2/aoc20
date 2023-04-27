const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  let lines = data
    .split("\n")
    .map((x) => parseInt(x))
    .sort((a, b) => a - b);
  lines = [0, ...lines];
  lines = [...lines, Math.max(...lines) + 3];
  let [one, three] = [0, 0];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] - lines[i - 1] === 1) one++;
    else if (lines[i] - lines[i - 1] === 3) three++;
  }
  console.log(one * three);
  let cache = {};
  const find = (i) => {
    if (i === lines.length - 1) return 1;
    if (i in cache) return cache[i];
    let sum = 0;
    lines.slice(i + 1).forEach((x, j) => {
      if (x - lines[i] <= 3) {
        sum += find(j + i + 1);
      }
    });
    cache[i] = sum;
    return sum;
  };
  console.log(find(0));
});
