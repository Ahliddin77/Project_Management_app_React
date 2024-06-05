import { useEffect, useState } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useGlobalContext } from "./hooks/useGlobalContext";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

// react router dom
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// actions
import { action as RegisterAction } from "./pages/Register";
import { action as LoginAction } from "./pages/Login";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
  });
  const { user, authReady, dispatch } = useGlobalContext();

  function handleToggleTaskStatus(taskId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, completed: !task.completed };
              }
              return task;
            }),
          };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  function handleAddTask(text) {
    setProjectsState((prevState) => {
      const taskId = Math.random();
      const newTask = {
        text: text,
        id: taskId,
        completed: false,
      };

      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          return {
            ...project,
            tasks: [newTask, ...project.tasks],
          };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  function handleDeleteTask(taskId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          return {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleAddProject(projectData) {
    setProjectsState((prevState) => {
      const newProject = {
        ...projectData,
        id: Math.random(),
        tasks: [],
        completed: false,
        pinned: false,
      };

      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject],
      };
    });
  }

  function handleToggleProjectStatus(projectId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, completed: !project.completed };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleSelectProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleDeleteProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId:
          prevState.selectedProjectId === id
            ? undefined
            : prevState.selectedProjectId,
        projects: prevState.projects.filter((project) => project.id !== id),
      };
    });
  }

  function handleTogglePin(taskId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, pinned: !task.pinned } : task
            ),
          };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  function handleTogglePinProject(projectId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, pinned: !project.pinned };
        }
        return project;
      });

      return {
        ...prevState,
        projects: updatedProjects,
      };
    });
  }

  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );
  let content = (
    <SelectedProject
      project={selectedProject}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onToggleTaskStatus={handleToggleTaskStatus}
      onTogglePin={handleTogglePin}
      tasks={selectedProject ? selectedProject.tasks : []}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  // actions

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes user={user}>
          <main className="h-screen my-8 flex gap-8">
            <ProjectSidebar
              onStartAddProject={handleStartAddProject}
              projects={projectsState.projects}
              onSelectProject={handleSelectProject}
              selectedProjectId={projectsState.selectedProjectId}
              onToggleProjectStatus={handleToggleProjectStatus}
              onDeleteProject={handleDeleteProject}
              onTogglePinProject={handleTogglePinProject}
            />
            {content}
          </main>
        </ProtectedRoutes>
      ),
    },
    {
      path: "/login",
      action: LoginAction,
      element: user ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/register",
      action: RegisterAction,
      element: user ? <Navigate to="/" /> : <Register />,
    },
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch({ type: "LOGIN", payload: user });
      dispatch({ type: "AUTH_READY", payload: true });
    });
  }, []);

  return <>{authReady && <RouterProvider router={routes} />}</>;
}

export default App;
