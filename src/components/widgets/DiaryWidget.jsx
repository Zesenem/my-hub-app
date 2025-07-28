import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, deleteTodo, toggleTodo } from "../../app/features/diary/diarySlice";
import toast from "react-hot-toast";

const FormInput = (props) => (
  <input
    {...props}
    className={`w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      props.className || ""
    }`}
  />
);

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const isCompleted = todo.completed;

  return (
    <div
      className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
        isCompleted
          ? "bg-gray-100/70 dark:bg-gray-800/60"
          : "bg-white/80 dark:bg-gray-700/70 shadow-sm"
      }`}
    >
      <div className="flex items-center flex-grow cursor-pointer" onClick={onToggle}>
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
            isCompleted ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-500"
          }`}
        >
          {isCompleted && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-gray-800 dark:text-gray-200 ${
              isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""
            }`}
          >
            {todo.text}
          </p>
          {todo.alarmTime && (
            <div
              className={`flex items-center text-xs mt-0.5 ${
                isCompleted
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-blue-500 dark:text-blue-400"
              }`}
            >
              <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{todo.alarmTime}</span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="ml-2 p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-10 px-4 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl">
    <div className="mx-auto mb-3 h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
      <svg
        className="h-6 w-6 text-green-600 dark:text-green-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.71,8.71L13,15.41V16a1,1,0,0,1-2,0V15.41l-4.71-4.7a1,1,0,0,1,1.42-1.42L12,13.59l3.29-3.3a1,1,0,0,1,1.42,1.42Z"></path>
      </svg>
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-200">All tasks complete!</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new task above.</p>
  </div>
);

export default function DiaryWidget() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.diary.todos);

  const [newTodoText, setNewTodoText] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("");

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.completed - b.completed);
  }, [todos]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success("Notifications enabled!");
        }
      });
    }
  }, []);

  useEffect(() => {
    const activeTimeouts = new Map();
    todos.forEach((todo) => {
      if (!todo.completed && todo.alarmTime) {
        const [hours, minutes] = todo.alarmTime.split(":");
        const now = new Date();
        const alarmDate = new Date();
        alarmDate.setHours(hours, minutes, 0, 0);

        if (alarmDate > now) {
          const timeoutId = setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("MyHub Reminder", { body: todo.text, icon: "/favicon.png" });
            }
          }, alarmDate.getTime() - now.getTime());
          activeTimeouts.set(todo.id, timeoutId);
        }
      }
    });
    return () => activeTimeouts.forEach(clearTimeout);
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim() === "") return;
    dispatch(addTodo({ text: newTodoText, alarmTime: newAlarmTime }));
    setNewTodoText("");
    setNewAlarmTime("");
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleAddTodo} className="mb-4 space-y-2">
        <FormInput
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="New task (e.g., Drink water)"
          required
        />
        <div className="flex items-center gap-2">
          <FormInput
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            className="text-gray-500"
          />
          <button
            type="submit"
            className="w-full flex-grow bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-2 flex-grow overflow-y-auto pr-1.5 -mr-1.5">
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 pt-2 pb-1">
          Tasks for Today
        </h2>
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => dispatch(toggleTodo(todo.id))}
              onDelete={() => dispatch(deleteTodo(todo.id))}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
