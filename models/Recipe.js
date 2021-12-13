"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const jsonDbPath = __dirname + "/../data/recipes.json";

// Default recipes
const DefaultRecipes = [
  {
    id: 1,
    name: "test",
    description: "desc",
    duration: "60",
    qty_people: "5",
    creation_date: "2021-04-12",
    ingredients_list: "Oeuf, farine",
    username: "test",
  },
];

class Recipes {
  constructor(dbPath = jsonDbPath, defaultItems = DefaultRecipes) {
    this.jsonDbPath = dbPath;
    this.DefaultRecipes = defaultItems;
  }

  getNextId() {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    let nextId;
    if (recipes.length === 0) nextId = 1;
    else nextId = recipes[recipes.length - 1].id + 1;

    return nextId;
  }

  /**
   * Returns all recipes
   * @returns {Array} Array of recipes
   */
  getAll() {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    return recipes;
  }

   /**
   * Returns all movies
   * @param {predicate} function to be used to filter all movies
   * @returns {Array} Array of movies
   */
  getAll(filterPredicate) {
    let recipe;
    recipe = parse(this.jsonDbPath, this.recipe);
    if (filterPredicate) return recipe.filter(filterPredicate);
    else return recipe;
  }

  /**
   * Returns the recipe identified by id
   * @param {number} id - id of the recipe to find
   * @returns {object} the recipe found or undefined if the id does not lead to a recipe
   */
  getOne(id) {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    const foundIndex = recipes.findIndex((recipe) => recipe.id == id);
    if (foundIndex < 0) return;

    return recipes[foundIndex];
  }

  getOneRandomly() {
    let recipeList = getRecipesListFromFile(jsonDbPath);
    return recipeList[Math.floor(Math.random() * recipeList.length)];
  }

  /**
   * Add a recipe in the DB and returns the added recipe (containing a new id)
   * @param {object} body - it contains all required data to create a recipe
   * @returns {object} the recipe that was created (with id)
   */

  addOne(body) {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);

    // add new recipe
    const newRecipe = {
      id: this.getNextId(),
      name: escape(body.name),
      description: escape(body.description),
      duration: escape(body.duration),
      qty_people: escape(body.qty_people),
      creation_date: escape(body.creation_date),
      ingredients_list: escape(body.ingredients_list),
      username: escape(body.username),
    };
    recipes.push(newRecipe);
    serialize(this.jsonDbPath, recipes);
    return newRecipe;
  }

  /**
   * Delete a recipe in the DB and return the deleted recipe
   * @param {number} id - id of the recipe to be deleted
   * @returns {object} the recipe that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    const foundIndex = recipes.findIndex((recipe) => recipe.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = recipes.splice(foundIndex, 1);
    serialize(this.jsonDbPath, recipes);

    return itemRemoved[0];
  }

  /**
   * Update a recipe in the DB and return the updated recipe
   * @param {number} id - id of the recipe to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated recipe or undefined if the update operation failed
   */
  updateOne(id, body) {
    const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    const foundIndex = recipes.findIndex((recipe) => recipe.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing recipe - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    // Escape all dangerous potential new chars
    const updatedRecipe = { ...recipes[foundIndex] };
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const element = body[key];
        updatedRecipe[key] = escape(element);
      }
    }
    // replace the movie found at index : (or use splice)
    recipes[foundIndex] = updatedRecipe;

    serialize(this.jsonDbPath, recipes);
    return updatedRecipe;
  }
}

function getRecipesListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let recipeListRawData = fs.readFileSync(filePath);
  let recipeList;
  if (recipeListRawData) recipeList = JSON.parse(recipeListRawData);
  else recipeList = [];
  return recipeList;
}

module.exports = { Recipes };
