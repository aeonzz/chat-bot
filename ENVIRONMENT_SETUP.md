# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# =============================================================================
# API Configuration
# =============================================================================

# Main chat API endpoint
# Used for: Sending questions and receiving answers from the chatbot
VITE_API_URL=http://localhost:8000/api/conversation/chat

# Topics API endpoint
# Used for: Fetching dynamic conversation topics from available documents
VITE_API_URL_TOPICS=http://localhost:8000/api/conversation/topics
```

## Development Setup

### 1. Copy the template
```bash
# Create your .env file (if it doesn't exist)
touch .env
```

### 2. Add the variables
Copy the environment variables above into your `.env` file.

### 3. Update URLs for production
When deploying to production, update the URLs to point to your production backend:

```env
# Production example
VITE_API_URL=https://your-backend.com/api/conversation/chat
VITE_API_URL_TOPICS=https://your-backend.com/api/conversation/topics
```

## How These Variables Are Used

### `VITE_API_URL`
- Used in: `src/hooks/use-chat.ts`
- Purpose: Main chatbot communication endpoint
- Usage: Sends user questions and receives AI responses

### `VITE_API_URL_TOPICS`
- Used in: `src/components/popup-chat/_config/index.ts`
- Purpose: Fetches suggested conversation topics
- Usage: Loads dynamic topics when chatbot opens
- Benefits:
  - Topics automatically reflect available documents
  - No frontend code changes needed when documents change
  - Provides users with relevant example questions

## Troubleshooting

### Topics not loading?
1. Check that `VITE_API_URL_TOPICS` is set in your `.env` file
2. Verify the backend server is running: `python -m app.main`
3. Test the endpoint directly: `curl http://localhost:8000/api/conversation/topics`
4. Check browser console for error messages

### Fallback Behavior
If the topics API fails, the app will:
- Log the error to the console
- Fall back to default topics:
  - "Code of Discipline"
  - "DTR Violations"
  - "Leave Filing"
- Continue working normally

## Backend Requirements

Make sure your backend has the `/api/conversation/topics` endpoint implemented. This endpoint should:
- Analyze available documents
- Extract relevant topics and categories
- Return example questions for each topic
- Response format:
```json
{
  "topics": [
    {
      "topic": "Leave Policies",
      "category": "HR & Benefits",
      "description": "Information about leave policies...",
      "examples": [
        "How many leave days do I get?",
        "What is the vacation leave policy?"
      ],
      "icon": "📅"
    }
  ],
  "total": 13,
  "document_count": 34
}
```

## Notes

- All Vite environment variables must start with `VITE_` to be accessible in the frontend
- Changes to `.env` require a restart of the dev server (`npm run dev`)
- Never commit your `.env` file to version control
- The `.env` file should be listed in `.gitignore`
