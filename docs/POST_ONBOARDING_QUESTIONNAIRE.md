# Post-Onboarding Questionnaire Implementation

## Summary

Implemented a comprehensive questionnaire system that prompts users with questions after completing onboarding to help the coach create a personalized fitness plan.

## What Was Built

### 1. Type Definitions (`types/questionnaire.ts`)
- `Question` - Individual question with type, options, validation
- `QuestionnaireSection` - Grouped questions by topic
- `QuestionnaireTemplate` - Complete questionnaire structure
- `QuestionnaireResponse` - User's answer to a question
- `Questionnaire` - User's questionnaire instance with status

### 2. API Service (`services/questionnaire.service.ts`)
Methods for:
- Getting questionnaire template
- Starting new questionnaire
- Submitting responses progressively
- Completing questionnaire
- Checking if user needs questionnaire

### 3. React Query Hooks (`hooks/use-questionnaire.ts`)
- `usePlanQuestionnaireTemplate()` - Fetch template
- `useCurrentQuestionnaire()` - Get user's questionnaire
- `useNeedsQuestionnaire()` - Check completion status
- `useStartQuestionnaire()` - Initialize questionnaire
- `useSubmitResponses()` - Save answers
- `useCompleteQuestionnaire()` - Mark as done

### 4. Questionnaire Screen (`app/questionnaire/plan-creation.tsx`)
Full-featured questionnaire UI with:
- **Section-based navigation** - Questions grouped by topic
- **Progress tracking** - Visual progress bar showing completion
- **5 question types:**
  - Text input (multiline)
  - Number input
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - Scale (1-10 rating)
- **Auto-save** - Responses saved as user answers
- **Validation** - Required field checking
- **Help text** - Contextual guidance
- **Back navigation** - Review previous answers
- **Completion flow** - Redirect to dashboard when done

### 5. Questionnaire Guard (`components/questionnaire-guard.tsx`)
Automatic redirect logic:
- Checks if user needs questionnaire after onboarding
- Redirects to questionnaire if needed
- Prevents access to main app until complete

### 6. App Layout Integration (`app/_layout.tsx`)
- Added questionnaire route
- Integrated QuestionnaireGuard
- Handles navigation flow

### 7. Documentation (`docs/QUESTIONNAIRE_SETUP.md`)
Complete guide covering:
- Architecture overview
- Question types and examples
- Backend API requirements
- Example questionnaire structure
- Testing procedures
- Future enhancements

## User Flow

```
1. User completes onboarding (payment successful)
   ↓
2. System checks: needsQuestionnaire()
   ↓
3. If YES → Redirect to /questionnaire/plan-creation
   ↓
4. User answers questions section by section
   ↓
5. Responses auto-saved after each question
   ↓
6. User completes all sections
   ↓
7. Questionnaire marked complete
   ↓
8. Coach receives responses to create plan
   ↓
9. User redirected to /(tabs)/today
```

## Question Types Supported

### 1. Text Input
```typescript
{
  type: 'text',
  text: 'What are your fitness goals?',
  placeholder: 'e.g., Lose weight, build muscle...',
  required: true
}
```

### 2. Number Input
```typescript
{
  type: 'number',
  text: 'How many days per week can you train?',
  min_value: 1,
  max_value: 7,
  required: true
}
```

### 3. Single Choice
```typescript
{
  type: 'single_choice',
  text: 'What is your fitness level?',
  options: ['Beginner', 'Intermediate', 'Advanced'],
  required: true
}
```

### 4. Multiple Choice
```typescript
{
  type: 'multiple_choice',
  text: 'Which activities do you enjoy?',
  options: ['Running', 'Cycling', 'Swimming', 'Strength Training'],
  required: false
}
```

### 5. Scale (1-10)
```typescript
{
  type: 'scale',
  text: 'How motivated are you?',
  min_value: 1,
  max_value: 10,
  help_text: '1 = Not motivated, 10 = Extremely motivated',
  required: true
}
```

## Backend API Requirements

### Endpoints Needed

1. **GET `/api/questionnaires/plan-creation`**
   - Returns questionnaire template with sections and questions
   - Response: `QuestionnaireTemplate`

2. **GET `/api/questionnaires/needs-completion`**
   - Checks if user needs to complete questionnaire
   - Response: `{ needs_completion: boolean }`

3. **POST `/api/questionnaires/start`**
   - Creates new questionnaire instance for user
   - Response: `Questionnaire` with `id` and `status: 'in_progress'`

4. **POST `/api/questionnaires/{id}/responses`**
   - Saves user responses (called after each question)
   - Body: `{ responses: QuestionnaireResponse[] }`
   - Response: Updated `Questionnaire`

5. **POST `/api/questionnaires/{id}/complete`**
   - Marks questionnaire as completed
   - Triggers plan creation workflow
   - Response: `Questionnaire` with `status: 'completed'`

### Example Template Structure

```json
{
  "id": "plan-creation-v1",
  "title": "Build Your Personalized Plan",
  "description": "Help us create the perfect plan for you",
  "sections": [
    {
      "id": "fitness-background",
      "title": "Fitness Background",
      "description": "Tell us about your experience",
      "order": 1,
      "questions": [
        {
          "id": "q1",
          "text": "What is your current fitness level?",
          "type": "single_choice",
          "required": true,
          "options": ["Beginner", "Intermediate", "Advanced"],
          "order": 1
        },
        {
          "id": "q2",
          "text": "How many days per week can you train?",
          "type": "number",
          "required": true,
          "min_value": 1,
          "max_value": 7,
          "placeholder": "Enter number of days",
          "order": 2
        }
      ]
    },
    {
      "id": "goals",
      "title": "Your Goals",
      "description": "What do you want to achieve?",
      "order": 2,
      "questions": [
        {
          "id": "q3",
          "text": "What is your primary goal?",
          "type": "single_choice",
          "required": true,
          "options": [
            "Lose weight",
            "Build muscle",
            "Improve endurance",
            "Increase strength",
            "General fitness"
          ],
          "order": 1
        },
        {
          "id": "q4",
          "text": "Tell us more about your goals",
          "type": "text",
          "required": true,
          "placeholder": "Be specific...",
          "help_text": "The more detail, the better we can help",
          "order": 2
        }
      ]
    }
  ]
}
```

## Key Features

✅ **Progressive questioning** - One question at a time  
✅ **Auto-save** - Responses saved immediately  
✅ **Section-based** - Questions grouped logically  
✅ **Progress tracking** - Visual progress bar  
✅ **Validation** - Required field checking  
✅ **Help text** - Contextual guidance  
✅ **Back navigation** - Review previous answers  
✅ **5 question types** - Text, number, choice, multi-choice, scale  
✅ **Responsive UI** - Works on all screen sizes  
✅ **Dark mode** - Themed components  
✅ **Loading states** - Smooth UX  
✅ **Error handling** - Retry on failure  

## Testing

### Manual Test Flow
1. Register new user
2. Complete onboarding flow
3. Complete payment
4. Verify redirect to questionnaire
5. Answer questions (test all types)
6. Test back navigation
7. Test validation (skip required field)
8. Complete questionnaire
9. Verify redirect to dashboard
10. Verify responses saved in backend

### Backend Testing
```bash
# Test template endpoint
curl http://localhost:8000/api/questionnaires/plan-creation \
  -H "Authorization: Bearer {token}"

# Test needs completion
curl http://localhost:8000/api/questionnaires/needs-completion \
  -H "Authorization: Bearer {token}"

# Start questionnaire
curl -X POST http://localhost:8000/api/questionnaires/start \
  -H "Authorization: Bearer {token}"

# Submit responses
curl -X POST http://localhost:8000/api/questionnaires/{id}/responses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"responses": [...]}'

# Complete questionnaire
curl -X POST http://localhost:8000/api/questionnaires/{id}/complete \
  -H "Authorization: Bearer {token}"
```

## Next Steps

### Backend Implementation
1. Create questionnaire database tables
2. Implement API endpoints
3. Create questionnaire template
4. Add plan creation logic based on responses
5. Set up coach notifications

### Optional Enhancements
- [ ] Save draft responses locally (offline support)
- [ ] Allow editing previous answers
- [ ] Add conditional logic (skip questions based on answers)
- [ ] Include photo uploads for measurements
- [ ] Add estimated completion time
- [ ] Support multiple questionnaire versions
- [ ] Add analytics on completion rates
- [ ] Implement A/B testing for questions

## Files Created

1. `types/questionnaire.ts` - Type definitions
2. `services/questionnaire.service.ts` - API service
3. `hooks/use-questionnaire.ts` - React Query hooks
4. `app/questionnaire/plan-creation.tsx` - Main screen
5. `components/questionnaire-guard.tsx` - Navigation guard
6. `docs/QUESTIONNAIRE_SETUP.md` - Detailed documentation
7. `docs/POST_ONBOARDING_QUESTIONNAIRE.md` - This summary

## Integration Points

- ✅ Types exported in `types/index.ts`
- ✅ Route added to `app/_layout.tsx`
- ✅ Guard integrated in app layout
- ✅ Hooks use React Query for caching
- ✅ Service uses existing API client
- ✅ UI uses themed components
- ✅ Follows existing patterns

**The questionnaire system is ready to use once the backend endpoints are implemented!**
