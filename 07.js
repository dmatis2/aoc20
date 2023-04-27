const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  const rules = data.split("\n");
  let rulesMap = new Map();
  rules.forEach((rule) => {
    const [type, rest] = rule.replace(".", "").split("contain");
    if (rest.trim().replace(/\d /g, "") !== "no other bags") {
      rulesMap.set(
        type.replace(" bags ", ""),
        rest
          .trim()
          .replace(/\d /g, "")
          .replace(/ bag$| bags$/g, "")
          .replace(/ bag,| bags,/g, ",")
          .split(", ")
      );
    }
  });

  let total = [];
  let queue = ["shiny gold"];

  while (queue.length !== 0) {
    const bag = queue.shift();
    for (let [rule, values] of rulesMap) {
      if (
        values.includes(bag) &&
        !queue.includes(rule) &&
        !total.includes(rule)
      ) {
        queue.push(rule);
        total.push(rule);
      }
    }
  }
  console.log(total.length);

  rulesMap.clear();
  rules.forEach((rule) => {
    const [type, rest] = rule.replace(".", "").split("contain");
    rulesMap.set(
      type.replace(" bags ", ""),
      rest
        .trim()
        .replace(/ bag$| bags$/g, "")
        .replace(/ bag,| bags,/g, ",")
        .split(", ")
    );
  });

  console.log(getCount("shiny gold", rulesMap) - 1);
});

let hash = {};
const getCount = (bag, rules) => {
  if (bag in hash) {
    return hash[bag];
  }
  let opts = rules.get(bag);
  let n = 1;
  opts.forEach((opt) => {
    if (!opt.includes("no other")) {
      let [count, ...type] = opt.split(" ");
      count = parseInt(count);
      type = type.join(" ");
      if (type in hash) n += count * hash[type];
      else {
        const val = getCount(type, rules);
        n += count * val;
      }
    }
  });
  hash[bag] = n;
  return n;
};
