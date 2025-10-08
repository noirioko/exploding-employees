# Past Problems Solved

## 2025-10-08: Noah AI, Collision System, and Depth Sorting

### Problems Encountered & Solutions

#### 1. **Noah's Container Size Mismatch**
**Problem**: Noah's container was 90×90px when it should have been 45×45px (matching Yuwon's setup).
- Noah's GIFs are 16×16, so they needed a smaller container
- Oversized container caused positioning issues

**Solution**:
- Changed container from 90px to 45px
- Updated offsets: `x - 22.5`, `y - 30` (was `x - 45`, `y - 60`)
- Files: `src/pages/Room.jsx` lines 811-814

---

#### 2. **Yuwon Could Walk Through Noah**
**Problem**: Collision detection only checked furniture zones, not Noah's position.
- `checkCollision()` had comment: "No collision with Noah - let Yuwon walk freely"
- Yuwon would phase right through Noah

**Solution**:
- Added Noah collision check in `checkCollision()` function
- Uses Noah's 12×12 collision box centered at his position
- Files: `src/pages/Room.jsx` lines 456-472

---

#### 3. **Collision Only at Noah's Original Position (Stale Closure Bug)**
**Problem**: Yuwon could only collide with Noah's "ghost" at his starting position (x:125, y:129).
- `checkCollision()` captured initial `characters` state when defined
- When Noah moved, function still checked against old position

**Solution**:
- Created `noahPositionRef` to track real-time position (like `positionRef` for Yuwon)
- Noah's AI updates ref every frame
- `checkCollision()` reads from `noahPositionRef.current` instead of stale state
- Files: `src/pages/Room.jsx` lines 78, 408-414, 457

---

#### 4. **Hitbox at Wrong Height (Center vs Feet)**
**Problem**: Noah's hitbox was centered at `noah.y`, but Yuwon's was at feet position (`y + 15`).
- This created a vertical gap - Yuwon could "slip through Noah's legs"
- Collision math was comparing center to feet

**Solution**:
- Calculate Noah's feet position: `noahFeetY = noah.y + 15`
- Both characters now compare feet-to-feet for collision
- Files: `src/pages/Room.jsx` lines 461-463

---

#### 5. **E Prompt Jittering at Boundary**
**Problem**: "Press E to Gift" prompt flickered on/off rapidly when walking near proximity boundary.
- Proximity check ran every frame (60fps)
- At 55-65px boundary, tiny movements caused constant toggling

**Solution**:
- **Throttled proximity checks** to run every 10 frames (60fps → 6fps)
- **Adjusted thresholds** from 55/65px to 45/60px (smaller zone)
- Added frame counter: `proximityCheckCounter.current`
- Files: `src/pages/Room.jsx` lines 77, 274-301

---

#### 6. **Depth Sorting Issue (Z-Index)**
**Problem**: Yuwon always rendered in front of Noah (zIndex 15 vs 14).
- When walking "above" Noah (smaller Y), Yuwon appeared to walk **over** Noah's sprite
- Should render behind when higher on screen, in front when lower

**Solution**:
- **Dynamic z-index based on Y position**
- Compare feet positions: `yuwonFeetY` vs `noahFeetY`
- If `yuwonFeetY < noahFeetY`: z-index 13 (behind)
- If `yuwonFeetY >= noahFeetY`: z-index 15 (in front)
- Creates proper depth sorting like Stardew Valley, Pokémon, etc.
- Files: `src/pages/Room.jsx` lines 900-905

---

#### 7. **Noah Starting Position**
**Problem**: Noah started too far from window he was supposed to be looking at.

**Solution**:
- Moved Noah from `y: 129` to `y: 113` (closer to window but outside collision zone 16)
- Set initial direction to `'up'` so he starts looking at window
- Files: `src/pages/Room.jsx` lines 95, 101

---

### Technical Concepts Applied

1. **React Refs for Real-time Data**: Using `useRef` to avoid stale closures in functions defined outside hooks
2. **Hysteresis**: Different enter/exit thresholds (45px/60px) to prevent rapid state toggling
3. **Throttling**: Running expensive checks less frequently (every 10 frames instead of every frame)
4. **Depth Sorting**: Y-position based z-index for proper 2D depth rendering
5. **Collision Detection**: AABB (Axis-Aligned Bounding Box) collision with proper feet positioning

---

### Files Modified

- `src/pages/Room.jsx` (main changes)
  - Lines 78: Added `noahPositionRef`
  - Lines 77: Added `proximityCheckCounter`
  - Lines 91-103: Character state with Noah at y:113
  - Lines 274-301: Throttled proximity detection
  - Lines 408-414: Update `noahPositionRef` in Noah's AI
  - Lines 456-472: Noah collision check with feet positioning
  - Lines 900-905: Dynamic z-index calculation

---

### Result

✅ Noah's container properly sized (45px)
✅ Yuwon cannot walk through Noah
✅ Collision works wherever Noah is positioned
✅ Hitboxes aligned at feet positions
✅ E prompt jitters significantly reduced
✅ Proper depth sorting - Yuwon renders behind/in front of Noah based on position
✅ Noah positioned near window

---

### Notes for Future

- **Jitter Elimination**: For 100% jitter-free proximity detection, implement directional intent checking (only show E when moving toward character)
- **Performance**: Throttling proximity checks from 60fps to 6fps saves CPU with minimal UX impact
- **Scalability**: The ref pattern and dynamic z-index system can be extended to support multiple NPCs
