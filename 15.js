const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  let nums = data.split(",").map((x) => parseInt(x));
  let map = new Map();
  let last = -1;
  let turn = 1;
  nums.forEach((x) => {
    map.set(x, turn++);
    last = x;
  });
  while (turn <= 30000000) {
    let newNum = -1;
    if (map.has(last)) {
      newNum = turn - 1 - map.get(last);
    } else {
      newNum = 0;
    }
    map.set(last, turn - 1);
    turn++;
    last = newNum;
    if (turn === 2021) console.log(last);
  }
  console.log(last);
});
