// Shop items configuration
// Each item can belong to multiple shop types

export const itemCategories = {
  FRUITS: 'Fruits',
  VEGETABLES: 'Vegetables',
  DAIRY: 'Dairy',
  BAKERY: 'Bakery',
  MEAT: 'Meat',
  SNACKS: 'Snacks',
  DRINKS: 'Drinks',
  CONDIMENTS: 'Condiments',
  KITCHEN: 'Kitchen',
  OTHER: 'Other'
};

export const shopItems = {
  // Supermarket items
  supermarket: [
    // FRUITS
    { id: 'red_apple', name: 'Red Apple', price: 5, image: '/images/cooking-sprites/ingredients/red_apple.png', category: itemCategories.FRUITS, description: 'Fresh red apple' },
    { id: 'green_apple', name: 'Green Apple', price: 5, image: '/images/cooking-sprites/ingredients/green_apple.png', category: itemCategories.FRUITS, description: 'Crisp green apple' },
    { id: 'banana', name: 'Banana', price: 3, image: '/images/cooking-sprites/ingredients/banana.png', category: itemCategories.FRUITS, description: 'Ripe banana' },
    { id: 'strawberry', name: 'Strawberry', price: 6, image: '/images/cooking-sprites/ingredients/strawberry.png', category: itemCategories.FRUITS, description: 'Sweet strawberries' },
    { id: 'watermelon1', name: 'Watermelon', price: 10, image: '/images/cooking-sprites/ingredients/watermelon1.png', category: itemCategories.FRUITS, description: 'Juicy watermelon' },
    { id: 'watermelon2', name: 'Watermelon Slice', price: 5, image: '/images/cooking-sprites/ingredients/watermelon2.png', category: itemCategories.FRUITS, description: 'Watermelon slice' },
    { id: 'red_grape', name: 'Red Grapes', price: 7, image: '/images/cooking-sprites/ingredients/red_grape.png', category: itemCategories.FRUITS, description: 'Sweet red grapes' },
    { id: 'green_grape', name: 'Green Grapes', price: 7, image: '/images/cooking-sprites/ingredients/green_grape.png', category: itemCategories.FRUITS, description: 'Green grapes' },

    // VEGETABLES
    { id: 'bell_pepper', name: 'Bell Pepper', price: 5, image: '/images/cooking-sprites/ingredients/bell_pepper.png', category: itemCategories.VEGETABLES, description: 'Fresh bell pepper' },
    { id: 'potato', name: 'Potato', price: 4, image: '/images/cooking-sprites/ingredients/potato.png', category: itemCategories.VEGETABLES, description: 'Fresh potato' },
    { id: 'cabbage', name: 'Cabbage', price: 6, image: '/images/cooking-sprites/ingredients/cabbage.png', category: itemCategories.VEGETABLES, description: 'Fresh cabbage' },
    { id: 'mushroom_white', name: 'White Mushroom', price: 8, image: '/images/cooking-sprites/ingredients/mushroom_white.png', category: itemCategories.VEGETABLES, description: 'Fresh mushrooms' },

    // DAIRY
    { id: 'milk_gallon', name: 'Milk Gallon', price: 12, image: '/images/cooking-sprites/ingredients/milk_gallon.png', category: itemCategories.DAIRY, description: 'Fresh milk gallon' },
    { id: 'milk_bottle', name: 'Milk Bottle', price: 8, image: '/images/cooking-sprites/ingredients/milk_bottle.png', category: itemCategories.DAIRY, description: 'Milk bottle' },
    { id: 'milk_pack', name: 'Milk Pack', price: 10, image: '/images/cooking-sprites/ingredients/milk_pack.png', category: itemCategories.DAIRY, description: 'Milk carton' },
    { id: 'milk_plastic', name: 'Milk Jug', price: 11, image: '/images/cooking-sprites/ingredients/milk_plastic.png', category: itemCategories.DAIRY, description: 'Plastic milk jug' },
    { id: 'butter', name: 'Butter', price: 8, image: '/images/cooking-sprites/ingredients/butter.png', category: itemCategories.DAIRY, description: 'Creamy butter' },
    { id: 'butter2', name: 'Butter Block', price: 9, image: '/images/cooking-sprites/ingredients/butter2.png', category: itemCategories.DAIRY, description: 'Butter block' },
    { id: 'egg_box', name: 'Egg Box', price: 10, image: '/images/cooking-sprites/ingredients/egg_box.png', category: itemCategories.DAIRY, description: 'Farm fresh eggs' },
    { id: 'egg_white', name: 'White Egg', price: 3, image: '/images/cooking-sprites/ingredients/egg_white.png', category: itemCategories.DAIRY, description: 'White egg' },
    { id: 'egg_brown', name: 'Brown Egg', price: 3, image: '/images/cooking-sprites/ingredients/egg_brown.png', category: itemCategories.DAIRY, description: 'Brown egg' },
    { id: 'white_cheese', name: 'White Cheese', price: 15, image: '/images/cooking-sprites/ingredients/white_cheese.png', category: itemCategories.DAIRY, description: 'Block of cheese' },
    { id: 'white_cheese_piece', name: 'Cheese Wedge', price: 8, image: '/images/cooking-sprites/ingredients/white_cheese_piece.png', category: itemCategories.DAIRY, description: 'Cheese wedge' },
    { id: 'American_cheese', name: 'American Cheese', price: 10, image: '/images/cooking-sprites/ingredients/American_cheese_p.png', category: itemCategories.DAIRY, description: 'American cheese slices' },
    { id: 'plain_yogurt', name: 'Plain Yogurt', price: 7, image: '/images/cooking-sprites/ingredients/plain_yogurt.png', category: itemCategories.DAIRY, description: 'Fresh yogurt' },

    // MEAT & FISH
    { id: 'bacon', name: 'Bacon', price: 12, image: '/images/cooking-sprites/ingredients/bacon.png', category: itemCategories.MEAT, description: 'Crispy bacon' },
    { id: 'meat1', name: 'Beef', price: 18, image: '/images/cooking-sprites/ingredients/meat1.png', category: itemCategories.MEAT, description: 'Fresh beef' },
    { id: 'meat2', name: 'Pork', price: 16, image: '/images/cooking-sprites/ingredients/meat2.png', category: itemCategories.MEAT, description: 'Fresh pork' },
    { id: 'fish', name: 'Fish', price: 15, image: '/images/cooking-sprites/ingredients/fish.png', category: itemCategories.MEAT, description: 'Fresh fish' },
    { id: 'salmon', name: 'Salmon', price: 20, image: '/images/cooking-sprites/ingredients/salmon.png', category: itemCategories.MEAT, description: 'Fresh salmon' },
    { id: 'tuna_can', name: 'Tuna Can', price: 8, image: '/images/cooking-sprites/ingredients/tuna_can.png', category: itemCategories.MEAT, description: 'Canned tuna' },

    // BAKERY & PANTRY
    { id: 'flour', name: 'Flour', price: 8, image: '/images/cooking-sprites/ingredients/flour.png', category: itemCategories.BAKERY, description: 'Bag of flour' },
    { id: 'sugar', name: 'Sugar', price: 6, image: '/images/cooking-sprites/ingredients/sugar.png', category: itemCategories.BAKERY, description: 'Bag of sugar' },
    { id: 'salt', name: 'Salt', price: 3, image: '/images/cooking-sprites/ingredients/salt.png', category: itemCategories.BAKERY, description: 'Salt shaker' },
    { id: 'baking_powder', name: 'Baking Powder', price: 5, image: '/images/cooking-sprites/ingredients/baking_powder.png', category: itemCategories.BAKERY, description: 'Baking powder' },
    { id: 'sliced_bread', name: 'Sliced Bread', price: 6, image: '/images/cooking-sprites/ingredients/sliced_bread_p.png', category: itemCategories.BAKERY, description: 'Sliced bread loaf' },
    { id: 'cookies', name: 'Cookies', price: 7, image: '/images/cooking-sprites/ingredients/cookies.png', category: itemCategories.BAKERY, description: 'Sweet cookies' },
    { id: 'marshmallows', name: 'Marshmallows', price: 5, image: '/images/cooking-sprites/ingredients/marshmallows.png', category: itemCategories.BAKERY, description: 'Fluffy marshmallows' },
    { id: 'cereal1', name: 'Cereal Box', price: 8, image: '/images/cooking-sprites/ingredients/cereal1.png', category: itemCategories.BAKERY, description: 'Breakfast cereal' },
    { id: 'cereal2', name: 'Cereal Box 2', price: 8, image: '/images/cooking-sprites/ingredients/cereal2.png', category: itemCategories.BAKERY, description: 'Breakfast cereal' },

    // CONDIMENTS & SAUCES
    { id: 'cooking_oil', name: 'Cooking Oil', price: 10, image: '/images/cooking-sprites/ingredients/cooking_oil.png', category: itemCategories.CONDIMENTS, description: 'Cooking oil' },
    { id: 'olive_oil', name: 'Olive Oil', price: 15, image: '/images/cooking-sprites/ingredients/olive_oil.png', category: itemCategories.CONDIMENTS, description: 'Extra virgin olive oil' },
    { id: 'ketchup', name: 'Ketchup', price: 5, image: '/images/cooking-sprites/ingredients/ketchup.png', category: itemCategories.CONDIMENTS, description: 'Tomato ketchup' },
    { id: 'mustard', name: 'Mustard', price: 4, image: '/images/cooking-sprites/ingredients/mustard.png', category: itemCategories.CONDIMENTS, description: 'Yellow mustard' },
    { id: 'barbeque_sauce', name: 'BBQ Sauce', price: 6, image: '/images/cooking-sprites/ingredients/barbeque_sauce.png', category: itemCategories.CONDIMENTS, description: 'Barbeque sauce' },
    { id: 'jam_strawberry', name: 'Strawberry Jam', price: 7, image: '/images/cooking-sprites/ingredients/jam_strawberry.png', category: itemCategories.CONDIMENTS, description: 'Strawberry jam' },
    { id: 'peanut_butter', name: 'Peanut Butter', price: 8, image: '/images/cooking-sprites/ingredients/peanut_butter.png', category: itemCategories.CONDIMENTS, description: 'Creamy peanut butter' },

    // SNACKS
    { id: 'potatochip_yellow', name: 'Potato Chips', price: 4, image: '/images/cooking-sprites/ingredients/potatochip_yellow.png', category: itemCategories.SNACKS, description: 'Crunchy chips' },
    { id: 'potatochip_blue', name: 'Potato Chips Blue', price: 4, image: '/images/cooking-sprites/ingredients/potatochip_blue.png', category: itemCategories.SNACKS, description: 'Crunchy chips' },
    { id: 'potatochip_green', name: 'Potato Chips Green', price: 4, image: '/images/cooking-sprites/ingredients/potatochip_green.png', category: itemCategories.SNACKS, description: 'Crunchy chips' },
    { id: 'snack1', name: 'Snack Bar', price: 3, image: '/images/cooking-sprites/ingredients/snack1.png', category: itemCategories.SNACKS, description: 'Snack bar' },
    { id: 'snack2', name: 'Snack Pack', price: 3, image: '/images/cooking-sprites/ingredients/snack2.png', category: itemCategories.SNACKS, description: 'Snack pack' },
    { id: 'energy_bar', name: 'Energy Bar', price: 4, image: '/images/cooking-sprites/ingredients/energy_bar.png', category: itemCategories.SNACKS, description: 'Energy bar' },
    { id: 'candy_bar', name: 'Candy Bar', price: 2, image: '/images/cooking-sprites/ingredients/candy_bar.png', category: itemCategories.SNACKS, description: 'Chocolate candy bar' },
    { id: 'milk_chocolate', name: 'Milk Chocolate', price: 5, image: '/images/cooking-sprites/ingredients/milk_chocolate.png', category: itemCategories.SNACKS, description: 'Milk chocolate bar' },
    { id: 'bubble_gum', name: 'Bubble Gum', price: 1, image: '/images/cooking-sprites/ingredients/bubble_gum.png', category: itemCategories.SNACKS, description: 'Bubble gum' },

    // DRINKS
    { id: 'water', name: 'Water Bottle', price: 2, image: '/images/cooking-sprites/ingredients/water.png', category: itemCategories.DRINKS, description: 'Bottled water' },
    { id: 'orange_juice', name: 'Orange Juice', price: 6, image: '/images/cooking-sprites/ingredients/orange_juice.png', category: itemCategories.DRINKS, description: 'Fresh orange juice' },
    { id: 'soft_drink_red', name: 'Soda Red', price: 3, image: '/images/cooking-sprites/ingredients/soft_drink_red.png', category: itemCategories.DRINKS, description: 'Red soda' },
    { id: 'soft_drink_blue', name: 'Soda Blue', price: 3, image: '/images/cooking-sprites/ingredients/soft_drink_blue.png', category: itemCategories.DRINKS, description: 'Blue soda' },
    { id: 'soft_drink_green', name: 'Soda Green', price: 3, image: '/images/cooking-sprites/ingredients/soft_drink_green.png', category: itemCategories.DRINKS, description: 'Green soda' },
    { id: 'soft_drink_yellow', name: 'Soda Yellow', price: 3, image: '/images/cooking-sprites/ingredients/soft_drink_yellow.png', category: itemCategories.DRINKS, description: 'Yellow soda' },
    { id: 'grape_soda', name: 'Grape Soda', price: 3, image: '/images/cooking-sprites/ingredients/grape_soda.png', category: itemCategories.DRINKS, description: 'Grape soda' },
    { id: 'coffee_bag', name: 'Coffee Bag', price: 10, image: '/images/cooking-sprites/ingredients/coffee_bag.png', category: itemCategories.DRINKS, description: 'Ground coffee' },
    { id: 'hot_cocoa_mix', name: 'Hot Cocoa Mix', price: 6, image: '/images/cooking-sprites/ingredients/hot_cocoa_mix.png', category: itemCategories.DRINKS, description: 'Hot cocoa mix' },
    { id: 'wine_red', name: 'Red Wine', price: 20, image: '/images/cooking-sprites/ingredients/wine_red.png', category: itemCategories.DRINKS, description: 'Red wine bottle' },
    { id: 'wine_white', name: 'White Wine', price: 20, image: '/images/cooking-sprites/ingredients/wine_white.png', category: itemCategories.DRINKS, description: 'White wine bottle' },

    // DESSERTS
    { id: 'strawberry_ice_cream', name: 'Strawberry Ice Cream', price: 8, image: '/images/cooking-sprites/ingredients/strawberry_ice_cream.png', category: itemCategories.SNACKS, description: 'Strawberry ice cream' },
    { id: 'vanilla_ice_cream', name: 'Vanilla Ice Cream', price: 8, image: '/images/cooking-sprites/ingredients/vanilla_or_lemon_ice_cream.png', category: itemCategories.SNACKS, description: 'Vanilla ice cream' },
    { id: 'fruit_cocktail_can', name: 'Fruit Cocktail', price: 6, image: '/images/cooking-sprites/ingredients/fruit_cocktail_can.png', category: itemCategories.SNACKS, description: 'Canned fruit cocktail' },

    // KITCHEN TOOLS
    { id: 'frying_pan', name: 'Frying Pan', price: 25, image: '/images/cooking-sprites/ingredients/frying pan_p.png', category: itemCategories.KITCHEN, description: 'Non-stick frying pan' },
    { id: 'bowl', name: 'Mixing Bowl', price: 10, image: '/images/cooking-sprites/ingredients/bowl.png', category: itemCategories.KITCHEN, description: 'Mixing bowl' },
    { id: 'chopping_board', name: 'Chopping Board', price: 15, image: '/images/cooking-sprites/ingredients/chopping board.png', category: itemCategories.KITCHEN, description: 'Wooden chopping board' },
    { id: 'kitchen_knife_set', name: 'Knife Set', price: 40, image: '/images/cooking-sprites/ingredients/kitchen_knife_set_p.png', category: itemCategories.KITCHEN, description: 'Kitchen knife set' },
    { id: 'whisk', name: 'Whisk', price: 8, image: '/images/cooking-sprites/ingredients/whisk_p.png', category: itemCategories.KITCHEN, description: 'Wire whisk' },
    { id: 'rolling_pin', name: 'Rolling Pin', price: 12, image: '/images/cooking-sprites/ingredients/rolling pin.png', category: itemCategories.KITCHEN, description: 'Wooden rolling pin' },
    { id: 'teakettle', name: 'Tea Kettle', price: 20, image: '/images/cooking-sprites/ingredients/teakettle.png', category: itemCategories.KITCHEN, description: 'Tea kettle' },

    // OTHER
    { id: 'aluminum_foil', name: 'Aluminum Foil', price: 6, image: '/images/cooking-sprites/ingredients/aluminum_foil.png', category: itemCategories.OTHER, description: 'Aluminum foil roll' },
    { id: 'paper_bag', name: 'Paper Bag', price: 1, image: '/images/cooking-sprites/ingredients/paper_bag.png', category: itemCategories.OTHER, description: 'Paper shopping bag' },
    { id: 'kitchen_soap', name: 'Kitchen Soap', price: 4, image: '/images/cooking-sprites/ingredients/kitchen_soap.png', category: itemCategories.OTHER, description: 'Dish soap' },
    { id: 'cleaning_gloves', name: 'Cleaning Gloves', price: 5, image: '/images/cooking-sprites/ingredients/cleaning_gloves_p.png', category: itemCategories.OTHER, description: 'Rubber cleaning gloves' },
    { id: 'wet_wipe', name: 'Wet Wipes', price: 3, image: '/images/cooking-sprites/ingredients/wet_wipe.png', category: itemCategories.OTHER, description: 'Wet wipes pack' },
    { id: 'bandage_box', name: 'Bandage Box', price: 5, image: '/images/cooking-sprites/ingredients/bandage_box.png', category: itemCategories.OTHER, description: 'First aid bandages' },
    { id: 'ball_pen', name: 'Pen', price: 2, image: '/images/cooking-sprites/ingredients/ball_pen.png', category: itemCategories.OTHER, description: 'Ballpoint pen' }
  ],

  // Convenience store items (for future use)
  convenience_store: [
    {
      id: 'chips',
      name: 'Chips',
      price: 7,
      emoji: '🍿',
      category: itemCategories.SNACKS,
      description: 'Crispy chips'
    },
    {
      id: 'soda',
      name: 'Soda',
      price: 5,
      emoji: '🥤',
      category: itemCategories.DRINKS,
      description: 'Cold soda'
    }
  ],

  // Boutique items (for future use)
  boutique: [
    // Will be filled with clothing items later
  ],

  // Cafe items (for future use)
  cafe: [
    {
      id: 'coffee',
      name: 'Coffee',
      price: 8,
      emoji: '☕',
      category: itemCategories.DRINKS,
      description: 'Hot coffee'
    },
    {
      id: 'cake',
      name: 'Cake',
      price: 12,
      emoji: '🍰',
      category: itemCategories.BAKERY,
      description: 'Slice of cake'
    }
  ]
};

// Helper function to get items by shop
export const getItemsByShop = (shopId) => {
  return shopItems[shopId] || [];
};

// Helper function to get item by ID across all shops
export const getItemById = (itemId) => {
  for (const shopId in shopItems) {
    const item = shopItems[shopId].find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
};
