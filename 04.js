const valid = ["byr", "cid", "ecl", "eyr", "hcl", "hgt", "iyr", "pid"];
const valid2 = ["byr", "ecl", "eyr", "hcl", "hgt", "iyr", "pid"];

const fs = require("fs");
fs.readFile("input.txt", "utf8", (err, data) => {
  let count = 0;
  const lines = data
    .split("\n\n")
    .map((l) => l.replace(/\n/g, " "))
    .forEach((l) => {
      const x = l
        .split(" ")
        .map((x) => x.split(":"))
        .map((x) => x[0])
        .sort();
      if (
        JSON.stringify(x) === JSON.stringify(valid) ||
        JSON.stringify(x) === JSON.stringify(valid2)
      ) {
        count++;
      }
    });
  console.log(count);
  let count2 = 0;
  const lines2 = data
    .split("\n\n")
    .map((l) => l.replace(/\n/g, " "))
    .forEach((l) => {
      const x = l
        .split(" ")
        .map((x) => x.split(":"))
        .map((x) => x[0])
        .sort();
      if (
        JSON.stringify(x) === JSON.stringify(valid) ||
        JSON.stringify(x) === JSON.stringify(valid2)
      ) {
        let obj = Object.fromEntries(
          l
            .split(" ")
            .map((x) => x.split(":"))
            .sort()
        );
        for (let i of valid2) {
          if (i in obj) {
            if (i === "byr") {
              const n = parseInt(obj[i]);
              obj = { ...obj, [i]: n >= 1920 && n <= 2002 };
            }
            if (i === "iyr") {
              const n = parseInt(obj[i]);
              obj = { ...obj, [i]: n >= 2010 && n <= 2020 };
            }
            if (i === "eyr") {
              const n = parseInt(obj[i]);
              obj = { ...obj, [i]: n >= 2020 && n <= 2030 };
            }
            if (i === "hgt") {
              if (obj[i].includes("cm")) {
                const n = parseInt(obj[i].split("cm")[0]);
                obj = { ...obj, [i]: n >= 150 && n <= 193 };
              } else if (obj[i].includes("in")) {
                const n = parseInt(obj[i].split("in")[0]);
                obj = { ...obj, [i]: n >= 59 && n <= 76 };
              } else {
                obj = { ...obj, [i]: false };
              }
            }
            if (i === "hcl") {
              obj = { ...obj, [i]: obj[i].match(/#[a-f0-9]{6}/) !== null };
            }
            if (i === "ecl") {
              obj = {
                ...obj,
                [i]: ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(
                  obj[i]
                ),
              };
            }
            if (i === "pid") {
              obj = { ...obj, [i]: obj[i].match(/[0-9]{9}/) !== null };
            }
          }
        }
        if (!Object.values(obj).some((e) => !e)) count2++;
      }
    });
  console.log(count2 - 1);
});
