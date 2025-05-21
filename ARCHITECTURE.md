# System Architecture

## Overall Architecture

The system is a web application composed of a frontend and a backend.
-   **Frontend**: A Single Page Application (SPA) built using Vue.js. It is responsible for the user interface and interaction.
-   **Backend**: A Node.js application using the Express.js framework. It provides a RESTful API for the frontend to consume and interacts with a MySQL database.

## Backend Details

The backend is structured with controllers handling business logic and routes defining the API endpoints.

### Database

The backend uses a MySQL database. The database connection configuration is located in `backend/config/db.js`.

### Controllers

Located in `backend/controllers/`:

-   **`ability.controller.js`**:
    -   `getAllAbilities`: Retrieves all abilities from the `Ability` table.
    -   `createAbility`: Inserts or updates a student's ability in the `Student_Ability` table. *Note: This function appears redundant with `addStudentAbility` in `studentAbility.controller.js` and uses undefined variables within its scope, suggesting it might be deprecated or buggy.*
-   **`auth.controller.js`**:
    -   `login`: Authenticates a student based on `student_id` and `password`.
-   **`course.controller.js`**:
    -   `getAllCourses`: Fetches all courses.
    -   `getCourseById`: Retrieves a specific course by its ID.
-   **`participate.controller.js`**:
    -   `getAllClubs`: Gets a list of all extracurricular activities.
    -   `getStudentClubs`: Fetches the list of clubs a specific student participates in.
    *   `selectClubs`: Allows a student to select multiple clubs.
-   **`performance.controller.js`**:
    *   `getAllCourses`: Retrieves `course_id` and `course_name` for all courses.
    *   `addPerformance`: Adds or updates a student's performance for a course.
    *   `getPerformanceByStudent`: Fetches all performances for a given student.
-   **`studentAbility.controller.js`**:
    *   `addStudentAbility`: Adds a specific ability, level, and description for a student.
-   **`studentController.js`**:
    *   `addStudentCourses`: Adds multiple course selections for a student.
    *   `getStudentCourses`: Retrieves all courses selected by a student.
-   **`test.controller.js`**:
    *   `ping`: A test endpoint that returns "pong" and a timestamp.
-   **`timePlan.controller.js`**:
    *   `getTimePlan`: Calculates and returns a student's weekly time plan based on academic performance, course load, abilities, and extracurricular activities.

### API Endpoints

Defined in `backend/routes/`:

-   **`ability.route.js`**:
    -   `GET /`: `abilityController.getAllAbilities`
    -   `POST /`: `abilityController.createAbility`
-   **`auth.route.js`**:
    -   `POST /login`: `authController.login`
-   **`course.route.js`**:
    -   `GET /`: `courseController.getAllCourses`
    -   `GET /:id`: `courseController.getCourseById`
-   **`participate.route.js`**:
    -   `GET /activities`: `participateController.getAllClubs`
    -   `POST /:id/activities`: `participateController.selectClubs`
    -   `GET /:id/activities/list`: `participateController.getStudentClubs`
-   **`performance.route.js`**:
    -   `POST /`: `performanceController.addPerformance`
    -   `GET /:student_id`: `performanceController.getPerformanceByStudent`
-   **`studentAbility.route.js`**:
    -   `POST /student-ability`: `studentAbilityController.addStudentAbility`
-   **`students.route.js`**:
    -   `POST /:id/courses`: `studentController.addStudentCourses`
    -   `GET /:id/courses/list`: `studentController.getStudentCourses`
-   **`test.route.js`**:
    -   `GET /ping`: `testController.ping`
-   **`timePlan.route.js`**:
    -   `GET /:id`: `timePlanController.getTimePlan`

## Frontend Details

The frontend is built with Vue.js and uses Vue Router for navigation.

### Components

Located in `frontend/src/components/`:

-   **`AbilityManager.vue`**:
    -   **Purpose**: Allows students to select predefined abilities, specify their proficiency level, and add a description.
    -   **Backend Interaction**: Fetches all abilities via `GET /abilities` and submits student-specific abilities via `POST /api/student-ability`.
-   **`Auth.vue`**:
    -   **Purpose**: Provides the student login interface.
    -   **Backend Interaction**: Sends credentials to `POST /auth/login`. Stores `student_id` in `localStorage` upon success.
-   **`Dashboard.vue`**:
    -   **Purpose**: Intended as the main landing page after login. Currently a placeholder.
    -   **Backend Interaction**: None.
-   **`PerformanceInput.vue`**:
    -   **Purpose**: Allows students to input and view their academic scores for courses.
    -   **Backend Interaction**: Fetches courses via `GET /api/courses`, student's performance via `GET /api/performance/:student_id`, and submits new scores via `POST /api/performance`.
    -   *Note: This component appears to be functionally identical to `StudentCoursePlanner.vue`, indicating redundancy.*
-   **`StudentClubPage.vue`**:
    -   **Purpose**: Enables students to select extracurricular clubs and view their current involvements and total weekly time commitment.
    -   **Backend Interaction**: Fetches all clubs via `GET /clubs/activities`, student's joined clubs via `GET /clubs/:student_id/activities/list`, and submits selections via `POST /clubs/:student_id/activities`.
-   **`StudentCoursePlanner.vue`**:
    -   **Purpose**: Allows students to input and view their academic scores for courses.
    -   **Backend Interaction**: Fetches courses via `GET /api/courses`, student's performance via `GET /api/performance/:student_id`, and submits new scores via `POST /api/performance`.
    -   *Note: This component appears to be functionally identical to `PerformanceInput.vue`, indicating redundancy.*
-   **`TimePlanView.vue`**:
    -   **Purpose**: Displays a personalized weekly time plan for the student, including study and club hours.
    -   **Backend Interaction**: Fetches time plan data via `GET /api/time-plan/:studentId`.

### Routing

Handled by `frontend/src/router/index.js`:

-   The router uses `createWebHistory` mode.
-   The default path `/` redirects to `/login`.
-   Routes are defined for components like `Auth`, `Dashboard`, `StudentCoursePlanner`, `AbilityManager`, `StudentClubPage`, `PerformanceInput`, and `TimePlanView`.
-   **Authentication Check**: A global navigation guard (`router.beforeEach`) is implemented:
    -   It checks if a `student_id` exists in `localStorage` to determine if the user is authenticated.
    -   If a user tries to access any route other than `/login` without being authenticated, they are redirected to `/login` with a `reason=login_required` query parameter.
    -   If an authenticated user tries to access `/login`, they are redirected to `/dashboard`.
    -   Otherwise, navigation proceeds as requested.
