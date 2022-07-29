# Conceptiverse Backend API
## Description
This API is interface for the apps database. It will handle account information, lesson data, and running tests

## CRUD Routes
### User Routes
User account information
___
- `GET` /user/ -> index all users
- `POST` /user/ -> Create a new user
- `GET` /user/:id -> Profile user
- `DELETE`/user/:id -> Delete a user
- `GET` /auth/ -> Gets authentication token for user
### Lesson 
Stores lesson information
___
- `GET` /lesson/ -> index all lessons
- `GET` /lesson/:id -> get lesson details
- `POST`/lesson/ -> Create a new lesson
- `DELETE` /lesson/ -> Delete a lesson

### Chapter
Stores information about the specific lessons being taught
___
- `GET` /chapter/ -> index all chapters
- `GET` /chapter/:id -> get chapter details
- `POST`/chapter/ -> Create a new chapter
- `DELETE` /chapter/ -> Delete a chapter

### Test Script
Used to test the users program at the end of every chapter
___
- `GET` /script/ -> index all scripts
- `GET` /script/:id -> get script details
- `GET` /script/test/ -> test a user's script
- `POST`/script/ -> Create a new script
- `DELETE` /script/ -> Delete a script

### Badge
Awarded to the user upon completing a lesson
___
- `GET` /badge/ -> index all badges
- `GET` /badge/:id -> get badge details
- `POST`/badge/ -> Create a new badge
- `DELETE` /badge/ -> Delete a badge
