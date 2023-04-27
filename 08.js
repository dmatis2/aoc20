const fs = require("fs");

const exe = (ins) => {
  let mem = 0;
  let exec = [];
  let i = 0;
  let isLoop = false;
  while (i >= 0 && i <= ins.length - 1) {
    const x = ins[i];
    if (exec.includes(i)) {
      isLoop = true;
      break;
    }
    exec = [...exec, i];
    let [c, n] = x.split(" ");
    switch (c) {
      case "acc":
        mem += parseInt(n);
        break;
      case "jmp":
        if (n === "+1") {
          i++;
          continue;
        }
        i += parseInt(n) - 1;
        break;
      default:
        break;
    }
    i++;
  }
  if (isLoop) return [1, mem];
  return [0, mem];
};

fs.readFile("input.txt", "utf8", (err, data) => {
  const ins = data.split("\n");
  console.log(exe(ins)[1]);
  let indexes = ins.map((x, i) => i).filter((x, i) => !ins[i].includes("acc"));
  indexes.some((idx) => {
    let [cmd, num] = ins[idx].split(" ");
    cmd = cmd === "jmp" ? "nop" : "jmp";
    let newIns = [
      ...ins.slice(0, idx),
      [cmd, num].join(" "),
      ...ins.slice(idx + 1),
    ];
    const [a, b] = exe(newIns);
    if (a === 0) {
      console.log(b);
      return true;
    }
    return false;
  });
});
