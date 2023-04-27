const fs = require("fs");

const lcm = (a, b) => {
  if ([a, b].includes(0)) return 0;
  return Math.abs((a * b) / gcd(a, b));
};

const gcd = (a, b) => {
  if (!b) return Math.abs(a);
  return gcd(b, a % b);
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let lines = data.split("\n");
  const min = parseInt(lines[0]);
  let res = min;
  let out = 0;
  lines[1]
    .split(",")
    .filter((x) => x !== "x")
    .map((x) => parseInt(x))
    .forEach((time) => {
      if (Math.ceil(min / time) * time - min < res) {
        out = time;
        res = Math.ceil(min / time) * time - min;
      }
    });
  console.log(out * res);

  const busIds = lines[1].split(",").map((busId) => {
    return busId !== "x" ? parseInt(busId) : 1;
  });

  let step = busIds[0];
  let timestamp = 0;

  busIds.forEach((busId, i) => {
    if (busId === 1 || busId === step) return;

    while ((timestamp + i) % busId !== 0) {
      timestamp += step;
    }

    step = lcm(step, busId);
  });

  console.log(timestamp);
});
