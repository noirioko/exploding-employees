// Cooking recipes configuration
// Each recipe requires specific ingredients and produces a finished dish

export const recipes = [
  {
    id: 'apple_pie',
    name: 'Apple Pie',
    image: '/images/cooking-sprites/food/05_apple_pie.png',
    dishImage: '/images/cooking-sprites/food/06_apple_pie_dish.png',
    ingredients: [
      { id: 'red_apple', amount: 3 },
      { id: 'flour', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'A classic dessert with sweet apple filling',
    discovered: true // Player has discovered this recipe
  },
  {
    id: 'bread',
    name: 'Bread',
    image: '/images/cooking-sprites/food/07_bread.png',
    dishImage: '/images/cooking-sprites/food/08_bread_dish.png',
    ingredients: [
      { id: 'flour', amount: 2 },
      { id: 'salt', amount: 1 },
      { id: 'water', amount: 1 }
    ],
    description: 'Fresh homemade bread',
    discovered: true
  },
  {
    id: 'baguette',
    name: 'Baguette',
    image: '/images/cooking-sprites/food/09_baguette.png',
    dishImage: '/images/cooking-sprites/food/10_baguette_dish.png',
    ingredients: [
      { id: 'flour', amount: 2 },
      { id: 'salt', amount: 1 },
      { id: 'water', amount: 1 }
    ],
    description: 'Crispy French baguette',
    discovered: true
  },
  {
    id: 'bun',
    name: 'Bun',
    image: '/images/cooking-sprites/food/11_bun.png',
    dishImage: '/images/cooking-sprites/food/12_bun_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'milk_gallon', amount: 1 },
      { id: 'egg_box', amount: 1 }
    ],
    description: 'Soft and fluffy bun',
    discovered: true
  },
  {
    id: 'bacon',
    name: 'Cooked Bacon',
    image: '/images/cooking-sprites/food/13_bacon.png',
    dishImage: '/images/cooking-sprites/food/14_bacon_dish.png',
    ingredients: [
      { id: 'bacon', amount: 1 }
    ],
    description: 'Crispy fried bacon strips',
    discovered: true
  },
  {
    id: 'burger',
    name: 'Burger',
    image: '/images/cooking-sprites/food/15_burger.png',
    dishImage: '/images/cooking-sprites/food/16_burger_dish.png',
    ingredients: [
      { id: 'meat1', amount: 1 },
      { id: 'sliced_bread', amount: 1 },
      { id: 'white_cheese', amount: 1 }
    ],
    description: 'Juicy beef burger with cheese',
    discovered: true
  },
  {
    id: 'burrito',
    name: 'Burrito',
    image: '/images/cooking-sprites/food/18_burrito.png',
    dishImage: '/images/cooking-sprites/food/19_burrito_dish.png',
    ingredients: [
      { id: 'meat1', amount: 1 },
      { id: 'flour', amount: 1 },
      { id: 'bell_pepper', amount: 1 },
      { id: 'white_cheese', amount: 1 }
    ],
    description: 'Wrapped burrito with meat and veggies',
    discovered: true
  },
  {
    id: 'bagel',
    name: 'Bagel',
    image: '/images/cooking-sprites/food/20_bagel.png',
    dishImage: '/images/cooking-sprites/food/21_bagel_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'egg_box', amount: 1 },
      { id: 'salt', amount: 1 }
    ],
    description: 'Classic chewy bagel',
    discovered: true
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake',
    image: '/images/cooking-sprites/food/22_cheesecake.png',
    dishImage: '/images/cooking-sprites/food/23_cheesecake_dish.png',
    ingredients: [
      { id: 'white_cheese', amount: 2 },
      { id: 'egg_box', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'flour', amount: 1 }
    ],
    description: 'Creamy and rich cheesecake',
    discovered: true
  },
  {
    id: 'cookies',
    name: 'Cookies',
    image: '/images/cooking-sprites/food/28_cookies.png',
    dishImage: '/images/cooking-sprites/food/29_cookies_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'butter', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'egg_box', amount: 1 }
    ],
    description: 'Sweet homemade cookies',
    discovered: true
  },
  {
    id: 'chocolatecake',
    name: 'Chocolate Cake',
    image: '/images/cooking-sprites/food/30_chocolatecake.png',
    dishImage: '/images/cooking-sprites/food/31_chocolatecake_dish.png',
    ingredients: [
      { id: 'flour', amount: 2 },
      { id: 'milk_chocolate', amount: 1 },
      { id: 'egg_box', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Rich chocolate cake',
    discovered: true
  },
  {
    id: 'donut',
    name: 'Donut',
    image: '/images/cooking-sprites/food/34_donut.png',
    dishImage: '/images/cooking-sprites/food/35_donut_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'egg_box', amount: 1 },
      { id: 'milk_gallon', amount: 1 }
    ],
    description: 'Sweet glazed donut',
    discovered: true
  },
  {
    id: 'friedegg',
    name: 'Fried Egg',
    image: '/images/cooking-sprites/food/38_friedegg.png',
    dishImage: '/images/cooking-sprites/food/39_friedegg_dish.png',
    ingredients: [
      { id: 'egg_box', amount: 1 },
      { id: 'cooking_oil', amount: 1 }
    ],
    description: 'Simple fried egg',
    discovered: true
  },
  {
    id: 'frenchfries',
    name: 'French Fries',
    image: '/images/cooking-sprites/food/44_frenchfries.png',
    dishImage: '/images/cooking-sprites/food/45_frenchfries_dish.png',
    ingredients: [
      { id: 'potato', amount: 2 },
      { id: 'cooking_oil', amount: 1 },
      { id: 'salt', amount: 1 }
    ],
    description: 'Crispy golden fries',
    discovered: true
  },
  {
    id: 'garlicbread',
    name: 'Garlic Bread',
    image: '/images/cooking-sprites/food/48_garlicbread.png',
    dishImage: '/images/cooking-sprites/food/49_garlicbread_dish.png',
    ingredients: [
      { id: 'sliced_bread', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Toasted bread with garlic butter',
    discovered: true
  },
  {
    id: 'hotdog',
    name: 'Hot Dog',
    image: '/images/cooking-sprites/food/54_hotdog.png',
    dishImage: '/images/cooking-sprites/food/56_hotdog_dish.png',
    ingredients: [
      { id: 'meat2', amount: 1 },
      { id: 'sliced_bread', amount: 1 },
      { id: 'ketchup', amount: 1 },
      { id: 'mustard', amount: 1 }
    ],
    description: 'Classic hot dog with condiments',
    discovered: true
  },
  {
    id: 'macncheese',
    name: 'Mac & Cheese',
    image: '/images/cooking-sprites/food/67_macncheese.png',
    dishImage: '/images/cooking-sprites/food/68_macncheese_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'white_cheese', amount: 2 },
      { id: 'milk_gallon', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Creamy macaroni and cheese',
    discovered: true
  },
  {
    id: 'omlet',
    name: 'Omelet',
    image: '/images/cooking-sprites/food/73_omlet.png',
    dishImage: '/images/cooking-sprites/food/74_omlet_dish.png',
    ingredients: [
      { id: 'egg_box', amount: 2 },
      { id: 'butter', amount: 1 },
      { id: 'white_cheese', amount: 1 }
    ],
    description: 'Fluffy cheese omelet',
    discovered: true
  },
  {
    id: 'pancakes',
    name: 'Pancakes',
    image: '/images/cooking-sprites/food/79_pancakes.png',
    dishImage: '/images/cooking-sprites/food/80_pancakes_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'egg_box', amount: 1 },
      { id: 'milk_gallon', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Fluffy stack of pancakes',
    discovered: true
  },
  {
    id: 'pizza',
    name: 'Pizza',
    image: '/images/cooking-sprites/food/81_pizza.png',
    dishImage: '/images/cooking-sprites/food/82_pizza_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'white_cheese', amount: 2 },
      { id: 'meat2', amount: 1 },
      { id: 'olive_oil', amount: 1 }
    ],
    description: 'Delicious homemade pizza',
    discovered: true
  },
  {
    id: 'roastedchicken',
    name: 'Roasted Chicken',
    image: '/images/cooking-sprites/food/85_roastedchicken.png',
    dishImage: '/images/cooking-sprites/food/86_roastedchicken_dish.png',
    ingredients: [
      { id: 'meat1', amount: 2 },
      { id: 'olive_oil', amount: 1 },
      { id: 'salt', amount: 1 }
    ],
    description: 'Juicy roasted chicken',
    discovered: true
  },
  {
    id: 'salmon',
    name: 'Grilled Salmon',
    image: '/images/cooking-sprites/food/88_salmon.png',
    dishImage: '/images/cooking-sprites/food/89_salmon_dish.png',
    ingredients: [
      { id: 'salmon', amount: 1 },
      { id: 'olive_oil', amount: 1 },
      { id: 'salt', amount: 1 }
    ],
    description: 'Perfectly grilled salmon',
    discovered: true
  },
  {
    id: 'strawberrycake',
    name: 'Strawberry Cake',
    image: '/images/cooking-sprites/food/90_strawberrycake.png',
    dishImage: '/images/cooking-sprites/food/91_strawberrycake_dish.png',
    ingredients: [
      { id: 'flour', amount: 2 },
      { id: 'strawberry', amount: 2 },
      { id: 'egg_box', amount: 1 },
      { id: 'sugar', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Sweet strawberry layered cake',
    discovered: true
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    image: '/images/cooking-sprites/food/92_sandwich.png',
    dishImage: '/images/cooking-sprites/food/93_sandwich_dish.png',
    ingredients: [
      { id: 'sliced_bread', amount: 2 },
      { id: 'bacon', amount: 1 },
      { id: 'white_cheese', amount: 1 }
    ],
    description: 'Classic sandwich',
    discovered: true
  },
  {
    id: 'steak',
    name: 'Steak',
    image: '/images/cooking-sprites/food/95_steak.png',
    dishImage: '/images/cooking-sprites/food/96_steak_dish.png',
    ingredients: [
      { id: 'meat1', amount: 2 },
      { id: 'olive_oil', amount: 1 },
      { id: 'salt', amount: 1 }
    ],
    description: 'Perfectly cooked steak',
    discovered: true
  },
  {
    id: 'waffle',
    name: 'Waffle',
    image: '/images/cooking-sprites/food/101_waffle.png',
    dishImage: '/images/cooking-sprites/food/102_waffle_dish.png',
    ingredients: [
      { id: 'flour', amount: 1 },
      { id: 'egg_box', amount: 1 },
      { id: 'milk_gallon', amount: 1 },
      { id: 'butter', amount: 1 }
    ],
    description: 'Crispy golden waffle',
    discovered: true
  }
];

// Helper function to get recipe by ID
export const getRecipeById = (recipeId) => {
  return recipes.find(r => r.id === recipeId);
};

// Helper function to check if player can cook a recipe
export const canCookRecipe = (recipe, playerIngredients) => {
  return recipe.ingredients.every(reqIngredient => {
    const playerAmount = playerIngredients[reqIngredient.id] || 0;
    return playerAmount >= reqIngredient.amount;
  });
};

// Helper function to get all discovered recipes
export const getDiscoveredRecipes = () => {
  return recipes.filter(r => r.discovered);
};

// Helper function to get all undiscovered recipes
export const getUndiscoveredRecipes = () => {
  return recipes.filter(r => !r.discovered);
};
