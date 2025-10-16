const paths = [
  "../src/controller/auth.controller.js",
  "../src/controller/food.controller.js",
  "../src/services/storage.services.js",
  "../src/models/foodpartner.model.js",
  "../src/models/food.model.js",
];

for (const p of paths) {
  try {
    require(p);
    console.log(`${p} -> OK`);
  } catch (err) {
    console.error(`${p} -> ERROR`);
    console.error(err && err.stack ? err.stack : err);
  }
}
