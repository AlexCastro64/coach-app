# Backend Integration Guide for CalCam-Inspired UI

## Overview
This guide explains what backend endpoints and data structures are needed to fully integrate the new home screen UI.

## Required Endpoints

### 1. Daily Nutrition Summary
**Endpoint**: `GET /api/nutrition/daily-summary`

**Query Parameters**:
```typescript
{
  date?: string; // YYYY-MM-DD format, defaults to today
}
```

**Response**:
```typescript
{
  date: string;
  calories: {
    target: number;        // User's daily calorie goal
    consumed: number;      // Total from meals
    burned: number;        // Total from workouts
    remaining: number;     // target - consumed + burned
  };
  macros: {
    carbs: {
      current: number;     // Grams consumed
      target: number;      // Daily goal in grams
      calories: number;    // carbs * 4
    };
    protein: {
      current: number;
      target: number;
      calories: number;    // protein * 4
    };
    fat: {
      current: number;
      target: number;
      calories: number;    // fat * 9
    };
  };
  updated_at: string;      // Last calculation time
}
```

**Example Response**:
```json
{
  "date": "2025-10-31",
  "calories": {
    "target": 2000,
    "consumed": 1320,
    "burned": 294,
    "remaining": 974
  },
  "macros": {
    "carbs": {
      "current": 115,
      "target": 247,
      "calories": 460
    },
    "protein": {
      "current": 118,
      "target": 110,
      "calories": 472
    },
    "fat": {
      "current": 41,
      "target": 85,
      "calories": 369
    }
  },
  "updated_at": "2025-10-31T13:41:00Z"
}
```

### 2. User Nutrition Targets
**Endpoint**: `GET /api/users/me/nutrition-targets`

**Response**:
```typescript
{
  daily_calories: number;
  macros: {
    carbs_g: number;
    protein_g: number;
    fat_g: number;
  };
  calculation_method: 'manual' | 'tdee' | 'coach_set';
  last_updated: string;
}
```

**Example Response**:
```json
{
  "daily_calories": 2000,
  "macros": {
    "carbs_g": 247,
    "protein_g": 110,
    "fat_g": 85
  },
  "calculation_method": "tdee",
  "last_updated": "2025-10-25T10:00:00Z"
}
```

### 3. Update Nutrition Targets
**Endpoint**: `PUT /api/users/me/nutrition-targets`

**Request Body**:
```typescript
{
  daily_calories?: number;
  macros?: {
    carbs_g?: number;
    protein_g?: number;
    fat_g?: number;
  };
}
```

## Calculation Logic

### Calorie Consumption
```python
def calculate_daily_calories_consumed(user_id: str, date: str) -> int:
    """
    Sum all meal calories for the given date.
    Use AI-estimated macros from meal photos.
    """
    meals = get_meals_for_date(user_id, date)
    total = 0
    
    for meal in meals:
        if meal.ai_feedback and meal.ai_feedback.macro_estimate:
            total += meal.ai_feedback.macro_estimate.calories
    
    return total
```

### Calorie Burn
```python
def calculate_daily_calories_burned(user_id: str, date: str) -> int:
    """
    Sum all workout calories for the given date.
    Use actual logged values or estimate from duration/type.
    """
    workouts = get_workouts_for_date(user_id, date)
    total = 0
    
    for workout in workouts:
        if workout.actual.calories:
            total += workout.actual.calories
        else:
            # Estimate based on workout type and duration
            total += estimate_calories(workout)
    
    return total

def estimate_calories(workout: WorkoutLog) -> int:
    """
    Rough estimates per hour by activity type.
    Should be refined based on user weight, intensity, etc.
    """
    CALORIES_PER_HOUR = {
        'run': 600,
        'ride': 500,
        'swim': 550,
        'strength': 400,
        'yoga': 200,
        'pilates': 300,
        'hiit': 700,
        'walk': 250,
        'other': 400,
    }
    
    duration_hours = workout.actual.duration_min / 60
    base_rate = CALORIES_PER_HOUR.get(workout.type, 400)
    
    # Adjust for RPE if available
    if workout.actual.rpe:
        intensity_multiplier = workout.actual.rpe / 5  # 0.2 to 2.0
        base_rate *= intensity_multiplier
    
    return int(base_rate * duration_hours)
```

### Macro Totals
```python
def calculate_daily_macros(user_id: str, date: str) -> dict:
    """
    Sum macros from all meals for the given date.
    """
    meals = get_meals_for_date(user_id, date)
    
    totals = {
        'carbs_g': 0,
        'protein_g': 0,
        'fat_g': 0,
    }
    
    for meal in meals:
        if meal.ai_feedback and meal.ai_feedback.macro_estimate:
            macros = meal.ai_feedback.macro_estimate
            totals['carbs_g'] += macros.carbs_g
            totals['protein_g'] += macros.protein_g
            totals['fat_g'] += macros.fat_g
    
    return totals
```

### Macro Targets
```python
def calculate_macro_targets(user: User) -> dict:
    """
    Calculate macro targets based on calorie goal and user preferences.
    Default split: 50% carbs, 25% protein, 25% fat
    """
    daily_calories = user.nutrition_targets.daily_calories or 2000
    
    # Get user's macro split or use defaults
    carb_pct = user.nutrition_targets.carb_percentage or 0.50
    protein_pct = user.nutrition_targets.protein_percentage or 0.25
    fat_pct = user.nutrition_targets.fat_percentage or 0.25
    
    return {
        'carbs_g': int((daily_calories * carb_pct) / 4),      # 4 cal/g
        'protein_g': int((daily_calories * protein_pct) / 4), # 4 cal/g
        'fat_g': int((daily_calories * fat_pct) / 9),         # 9 cal/g
    }
```

## Database Schema Updates

### User Nutrition Targets Table
```sql
CREATE TABLE user_nutrition_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    daily_calories INTEGER NOT NULL,
    carbs_g INTEGER NOT NULL,
    protein_g INTEGER NOT NULL,
    fat_g INTEGER NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### Daily Nutrition Cache Table (Optional)
```sql
CREATE TABLE daily_nutrition_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    calories_consumed INTEGER NOT NULL,
    calories_burned INTEGER NOT NULL,
    carbs_g DECIMAL(10,2) NOT NULL,
    protein_g DECIMAL(10,2) NOT NULL,
    fat_g DECIMAL(10,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Index for fast lookups
CREATE INDEX idx_daily_nutrition_user_date 
ON daily_nutrition_cache(user_id, date DESC);
```

## Frontend Integration

### 1. Create Service
**File**: `services/nutrition.service.ts`

```typescript
import { apiClient } from './api.client';

export interface DailyNutritionSummary {
  date: string;
  calories: {
    target: number;
    consumed: number;
    burned: number;
    remaining: number;
  };
  macros: {
    carbs: { current: number; target: number; calories: number };
    protein: { current: number; target: number; calories: number };
    fat: { current: number; target: number; calories: number };
  };
  updated_at: string;
}

export interface NutritionTargets {
  daily_calories: number;
  macros: {
    carbs_g: number;
    protein_g: number;
    fat_g: number;
  };
  calculation_method: 'manual' | 'tdee' | 'coach_set';
  last_updated: string;
}

export const NutritionService = {
  async getDailySummary(date?: string): Promise<DailyNutritionSummary> {
    const params = date ? { date } : {};
    const response = await apiClient.get('/nutrition/daily-summary', { params });
    return response.data;
  },

  async getTargets(): Promise<NutritionTargets> {
    const response = await apiClient.get('/users/me/nutrition-targets');
    return response.data;
  },

  async updateTargets(targets: Partial<NutritionTargets>): Promise<NutritionTargets> {
    const response = await apiClient.put('/users/me/nutrition-targets', targets);
    return response.data;
  },
};
```

### 2. Create Hook
**File**: `hooks/use-nutrition.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionService } from '@/services/nutrition.service';

export const nutritionKeys = {
  all: ['nutrition'] as const,
  summary: (date?: string) => [...nutritionKeys.all, 'summary', date] as const,
  targets: () => [...nutritionKeys.all, 'targets'] as const,
};

export function useDailyNutritionSummary(date?: string) {
  return useQuery({
    queryKey: nutritionKeys.summary(date),
    queryFn: () => NutritionService.getDailySummary(date),
    staleTime: 60_000, // 1 minute
  });
}

export function useNutritionTargets() {
  return useQuery({
    queryKey: nutritionKeys.targets(),
    queryFn: () => NutritionService.getTargets(),
    staleTime: 300_000, // 5 minutes
  });
}

export function useUpdateNutritionTargets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NutritionService.updateTargets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.all });
    },
  });
}
```

### 3. Update today.tsx
**File**: `app/(tabs)/today.tsx`

Replace mock data section with:

```typescript
// Remove mock data
const { data: nutritionSummary, isLoading: nutritionLoading } = useDailyNutritionSummary(
  selectedDate.toISOString().split('T')[0]
);

// Use real data
const caloriesTarget = nutritionSummary?.calories.target || 2000;
const caloriesConsumed = nutritionSummary?.calories.consumed || 0;
const caloriesBurned = nutritionSummary?.calories.burned || 0;
const caloriesRemaining = nutritionSummary?.calories.remaining || caloriesTarget;

const macros = {
  carbs: {
    current: nutritionSummary?.macros.carbs.current || 0,
    target: nutritionSummary?.macros.carbs.target || 247,
    color: '#3B82F6',
  },
  protein: {
    current: nutritionSummary?.macros.protein.current || 0,
    target: nutritionSummary?.macros.protein.target || 110,
    color: '#EF4444',
  },
  fat: {
    current: nutritionSummary?.macros.fat.current || 0,
    target: nutritionSummary?.macros.fat.target || 85,
    color: '#F59E0B',
  },
};
```

## Testing

### Manual Testing
1. **Create test user** with nutrition targets
2. **Log meals** with AI estimates
3. **Log workouts** with durations
4. **Verify calculations** match expectations
5. **Test date navigation** loads correct data
6. **Check cache performance** for repeated requests

### API Testing
```bash
# Get daily summary
curl -X GET "http://localhost:8000/api/nutrition/daily-summary?date=2025-10-31" \
  -H "Authorization: Bearer {token}"

# Get targets
curl -X GET "http://localhost:8000/api/users/me/nutrition-targets" \
  -H "Authorization: Bearer {token}"

# Update targets
curl -X PUT "http://localhost:8000/api/users/me/nutrition-targets" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "daily_calories": 2200,
    "macros": {
      "carbs_g": 275,
      "protein_g": 120,
      "fat_g": 90
    }
  }'
```

## Performance Considerations

### Caching Strategy
1. **Cache daily summaries** - Recalculate only when meals/workouts change
2. **Invalidate on updates** - Clear cache when user logs activity
3. **Background jobs** - Pre-calculate for active users
4. **Redis caching** - Store frequently accessed data

### Optimization Tips
1. Use database indexes on user_id and date
2. Batch calculate for multiple dates
3. Cache macro targets (rarely change)
4. Use materialized views for aggregations
5. Implement pagination for activity lists

## Migration Plan

### Phase 1: Add Endpoints (Week 1)
- [ ] Create nutrition service
- [ ] Implement calculation logic
- [ ] Add API endpoints
- [ ] Write tests

### Phase 2: Database Updates (Week 1)
- [ ] Create nutrition targets table
- [ ] Add default targets for existing users
- [ ] Create cache table (optional)
- [ ] Add indexes

### Phase 3: Frontend Integration (Week 2)
- [ ] Create nutrition service
- [ ] Create React Query hooks
- [ ] Update today.tsx
- [ ] Test thoroughly

### Phase 4: Refinement (Week 2)
- [ ] Optimize calculations
- [ ] Add caching
- [ ] Monitor performance
- [ ] Gather user feedback

## Rollout Strategy

1. **Beta testing** with 10 users
2. **Monitor** API performance and accuracy
3. **Iterate** based on feedback
4. **Full rollout** to all users
5. **Continuous improvement** based on usage data

---

**Status**: Ready for Backend Implementation  
**Priority**: High  
**Estimated Effort**: 2 weeks  
**Dependencies**: Meal AI estimates, Workout logging
