# CalCam-Inspired UI Implementation

## Overview

Implemented a CalCam-inspired home screen layout for the coach app, featuring a clean, data-focused design that shows users their daily progress at a glance.

## Components Created

### 1. CircularProgress (`components/dashboard/CircularProgress.tsx`)
- **Purpose**: Display progress in a circular ring format
- **Features**:
  - Customizable size, stroke width, and colors
  - Supports custom center content
  - Smooth SVG-based rendering
  - Used for main calorie tracking ring

### 2. MacroCard (`components/dashboard/MacroCard.tsx`)
- **Purpose**: Show individual macro nutrient progress (carbs, protein, fat)
- **Features**:
  - Circular progress indicator
  - Current vs target values
  - Color-coded by macro type
  - Icon support for visual identification

### 3. DateSelector (`components/dashboard/DateSelector.tsx`)
- **Purpose**: Week view date picker similar to CalCam
- **Features**:
  - Horizontal scrollable week view
  - Shows 7 days (3 before, today, 3 after)
  - Highlights today with "Today" label
  - Selected date has filled circle
  - Smooth touch interactions

### 4. ActivityLogCard (`components/dashboard/ActivityLogCard.tsx`)
- **Purpose**: Display logged workouts and meals
- **Features**:
  - Type-based icons and colors
  - Time stamp
  - Calorie display
  - Detailed metrics (duration, distance, macros)
  - Touch-enabled for navigation

## Layout Structure

### Header
- **App title**: "CoachApp"
- **Subtitle**: Current goal or tagline
- **Streak badge**: Fire emoji with current streak count

### Date Selector
- Horizontal scrollable week view
- Easy date navigation

### Today's Plan
- Shows active goal
- Task completion progress

### Main Progress Ring
- **Center**: Calories remaining (large number)
- **Left**: Calories eaten
- **Right**: Calories burned
- **Ring**: Visual progress toward calorie goal

### Macros Section
- Three cards side-by-side
- Carbs (blue), Protein (red), Fat (orange)
- Each shows current/target with circular progress

### Recently Logged
- **Filter tabs**: All, Workouts, Meals
- **Activity cards**: List of logged items with details
- **Empty state**: Friendly message when no activities

### Floating Action Button (FAB)
- Orange circular button with + icon
- Fixed at bottom center
- Quick access to log screen

## Key Design Decisions

### Colors
- **Primary action**: `#FF6B35` (orange) - matches CalCam's energy
- **Carbs**: `#3B82F6` (blue)
- **Protein**: `#EF4444` (red)
- **Fat**: `#F59E0B` (amber)
- **Streak badge**: Yellow background with brown text

### Typography
- **Large numbers**: Bold, 48-56px for key metrics
- **Section titles**: 20px, bold
- **Body text**: 14-16px
- **Labels**: 12-14px, reduced opacity

### Spacing
- Consistent 20px horizontal padding
- 24px vertical spacing between sections
- 12-16px gaps within components

### Interactions
- Pull-to-refresh on main scroll view
- Tap to select dates
- Filter buttons for activity types
- FAB for quick logging

## Data Integration

### Current Implementation
The UI uses **mock data** for demonstration:
```typescript
const caloriesTarget = 2000;
const caloriesConsumed = 1320;
const caloriesBurned = 294;
const macros = {
  carbs: { current: 115, target: 247 },
  protein: { current: 118, target: 110 },
  fat: { current: 41, target: 85 },
};
```

### Backend Integration Needed
To make this fully functional, implement these backend endpoints:

1. **GET `/api/nutrition/daily-summary`**
   ```json
   {
     "date": "2025-10-31",
     "calories_target": 2000,
     "calories_consumed": 1320,
     "calories_burned": 294,
     "macros": {
       "carbs": { "current": 115, "target": 247 },
       "protein": { "current": 118, "target": 110 },
       "fat": { "current": 41, "target": 85 }
     }
   }
   ```

2. **GET `/api/activities/recent?date=YYYY-MM-DD`**
   - Returns workouts and meals for selected date
   - Already partially working with existing hooks

3. **GET `/api/nutrition/targets`**
   - User's personalized macro targets
   - Based on goals and body metrics

## Dependencies

### New Package
- `react-native-svg` - For circular progress rings
  - Installed via: `npm install react-native-svg`

### Existing Packages
- All other dependencies already in project
- Uses existing hooks for data fetching
- Leverages themed components

## Usage

The new UI is now the default home screen at `app/(tabs)/today.tsx`. Users will see:

1. Their daily calorie and macro progress
2. A week view to navigate different dates
3. Their logged activities with filtering
4. Quick access to log new activities via FAB

## Future Enhancements

### Short Term
- [ ] Connect to real nutrition API
- [ ] Add date-based data filtering
- [ ] Implement activity detail view
- [ ] Add edit/delete for logged items

### Medium Term
- [ ] Animated progress transitions
- [ ] Weekly/monthly view toggle
- [ ] Nutrition insights and tips
- [ ] Photo logging for meals

### Long Term
- [ ] AI-powered meal recognition
- [ ] Integration with fitness trackers
- [ ] Social sharing features
- [ ] Gamification elements

## Testing

### Manual Testing Checklist
- [x] Date selector scrolls smoothly
- [x] Filter buttons toggle correctly
- [x] FAB navigates to log screen
- [x] Pull-to-refresh works
- [x] Empty states display properly
- [x] Dark mode compatibility
- [ ] Real data integration
- [ ] Performance with large activity lists

## Files Modified/Created

### Created
1. `components/dashboard/CircularProgress.tsx`
2. `components/dashboard/MacroCard.tsx`
3. `components/dashboard/DateSelector.tsx`
4. `components/dashboard/ActivityLogCard.tsx`
5. `docs/CALCAM_INSPIRED_UI.md` (this file)

### Modified
1. `app/(tabs)/today.tsx` - Complete redesign with new layout
2. `package.json` - Added `react-native-svg` dependency

## Screenshots

The new UI closely matches CalCam's design philosophy:
- **Clean and minimal** - Focus on data, not decoration
- **Circular progress** - Visual and intuitive
- **Easy navigation** - Date selector and filters
- **Quick actions** - FAB for fast logging
- **Information hierarchy** - Most important data (calories) is largest

---

**Implementation Date**: October 31, 2025  
**Status**: ✅ Complete (UI only, backend integration pending)
