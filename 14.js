const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  let lines = data.split("\n");
  let hash = {};
  let mask;
  lines.forEach((l) => {
    if (l.includes("mask")) {
      mask = l.split(" ")[2].padStart(36, "0");
      return;
    }
    let [mem, num] = l
      .replace(/^mem\[(\d+)\] = (\d+)/, (match, p1, p2) => `${p1},${p2}`)
      .split(",");
    let binNum = (num >>> 0).toString(2).padStart(36, "0").split("");
    for (let i = 35; i >= 0; i--) {
      if (mask[i] === "1") {
        binNum[i] = "1";
      } else if (mask[i] === "0") {
        binNum[i] = "0";
      }
    }
    hash[mem] = parseInt(binNum.join(""), 2);
  });
  console.log(Object.values(hash).reduce((a, v) => a + v, 0));

  let map = new Map();
  mask = "".padStart(36, "0");
  lines.forEach((l) => {
    if (l.includes("mask")) {
      mask = l.split(" ")[2].padStart(36, "0");
      return;
    }
    let [mem, num] = l
      .replace(/^mem\[(\d+)\] = (\d+)/, (match, p1, p2) => `${p1},${p2}`)
      .split(",");
    mem = parseInt(mem);
    let allAddresses = [mem.toString(2).padStart(36, "0").split("")];
    for (let idx = 0; idx < 36; idx++) {
      let count = allAddresses.length;
      for (let j = 0; j < count; j++) {
        if (mask[idx] === "0") continue;
        let current = allAddresses.shift();
        if (mask[idx] === "1") {
          current[idx] = "1";
          allAddresses.push([...current]);
        } else if (mask[idx] === "X") {
          current[idx] = "1";
          allAddresses.push([...current]);
          current[idx] = "0";
          allAddresses.push([...current]);
        } else {
          allAddresses.push([...current]);
        }
      }
    }
    for (let j = 0; j < allAddresses.length; j++) {
      let m = parseInt(allAddresses[j].join(""), 2);
      map.set(m, num);
    }
  });
  console.log(Array.from(map.values()).reduce((a, v) => a + parseInt(v), 0));
});
