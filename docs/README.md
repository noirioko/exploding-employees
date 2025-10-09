# Exploding Employees - Documentation

Welcome to the Exploding Employees documentation! This is a gamified productivity app where you manage tasks through four employee characters.

## 📚 Documentation Index

### Core Systems
- [Task System](./task-system.md) - Task types, energy levels, and completion mechanics
- [Employee Morale & Performance](./employee-morale.md) - How employees work, morale, energy, and rankings
- [Currency & Economy](./currency-system.md) - Won, YuCash, Noah Credit Card, and paycheck system
- [Experience & Progression](./experience-system.md) - XP earning and leveling

### Game Features
- [Card Collection](./card-collection.md) - Collecting office cards from task drops
- [Gacha & AU Books](./gacha-system.md) - Rolling for AU books and revealing story snippets
- [Cooking & Gifts](./cooking-system.md) - Cooking dishes and giving gifts to employees
- [Friendship System](./friendship-system.md) - Building relationships with employees
- [Stamp System](./stamp-system.md) - Achievement stamps and milestones
- [Room System](./room-system.md) - Room customization, furniture, and character walking

### Pages & UI
- [Dashboard](./pages-dashboard.md) - Main task management interface
- [Company Page](./pages-company.md) - Employee status and company performance
- [Record Page](./pages-record.md) - Completed tasks history and budget tracking
- [Vanity Page](./pages-vanity.md) - Card collection viewer
- [Library Page](./pages-library.md) - AU Books reading interface
- [Store Page](./pages-store.md) - Shopping for ingredients and gacha
- [Room Page](./pages-room.md) - Room editor and character interactions

### Technical Documentation
- [Data Structures](./data-structures.md) - localStorage schema and state management
- [Constants & Configuration](./constants.md) - Game balance and configuration values
- [Component Architecture](./architecture.md) - App structure and component overview

## 🚀 Quick Start

1. **Create Tasks**: Add tasks on the Dashboard - they're auto-assigned to employees based on type
2. **Complete Tasks**: Check off tasks to earn EXP and Won currency
3. **Manage Morale**: Keep employees happy by balancing workload and taking breaks
4. **Collect Cards**: Random card drops from task completion
5. **Explore Features**: Use earned currency to unlock gacha, cooking, and more!

## 🎮 Game Loop

```
Create Tasks → Complete Tasks → Earn Rewards (EXP + Won) → Manage Employee Morale
     ↓              ↓                    ↓                        ↓
Auto-assigned   Card Drops      Convert Won to YuCash    Take breaks when needed
to employees    (random)        via Paycheck button            ↓
                                                        Unlock more features!
```

## 📝 Contributing to Docs

When adding new features, please update the relevant documentation files. If you're adding a major new system, create a new `.md` file in the `docs/` folder and link it in this README.

## 🐛 Known Issues

See [ISSUES.md](./ISSUES.md) for current bugs and planned fixes.

---

## 📁 Documentation Files

Here's what each documentation file covers:

### Core Systems
- **task-system.md** - Complete guide to all 5 task types, energy levels, and completion mechanics
- **employee-morale.md** - How employees work, mood calculations, energy system, and performance ranks
- **currency-system.md** - Won, YuCash, Noah Credit Card, and the economy flow
- **experience-system.md** - (Coming soon) XP and leveling system

### Game Features
- **card-collection.md** - Card drops, collection progress, and rarity system
- **gacha-system.md** - AU book gacha, rolling mechanics, and snippet unlocking
- **cooking-system.md** - Ingredients, recipes, cooking, and gifting dishes
- **friendship-system.md** - (Covered in cooking-system.md) Building relationships with employees
- **stamp-system.md** - Achievement stamps, collection, and rewards
- **room-system.md** - Room customization, furniture placement, and character interactions

### Technical Documentation
- **data-structures.md** - Complete localStorage schema, type definitions, and data flow
- **constants.md** - Game balance values, configuration, and tuning guide
- **architecture.md** - (Coming soon) Component structure and code organization

### Other
- **ISSUES.md** - Known bugs, planned fixes, and feature requests

---

## 🎯 For New Contributors

If you're new to the codebase:

1. **Start here:** Read `task-system.md` and `employee-morale.md` to understand the core gameplay
2. **Understand the data:** Check `data-structures.md` to see how everything is stored
3. **Check for issues:** Look at `ISSUES.md` to see known problems and planned features
4. **Explore features:** Read the individual feature docs for systems you want to work on
5. **Tune values:** Use `constants.md` to understand game balance

---

## 🔧 For Players

If you just want to play:

- **Quick Start**: See the main README above
- **How Things Work**: Read `task-system.md` and `employee-morale.md`
- **Troubleshooting**: Check `ISSUES.md` for known bugs
- **Advanced Strategies**: Each feature doc has a "Tips" section

---

## 📝 Maintenance

**Documentation Status:**
- ✅ Complete: Task System, Employee Morale, Currency, Card Collection, Gacha, Cooking, Stamp, Room, Data Structures, Constants, Issues
- ⏳ In Progress: None
- 📋 Planned: Experience System, Architecture, Page-specific guides

**Last Updated:** October 9, 2025
