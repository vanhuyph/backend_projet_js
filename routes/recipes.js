let express = require("express");
const { Recipe } = require("../models/Recipe");
const { authorize } = require("../utils/auth");
let router = express.Router();

// GET /recipes : read all the recipes from the menu
// If there's a parameter, return a filtered recipes list
router.get("/", function (req, res) {
  return res.json(Recipe.getAllRecipes);
});

// GET /recipes/random : Get a random recipe
router.get("/random", function (req, res) {
  return res.json(Recipe.getOneRandomly);
});

// POST /recipes : create a recipe to be added to the menu.
// authorize Middleware : it authorize any authenticated user and load the user in req.user
router.post("/", authorize, function (req, res) {
  //Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("description") &&
      req.body.description.length === 0) ||
    (req.body.hasOwnProperty("duration") && req.body.duration.length === 0) ||
    (req.body.hasOwnProperty("qty_people") &&
      req.body.qty_people.length === 0) ||
    (req.body.hasOwnProperty("creation_date") &&
      req.body.creation_date.length === 0) ||
    (req.body.hasOwnProperty("ingredients_list") &&
      req.body.ingredients_list.length === 0) ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0)
  )
    return res.status(400).end();

  let newRecipe = new Recipe(req.body);
  newRecipe.addRecipe();
  return res.json(newRecipe);
});

//Search recipes: GET /api/courts/:search
router.get("/:search", function (req, res) {
  return res.json(Recipe.search(req.params.search));
});

// GET /recipes/{username} : Get all recipes from his username
router.get("/:username", function (req, res) {
  return res.json(Recipe.getAllRecipesFromUsername(req.params.username));
});

// GET /recipes/{id} : Get a recipe from its id in the menu
router.get("/:id", function (req, res) {
  const recipe = Recipe.getOne(req.params.id);
  // Send an error code '404 Not Found' if the recipe was not found
  if (!recipe) return res.status(404).end();
  return res.json(recipe);
});

// DELETE /recipes/{i} : delete a recipe from the menu
// authorize Middleware : it authorize any authenticated user and load the user in req.user
router.delete("/:id", authorize, function (req, res) {
  return res.json(Recipe.deleteRecipe(req.params.id));
});

// PUT /recipes/{id} : update a recipe at id
// router.put("/:id", authorize, function (req, res) {
//   console.log(`PUT /recipes/${req.params.id}`);
//   // Send an error code '400 Bad request' if the body parameters are not valid
//   if (
//     !req.body ||
//     (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
//     (req.body.hasOwnProperty("description") &&
//       req.body.description.length === 0) ||
//     (req.body.hasOwnProperty("duration") && req.body.duration.length === 0) ||
//     (req.body.hasOwnProperty("qty_people") &&
//       req.body.qty_people.length === 0) ||
//     (req.body.hasOwnProperty("creation_date") &&
//       req.body.creation_date.length === 0) ||
//     (req.body.hasOwnProperty("ingredients_list") &&
//       req.body.ingredients_list.length === 0) ||
//     (req.body.hasOwnProperty("username") && req.body.username.length === 0)
//   )
//     return res.status(400).end();

//   const recipe = recipeModel.updateOne(req.params.id, req.body);
//   // Send an error code 'Not Found' if the recipe was not found :
//   if (!recipe) return res.status(404).end();
//   return res.json(recipe);
// });

module.exports = router;
