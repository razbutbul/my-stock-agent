# Prompt Flow — איך ה-LLM מקבל את קובץ הפרומפט

## קבצים

| קובץ | תפקיד |
|------|--------|
| `system.prompt.md` | הפרומפט שאתה עורך — נשלח כ-system message |
| `agent-prompt.service.ts` | טוען את הקובץ מהדיסק ומחזיק אותו בזיכרון |
| `agent.service.ts` | מרכיב את ה-messages ושולח ל-OpenAI |

## פלואו לכל שאלת משתמש

```
Client                    AgentController              AgentService                 OpenAI
  |                              |                          |                          |
  |  POST /api/agent/chat        |                          |                          |
  |  { message: "..." }          |                          |                          |
  |----------------------------->|                          |                          |
  |                              |  chat(message)           |                          |
  |                              |------------------------->|                          |
  |                              |                          |                          |
  |                              |                          |  getSystemPrompt()       |
  |                              |                          |  (מזיכרון — נטען בהפעלה) |
  |                              |                          |                          |
  |                              |                          |  messages = [            |
  |                              |                          |    { role: "system",     |
  |                              |                          |      content: <קובץ> },   |
  |                              |                          |    { role: "user",       |
  |                              |                          |      content: <שאלה> }   |
  |                              |                          |  ]                       |
  |                              |                          |                          |
  |                              |                          |  chat.completions.create |
  |                              |                          |------------------------->|
  |                              |                          |                          |
  |                              |                          |  (לולאת tools אם נדרש)   |
  |                              |                          |<-------------------------|
  |                              |                          |                          |
  |                              |  AgentResponseDto        |                          |
  |                              |<-------------------------|                          |
  |  { message, toolsUsed }      |                          |                          |
  |<-----------------------------|                          |                          |
```

## מתי הקובץ נטען?

1. **בהפעלת השרת** — `AgentPromptService` קורא את `system.prompt.md` פעם אחת.
2. **בכל בקשת chat** — התוכן שכבר בזיכרון מוכנס כ-`role: "system"` לפני ה-`role: "user"`.
3. **בכל איטרציה בלולאת ה-tools** — אותו מערך `messages` (כולל system) נשלח שוב ל-OpenAI.

## הערות

- עריכת `system.prompt.md` דורשת **הפעלה מחדש** של השרת (אין hot-reload לקובץ).
- `POST /api/agent/analyze` עובר דרך `chat()` — מקבל את אותו פרומפט.
- אם הקובץ חסר או ריק — השרת זורק שגיאה בהפעלה.
