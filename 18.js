const fs = require("fs");

const eval = (expr) => {
  while (!expr.match(/^\d+$/)) {
    while (expr.match(/\([^\(\)]+\)/)) {
      const { before, inner, rest } =
        /(?<before>.*)\((?<inner>[^\(\)]+)\)(?<rest>.*)/.exec(expr).groups;
      let tmp = eval(inner);
      expr = `${before}${tmp}${rest}`;
    }
    let { a, op, b, rest } = /(?<a>\d+)(?<op>.)(?<b>\d+)(?<rest>.*)/.exec(
      expr
    ).groups;
    let res = parseInt(a);
    b = parseInt(b);
    if (op === "+") res += b;
    if (op === "-") res -= b;
    if (op === "*") res *= b;
    if (op === "/") res /= b;
    expr = `${res}${rest}`;
  }
  return parseInt(expr.match(/^\d+$/)[0]);
};

const eval2 = (expr) => {
  while (!expr.match(/^\d+$/)) {
    while (expr.match(/\([^\(\)]+\)/)) {
      const { before, inner, rest } =
        /(?<before>.*)\((?<inner>[^\(\)]+)\)(?<rest>.*)/.exec(expr).groups;
      let tmp = eval2(inner);
      expr = `${before}${tmp}${rest}`;
    }
    while (expr.match(/\+/)) {
      let { before, a, b, rest } = /(?<a>\d+)\+(?<b>\d+)(?<rest>.*)/.exec(
        expr
      ).groups;
      let res = parseInt(a) + parseInt(b);
      expr = `${expr.slice(0, expr.indexOf(`${a}+`))}${res}${rest}`;
    }
    if (expr.match(/^\d+$/)) return parseInt(expr.match(/^\d+$/)[0]);
    let { a, op, b, rest } = /(?<a>\d+)(?<op>.)(?<b>\d+)(?<rest>.*)/.exec(
      expr
    ).groups;
    let res = parseInt(a);
    b = parseInt(b);
    if (op === "*") res *= b;
    if (op === "-") res -= b;
    if (op === "/") res /= b;
    expr = `${res}${rest}`;
  }
  return parseInt(expr.match(/^\d+$/)[0]);
};

fs.readFile("input.txt", "utf8", (err, data) => {
  let exprs = data.split("\n").map((expr) => expr.replace(/ /g, ""));
  let total = 0;
  let total2 = 0;
  exprs.forEach((expr) => {
    total += eval(expr);
    total2 += eval2(expr);
  });
  console.log(total);
  console.log(total2);
});
