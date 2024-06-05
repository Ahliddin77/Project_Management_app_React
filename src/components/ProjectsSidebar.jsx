// components
import Button from "./Button";

// react imports
import { useState, useEffect } from "react";
import { FaEllipsisV, FaThumbtack } from "react-icons/fa";

// firebase imports
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// icon
import { IoMdLogOut } from "react-icons/io";

// global context
import { useGlobalContext } from "../hooks/useGlobalContext";
import toast from "react-hot-toast";

export default function ProjectSidebar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
  onToggleProjectStatus,
  onDeleteProject,
  onTogglePinProject,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [sortedProjects, setSortedProjects] = useState(projects);

  const toggleDropdown = (projectId) => {
    if (openDropdownId === projectId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(projectId);
    }
  };

  useEffect(() => {
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      return a.title.localeCompare(b.title);
    });

    setSortedProjects(sortedProjects);
  }, [projects]);

  const { dispatch, user } = useGlobalContext();

  // log out function
  const logoutAccount = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
        toast.success("You have been logged out");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl flex flex-col">
      <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-200">
        Your Projects
      </h2>
      <div>
        <Button onClick={onStartAddProject}>+ Add Project</Button>
      </div>
      <ul className="mt-8 mb-auto">
        {sortedProjects.map((project) => {
          let cssClasses =
            "w-full text-left px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800";
          if (project.id === selectedProjectId) {
            cssClasses += " bg-stone-800 text-stone-200";
          } else {
            cssClasses += " text-stone-400";
          }
          if (project.completed) {
            cssClasses += " line-through text-gray-500";
          }
          return (
            <li key={project.id} className="relative">
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={project.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleProjectStatus(project.id);
                  }}
                  className="mr-2"
                />
                <button
                  className={cssClasses}
                  onClick={() => onSelectProject(project.id)}
                >
                  {project.title}
                </button>
                <div className="relative">
                  <button
                    className="text-stone-50 hover:text-stone-200"
                    onClick={() => toggleDropdown(project.id)}
                  >
                    {project.pinned ? <FaThumbtack /> : <FaEllipsisV />}
                  </button>
                  {openDropdownId === project.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-stone-700 border border-stone-600 rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-stone-50 hover:bg-stone-600"
                        onClick={() => {
                          onTogglePinProject(project.id);
                          setOpenDropdownId(null);
                        }}
                      >
                        {project.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-stone-50 hover:bg-red-600"
                        onClick={() => {
                          onDeleteProject(project.id);
                          setOpenDropdownId(null);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-y-5 justify-center items-center">
        {user.displayName && user.photoURL ? (
          <>
            <div className="flex gap-5 items-center">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.photoURL} />
                </div>
              </div>
              <h3 className="font-bold capitalize">{user.displayName}</h3>
            </div>
          </>
        ) : (
          ""
        )}
        <button
          onClick={logoutAccount}
          className="btn btn-square w-full flex items-center"
        >
          <span>Logout</span>
          <IoMdLogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
