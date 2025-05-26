# Semester_Planning_Consultant

A web-based system for helping students plan their course loads and time allocation effectively.

---

## System Architecture

### Overall Architecture

- **Frontend**: A Vue.js-based Single Page Application (SPA) for dynamic and interactive UI.
- **Backend**: A Node.js application using Express.js for REST API, connected to a MySQL database.

---

## Backend Structure

### Database

- Relational database: **MySQL**
- Connection config: `backend/config/db.js`

### Controllers (`backend/controllers/`)

- **ability.controller.js**
  - `getAllAbilities`: Retrieve all abilities.
  - `createAbility`: Insert/update student's ability.

- **auth.controller.js**
  - `login`: Authenticate via student ID and password.

- **course.controller.js**
  - `getAllCourses`: Return course list (id and name).
  - `getCourseById`: Return course details by ID.

- **participate.controller.js**
  - `getAllClubs`: List all clubs.
  - `getStudentClubs`: Get clubs joined by a student.
  - `selectClubs`: Submit club participation.

- **performance.controller.js**
  - `getAllCourses`: List courses for dropdowns.
  - `addPerformance`: Add/update student performance.
  - `getPerformanceByStudent`: Get all scores of a student.

- **studentAbility.controller.js**
  - `addStudentAbility`: Save student ability level and description.

- **studentController.js**
  - `addStudentCourses`: Submit student’s selected courses.
  - `getStudentCourses`: Fetch student’s enrolled courses.

- **test.controller.js**
  - `ping`: Basic test API response.

- **timePlan.controller.js**
  - `getTimePlan`: Compute and return suggested weekly plan.

---

### API Routes (`backend/routes/`)

- **ability.route.js**
  - `GET /` → List all abilities
  - `POST /` → Add/update student ability

- **auth.route.js**
  - `POST /login` → Login

- **course.route.js**
  - `GET /` → List all courses
  - `GET /:id` → Get course by ID

- **participate.route.js**
  - `GET /activities` → Get all clubs
  - `GET /:id/activities/list` → Get student’s clubs
  - `POST /:id/activities` → Submit selected clubs

- **performance.route.js**
  - `POST /` → Add or update scores
  - `GET /:student_id` → Get scores by student

- **studentAbility.route.js**
  - `POST /student-ability` → Save student ability

- **students.route.js**
  - `POST /:id/courses` → Submit selected courses
  - `GET /:id/courses/list` → List selected courses

- **test.route.js**
  - `GET /ping` → Server health check

- **timePlan.route.js**
  - `GET /:id` → Generate weekly study plan

---

## Frontend Structure

The frontend is structured using Vue 3 and Vue Router.

### Components (`frontend/src/components/`)

- **AbilityManager.vue**
  - Select and submit abilities with proficiency and notes.

- **Auth.vue**
  - Login form. On success, saves `student_id` to localStorage.

- **Dashboard.vue**
  - Landing page after login (static placeholder).

- **PerformanceInput.vue**
  - Input performance per course and view records.

- **StudentClubPage.vue**
  - Choose clubs and see total weekly hours.

- **StudentCoursePlanner.vue**
  - Input expected grade and study time for selected courses.

- **TimePlanView.vue**
  - (Optional) Display weekly time distribution plan.

---

## Routing (`frontend/src/router/index.js`)

- **Mode**: `createWebHistory()`
- **Paths**:
  - `/login`, `/dashboard`, `/student`, `/abilities`, `/clubs`, `/performance`, `/timeplan`
- **Default redirect**: `/` → `/login`

### Navigation Guard

```js
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('student_id')

  if (to.path !== '/login' && !isLoggedIn) {
    next('/login?reason=login_required')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})
## Authentication & Authorization

- LocalStorage-based session.
- Navigation guards enforce protection for private routes.
- If not logged in, users are redirected to `/login?reason=login_required`.
- If already logged in and navigating to `/login`, user is redirected to `/dashboard`.
- Login page displays contextual message based on redirection reason.
## Course Selection

- Courses appear as dropdowns: `course_id - course_name`
- User inputs:
  - Semester
  - Expected grade
  - Estimated study hours
- Records are stored in the `Student_Course_Selection` table.
- Submissions are handled via `POST /students/:id/courses`

---

## Ability Management

- Users select from a list of predefined abilities.
- Each ability is assigned:
  - A level (1 to 5)
  - An optional description
- Data is submitted to `POST /student-ability` and stored in `Student_Ability`.

---

## Performance Input

- Allows students to enter and update scores for each course.
- If a record already exists, it will be updated (`ON DUPLICATE KEY UPDATE` logic).
- Performance data is displayed in a summary table.
- Interacts with:
  - `GET /api/courses` (fetch dropdown)
  - `GET /api/performance/:student_id`
  - `POST /api/performance`

---

## Club Participation

- Students can join one or more extracurricular clubs.
- Joined clubs are displayed along with total weekly hours.
- Routes:
  - `GET /clubs/activities` → list all clubs
  - `POST /clubs/:id/activities` → submit selected clubs
  - `GET /clubs/:id/activities/list` → fetch joined clubs

---

## Time Planning

- A suggested weekly time allocation is generated using:
  - Study hours from course selection
  - Hours from club participation
  - (Optional) Ability influence
- API: `GET /api/time-plan/:id`
- Output: JSON object representing weekly plan (by activity type)

---

## UX Messages

- Feedback messages are styled `<div>` blocks within each component
- Common use cases:
  - Login required message (`reason=login_required`)
  - Submission success or error
  - Form validation failure (e.g., incomplete inputs)
- Avoids native `alert()` popups for better user experience

---

## Testing Endpoint

- A minimal endpoint is available for health checks:
  - `GET /api/ping`
  - Response:
    ```json
    {
      "pong": true,
      "timestamp": "2025-05-26T12:00:00Z"
    }
    ```
