# Axis Productivity x BL Game — Strategic Plan

_Last updated: 2025-10-04 (Asia/Jakarta)_

## Vision
A fun, low‑friction productivity toy where **real tasks** unlock **BL story chaos**. Players do chores → earn tickets → pull either wholesome slice‑of‑life or cursed AU one‑liners. Long‑term, the app layers light room‑decor and Axis Corp “management” flavor without heavy backend costs.

---

## Core Pillars
1. **Tasks First**: Completing tasks generates EXP/Gold and tickets. No direct monetization that skips tasks.
2. **Two Reward Streams**:
   - **Daily Fluff** (Normal Tickets) → cute, short stories + cursed trading cards.
   - **AU Progressions** (Golden Tickets) → linear, spicy/cursed arcs unlocked by “Impossible Tasks.”
3. **Cheap to Build**: Start text-only; art/rooms/events are modular expansions.

---

## Game Loops (Overview)
- **Short Loop (Daily)**: Do 5–10 tasks → earn up to 2 Normal Tickets → roll text rewards → entries logged to Recordbook (no stat impact).
- **Mid Loop (Weekly)**: Mark 1–2 tasks as **Impossible** → each completion grants 1 Golden Ticket → advances one AU linearly.
- **Long Loop (Evergreen)**: Collect all AU lines; collect cursed cards; optional room cosmetics; seasonal packs.

---

## MVP (Phase 1)
**Goal:** Ship a delightful _toy_ with no backend bills.

### Features
- **Tasks Tab**: Add/Complete/Delete tasks; energy tags (Low +1, Mid +2, High +3 EXP).
- **Daily Counter**: Resets at local midnight; shows today’s task count.
- **Ticket Wallet**:
  - Normal Tickets: +1 at 5 tasks, +1 at 10 tasks (cap 2/day).
  - Golden Tickets: +1 per **Impossible Task** completion (manual flag per task).
- **Gacha Pull**:
  - Normal Pool → outputs a text card (uses rarity table below).
  - Golden Pool → advances **one selected AU** linearly (or starts new if none active).
- **Recordbook**:
  - **Daily Log**: timeline of Normal draws.
  - **AU Collection**: list of AUs (locked → "???????"); shows unlocked stages in order.
- **Local Save**: Persist to `localStorage` / `IndexedDB`. No login required.

### Non-Goals (Phase 1)
- No backend, no payments, no room editor, no cosmetics.

---

## Phase 2 — Progression & Flavor
- **Levels/Promotions**:
  - EXP → Level; per character mini-promotion snippets on thresholds.
  - Capped real jobs in canon (e.g., Jaehyun Team Lead, Minkyu Senior Accountant).
- **Daily Fun Goals** (text-only):
  - 5 tasks → “Kiss” counter ++ (purely for logs)
  - 10 tasks → “Fuck” counter ++ (purely for logs)
  - Optional impossible → “Impreg” ++ (Omegaverse meme)
- **Axis Weekly Report** (flavor only):
  - Rank S–F based on weekly tasks; sassy text only (no mechanical impact).

---

## Phase 3 — Cosmetics & Light Rooms (Optional)
- **Room Tab**: Single static background per character; no physics.
- **Furniture Placers**: Text-only names (e.g., “Sofa (Gray) placed” in log). Actual visual items can come later.
- **Seasonal Packs**: Add limited textual collectibles.

---

## Phase 4 — Monetization (When/If Needed)
- **Subscription (Optional)**: $3–5/mo → seasonal packs included, extra Normal Ticket per day, vanity badges. No story skips.
- **Premium Currency (Diamonds)**: Weekly boosters (Gold/EXP multipliers; streak saver). Cannot purchase story directly.
- **Paid DLC**: Side Storybooks/AUs; cosmetic room themes when visuals exist.

> Monetization is disabled by default until retention is proven.

---

## Data Structures

### Task (local)
```json
{
  "id": "uuid",
  "title": "string",
  "energy": "low|mid|high",
  "isImpossible": false,
  "isDone": false,
  "completedAt": 1733318400000
}
```

### Tickets (local)
```json
{
  "normal": 2,
  "golden": 1,
  "lastDailyReset": "2025-10-04"
}
```

### Recordbook (local)
```json
{
  "dailyLog": [
    {"date":"2025-10-04","ticket":"normal","cardId":"C-023"}
  ],
  "aus": {
    "omegaverse": {"unlocked": true, "stage": 3, "history": [1,2,3]},
    "debt": {"unlocked": true, "stage": 1, "history": [1]}
  }
}
```

### Pools
```json
{
  "cards": { "common": [...], "rare": [...], "super": [...], "ultra": [...] },
  "aus": {
    "omegaverse": ["Line 1", "Line 2", "Line 3"],
    "debt": ["Line 1", "Line 2"]
  }
}
```

---

## Gacha Design

### Rarities & Drop Rates
| Rarity | Length | Pool Size | Normal Ticket | Golden Ticket |
|---|---|---:|---:|---:|
| ⭐️ Common | 1–3 sentences | ~60 | **70%** | 20% |
| 💎 Rare | 7–10 sentences | ~25 | **20%** | 40% |
| 🔥 Super Rare | 2 paragraphs | ~10 | **8%** | 30% |
| 🌈💀 Ultra Rare | ~500+ words | ~5 | **2%** | 10% |

> Golden Ticket pulls can optionally bypass the card pool and strictly progress an AU. If using card mode for Golden, use the rightmost rates.

### AU Progression Logic (Golden Ticket default)
1. If **no active AU**, choose a random AU to start; set stage = 1.
2. If active AU exists and **stage < max**, advance `stage += 1`.
3. If `stage == max`, randomly start a new AU (not yet complete).
4. AU entries are **linear** per AU (no spoilers out of order).

### Daily Ticket Logic
- Award up to **2 Normal Tickets/day** at 5 and 10 completed tasks.
- A day = local midnight to midnight; reset counters at midnight.

---

## AU Starter List (20 Themes)
1) Omegaverse AU  
2) Debt AU  
3) Mafia AU  
4) Birdman AU  
5) College AU  
6) High School AU  
7) Streamer AU  
8) Catboy AU  
9) CEO Rival AU  
10) Fantasy AU  
11) Vampire AU  
12) Fake Marriage AU  
13) Servant/Butler AU  
14) Roommates AU  
15) Runaway AU  
16) Office Romance AU  
17) Ghost/Haunting AU  
18) Royalty AU  
19) Pirate AU  
20) Apocalypse AU  

> Each AU targets **~20 lines** for a 1‑month completion pace (assuming 15–20 Golden Tickets/month via impossible tasks + streak/event bonuses).

---

## Sample Cursed Card Pack (for Normal Tickets)
- **Common (⭐️)**: 3 sentences jokes. (e.g., Yuwon trips; Noah catches; Jaehyun complains.)
- **Rare (💎)**: 7–10 sentence mini-premises. (e.g., IQ 200 Yuwon trades brains for Noah’s holy—)
- **Super Rare (🔥)**: 2 paragraphs (HR policy meltdown; apocalypse Tuesday; etc.)
- **Ultra Rare (🌈💀)**: ~500+ words short ficlet jackpots.

> Maintain JSON files per rarity; support seasonal appends (e.g., `cards_halloween_2025.json`).

---

## Promotions with Mini-Stories (Flavor)
- **Canon caps** respected (e.g., Jaehyun Team Lead; Minkyu Senior Accountant). Promotions replay their early career as mini-scenes.
- Example tiers:  
  - **Yuwon**: Intern → Junior → Senior → Creative Mgr → “Graphic design is my passion.”  
  - **Noah**: Trainee → PM → Sr. Mgr → Director → CEO.  
  - **Minkyu**: Intern → Coordinator → Manager → **Senior Accountant (cap)**.  
  - **Jaehyun**: Intern → Specialist → **Team Lead (cap)**.  

Each threshold shows a 2–5 sentence scene (text-only Phase 2).

---

## Axis Corp Flavor Systems (Optional)
- **Weekly Report**: S–F grade based on weekly tasks; sassy dialogue only.
- **Reputation**: cosmetic stat; if too many Impossible Tasks in a row, HR memos appear.
- **Daily Fun Stat**: kiss/fuck/impreg counters (logs only; no EXP impact).

---

## Tech Plan
- **Frontend**: Vite + React + TypeScript + Tailwind (your current stack).
- **State**: Zustand or Redux Toolkit (simple slices: tasks, tickets, pools, recordbook).
- **Persistence**: LocalStorage for now; IndexedDB (Dexie) if needed for larger text pools.
- **Time**: Use `dayjs`/`date-fns` for local midnight resets.
- **Internationalization**: Plan keys for later, but hardcode EN first.

> Backend (Firebase/Supabase) only after we prove retention. Add Auth + cloud sync later.

---

## File/Content Organization
```
/content
  /cards
    common.json
    rare.json
    super.json
    ultra.json
  /aus
    omegaverse.json
    debt.json
    mafia.json
    ...
  /seasonal
    halloween_2025.json
    xmas_2025.json
```

---

## UX Flows
1. **Complete Task → Ticket Award Toast**
2. **Gacha Screen → Pull Button → Result Modal → “Add to Recordbook” CTA**
3. **Recordbook**: tabs for Daily Log vs AU Collection; locked entries show “??????”.
4. **AU Progress**: Golden pull auto-advances active AU; progress bar (e.g., 7/20).

---

## Milestones & Scope Control
- **M1 (Week 1)**: MVP tasks, daily reset, ticket wallet, Normal gacha with Common/Rare pools, daily log.  
- **M2 (Week 2)**: Golden gacha with 1 AU (linear), AU Collection tab.  
- **M3 (Week 3)**: Add Rare/Super/Ultra pools; 50 starter cards; 3 AUs.  
- **M4 (Week 4)**: Promotions mini-scenes; kiss/fuck counters; Weekly Report flavor.

> Freeze scope per milestone. New ideas = backlog only.

---

## Backlog (After Month 1)
- Seasonal packs & streak bonuses (bonus Golden ticket at 10‑day streak).
- Room backgrounds (static) with textual furniture placements.
- Cosmetic store (text unlocks first; visuals later).
- Share/export Recordbook (image export).
- Cloud sync/auth.

---

## QA & Telemetry (No Backend Edition)
- Add a **debug panel** (hidden) to view: task counts, ticket counts, last reset time.
- Add **seed controls** to test gacha odds locally.
- Optional: opt‑in anonymous metrics via local file export (players can share logs for feedback).

---

## Writing Guidelines
- **Tone**: playful, non‑judgmental, meme‑aware.
- **Boundaries**: respect user’s triggers (e.g., bottom never tops, keep dynamics consistent).
- **Length Targets**: Common ≤ 3 sentences; Rare 7–10; Super 2 paragraphs; Ultra ~500+ words.
- **Localization Ready**: Store text as arrays of strings; avoid hardcoded line breaks.

---

## Definition of Done (Phase 1–2)
- Player can: add/complete tasks → earn tickets → pull gacha → see logs → advance one AU linearly.
- All data persists locally; survives refresh.
- Midnight reset works correctly for Asia/Jakarta.

---

## Risk Mitigation
- **Scope Creep**: hard milestone gates; anything new → backlog.
- **Burnout**: text‑only first; no art required. Ship tiny wins weekly.
- **Piracy**: personalization via logs/collections reduces value of reposts; Ultra cards rotate seasonally.

---

## Hand‑off Notes for Claude
- Start with data-first architecture (JSON pools + local state).
- Implement deterministic RNG with seed per day for reproducible pulls if needed.
- Build Recordbook screens before any art/cosmetics.
- Keep functions pure and testable (ticket award, AU advance, rarity roll).

---

**End of Plan**

