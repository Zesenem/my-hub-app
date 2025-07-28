import { createSlice } from "@reduxjs/toolkit";

const DIARY_STORAGE_KEY = "my-hub-app.diaryTodos";

const loadTodos = () => {
  try {
    const serializedTodos = localStorage.getItem(DIARY_STORAGE_KEY);
    if (serializedTodos === null) {
      return [
        { id: 1, text: "Finish school project", completed: false, alarmTime: null },
        { id: 2, text: "Take calcium at 18:00", completed: false, alarmTime: "18:00" },
        { id: 3, text: "Buy groceries", completed: true, alarmTime: null },
      ];
    }
    return JSON.parse(serializedTodos);
  } catch (err) {
    console.error("Could not load diary todos from localStorage", err);
    return [];
  }
};

const saveTodos = (todos) => {
  try {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error("Could not save diary todos to localStorage", err);
  }
};

const initialState = {
  todos: loadTodos(),
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const { text, alarmTime } = action.payload;
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        alarmTime: alarmTime || null,
      };
      state.todos.unshift(newTodo);
      saveTodos(state.todos);
    },
    deleteTodo: (state, action) => {
      const todoId = action.payload;
      state.todos = state.todos.filter((todo) => todo.id !== todoId);
      saveTodos(state.todos);
    },
    toggleTodo: (state, action) => {
      const todoId = action.payload;
      const todo = state.todos.find((todo) => todo.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
      }
      saveTodos(state.todos);
    },
  },
});

export const { addTodo, deleteTodo, toggleTodo } = diarySlice.actions;

export default diarySlice.reducer;
