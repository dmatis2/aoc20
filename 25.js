const fs = require("fs");

if (process.argv.length !== 3) {
  console.log(`Need file`);
  return 1;
}

const getLoopSize = (publicKey) => {
  let size = 1;
  let total = 7;
  while (total !== publicKey) {
    total *= 7;
    total %= 20201227;
    size++;
  }
  return size;
};

const transform = (publicKey, loop) => {
  let out = publicKey;
  for (let i = 1; i < loop; i++) {
    out *= publicKey;
    out %= 20201227;
  }
  return out;
};

fs.readFile(process.argv[2], "utf8", (err, data) => {
  const [card, door] = data.split("\n").map((x) => parseInt(x));
  const cLS = getLoopSize(card);
  console.log(transform(door, cLS));
});
