const fs = require("fs");

if (process.argv.length !== 3) {
  console.log(`Need file`);
  return 1;
}

let tiles = [];

const removeBorder = (image) => {
  return image.slice(1, image.length - 1).map((c) =>
    c
      .split("")
      .slice(1, c.length - 1)
      .join("")
  );
};

const rotateRight = (tile) => {
  let { full } = tile;
  let newFull = [...new Array(10)].map((_) =>
    [...new Array(10)].map((_) => ".")
  );
  for (let col = 0; col < 10; col++) {
    for (let row = 9; row >= 0; row--) {
      newFull[col][9 - row] = full[row][col];
    }
    newFull[col] = newFull[col].join("");
  }
  const up = newFull[0];
  const right = newFull.map((x) => x[9]).join("");
  const down = newFull[9];
  const left = newFull.map((x) => x[0]).join("");
  return { ...tile, up, down, left, right, full: newFull };
};

const flipHorizontally = (tile) => {
  let { full } = tile;
  let newFull = [...full.map((x) => x.split("").reverse().join(""))];
  const up = newFull[0];
  const right = newFull.map((x) => x[9]).join("");
  const down = newFull[9];
  const left = newFull.map((x) => x[0]).join("");
  return { ...tile, up, down, left, right, full: newFull };
};

const flipVertically = (tile) => {
  let newTile = flipHorizontally(rotateRight(rotateRight(tile)));
  return newTile;
};

const revStr = (str) => str.split("").reverse().join("");

const match = (tile1, tile2) => {
  for (let i = 0; i < tile1.borders.length; i++) {
    const border = tile1.borders[i];
    if (tile2.borders.includes(border)) {
      return border;
    }
  }
  return null;
};

fs.readFile(process.argv[2], "utf8", (err, data) => {
  const t = data.split("\n\n");
  t.forEach((tile) => {
    let lines = tile.split("\n");
    let id = lines.shift().match(/\d+/)[0];
    let full = [...lines];
    const up = lines[0];
    const right = lines.map((x) => x[9]).join("");
    const down = lines[9];
    const left = lines.map((x) => x[0]).join("");

    let borders = [
      up,
      revStr(up),
      down,
      revStr(down),
      right,
      revStr(right),
      left,
      revStr(left),
    ];

    tiles.push({
      id: parseInt(id),
      up,
      down,
      left,
      right,
      borders,
      full,
      matched: [],
    });
  });

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    for (let j = i + 1; j < tiles.length; j++) {
      const nextTile = tiles[j];
      const matched = match(tile, nextTile);
      if (matched) {
        tile.matched.push({ tile: nextTile.id, matched });
        nextTile.matched.push({ tile: tile.id, matched });
      }
    }
  }
  const part1 = tiles
    .filter((x) => x.matched.length === 2)
    .reduce((a, x) => a * x.id, 1);
  console.log(part1);

  // * part2
  let tilesSorted = tiles.sort((a, b) => a.matched.length - b.matched.length);
  let allTiles = [...tilesSorted];
  let finalImage = new Map();
  let directions = new Map();
  let queue = [tilesSorted[0]];
  finalImage.set(tilesSorted[0].id, `0,0`);

  let move = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  let opposites = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  while (queue.length !== 0) {
    const tile = queue.shift();
    tilesSorted = tilesSorted.filter((x) => x.id !== tile.id);
    let [x, y] = [0, 0];
    if (finalImage.has(tile.id)) {
      [x, y] = finalImage
        .get(tile.id)
        .split(",")
        .map((x) => parseInt(x));
    }
    for (let dir of ["up", "down", "left", "right"]) {
      let nextTile = tile.matched.find(
        (z) =>
          z.matched === tile[dir] ||
          z.matched.split("").reverse().join("") === tile[dir]
      );

      if (nextTile && !finalImage.has(nextTile.id)) {
        nextTile = tilesSorted.find((x) => x.id === nextTile.tile);
        if (nextTile && !queue.map((x) => x.id).includes(nextTile.id)) {
          console.log(`Testing ${nextTile[opposites[dir]]}`);
          let matches = false;
          for (let i = 0; i < 4; i++) {
            console.log(`${nextTile[opposites[dir]]}`);
            if (nextTile[opposites[dir]] === tile[dir]) {
              console.log(`matched`);
              matches = true;
              break;
            }
            nextTile = rotateRight(nextTile);
          }
          if (!matches) {
            nextTile = flipHorizontally(nextTile);
            for (let i = 0; i < 4; i++) {
              if (nextTile[opposites[dir]] === tile[dir]) {
                matches = true;
                break;
              }
              nextTile = rotateRight(nextTile);
            }
          }
          if (!matches) {
            nextTile = flipVertically(nextTile);
            for (let i = 0; i < 4; i++) {
              if (nextTile[opposites[dir]] === tile[dir]) {
                matches = true;
                break;
              }
              nextTile = rotateRight(nextTile);
            }
          }
          if (matches) {
            const [newX, newY] = move[dir];
            finalImage.set(nextTile.id, `${x + newX},${y + newY}`);
            queue.push(nextTile);
            tilesSorted = tilesSorted.filter((t) => t.id !== tile.id);
          }
        }
      }
    }
    if (queue.length === 0 && tilesSorted.length !== 0) {
      queue = [...tilesSorted];
    }
  }
  let values = Array.from(finalImage.values())
    .map((x) => x.split(","))
    .map((x) => x.map((y) => parseInt(y)));
  values = values.sort((a, b) => a[0] - b[0]);
  const [minX, maxX] = [values[0][0], values[values.length - 1][0]];
  values = values.sort((a, b) => a[1] - b[1]);
  const [minY, maxY] = [values[0][1], values[values.length - 1][1]];
  const rangeX =
    Math.sign(maxX) === Math.sign(minX)
      ? Math.abs(maxX) - Math.abs(minX)
      : Math.abs(minX) + maxX + 1;
  const rangeY =
    Math.sign(maxY) === Math.sign(minY)
      ? Math.abs(maxY) - Math.abs(minY)
      : Math.abs(minY) + maxY + 1;
  let final = [...new Array(rangeY)].map((_) =>
    [...new Array(rangeX)].map((_) => 0)
  );
  for (let key of finalImage.keys()) {
    const [x, y] = finalImage
      .get(key)
      .split(",")
      .map((x) => parseInt(x));
    const t = allTiles.find((t) => t.id === key);
    if (t) {
      final[y - minY][x - minX] = t.id;
    }
  }

  // ! this need to be done
  console.log(final);
  // final = final.map((r) =>
  //   r.map((c) => allTiles.find((x) => x.id === c).full).map(c => removeBorder(c))
  // );

  // let img = []
  // for(let row=0;row<final.length;row++) {
  //   let tmp = []
  //   for(let row2=0;row2<8;row2++) {
  //     tmp.push(final[row].reduce((a,v) => {
  //       console.log(v[row2]);
  //       return a + v[row2]
  //     }, ""))
  //   }
  //   img.push(tmp);
  // }
  // console.table(img[0]);
  // ! untilx here

  // let result = []
  // for(let r=0; r < final.length; r++) {
  //   let str = ""
  //   for(let r2=0;r2<8;r2++) {
  //     for(let c=0;c < final[0].length;c++) {
  //       const tmp = removeBorder(final[r][c]);
  //       str += tmp[r2]
  //     }
  //     result.push(str)
  //   }
  // }
  // console.log(result);
});
