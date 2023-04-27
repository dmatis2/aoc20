const fs = require("fs");

let game = 0;
const recursive = (p1, p2, game = 1) => {
  let round = 0;
  let seen = [];
  while (p1.length !== 0 && p2.length !== 0) {
    ++round;
    const strP1 = JSON.stringify(p1);
    const strP2 = JSON.stringify(p2);
    if (seen.includes(`${strP1},${strP2}`)) {
      if (game === 1) {
        return p1.reverse().reduce((a, v, i) => a + v * (i + 1), 0);
      }
      return -1;
    }
    seen.push(`${strP1},${strP2}`);
    const a = p1.shift();
    const b = p2.shift();
    let winner = 0;
    if (a <= p1.length && b <= p2.length) {
      winner = recursive([...p1.slice(0, a)], [...p2.slice(0, b)], game + 1);
    } else {
      winner = a > b ? -1 : 1;
    }
    if (winner !== 0) {
      if (winner === -1) p1.push(...[a, b]);
      else p2.push(...[b, a]);
    } else {
      if (a < b) p2.push(...[b, a]);
      else p1.push(...[a, b]);
    }
    prevP1 = a;
    prevP2 = b;
  }
  if (game === 1) {
    return p1.length === 0
      ? p2.reverse().reduce((a, v, i) => a + v * (i + 1), 0)
      : p1.reverse().reduce((a, v, i) => a + v * (i + 1), 0);
  }
  return p1.length > p2.length ? -1 : 1;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let [p1, p2] = data.split("\n\n");
  p1 = p1
    .split("\n")
    .slice(1)
    .map((x) => parseInt(x));
  p2 = p2
    .split("\n")
    .slice(1)
    .map((x) => parseInt(x));
  let [recurP1, recurP2] = [[...p1], [...p2]];
  while (p1.length !== 0 && p2.length !== 0) {
    const [a, b] = [p1.shift(), p2.shift()];
    if (a < b) p2.push(...[b, a]);
    else p1.push(...[a, b]);
    game++;
  }
  console.log(
    p1.length === 0
      ? p2.reverse().reduce((a, v, i) => a + v * (i + 1), 0)
      : p1.reverse().reduce((a, v, i) => a + v * (i + 1), 0)
  );

  console.log(recursive(recurP1, recurP2));
});
  