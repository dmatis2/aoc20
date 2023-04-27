const fs = require("fs");
fs.readFile("input.txt", "utf8", (err, data) => {
  const lines = data
    .split("\n")
    .map((l) => l.split(" "))
    .map((l) => [...l.slice(0, 2), [...l[2]].sort().join("")]);
  const lines2 = data.split("\n").map((l) => l.split(" "));
  let total = 0;
  lines.forEach((line) => {
    let [low, high] = line[0].split("-");
    const letter = line[1][0];
    low = parseInt(low);
    high = parseInt(high);
    let count = 0;
    line[2].split("").forEach((l) => {
      if (l === letter) count += 1;
    });
    if (count >= low && count <= high) {
      total += 1;
    }
  });
  console.log(`${total}`);
  let total2 = 0;
  lines2.forEach((line) => {
    let [low, high] = line[0].split("-");
    const letter = line[1][0];
    low = parseInt(low);
    high = parseInt(high);
    if (
      (line[2][low - 1] === letter || line[2][high - 1] === letter) &&
      line[2][low - 1] !== line[2][high - 1]
    )
      total2 += 1;
  });
  console.log(`${total2}`);
});
