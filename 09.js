const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  let invalid = 0;
  lines.slice(25).every((n, i) => {
    const res = lines.slice(i, i + 25).some((m, j) => {
      const arr = lines
        .slice(i, i + 25)
        .filter((x, k) => k !== j)
        .map((x) => parseInt(x))
        .sort();
      if (arr.includes(parseInt(n) - parseInt(m))) return true;
      return false;
    });
    if (!res) {
      console.log(n);
      invalid = i + 25;
    }
    return res;
  });
  let arr = [...lines].map((x) => parseInt(x));
  let i = 0;
  while (i < invalid) {
    let sum = arr[i];
    let j = i;
    while (sum < arr[invalid]) {
      sum += arr[++j];
    }
    if (sum === arr[invalid]) {
      const final = arr.slice(i, j + 1);
      console.log(Math.min(...final) + Math.max(...final));
      break;
    }
    i++;
  }
});
