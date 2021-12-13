var express = require("express");
const { Recipes } = require("../models/Recipe");
const { authorize } = require("../utils/auth");

var router = express.Router();
const recipeModel = new Recipes();

// GET /recipes : read all the recipes from the menu
router.get("/", function (req, res) {
  console.log("GET /recipes");
  console.log("req.params", req.query);
  const username = req.query ? String(req.query["username"]) : undefined;
  if(!username) return res.json(recipeModel.getAll());
  else{
    res.json(recipeModel.getAll((recipe) => recipe.username === username));
  }
});

// GET /recipes/{id} : Get a recipe from its id in the menu
router.get("/:id", function (req, res) {
  console.log(`GET /recipes/${req.params.id}`);

  const recipe = recipeModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the recipe was not found
  if (!recipe) return res.status(404).end();

  return res.json(recipe);
});


// POST /recipes : create a recipe to be added to the menu.
// authorize Middleware : it authorize any authenticated user and load the user in req.user
router.post("/", authorize, function (req, res) {
  console.log("POST /recipes");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("description") && req.body.description.length === 0) ||
    (req.body.hasOwnProperty("duration") && req.body.duration.length === 0) ||
    (req.body.hasOwnProperty("qty_people") && req.body.qty_people.length === 0) ||
    (req.body.hasOwnProperty("creation_date") && req.body.creation_date.length === 0) ||
    (req.body.hasOwnProperty("ingredients_list") && req.body.ingredients_list.length === 0) ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0)
  )
  return res.status(400).end();

  const recipe = recipeModel.addOne(req.body);

  return res.json(recipe);
});

// DELETE /recipes/{i} : delete a recipe from the menu
// authorize Middleware : it authorize any authenticated user and load the user in req.user
router.delete("/:id", authorize, function (req, res) {
  console.log(`DELETE /recipes/${req.params.id}`);

  const recipe = recipeModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the recipe was not found
  if (!recipe) return res.status(404).end();
  return res.json(recipe);
});

// PUT /recipes/{id} : update a recipe at id
router.put("/:id", authorize, function (req, res) {
  console.log(`PUT /recipes/${req.params.id}`);
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
    (req.body.hasOwnProperty("description") && req.body.description.length === 0) ||
    (req.body.hasOwnProperty("duration") && req.body.duration.length === 0) ||
    (req.body.hasOwnProperty("qty_people") && req.body.qty_people.length === 0) ||
    (req.body.hasOwnProperty("creation_date") && req.body.creation_date.length === 0) ||
    (req.body.hasOwnProperty("ingredients_list") && req.body.ingredients_list.length === 0) ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0)
  )
  return res.status(400).end();

  const recipe = recipeModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the recipe was not found :
  if (!recipe) return res.status(404).end();
  return res.json(recipe);
});

module.exports = router;
