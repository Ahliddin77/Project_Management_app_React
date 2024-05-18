import NewTask from "./NewTask";
import { useState, useEffect } from "react";
import { FaEllipsisV, FaThumbtack } from "react-icons/fa"; // Import pin icon

export default function Tasks({
  tasks,
  onAdd,
  onDelete,
  onToggleStatus,
  onTogglePin,
}) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const pinnedTasks = tasks.filter((task) => task.pinned);
    const completedTasks = tasks.filter(
      (task) => task.completed && !task.pinned
    );
    const incompleteTasks = tasks.filter(
      (task) => !task.completed && !task.pinned
    );
    setSortedTasks([...pinnedTasks, ...incompleteTasks, ...completedTasks]);
  }, [tasks]);

  const toggleDropdown = (taskId) => {
    if (openDropdownId === taskId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(taskId);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Tasks</h2>
      <NewTask onAdd={onAdd} />
      {sortedTasks.length === 0 && (
        <p className="text-stone-800 my-4">
          This project does not have any tasks yet.
        </p>
      )}
      {sortedTasks.length > 0 && (
        <ul className="p-4 mt-8 rounded-md bg-stone-100">
          {sortedTasks.map((task) => (
            <li
              className="flex justify-between items-center my-4 relative"
              key={task.id}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleStatus(task.id)}
                  className="mr-2"
                />
                <span
                  className={
                    task.completed ? "line-through text-stone-500" : ""
                  }
                >
                  {task.text}
                </span>
                {task.pinned && (
                  <FaThumbtack className="ml-2 text-stone-700" /> // Pin icon for pinned tasks
                )}
              </div>
              <div className="relative">
                <button
                  className="text-stone-700 hover:text-stone-900"
                  onClick={() => toggleDropdown(task.id)}
                >
                  <FaEllipsisV />
                </button>
                {openDropdownId === task.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-gray-100"
                      onClick={() => {
                        onTogglePin(task.id); // Use the function passed from the parent
                        setOpenDropdownId(null);
                      }}
                    >
                      {task.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-red-100 hover:text-red-500"
                      onClick={() => {
                        onDelete(task.id);
                        setOpenDropdownId(null);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
