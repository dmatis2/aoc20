const fs = require("fs");

let ingredientCounter = new Map();
let map = new Map();

fs.readFile("input.txt", "utf8", (err, data) => {
  data.split("\n").forEach((line) => {
    let { ingredients, allergens } =
      /^(?<ingredients>.*) \(contains (?<allergens>.*)\)$/.exec(line).groups;
    ingredients = ingredients.split(" ");
    allergens = allergens.split(", ");
    for (let ing of ingredients) {
      if (ingredientCounter.has(ing)) {
        ingredientCounter.set(ing, ingredientCounter.get(ing) + 1);
      } else {
        ingredientCounter.set(ing, 1);
      }
    }

    for (let allergen of allergens) {
      if (!map.has(allergen)) {
        map.set(allergen, ingredients);
      } else {
        const tmp = map.get(allergen);
        if (tmp.length === 1) {
        } else {
          map.set(
            allergen,
            ingredients.filter((i) => tmp.includes(i))
          );
        }
      }
    }
  });

  let doneMap = new Map();
  while (map.size > 0) {
    const unique = Array.from(map.keys()).find(
      (key) => map.get(key).length === 1
    );
    const ingredient = map.get(unique)[0];
    doneMap.set(unique, ingredient);
    map.delete(unique);
    for (let key of map.keys()) {
      map.set(
        key,
        map.get(key).filter((x) => x !== ingredient)
      );
    }
  }

  let part1 = 0;
  for (let key of ingredientCounter.keys()) {
    if (!Array.from(doneMap.values()).includes(key)) {
      part1 += ingredientCounter.get(key);
    }
  }
  console.log(part1);
  console.log(
    Array.from(doneMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((a) => a[1])
      .join(",")
  );
});
