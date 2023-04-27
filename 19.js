const fs = require("fs");

const rulesMap = new Map();
const rulesCache = {};
const getRuleWithMemo = (rule) => {
  if (rule in rulesCache) return rulesCache[rule];
  if (/^".*"$/.test(rule)) {
    const res = rule.replace(/"/g, "");
    rulesCache[rule] = res;
    return res;
  } else if (/\|/.test(rule)) {
    const piped = rule.split(" | ");
    const res = `(${getRuleWithMemo(piped[0])}|${getRuleWithMemo(piped[1])})`;
    rulesCache[rule] = res;
    return res;
  }
  const split = rule.split(" ");
  const res = split.map((x) => getRuleWithMemo(rulesMap.get(x))).join("");
  rulesCache[rule] = res;
  return res;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let [rules, msgs] = data.split("\n\n");
  rules = rules.split("\n").forEach((rule) => {
    const { id, values } = /^(?<id>\d+): (?<values>.*)$/.exec(rule).groups;
    rulesMap.set(id, values);
  });
  const regex = new RegExp(`^${getRuleWithMemo("0")}$`);
  let count = 0;
  msgs.split("\n").forEach((msg) => {
    if (msg.match(regex)) count++;
  });
  console.log(count);

  /*
    0: 8 11 => 42{n+1} 31{n}
    8: 42 | 42 8 => 42{1,}
    11: 42 31 | 42 11 31 => 42{n} 31{n}
  */
  count = 0;
  const part2Regex = new RegExp(
    `^(?<r42>${getRuleWithMemo("42")}+)(?<r31>${getRuleWithMemo("31")}+)$`
  );
  msgs.split("\n").forEach((msg) => {
    if (msg.match(part2Regex)) {
      const { groups } = part2Regex.exec(msg);
      const { r42, r31 } = groups;
      const matches42 = r42.match(
        new RegExp(getRuleWithMemo("42"), "g")
      ).length;
      const matches31 = r31.match(
        new RegExp(getRuleWithMemo("31"), "g")
      ).length;
      if (matches42 > matches31) count++;
    }
  });
  console.log(count);
});
