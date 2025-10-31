# Post-Onboarding Questionnaire Setup

## Overview

After users complete the onboarding flow (welcome, testimonials, questions, payment), they are redirected to a comprehensive questionnaire that helps the coach gather information to create a personalized fitness plan.

## Flow

1. **User completes onboarding** → Payment successful
2. **System checks** → Does user need to complete questionnaire?
3. **If yes** → Redirect to `/questionnaire/plan-creation`
4. **User answers questions** → Responses saved progressively
5. **Questionnaire completed** → Coach receives data to create plan
6. **User redirected** → Main app dashboard

## Architecture

### Types (`types/questionnaire.ts`)

```typescript
interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'single_choice' | 'multiple_choice' | 'scale';
  required: boolean;
  options?: string[];
  min_value?: number;
  max_value?: number;
  placeholder?: string;
  help_text?: string;
  order: number;
}

interface QuestionnaireSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

interface QuestionnaireTemplate {
  id: string;
  title: string;
  description: string;
  sections: QuestionnaireSection[];
}
```

### Service (`services/questionnaire.service.ts`)

API endpoints:
- `GET /api/questionnaires/plan-creation` - Get questionnaire template
- `GET /api/questionnaires/current` - Get user's current questionnaire
- `GET /api/questionnaires/needs-completion` - Check if user needs questionnaire
- `POST /api/questionnaires/start` - Start new questionnaire
- `POST /api/questionnaires/{id}/responses` - Submit responses
- `POST /api/questionnaires/{id}/complete` - Mark questionnaire complete

### Hooks (`hooks/use-questionnaire.ts`)

React Query hooks:
- `usePlanQuestionnaireTemplate()` - Fetch template
- `useCurrentQuestionnaire()` - Get current questionnaire
- `useNeedsQuestionnaire()` - Check if needed
- `useStartQuestionnaire()` - Start questionnaire
- `useSubmitResponses()` - Submit answers
- `useCompleteQuestionnaire()` - Complete questionnaire

### Screen (`app/questionnaire/plan-creation.tsx`)

Features:
- **Progressive questions** - One question at a time
- **Section-based** - Questions grouped by topic
- **Progress tracking** - Visual progress bar
- **Auto-save** - Responses saved as user answers
- **Validation** - Required field checking
- **Help text** - Contextual guidance
- **Multiple question types** - Text, number, choice, scale

### Guard (`components/questionnaire-guard.tsx`)

Automatically redirects users to questionnaire if:
- User is authenticated
- Onboarding is completed
- Questionnaire needs completion
- Not already on questionnaire screen

## Question Types

### 1. Text Input
```typescript
{
  type: 'text',
  text: 'What are your fitness goals?',
  placeholder: 'e.g., Lose weight, build muscle...',
  help_text: 'Be specific about what you want to achieve'
}
```

### 2. Number Input
```typescript
{
  type: 'number',
  text: 'How many days per week can you train?',
  placeholder: 'Enter a number...',
  min_value: 1,
  max_value: 7
}
```

### 3. Single Choice
```typescript
{
  type: 'single_choice',
  text: 'What is your current fitness level?',
  options: ['Beginner', 'Intermediate', 'Advanced']
}
```

### 4. Multiple Choice
```typescript
{
  type: 'multiple_choice',
  text: 'Which types of training do you enjoy?',
  options: ['Running', 'Strength Training', 'Yoga', 'Swimming', 'Cycling']
}
```

### 5. Scale (1-10)
```typescript
{
  type: 'scale',
  text: 'How motivated are you right now?',
  min_value: 1,
  max_value: 10,
  help_text: '1 = Not motivated, 10 = Extremely motivated'
}
```

## Backend Requirements

### 1. Questionnaire Template

The backend should provide a template with sections and questions:

```json
{
  "id": "plan-creation-v1",
  "title": "Build Your Personalized Plan",
  "description": "Help us understand your goals and preferences",
  "sections": [
    {
      "id": "fitness-background",
      "title": "Fitness Background",
      "description": "Tell us about your fitness history",
      "order": 1,
      "questions": [
        {
          "id": "fitness-level",
          "text": "What is your current fitness level?",
          "type": "single_choice",
          "required": true,
          "options": ["Beginner", "Intermediate", "Advanced"],
          "order": 1
        },
        {
          "id": "training-frequency",
          "text": "How many days per week can you train?",
          "type": "number",
          "required": true,
          "min_value": 1,
          "max_value": 7,
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
          "id": "primary-goal",
          "text": "What is your primary fitness goal?",
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
          "id": "goal-details",
          "text": "Tell us more about your goals",
          "type": "text",
          "required": true,
          "placeholder": "Be specific about what you want to achieve...",
          "help_text": "The more detail you provide, the better we can tailor your plan",
          "order": 2
        }
      ]
    },
    {
      "id": "preferences",
      "title": "Training Preferences",
      "description": "What do you enjoy?",
      "order": 3,
      "questions": [
        {
          "id": "preferred-activities",
          "text": "Which activities do you enjoy?",
          "type": "multiple_choice",
          "required": false,
          "options": [
            "Running",
            "Cycling",
            "Swimming",
            "Strength Training",
            "Yoga",
            "Pilates",
            "HIIT",
            "Walking"
          ],
          "order": 1
        },
        {
          "id": "motivation-level",
          "text": "How motivated are you right now?",
          "type": "scale",
          "required": true,
          "min_value": 1,
          "max_value": 10,
          "help_text": "1 = Not motivated, 10 = Extremely motivated",
          "order": 2
        }
      ]
    }
  ]
}
```

### 2. Response Storage

Store responses as they're submitted:

```json
{
  "questionnaire_id": "uuid",
  "user_id": "uuid",
  "status": "in_progress",
  "responses": [
    {
      "question_id": "fitness-level",
      "question_text": "What is your current fitness level?",
      "answer": "Intermediate",
      "answered_at": "2025-10-31T13:00:00Z"
    },
    {
      "question_id": "training-frequency",
      "question_text": "How many days per week can you train?",
      "answer": 5,
      "answered_at": "2025-10-31T13:01:00Z"
    }
  ]
}
```

### 3. Completion Handling

When questionnaire is completed:
1. Mark questionnaire as `completed`
2. Set `completed_at` timestamp
3. Trigger coach notification
4. Create initial plan based on responses
5. Update user's `needs_questionnaire` flag to `false`

## Example Questions for Plan Creation

### Section 1: Fitness Background
1. What is your current fitness level? (Single choice)
2. How many days per week can you train? (Number)
3. How long have you been training? (Text)
4. Do you have any injuries or limitations? (Text)

### Section 2: Goals & Motivation
1. What is your primary fitness goal? (Single choice)
2. Tell us more about your goals (Text)
3. Why is this important to you? (Text)
4. How motivated are you right now? (Scale 1-10)

### Section 3: Training Preferences
1. Which activities do you enjoy? (Multiple choice)
2. What time of day do you prefer to train? (Single choice)
3. Do you prefer training alone or with others? (Single choice)
4. How long can each training session be? (Number)

### Section 4: Lifestyle & Schedule
1. What is your occupation? (Text)
2. How would you describe your daily activity level? (Single choice)
3. How many hours of sleep do you get per night? (Number)
4. Do you have any dietary restrictions? (Text)

### Section 5: Experience & Equipment
1. Have you worked with a coach before? (Single choice)
2. What equipment do you have access to? (Multiple choice)
3. Do you prefer gym or home workouts? (Single choice)
4. Any other information we should know? (Text)

## Testing

### Manual Testing
1. Complete onboarding flow
2. Verify redirect to questionnaire
3. Answer questions progressively
4. Test back navigation
5. Verify responses are saved
6. Complete questionnaire
7. Verify redirect to dashboard

### API Testing
```bash
# Get template
curl -X GET http://localhost:8000/api/questionnaires/plan-creation \
  -H "Authorization: Bearer {token}"

# Start questionnaire
curl -X POST http://localhost:8000/api/questionnaires/start \
  -H "Authorization: Bearer {token}"

# Submit responses
curl -X POST http://localhost:8000/api/questionnaires/{id}/responses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "question_id": "fitness-level",
        "question_text": "What is your current fitness level?",
        "answer": "Intermediate",
        "answered_at": "2025-10-31T13:00:00Z"
      }
    ]
  }'

# Complete questionnaire
curl -X POST http://localhost:8000/api/questionnaires/{id}/complete \
  -H "Authorization: Bearer {token}"
```

## Future Enhancements

- [ ] Save draft responses locally
- [ ] Allow editing previous answers
- [ ] Add question branching logic
- [ ] Include photo uploads for body measurements
- [ ] Add video question types
- [ ] Implement skip logic
- [ ] Add progress saving across sessions
- [ ] Include estimated completion time
- [ ] Add question categories/tags
- [ ] Support multiple languages
