# Scriblo: MERN Notepad
A notes app where users sign up, log in, and create, edit and organise their own notes.
## Features (Phase 1)- Sign up and log in with JWT; passwords hashed with bcrypt- Create, read, update and delete notes; each user only sees their own- Folders: create, rename and delete (deleting a folder deletes its notes); move notes between 
folders- Tags on notes- Search titles and content, filter by folder, tag or pinned status, sort by date, pagination- Pin notes to keep them at the top- Trash: deleted notes go to Trash and can be restored or deleted forever- Rate limiting with Upstash Redis (100 requests per minute per IP)

## Tech
MongoDB, Express, React (Vite), Node.js, Tailwind + DaisyUI, JWT auth, Upstash rate limiting

## Run locally
1. Create `backend/.env` with MONGO_URI, PORT=5001, JWT_SECRET,
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NODE_ENV=development
2. `cd backend && npm install && npm run dev`
3. In a second terminal: `cd frontend && npm install && npm run dev`
4. Open http://localhost:5173

## API
All `/api/notes` and `/api/folders` routes need `Authorization: Bearer <token>`.

| Method | URL | What it does |
|---|---|---|
| POST | /api/auth/signup | Create an account |
| POST | /api/auth/login | Log in, returns a JWT |
| GET | /api/notes | List notes (`search`, `folder`, `tag`, `pinned`, `sort`, `page`, `limit`) |
| GET | /api/notes/tags | All tags the user has used |
| GET | /api/notes/:id | One note |
| POST | /api/notes | Create a note |
| PUT | /api/notes/:id | Edit a note or move it to another folder |
| PATCH | /api/notes/:id/pin | Pin or unpin |
| DELETE | /api/notes/:id | Move to Trash |
| GET | /api/notes/trash | Notes in Trash |
| PATCH | /api/notes/:id/restore | Restore from Trash |
| DELETE | /api/notes/:id/permanent | Delete forever |
| GET / POST | /api/folders | List or create folders |
| PUT / DELETE | /api/folders/:id | Rename or delete a folder (and its notes) |
## Team
- Mariyam: backend
- Abdul Rehman: frontend