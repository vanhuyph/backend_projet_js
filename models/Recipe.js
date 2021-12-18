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
  }

  /**
   * Returns all recipes
   * @returns {Array} Array of recipes
   */
  static get getAllRecipes() {
    return getRecipesListFromFile(jsonDbPath);
  }

  /**
   * Returns the recipe identified by id
   * @param {number} id - id of the recipe to find
   * @returns {object} the recipe found or undefined if the id does not lead to a recipe
   */
  static getRecipe(id) {
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

  static updateOne(id, newData) {
    let recipeList = getRecipesListFromFile(jsonDbPath);
    let index = recipeList.findIndex((recipe) => recipe.id == id);
    if (index < 0 || !newData) return;

    //escape new data to protect against XXS attack
    if (newData.name) newData.name = escape(newData.name);
    if (newData.description) newData.description = escape(newData.description);
    if (newData.duration) newData.duration = escape(newData.duration);
    if (newData.qty_people) newData.qty_people = escape(newData.qty_people);
    if (newData.ingredients_list) newData.ingredients_list = escape(newData.ingredients_list);

    recipeList[index] = { ...recipeList[index], ...newData };
    const recipeUpdated = { ...recipeList[index] };
    saveRecipesListToFile(jsonDbPath, recipeList);
    return recipeUpdated;
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