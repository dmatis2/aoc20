const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  const first = data
    .replace(/F|L/g, "0")
    .replace(/B|R/g, "1")
    .split("\n")
    .map((l) => parseInt(l.slice(0, 7), 2) * 8 + parseInt(l.slice(7), 2));
  console.log(Math.max(...first));

  let arr = [...new Array(Math.max(...first))]
    .map((_, i) => i + 1)
    .filter((x) => !first.includes(x));
  console.log(
    arr.filter((x) => !arr.includes(x - 1) && !arr.includes(x + 1))[0]
  );
});
