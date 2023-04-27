const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  console.log(
    data
      .split("\n\n")
      .reduce(
        (acc, g) => acc + [...new Set([...g].filter((x) => x !== "\n"))].length,
        0
      )
  );
  console.log(
    data.split("\n\n").reduce((acc, g) => {
      return (
        acc +
        [...new Set([...g].filter((x) => x !== "\n"))].reduce(
          (acc2, l) =>
            g
              .split("\n")
              .map((x) => [...x].sort().join(""))
              .every((x) => x.includes(l))
              ? acc2 + 1
              : acc2,
          0
        )
      );
    }, 1)
  );
});
