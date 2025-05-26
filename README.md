# semester_planning_consultant
A web-based system for optimizing students' credit and time allocation.
# System Architecture

## Overall Architecture

The system is a web application composed of a frontend and a backend.

- **Frontend**: A Single Page Application (SPA) built using Vue.js. It handles all user interactions and renders dynamic views.
- **Backend**: A Node.js application using the Express.js framework. It serves RESTful APIs for data access and interacts with a MySQL database.

---

## Backend Details

The backend is organized into controller and route modules.

### Database

- MySQL is used for persistent data storage.
- The connection is defined in `backend/config/db.js`.

### Controllers (Located in `backend/controllers/`)

- **`ability.controller.js`**
  - `getAllAbilities`: Fetches all abilities.
  - `createAbility`: Inserts or updates ability entries in `Student_Ability`.

- **`auth.controller.js`**
  - `login`: Authenticates students via `student_id` and `password`.

- **`course.controller.js`**
  - `getAllCourses`: Returns all course IDs and names.
  - `getCourseById`: Returns a single course by ID.

- **`participate.controller.js`**
  - `getAllClubs`: Fetches all available clubs.
  - `getStudentClubs`: Lists a student’s joined clubs.
  - `selectClubs`: Adds clubs for a student.

- **`performance.controller.js`**
  - `getAllCourses`: Lists all courses (for dropdown).
  - `addPerformance`: Adds or updates performance records.
  - `getPerformanceByStudent`: Lists a student's performance.

- **`studentAbility.controller.js`**
  - `addStudentAbility`: Adds a student’s ability level and description.

- **`studentController.js`**
  - `addStudentCourses`: Stores a student's course selections.
  - `getStudentCourses`: Retrieves a student's selected courses.

- **`test.controller.js`**
  - `ping`: Simple endpoint to test API connectivity.

- **`timePlan.controller.js`**
  - `getTimePlan`: Generates a personalized weekly study/club schedule.

### Routes (Located in `backend/routes/`)

- **`ability.route.js`**
  - `GET /`: List all abilities.
  - `POST /`: Add/update a student’s ability.

- **`auth.route.js`**
  - `POST /login`: Handles student login.

- **`course.route.js`**
  - `GET /`: All courses.
  - `GET /:id`: Course by ID.

- **`participate.route.js`**
  - `GET /activities`: List all clubs.
  - `GET /:id/activities/list`: Student's joined clubs.
  - `POST /:id/activities`: Submit selected clubs.

- **`performance.route.js`**
  - `POST /`: Submit or update scores.
  - `GET /:student_id`: Get scores for a student.

- **`studentAbility.route.js`**
  - `POST /student-ability`: Add student ability data.

- **`students.route.js`**
  - `POST /:id/courses`: Submit selected courses.
  - `GET /:id/courses/list`: Get course selections.

- **`test.route.js`**
  - `GET /ping`: Test endpoint.

- **`timePlan.route.js`**
  - `GET /:id`: Get generated weekly plan.

---

## Frontend Details

The frontend uses Vue.js and Vue Router for SPA navigation.

### Components (Located in `frontend/src/components/`)

- **`AbilityManager.vue`**
  - Add/update abilities with level and description.
  - Interacts with `/abilities` and `/api/student-ability`.

- **`Auth.vue`**
  - Login interface.
  - Calls `/auth/login`, stores `student_id` in `localStorage`.

- **`Dashboard.vue`**
  - Main post-login landing view. (Currently a placeholder.)

- **`PerformanceInput.vue`**
  - Students select a course and input a score.
  - Pulls courses from `/api/courses` and records from `/api/performance/:student_id`.
  - Similar in function to `StudentCoursePlanner.vue`.

- **`StudentClubPage.vue`**
  - Allows selection of clubs and displays time commitment.
  - Interacts with `/clubs/...` endpoints.

- **`StudentCoursePlanner.vue`**
  - Course planning: select course, semester, expected grade, and study hours.
  - Courses fetched from `/api/courses`, selections sent to `/students/:id/courses`.

- **`TimePlanView.vue`**
  - Displays a summarized weekly study plan (future feature).
  - Interacts with `/api/time-plan/:id`.

---

## Routing

Routing is handled in `frontend/src/router/index.js`.

- **Mode**: `createWebHistory` is used.
- **Routes**: `/login`, `/dashboard`, `/student`, `/abilities`, `/clubs`, `/performance`, and `/timeplan`.
- **Default Redirect**: `/` → `/login`.

### Navigation Guard

- Checks if `student_id` exists in `localStorage`.
- If not logged in:
  - Redirect to `/login?reason=login_required`.
- If already logged in and accessing `/login`, redirect to `/dashboard`.

---

## 🔐 Authentication & Authorization

- Authentication is simple and sessionless (using localStorage).
- Navigation guards enforce route protection.
- Message prompt is shown on login page if redirected due to unauthorized access.

---

## 📚 Course Selection

- Dropdown lists with `course_id - course_name`.
- User selects courses with expected grades and estimated study hours.
- Data is sent to `Student_Course_Selection`.

---

## 🧠 Ability Management

- Select an ability, choose a level (1–5), and add optional notes.
- Abilities are linked to each student in a relational table.

---

## 🎯 Performance Entry

- Students input and update their scores.
- `ON DUPLICATE KEY UPDATE` logic allows safe re-submission.
- View all scores in a summary table.

---

## 🎽 Club Participation

- Join one or more clubs.
- View all joined clubs and total weekly hours.
- Participation data stored in `participate` table.

---

## ⏱️ Time Planning (Optional)

- Aggregates:
  - Course study time
  - Club hours
  - Ability levels
- Returns suggested weekly time allocation.

---

## 💬 UX Messages

- Uses in-page styled `<div>` alerts for:
  - Login required
  - Submission success/failure
  - Incomplete form warnings
- Avoids browser `alert()` popups for smoother UI.

---

## 🧪 Testing Endpoint

- `GET /api/ping` returns `{ pong, timestamp }` for testing server status.
