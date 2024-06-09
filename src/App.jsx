// react imports
import { useEffect, useState } from "react";

// components
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import ProtectedRoutes from "./components/ProtectedRoutes";

// custom hooks
import { useGlobalContext } from "./hooks/useGlobalContext";
import { useCollection } from "./firebase/useCollection";

// firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

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
import toast from "react-hot-toast";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
  });
  const { user, authReady, dispatch } = useGlobalContext();
  const { projects } = useCollection("projects", ["uid", "==", user?.uid]);

  useEffect(() => {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: projects || [],
      };
    });
  }, [projects]);

  function handleToggleTaskStatus(taskId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, completed: !task.completed };
              }
              return task;
            }),
          }).then(() => {
            toast.success("Task updated successfully");
          });
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
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            tasks: [newTask, ...project.tasks],
          }).then((data) => {
            toast.success("Task added successfully");
          });
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
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            tasks: project.tasks.filter((task) => task.id !== taskId),
          }).then((data) => {
            toast.success("Delete successfully");
          });
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

  async function handleAddProject(projectData) {
    const newProject = {
      ...projectData,
      tasks: [],
      uid: user.uid,
      completed: false,
      pinned: false,
    };

    addDoc(collection(db, "projects"), newProject)
      .then(() => {
        toast.success("Project added successfully");
      })
      .catch((error) => {
        toast.error("Error adding project");
      });

    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleToggleProjectStatus(projectId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === projectId) {
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            completed: !project.completed,
          }).then((data) => {
            toast.success("Successfully");
          });
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
    deleteDoc(doc(db, "projects", id)).then(() => {
      toast.success("Successfully deleted");
      setProjectsState((prevState) => {
        return {
          ...prevState,
          selectedProjectId: undefined,
        };
      });
    });
  }

  function handleTogglePin(taskId) {
    setProjectsState((prevState) => {
      const updatedProjects = prevState.projects.map((project) => {
        if (project.id === prevState.selectedProjectId) {
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, pinned: !task.pinned } : task
            ),
          }).then((data) => {
            toast.success("Successfully");
          });
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
          const productRef = doc(db, "projects", project.id);

          updateDoc(productRef, {
            pinned: !project.pinned,
          }).then((data) => {
            toast.success("Successfully");
          });
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
