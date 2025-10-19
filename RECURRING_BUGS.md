# RECURRING BUGS - DO NOT REPEAT

## Yuwon Sprite Issues (Fixed multiple times)

### 1. Sprite Squashing
**Problem:** Yuwon sprite gets squashed when setting width and height to same value
**Solution:** ALWAYS use `width: 'auto'` or `height: 'auto'` to maintain aspect ratio
```javascript
// ❌ WRONG - Squashes sprite
style={{ width: '80px', height: '80px' }}

// ✅ CORRECT - Maintains aspect ratio
style={{ width: 'auto', height: '80px' }}
```

### 2. Typewriter Effect Not Working
**Problem:** Yuwon's dialogue doesn't have typewriter effect or doesn't play sound
**Solution:** Always include both typewriter useEffect AND sound in the effect
```javascript
useEffect(() => {
  if (showYuwonDialogue && yuwonDialogueIndex < yuwonDialogue.length) {
    // Play dialogue sound
    const audio = new Audio('/sounds/pixel/dialogue.wav');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio play failed:', err));

    const timer = setTimeout(() => {
      setYuwonDialogueIndex(yuwonDialogueIndex + 1);
    }, 50);
    return () => clearTimeout(timer);
  }
}, [showYuwonDialogue, yuwonDialogueIndex, yuwonDialogue]);
```

### 3. Sprite Not Rendering in Canvas
**Problem:** Yuwon sprite doesn't show in game canvas
**Solution:** Check these things:
- Image is loaded: `playerSpriteRef.current && playerSpriteRef.current.complete`
- `ctx.imageSmoothingEnabled = false` for pixelated look
- Correct dimensions used (don't force square aspect ratio)

### 4. Sprite Timing Logic
**Problem:** Yuwon sprite shows at wrong times (e.g., during attack phase, during dodge bullets)
**Solution:**
- Sprite should ONLY show during DIALOGUE TIME (both Yuwon and Noah talking)
- After dialogue ends, TRANSFORM to heart with animation
- Heart stays for ENTIRE dodge phase (while dodging bullets)
- Heart stays for ENTIRE attack phase (choosing work/slack)
- DO NOT transform back to sprite until NEXT WAVE'S DIALOGUE starts
- Timeline:
  - Frames 1-90: Yuwon talks → SHOW SPRITE
  - Frames 90-210: Noah talks → SHOW SPRITE
  - Frames 210-240: Transformation animation → FADE SPRITE, GROW HEART
  - Frames 240+: Dodging bullets → SHOW HEART ONLY
  - Attack phase: Choosing action → SHOW HEART ONLY
  - Next wave frame 1: New dialogue → SPRITE RETURNS

## ShootEmUp.jsx Specific Rules
1. Yuwon speaks first with typewriter effect
2. Noah speaks second with typewriter effect
3. Transformation animation happens AFTER all dialogue
4. Bullets spawn AFTER transformation completes
5. Heart stays for entire dodge phase (don't transform back until next wave)
