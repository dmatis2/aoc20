const fs = require("fs");

if (process.argv.length !== 3) {
  console.log(`Need file`);
  return 1;
}

const dirs = {
  e: [1, -1, 0],
  se: [0, -1, 1],
  sw: [-1, 0, 1],
  w: [-1, 1, 0],
  nw: [0, 1, -1],
  ne: [1, 0, -1],
};

fs.readFile(process.argv[2], "utf8", (err, data) => {
  let map = new Map();
  data.split("\n").forEach((r) => {
    let [x, y, z] = [0, 0, 0];
    while (r.length > 0) {
      const dir = r.match(/^(e|se|sw|w|nw|ne)/)[0];
      [x, y, z] = [x + dirs[dir][0], y + dirs[dir][1], z + dirs[dir][2]];
      r = r.split("").slice(dir.length).join("");
    }
    if (map.has(`${x},${y},${z}`)) {
      map.delete(`${x},${y},${z}`);
      return;
    }
    map.set(`${x},${y},${z}`, "");
  });
  console.log(map.size);

  for (let day = 1; day <= 100; day++) {
    let toEvaluate = new Set();
    let newMap = new Map();
    for (let keyDir of map.keys()) {
      let [x, y, z] = keyDir.split(",").map((x) => parseInt(x));
      toEvaluate.add([x, y, z]);
      for (let keyDir in dirs) {
        toEvaluate.add([
          x + dirs[keyDir][0],
          y + dirs[keyDir][1],
          z + dirs[keyDir][2],
        ]);
      }
    }
    for (let coord of toEvaluate) {
      const [x, y, z] = coord;
      let neighborsCount = 0;
      for (let keyDir in dirs) {
        const newX = x + dirs[keyDir][0];
        const newY = y + dirs[keyDir][1];
        const newZ = z + dirs[keyDir][2];
        if (map.has(`${newX},${newY},${newZ}`)) {
          neighborsCount++;
        }
      }
      if (map.has(`${x},${y},${z}`)) {
        if (neighborsCount > 0 && neighborsCount <= 2)
          newMap.set(`${x},${y},${z}`, "");
      } else {
        if (neighborsCount === 2) newMap.set(`${x},${y},${z}`, "");
      }
    }
    map = newMap;
  }
  console.log(map.size);
});
