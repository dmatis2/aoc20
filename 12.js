const fs = require("fs");

const heads = { 0: "n", 90: "e", 180: "s", 270: "w" };
fs.readFile("input.txt", "utf8", (err, data) => {
  let actions = data.split("\n");
  let state = { n: 0, e: 0, s: 0, w: 0, head: "e", deg: 90 };
  actions.forEach((action) => {
    let [dir, ...count] = [...action].map((x) => x.toLowerCase());
    count = parseInt(count.join(""));
    switch (dir) {
      case "f":
        state[state.head] += count;
        break;
      case "l":
        state.deg = (360 + state.deg - count) % 360;
        break;
      case "r":
        state.deg = (state.deg + count) % 360;
        break;
      default:
        state[dir] += count;
    }
    state.head = heads[state.deg];
  });
  const { n, s, e, w } = state;
  console.log(Math.abs(n - s) + Math.abs(e - w));

  state = { n: 0, e: 0, s: 0, w: 0, head: "e", deg: 90 };
  let waypoint = { n: 1, e: 10, s: 0, w: 0 };
  actions.forEach((action) => {
    let [dir, ...count] = [...action].map((x) => x.toLowerCase());
    count = parseInt(count.join(""));
    let dirs;
    let val;
    let diff;
    switch (dir) {
      case "f":
        state = {
          ...state,
          n: state.n + count * waypoint.n,
          e: state.e + count * waypoint.e,
          s: state.s + count * waypoint.s,
          w: state.w + count * waypoint.w,
        };
        break;
      case "l":
        dirs = Object.values(waypoint);
        for (let i = 0; i < count / 90; i++) {
          val = dirs.shift();
          dirs.push(val);
        }
        Object.keys(waypoint).forEach((d, i) => {
          waypoint[d] = dirs[i];
        });
        break;
      case "r":
        dirs = Object.values(waypoint);
        for (let i = 0; i < count / 90; i++) {
          val = dirs.pop();
          dirs.unshift(val);
        }
        Object.keys(waypoint).forEach((d, i) => {
          waypoint[d] = dirs[i];
        });
        break;
      default:
        waypoint[dir] += count;
    }
    state.head = heads[state.deg];
  });
  const { n: n2, s: s2, e: e2, w: w2 } = state;
  console.log(Math.abs(n2 - s2) + Math.abs(e2 - w2));
});
