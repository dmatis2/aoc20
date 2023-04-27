const fs = require("fs");

if (process.argv.length !== 3) {
  console.log(`Need file`);
  return 1;
}

class Node {
  constructor(data, prev = null) {
    this.data = data;
    this.prev = prev;
    this.next = null;
  }
}
let map = new Map();

fs.readFile(process.argv[2], "utf8", (err, data) => {
  let cups = data.split("").map((x) => parseInt(x));
  const start = new Node(cups[0]);
  map.set(cups[0], start);
  let tmp = start.next;
  let prevTmp = start;
  let totalCount = 1;
  cups.slice(1).forEach((c) => {
    tmp = new Node(c, prevTmp);
    tmp.prev = prevTmp;
    prevTmp.next = tmp;
    if (!map.has(c)) map.set(c, tmp);
    tmp = tmp.next;
    prevTmp = prevTmp.next;
    ++totalCount;
  });
  let nextVal = Math.max(...cups) + 1;
  for (let i = totalCount + 1; totalCount !== 1000000; i++) {
    tmp = new Node(nextVal++, prevTmp);
    tmp.prev = prevTmp;
    prevTmp.next = tmp;
    if (!map.has(nextVal - 1)) map.set(nextVal - 1, tmp);
    tmp = tmp.next;
    prevTmp = prevTmp.next;
    ++totalCount;
  }
  prevTmp.next = start;
  start.prev = prevTmp;

  currentCup = cups[0];
  for (let move = 0; move < 100; move++) {
    let picked = cups.slice(1, 4);
    cups = cups.filter((x) => !picked.includes(x));
    let destination = currentCup - 1;
    while (!cups.includes(destination)) {
      destination =
        destination <= Math.min(...cups) ? Math.max(...cups) : destination - 1;
    }
    cups = [
      ...cups.slice(0, cups.indexOf(destination) + 1),
      ...picked,
      ...cups.slice(cups.indexOf(destination) + 1),
    ];
    currentCup = cups[(cups.indexOf(currentCup) + 1) % cups.length];
    const first = cups.shift();
    cups.push(first);
  }
  const fix = 10 % cups.length;
  while (cups[0] !== 1) {
    const first = cups.shift();
    cups.push(first);
  }
  console.log(cups.slice(1).join(""));

  let HEAD = start;
  currentCup = HEAD.data;
  for (let move = 0; move < 10000000; move++) {
    let picked = [
      HEAD.next.data,
      HEAD.next.next.data,
      HEAD.next.next.next.data,
    ];
    HEAD.next.next.next.next.prev = HEAD;
    HEAD.next = HEAD.next.next.next.next;
    let destination = currentCup === 1 ? 1000000 : currentCup - 1;
    while (picked.includes(destination)) {
      destination = destination <= 1 ? 1000000 : destination - 1;
    }
    let x = map.get(destination);
    let next = x.next;
    let part2tmp = null;
    let part2Prevtmp = x;
    picked.forEach((c) => {
      part2tmp = new Node(c, part2Prevtmp);
      map.set(c, part2tmp);
      part2tmp.prev = part2Prevtmp;
      part2Prevtmp.next = part2tmp;
      part2tmp = part2tmp.next;
      part2Prevtmp = part2Prevtmp.next;
    });
    part2Prevtmp.next = next;
    HEAD = HEAD.next;
    currentCup = HEAD.data;
  }
  let q = map.get(1);
  console.log(q.next.data * q.next.next.data);
});
