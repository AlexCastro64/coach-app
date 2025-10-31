# Home Screen User Guide

## Overview
The home screen provides a comprehensive daily overview of your fitness journey, inspired by CalCam's clean, data-focused design.

## Screen Layout (Top to Bottom)

### 1. Header
```
┌─────────────────────────────────────┐
│ CoachApp              🔥 18         │
│ Your fitness journey                │
└─────────────────────────────────────┘
```
- **App Name**: CoachApp
- **Subtitle**: Your current goal or tagline
- **Streak Badge**: Fire emoji with your current streak count

### 2. Date Selector
```
┌─────────────────────────────────────┐
│  S   M   T   W   T   F   S          │
│ 26  27  28  29  30 (31)  1          │
│                     Today           │
└─────────────────────────────────────┘
```
- **Scrollable week view**: Shows 7 days
- **Today indicator**: Highlighted with "Today" label
- **Selected date**: Filled circle
- **Tap to switch**: View different days

### 3. Today's Plan
```
┌─────────────────────────────────────┐
│ Today's Plan                        │
│ ┌─────────────────────────────────┐ │
│ │ Lose weight, build muscle       │ │
│ │ 2 of 3 tasks completed          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Goal summary**: Your active goal
- **Task progress**: Completed vs total tasks

### 4. Main Progress Ring
```
┌─────────────────────────────────────┐
│                                     │
│  1320        ╱───╲        294       │
│  Eaten      │ 874 │      Burned     │
│             │ kcal│                 │
│             │Rem. │                 │
│              ╲───╱                  │
│                                     │
└─────────────────────────────────────┘
```
- **Center**: Calories remaining (large number)
- **Left**: Calories eaten today
- **Right**: Calories burned today
- **Ring**: Visual progress (black on gray)

### 5. Macro Cards
```
┌─────────────────────────────────────┐
│ ┌──────┐  ┌──────┐  ┌──────┐       │
│ │Carbs │  │Protein│ │ Fat  │       │
│ │115/  │  │118/   │ │41/   │       │
│ │247g  │  │110g   │ │85g   │       │
│ │  🌾  │  │  🥩   │ │  🥑  │       │
│ └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────┘
```
- **Three cards**: Carbs (blue), Protein (red), Fat (orange)
- **Progress rings**: Show current vs target
- **Emoji icons**: Visual identification

### 6. Recently Logged
```
┌─────────────────────────────────────┐
│ Recently Logged                     │
│                                     │
│ [All] [Workouts] [Meals]            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏃 12:27 PM                     │ │
│ │    Vegetable Bowl         150   │ │
│ │    30g 🥩 5g 🌾 1g 🥑     kcal  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🍽️ 10:15 AM                     │ │
│ │    Morning Run            294   │ │
│ │    ⏱️ 30min 📍 5km         kcal  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Filter tabs**: All, Workouts, Meals
- **Activity cards**: Show logged items
- **Details**: Time, title, calories, metrics
- **Icons**: Type-specific (workout/meal)

### 7. Floating Action Button
```
                    ┌───┐
                    │ + │  ← Orange circle
                    └───┘
```
- **Position**: Bottom center (above tab bar)
- **Action**: Opens log screen
- **Always visible**: Quick access to logging

## Color Guide

### Primary Colors
- **Orange (#FF6B35)**: Primary actions, FAB, active filters
- **Black (#000000)**: Main progress ring
- **Light Gray (#E5E7EB)**: Background rings, borders

### Macro Colors
- **Blue (#3B82F6)**: Carbs
- **Red (#EF4444)**: Protein
- **Orange (#F59E0B)**: Fat

### Status Colors
- **Yellow (#FEF3C7)**: Streak badge background
- **Brown (#92400E)**: Streak badge text
- **Green (#10B981)**: Success states
- **Gray (#6B7280)**: Secondary text

## Interactions

### Tap Actions
1. **Date circles**: Switch to that date
2. **Filter buttons**: Toggle activity filter
3. **Activity cards**: View details (future)
4. **FAB**: Open log screen
5. **Plan card**: View full plan (future)

### Gestures
1. **Pull down**: Refresh all data
2. **Horizontal scroll**: Navigate dates
3. **Vertical scroll**: Browse activities

## Data Sources

### Real-Time Data
- ✅ Workouts logged today
- ✅ Meals logged today
- ✅ Tasks completed
- ✅ Current streak
- ✅ Active goal

### Mock Data (Temporary)
- ⏳ Calorie targets
- ⏳ Macro targets
- ⏳ Calorie totals
- ⏳ Burn calculations

## Empty States

### No Activities
```
┌─────────────────────────────────────┐
│        📦                           │
│   No activities logged yet          │
│   Tap the + button below to log    │
│   your first activity               │
└─────────────────────────────────────┘
```

### No Plan
```
┌─────────────────────────────────────┐
│   Your fitness journey              │
│   (No active goal set)              │
└─────────────────────────────────────┘
```

## Tips for Users

### Getting Started
1. **Set your goal**: Talk to your coach
2. **Log activities**: Use the + button
3. **Check daily**: Review your progress
4. **Complete tasks**: Mark them as done
5. **Build streaks**: Stay consistent

### Best Practices
- **Log immediately**: Don't wait until end of day
- **Be accurate**: Helps with progress tracking
- **Review regularly**: Check your trends
- **Adjust targets**: Work with your coach
- **Celebrate wins**: Acknowledge your streaks

### Understanding Your Data

#### Calories Remaining
- **Positive number**: You can eat more
- **Negative number**: You've exceeded target
- **Accounts for**: Food eaten + exercise burned

#### Macro Progress
- **Under target**: Room to eat more
- **At target**: Perfect balance
- **Over target**: Exceeded for the day

#### Activity Log
- **Workouts**: Show duration, distance, intensity
- **Meals**: Show macros and calories
- **Time stamps**: When you logged it

## Troubleshooting

### Data Not Showing
1. Pull down to refresh
2. Check internet connection
3. Verify you're logged in
4. Contact support if persists

### Incorrect Totals
1. Review logged items
2. Check for duplicates
3. Verify meal estimates
4. Talk to your coach

### Performance Issues
1. Close and reopen app
2. Clear old data (settings)
3. Update to latest version
4. Report to support

## Keyboard Shortcuts (Future)

- **R**: Refresh data
- **L**: Open log screen
- **←/→**: Navigate dates
- **F**: Toggle filters

## Accessibility

- **VoiceOver**: Full support
- **Dynamic Type**: Text scales
- **High Contrast**: Supported
- **Reduced Motion**: Respects setting

---

**Last Updated**: October 31, 2025  
**Version**: 1.0  
**Feedback**: Contact your coach or support team
