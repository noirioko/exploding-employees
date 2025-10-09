# Room System

An interactive room customization and character interaction system where you can decorate rooms, place furniture, and interact with walking employee characters.

## 🏠 Room Overview

The Room system provides a visual, interactive space where:
- Employees walk around as pixel art characters
- You can place and arrange furniture
- Different zones have different functions
- Employees interact with furniture and each other
- Room appearance reflects your progress and style

## 🚶 Character Walking System

### Movement Mechanics

**Walking Behavior:**
- Characters move autonomously around the room
- Smooth pixel-by-pixel movement
- Walk to random positions
- Stop and idle at destinations
- Turn around when reaching walls

**Character Sprites:**
- Pixel art style (32×32 or 64×64 sprites)
- Walking animations (4 frames)
- Idle animations
- Facing directions: left, right, up, down
- Character-specific sprites (Yuwon, Noah, Jaehyun, Minkyu)

**Pathfinding:**
- Characters avoid furniture obstacles
- Can walk around objects
- Prefer open spaces
- May gather in social zones

### Character States

**Idle:**
- Standing still
- Occasional animations (looking around, stretching)
- Play on phone, drink coffee, etc.

**Walking:**
- Moving to destination
- Animated walking cycle
- Speed varies by character mood

**Interacting:**
- Using furniture (sitting, sleeping, working)
- Talking with other characters
- Special animations per furniture type

## 🪑 Furniture System

### Furniture Types

**Functional Furniture:**
- **Desk**: Characters work here
- **Chair**: Sit and rest
- **Bed**: Sleep and recover energy
- **Sofa**: Relax and socialize
- **Kitchen**: Cooking area
- **Bookshelf**: Reading zone
- **Coffee Machine**: Get coffee
- **Computer**: Work station
- **Plant**: Decoration, boosts mood

**Decorative Furniture:**
- **Rug**: Floor decoration
- **Lamp**: Lighting
- **Painting**: Wall art
- **Clock**: Time display
- **Window**: Background element
- **Curtains**: Window decoration

**Special Furniture:**
- **Gift Box**: Place gifts for employees
- **Mini-game Station**: Play mini-games
- **Photo Wall**: Display memories/achievements
- **Trophy Case**: Show collection achievements

### Furniture Properties

Each furniture has:
- **Size**: 1×1, 2×2, 1×2, etc. (grid squares)
- **Category**: Functional, decorative, special
- **Price**: Cost in YuCash or unlock condition
- **Layering**: Floor, mid-layer, wall, overlay
- **Collision**: Can characters walk through it?
- **Interaction**: What happens when character uses it?
- **Mood Effect**: Does it boost employee morale?

### Furniture Layering

**4-Layer System:**
1. **Floor Layer**: Rugs, floor tiles, tatami mats
2. **Furniture Layer**: Desks, chairs, beds, etc.
3. **Wall Layer**: Paintings, shelves, windows
4. **Overlay Layer**: Particles, effects, lighting

This allows overlapping furniture for depth and realism.

## 🎨 Room Editor

### Editing Mode

**Enter Edit Mode:**
- Click "Edit Room" button on Room page
- Opens furniture placement interface
- Characters fade out or pause
- Grid overlay appears

**Furniture Placement:**
- Drag furniture from inventory/catalog
- Snap to grid (or free placement mode)
- Rotate furniture (if applicable)
- Change furniture layer
- Preview placement before confirming

**Controls:**
- **Click**: Select furniture
- **Drag**: Move furniture
- **Right-click**: Delete furniture
- **Scroll**: Change layer (floor/furniture/wall)
- **R key**: Rotate selected item
- **ESC**: Cancel placement

### Room Zones

**Defined Zones:**
- **Work Zone**: Office desks, computers (productivity area)
- **Rest Zone**: Beds, sofas (recovery area)
- **Kitchen Zone**: Cooking furniture (cooking interaction)
- **Social Zone**: Tables, chairs (characters gather here)
- **Storage Zone**: Shelves, chests (not implemented yet)

**Zone Effects:**
- Characters prefer certain zones based on mood
- Work zone increases productivity visualization
- Rest zone = characters sleep/recover
- Kitchen zone = cooking animations
- Social zone = character conversations

## 🏪 Getting Furniture

### Purchase from Store

**Buy with YuCash:**
- Browse furniture catalog
- Each piece has price
- Buy once, place multiple times (or limited per furniture?)

### Unlock via Achievements

**Achievement Furniture:**
- Complete X tasks → unlock "Overachiever Desk"
- Max friendship → unlock "Friendship Sofa"
- Collect all cards → unlock "Collector's Display Case"

### Special Events

**Seasonal Furniture:**
- Holiday-themed furniture (Christmas tree, Halloween decorations)
- Limited-time availability
- May return next year

### Gacha Furniture

**Rare Furniture from Special Gacha:**
- Premium furniture pool
- Costs Noah Credit Card (premium currency)
- Exclusive designs

## 🎮 Room Interactions

### Furniture Interactions

**When Character Reaches Furniture:**
- Plays interaction animation
- Character state changes (working, resting, etc.)
- Visual effects (sparkles, hearts, ZZZ for sleep)
- May trigger dialogue or reactions

**Examples:**
- Sit on chair → "Ahh, comfortable!" 💺
- Use desk → Working animation, productivity increases
- Sleep in bed → ZZZ animation, energy restored
- Coffee machine → Get coffee, mood boost ☕

### Character-to-Character Interactions

**When Two Characters Meet:**
- Stop and face each other
- Speech bubbles appear
- Conversation animations
- May have special dialogues based on friendship level
- Friendship points may increase slightly

**Interaction Types:**
- Casual chat (random topics)
- Work discussion (if both in work zone)
- Complaining about tasks (if overworked)
- Celebrating completed tasks
- Gift exchanges (if holding items)

## 🎨 Room Themes & Customization

### Pre-made Themes

**Room Templates:**
- **Minimalist Office**: Clean, simple, productivity-focused
- **Cozy Home**: Warm, comfortable, relaxing
- **Gamer Den**: Gaming setup, RGB lights, posters
- **Korean Café**: Coffee shop aesthetic, plants, pastries
- **Fantasy Cottage**: Magical, whimsical decorations

**Apply Theme:**
- One-click apply entire furniture set
- Can modify after applying
- Themes cost YuCash or unlocked via achievements

### Custom Layouts

**Save/Load Layouts:**
- Save current room layout
- Load previous layouts
- Share layouts with friends (export code)
- Import layouts from community

## 📊 Room Data Structure

### Room Save Data

```javascript
{
  roomId: 'yuwon_room_01',
  roomName: 'Yuwon\'s Office',
  owner: 'yuwon',
  furniture: [
    {
      id: 'desk_001',
      furnitureType: 'modern_desk',
      position: { x: 100, y: 150 },
      layer: 'furniture',
      rotation: 0
    },
    {
      id: 'chair_001',
      furnitureType: 'office_chair',
      position: { x: 100, y: 180 },
      layer: 'furniture',
      rotation: 180
    }
  ],
  characters: ['yuwon', 'noah'], // Characters currently in room
  theme: 'office',
  lastModified: '2025-10-09T12:00:00Z'
}
```

### Character Position Data

```javascript
{
  employeeId: 'yuwon',
  position: { x: 200, y: 300 },
  direction: 'right', // facing direction
  state: 'walking', // walking, idle, interacting
  targetPosition: { x: 400, y: 300 }, // where they're walking to
  interactingWith: null // furniture ID if interacting
}
```

## 💡 Room Strategy Tips

### Layout Tips

1. **Create zones** - Separate work, rest, and social areas
2. **Leave space** - Don't overcrowd, characters need room to walk
3. **Layer thoughtfully** - Use floor rugs, then furniture, then wall art
4. **Functional first** - Place key furniture (desk, bed) before decorations
5. **Visual balance** - Distribute furniture evenly, avoid one side being too heavy

### Character Happiness

**Room affects morale:**
- More furniture = higher base mood
- Themed rooms = aesthetic bonus
- Functional furniture = productivity bonus
- Decorative furniture = happiness bonus

**Optimal Room:**
- 2-3 work stations
- 1-2 rest areas
- 1 social area
- 5-10 decorative items
- Good spacing for movement

## 🔮 Planned Features

- [ ] Multiple rooms per employee (bedroom, office, etc.)
- [ ] Room expansion (buy more space)
- [ ] Room visitors (invite employees to other rooms)
- [ ] Furniture crafting (combine materials)
- [ ] Furniture upgrades (level up furniture)
- [ ] Interactive mini-games at furniture
- [ ] Pet system (cats, dogs walk around room)
- [ ] Room rating/showcase system
- [ ] Community room gallery (visit other players' rooms)
- [ ] Room seasons (weather effects, seasonal decorations)

## 🐛 Known Issues

- [ ] Characters may sometimes clip through furniture
- [ ] Pathfinding can get stuck in corners
- [ ] Layering may not work correctly for all furniture
- [ ] Room performance drops with too much furniture (>50 items)
- [ ] Character collisions need improvement

## 🎮 Technical Notes

### Performance Optimization

**Character Update Frequency:**
- Update character positions at 30-60 FPS
- Only update visible characters
- Pause animations when room is not active

**Furniture Rendering:**
- Use sprite batching for same furniture types
- Cull off-screen furniture
- Lazy load furniture images

### Grid System

**Room Grid:**
- Default: 20×20 grid (400 total squares)
- Each square: 32×32 pixels
- Total room: 640×640 pixels
- Scalable based on room size

---

*Design your perfect workspace and watch your employees come to life!* 🏠✨
