import { useState } from "react";

export default function NewTask({ onAdd }) {
  const [eneteredTask, setEnteredTask] = useState("");

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleClick() {
    if (eneteredTask.trim() === "") {
      return;
    }
    onAdd(eneteredTask);
    setEnteredTask("");
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        className="w-64 px-2 rounded-sm bg-stone-200"
        onChange={handleChange}
        value={eneteredTask}
      />
      <button
        className="text-stone-700 hover:text-stone-950"
        onClick={handleClick}
      >
        Add Task
      </button>
    </div>
  );
}
