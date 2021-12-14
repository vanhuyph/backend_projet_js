"use strict";
var escape = require("escape-html");
const jsonDbPath = __dirname + "/../data/recipes.json";

class Recipe {
  constructor(data) {
    this.id = Recipe.getNextId();
    //escape the title & link in order to protect agains XSS attacks
    this.name = escape(data.name);
    this.description = escape(data.description);
    this.duration = escape(data.duration);
    this.qty_people = escape(data.qty_people);
    this.creation_date = escape(data.creation_date);
    this.ingredients_list = escape(data.ingredients_list);
    this.username = escape(data.username);
  }

  static getNextId() {
    let recipesList = getRecipesListFromFile(jsonDbPath);
    if (recipesList.length === 0) return 1;
    return recipesList[recipesList.length - 1].id + 1;

    // const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
    // let nextId;
    // if (recipes.length === 0) nextId = 1;
    // else nextId = recipes[recipes.length - 1].id + 1;
    // return nextId;
  }

  /**
   * Returns all recipes
   * @returns {Array} Array of recipes
   */
  static get getAllRecipes() {
    return getRecipesListFromFile(jsonDbPath);
  }

  /**
   * Returns all recipes
   * @param {predicate} function to be used to filter all movies
   * @returns {Array} Array of movies
   */
  // getAll(filterPredicate) {
  //   let recipe;
  //   recipe = parse(this.jsonDbPath, this.recipe);
  //   if (filterPredicate) return recipe.filter(filterPredicate);
  //   else return recipe;
  // }

  /**
   * Returns the recipe identified by id
   * @param {number} id - id of the recipe to find
   * @returns {object} the recipe found or undefined if the id does not lead to a recipe
   */

  static getOne(id) {
    let recipesList = getRecipesListFromFile(jsonDbPath);
    return recipesList.find((recipe) => recipe.id == id);
  }

  static getAllRecipesFromUsername(username) {
    let recipesList = new Array();
    let allRecipesList = getRecipesListFromFile(jsonDbPath);
    allRecipesList.forEach((element) => {
      if (element.username === username) {
        recipesList.push(element);
      }
    });
    return recipesList;
  }

  static search(search) {
    let recipesList = new Array();
    let regex = `^.*${search}.*$`.toLowerCase();
    let allRecipesList = getRecipesListFromFile(jsonDbPath);
    allRecipesList.forEach((recipe) => {
      if (
        recipe.name.toLowerCase().match(regex) ||
        recipe.description.toLowerCase().match(regex) ||
        recipe.username.toLowerCase().match(regex)
      ) {
        recipesList.push(recipe);
      }
    });
    return recipesList;
  }

  static get getOneRandomly() {
    let recipesList = getRecipesListFromFile(jsonDbPath);
    return recipesList[Math.floor(Math.random() * recipesList.length)];
  }

  /**
   * Add a recipe in the DB and returns the added recipe (containing a new id)
   * @param {object} body - it contains all required data to create a recipe
   * @returns {object} the recipe that was created (with id)
   */

  addRecipe() {
    let recipesList = getRecipesListFromFile(jsonDbPath);
    recipesList.push(this);
    saveRecipesListToFile(jsonDbPath, recipesList);
  }

  /**
   * Delete a recipe in the DB and return the deleted recipe
   * @param {number} id - id of the recipe to be deleted
   * @returns {object} the recipe that was deleted or undefined if the delete operation failed
   */
  static deleteRecipe(id) {
    let recipesList = getRecipesListFromFile(jsonDbPath);
    const index = recipesList.findIndex((recipe) => recipe.id == id);
    if (index < 0) return;
    const itemRemoved = { ...recipesList[index] };

    recipesList.splice(index, 1);
    saveRecipesListToFile(jsonDbPath, recipesList);
    return itemRemoved;
  }

  /**
   * Update a recipe in the DB and return the updated recipe
   * @param {number} id - id of the recipe to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated recipe or undefined if the update operation failed
   */
  // updateOne(id, body) {
  //   const recipes = parse(this.jsonDbPath, this.DefaultRecipes);
  //   const foundIndex = recipes.findIndex((recipe) => recipe.id == id);
  //   if (foundIndex < 0) return;
  //   // create a new object based on the existing recipe - prior to modification -
  //   // and the properties requested to be updated (those in the body of the request)
  //   // use of the spread operator to create a shallow copy and repl
  //   // Escape all dangerous potential new chars
  //   const updatedRecipe = { ...recipes[foundIndex] };
  //   for (const key in body) {
  //     if (Object.hasOwnProperty.call(body, key)) {
  //       const element = body[key];
  //       updatedRecipe[key] = escape(element);
  //     }
  //   }
  //   // replace the movie found at index : (or use splice)
  //   recipes[foundIndex] = updatedRecipe;

  //   serialize(this.jsonDbPath, recipes);
  //   return updatedRecipe;
  // }
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

function saveRecipesListToFile(filePath, recipesList) {
  const fs = require("fs");
  let data = JSON.stringify(recipesList);
  fs.writeFileSync(filePath, data);
}

module.exports = { Recipe };
