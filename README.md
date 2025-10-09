## Overview
The Task Manager Application is a full-stack web application that allows users to create, update, complete, and delete tasks. It supports a recent tasks view and interactive task cards. Users can also toggle between light and dark themes.

---

## Features
- **Create Task**: Users can add a new task with a title and description.
- **Update Task**: Users can edit the title and description of an existing task.
- **Mark as Completed**: Users can mark tasks as done.
- **Delete Task**: Users can remove tasks.
- **Recent Tasks**: Displays the 5 most recent incomplete tasks.
- **Theme Toggle**: Switch between light and dark themes.
- **Responsive UI**: Interactive task cards for easy management.
- **API Integration**: RESTful API using Spring Boot backend.

---

---
## UI

**Light Mode**
![Light Mode](https://github.com/it21302862/Task_Manager_Assignment/blob/main/frontend/taskmanager/public/Light_Mode.png)

**Dark Mode**
![Dark Mode](https://github.com/it21302862/Task_Manager_Assignment/blob/main/frontend/taskmanager/public/TodoList_Home.png)

**Create Task Modal**
![Create Task Modal](https://github.com/it21302862/Task_Manager_Assignment/blob/main/frontend/taskmanager/public/Create_Task.png)

**Edit Task Modal**
![Edit Task Modal](https://github.com/it21302862/Task_Manager_Assignment/blob/main/frontend/taskmanager/public/Update_Task.png)


## Technologies Used
- **Frontend**:
  - React.js
  - Reactstrap for modals and UI components
  - Fetch API for HTTP requests
  - Boostrap for styling
- **Backend**:
  - Java Spring Boot
  - Spring Data JPA with Hibernate
  - MySQL database
  - REST API development
- **Testing**:
  - JUnit 5 and Mockito for unit testing
  - Spring Boot Test and MockMvc for integration testing
- **Others**:
  - Maven for project build
  - Docker 

### Backend
1. Navigate to the backend folder
2. Configure the application.properties with your MySQL credentials:
3. Build and run the Spring Boot application
4. The backend will run at:
     http://localhost:9090

---
#### Backend Architecture

**System Diagram**
![Architecture Diagram](https://github.com/it21302862/Task_Manager_Assignment/blob/main/frontend/taskmanager/public/architecture.png)
---

### Frontend
1. Navigate to the frontend folder

```
cd frontend
```

```
cd taskmanager
```

2. Install dependencies

```
npm install
```

3. Create .env file with backend URL
REACT_APP_API_BASE_URL=http://localhost:9090

4. Start the React application

```
npm run start
```
5. The frontend will run at
http://localhost:3000

6. To run test cases
```
npm test -- --watchAll=false
```