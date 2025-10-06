// Furniture catalog for the room decoration system

export const furnitureCatalog = [
  // Bedroom
  { id: 'bed', name: 'Bed', image: '/images/game-rooms/Bed.png', price: 500, upgradeable: false },
  { id: 'desk', name: 'Computer Desk', image: '/images/game-rooms/Computer Desk.png', price: 400, upgradeable: false },

  // Storage - Upgradeable
  { id: 'bookshelf_empty', name: 'Bookshelf (Empty)', image: '/images/game-rooms/Bookshelve_Empty.png', price: 300, upgradeable: true, upgradesTo: 'bookshelf_decorated' },
  { id: 'bookshelf_decorated', name: 'Bookshelf (Decorated)', image: '/images/game-rooms/Bookshelve_Decorated.png', price: 500, upgradeable: false },
  { id: 'cabinet1_empty', name: 'Cabinet (Empty)', image: '/images/game-rooms/Cabinet_1_Empty.png', price: 250, upgradeable: true, upgradesTo: 'cabinet1_decorated' },
  { id: 'cabinet1_decorated', name: 'Cabinet (Decorated)', image: '/images/game-rooms/Cabinet_1_Decorated.png', price: 400, upgradeable: false },
  { id: 'cabinet2', name: 'Cabinet 2', image: '/images/game-rooms/Cabinet_2.png', price: 300, upgradeable: false },
  { id: 'wall_shelf_empty', name: 'Wall Shelf (Empty)', image: '/images/game-rooms/Wall Shelf_Empty.png', price: 200, upgradeable: true, upgradesTo: 'wall_shelf_decorated' },
  { id: 'wall_shelf_decorated', name: 'Wall Shelf (Decorated)', image: '/images/game-rooms/Wall Shelf_Decorated.png', price: 350, upgradeable: false },

  // Kitchen
  { id: 'fridge', name: 'Fridge', image: '/images/game-rooms/Fridge.png', price: 600, upgradeable: false },
  { id: 'kitchen_counter_empty', name: 'Kitchen Counter (Empty)', image: '/images/game-rooms/Kitchen Counter_Empty.png', price: 450, upgradeable: true, upgradesTo: 'kitchen_counter_decorated' },
  { id: 'kitchen_counter_decorated', name: 'Kitchen Counter (Decorated)', image: '/images/game-rooms/Kitchen Counter_Decorated.png', price: 650, upgradeable: false },
  { id: 'kitchen_upper_shelves', name: 'Kitchen Upper Shelves', image: '/images/game-rooms/Kitchen Upper Shelves.png', price: 400, upgradeable: false },
  { id: 'kitchen_island_empty', name: 'Kitchen Island (Empty)', image: '/images/game-rooms/Kitchen Island_Empty.png', price: 500, upgradeable: true, upgradesTo: 'kitchen_island_decorated' },
  { id: 'kitchen_island_decorated', name: 'Kitchen Island (Decorated)', image: '/images/game-rooms/Kitchen Island_Decorated.png', price: 700, upgradeable: false },

  // Living Room
  { id: 'sofa', name: 'Sofa', image: '/images/game-rooms/Sofa.png', price: 800, upgradeable: false },
  { id: 'tv_table', name: 'TV Table', image: '/images/game-rooms/TV Table.png', price: 350, upgradeable: false },
  { id: 'tv_shelf_empty', name: 'TV Shelf (Empty)', image: '/images/game-rooms/TV Shelf_Empty.png', price: 400, upgradeable: true, upgradesTo: 'tv_shelf_decorated' },
  { id: 'tv_shelf_decorated', name: 'TV Shelf (Decorated)', image: '/images/game-rooms/TV Shelf_Decorated.png', price: 600, upgradeable: false },

  // Decorations
  { id: 'carpet1', name: 'Carpet 1', image: '/images/game-rooms/Carpet_1.png', price: 200, upgradeable: false },
  { id: 'carpet2', name: 'Carpet 2', image: '/images/game-rooms/Carpet_2.png', price: 200, upgradeable: false },
  { id: 'carpet3', name: 'Carpet 3', image: '/images/game-rooms/Carpet_3.png', price: 200, upgradeable: false },
  { id: 'carpet4', name: 'Carpet 4', image: '/images/game-rooms/Carpet_4.png', price: 200, upgradeable: false },
  { id: 'painting1', name: 'Painting 1', image: '/images/game-rooms/Painting_1.png', price: 150, upgradeable: false },
  { id: 'painting2', name: 'Painting 2', image: '/images/game-rooms/Painting_2.png', price: 150, upgradeable: false },
  { id: 'painting3', name: 'Painting 3', image: '/images/game-rooms/Painting_3.png', price: 150, upgradeable: false },
];
