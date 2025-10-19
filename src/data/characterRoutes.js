// Character AI routes and behaviors for invited characters

// Noah's walking route in Yuwon's room (patrol)
export const noahRoute = {
  character: 'noah',
  type: 'patrol',
  waypoints: [
    { x: 51, y: 312, direction: 'up', pauseDuration: 0, action: 'walk' },
    { x: 47, y: 252, direction: 'up', pauseDuration: 0, action: 'walk' },
    { x: 96, y: 237, direction: 'right', pauseDuration: 5, action: 'walk' },
    { x: 230, y: 238, direction: 'right', pauseDuration: 5, action: 'walk' },
    { x: 230, y: 135, direction: 'up', pauseDuration: 5, action: 'walk' },
    { x: 64, y: 130, direction: 'left', pauseDuration: 5, action: 'walk' },
    { x: 152, y: 132, direction: 'right', pauseDuration: 5, action: 'walk' },
    { x: 152, y: 119, direction: 'up', pauseDuration: 10, action: 'walk' }
  ],
  startWaypointIndex: 0
};

// Noah's "just invited" route - from door to patrol starting position
export const noahJustInvitedRoute = {
  character: 'noah',
  type: 'just_invited',
  waypoints: [
    // Start at door (where character spawns)
    { x: 44, y: 412, direction: 'up', pauseDuration: 0, action: 'walk' },
    { x: 53, y: 314, direction: 'up', pauseDuration: 0, action: 'walk' },
    { x: 51, y: 312, direction: 'up', pauseDuration: 0, action: 'walk' }
    // End at patrol starting position (51, 312)
  ],
  startWaypointIndex: 0
};

// Noah's "going home" route - from left pause position to door
export const noahGoingHomeRoute = {
  character: 'noah',
  type: 'going_home',
  waypoints: [
    // From left position, move right by 20px
    { x: 74, y: 112, direction: 'right', pauseDuration: 0, action: 'walk' },

    // Go down 200px
    { x: 74, y: 312, direction: 'down', pauseDuration: 0, action: 'walk' },

    // Go left 30px
    { x: 44, y: 312, direction: 'left', pauseDuration: 0, action: 'walk' },

    // Go down 100px (should be out of room)
    { x: 44, y: 412, direction: 'down', pauseDuration: 0, action: 'walk' },
  ],
  startWaypointIndex: 0
};

// Example routes for other characters (can be expanded later)
export const jaehyunRoute = {
  character: 'jaehyun',
  type: 'static', // Stays in one spot
  waypoints: [
    { x: 270, y: 180, direction: 'down', pauseDuration: 0, action: 'idle' }
  ],
  startWaypointIndex: 0
};

export const minkyuRoute = {
  character: 'minkyu',
  type: 'static', // Stays in one spot
  waypoints: [
    { x: 400, y: 200, direction: 'down', pauseDuration: 0, action: 'idle' }
  ],
  startWaypointIndex: 0
};

// Helper function to get route for a character based on their route stage
export const getRouteForCharacter = (characterName, routeStage = 'patrol') => {
  if (characterName === 'noah') {
    if (routeStage === 'going_home') return noahGoingHomeRoute;
    if (routeStage === 'just_invited') return noahJustInvitedRoute;
    return noahRoute; // Default to patrol
  } else if (characterName === 'jaehyun') {
    return jaehyunRoute;
  } else if (characterName === 'minkyu') {
    return minkyuRoute;
  }
  return null;
};
