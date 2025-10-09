# Known Issues & Bugs

This document tracks current bugs, issues, and needed fixes for Exploding Employees.

## 🐛 Critical Bugs

### Employee Morale System
**Status**: 🔴 Needs Investigation

**Issues:**
1. Employee ranks (S/A/B/C/F) may show incorrect values
2. Energy display might not match actual energy consumption
3. "Days worked" calculation may be off
4. Rest system may not properly reset energy calculations

**Affected Employees:**
- All employees, but especially Noah's recurring task tracking

**Potential Causes:**
- Energy calculation logic in `getMoraleStatus()` function
- Date comparison issues when checking "today's tasks"
- Rest timestamp not being properly considered
- Completed tasks not being filtered correctly by date

**Next Steps:**
- [ ] Add debug logging to `getMoraleStatus()` function
- [ ] Verify energy calculation logic matches documentation
- [ ] Test rest system thoroughly
- [ ] Check date comparison logic for timezone issues

---

### Finance Task Display
**Status**: 🟡 Minor Issue

**Issue:** Finance tasks with negative amounts might not display correctly in some views

**Workaround:** Manually add "-" to the task name

**Fix Needed:** Ensure amount is formatted as currency with +/- sign

---

## 🔧 Needed Features

### Recurring Task Auto-Regeneration
**Status**: 🟡 Planned Feature

**Current Behavior:** Recurring tasks are deleted when completed (like daily tasks)

**Expected Behavior:**
- Recurring tasks should regenerate based on schedule
- Daily tasks → reappear next day
- Weekly tasks → reappear on specified day
- Monthly tasks → reappear on specified date

**Implementation Notes:**
- Need to add "next due date" field to recurring tasks
- Check at midnight if any recurring tasks should regenerate
- Keep original task in tasks array, only log completion

---

### Card Drop Notification
**Status**: 🟢 Could Be Enhanced

**Current:** Card drop notification shows briefly when card is dropped

**Enhancement Ideas:**
- Sound effect when card drops
- Animation for card reveal
- "New Card!" indicator on Vanity page
- Gallery view with card rarity tiers

---

## 🎨 UI/UX Issues

### Mobile Responsiveness
**Status**: 🟡 Needs Testing

**Issue:** App may not be fully responsive on mobile devices

**Areas to Check:**
- Room page furniture editor
- Calendar on Record page
- Task list on Dashboard
- Navigation bar

---

### Loading States
**Status**: 🟡 Enhancement

**Issue:** No loading states when data is being saved/loaded

**Enhancement:** Add loading spinners or skeleton screens

---

## 📊 Data & Performance

### localStorage Limits
**Status**: 🟡 Potential Future Issue

**Issue:** localStorage has 5-10MB limit per domain

**Current Status:** Likely fine for now, but could hit limits with:
- Thousands of completed tasks
- Many unlocked AU books
- Large card collection

**Mitigation:**
- Implement data archiving (move old completed tasks to separate storage)
- Add "Clear old data" feature
- Consider IndexedDB for larger data storage

---

### Date Timezone Issues
**Status**: 🔴 Needs Verification

**Issue:** Date comparisons may have timezone bugs

**Symptoms:**
- Tasks completed at 11 PM might show as "tomorrow"
- "Today's tasks" might include yesterday's tasks
- Consistency rank might count wrong days

**Fix Needed:**
- Ensure all dates use `.setHours(0, 0, 0, 0)` for day-only comparisons
- Test around midnight
- Consider using a date library (date-fns or day.js)

---

## 🔐 Data Safety

### No Data Export
**Status**: 🟡 Should Add

**Issue:** Users can't export their data

**Risk:** If localStorage is cleared, all data is lost

**Solution:**
- Add "Export Data" button (downloads JSON file)
- Add "Import Data" button (uploads JSON file)
- Consider cloud backup option

---

## 🧪 Testing

### No Automated Tests
**Status**: 🟡 Would Be Nice

**Current:** No unit tests, integration tests, or E2E tests

**High Priority Test Areas:**
- Employee morale calculation logic
- Task completion and reward system
- Energy calculation
- Currency conversion (Won → YuCash)

---

## 📝 Documentation

### Missing Documentation
**Status**: 🟢 In Progress

**Completed:**
- ✅ Task System docs
- ✅ Employee Morale docs
- ✅ Issues tracking (this file)

**Still Needed:**
- [ ] Currency system docs
- [ ] Card collection docs
- [ ] Gacha system docs
- [ ] Cooking system docs
- [ ] Room system docs
- [ ] Data structure docs
- [ ] Component architecture docs

---

## 🚀 Reporting Issues

If you encounter a bug:

1. Check if it's already listed here
2. Try to reproduce the bug
3. Note steps to reproduce
4. Check browser console for errors
5. Document expected vs actual behavior
6. Add to this file or create GitHub issue

**Helpful Debug Info:**
- Browser & version
- What you were doing when bug occurred
- localStorage data (if relevant)
- Console error messages
- Screenshots (if UI bug)

---

## 🔄 Recently Fixed

*(Will add items here as bugs are fixed)*

### Noah Rank Calculation
**Fixed**: 2025-10-09

**Issue:** Noah always showing F rank despite completing recurring tasks

**Cause:** Logic was checking if recurring tasks were "due" in past days by looking at current pending tasks, which was flawed

**Fix:** Changed to check if recurring tasks were actually completed on each day (same as other employees)

---

*Last Updated: 2025-10-09*
