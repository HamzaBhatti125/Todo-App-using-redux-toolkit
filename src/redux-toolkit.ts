import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v1 as uuid } from "uuid";

import { Todo } from "./type";

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(action.payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, action: PayloadAction<{ id: string; desc: string }>) => {
      const { id, desc } = action.payload;
      const todoToEdit = state.find((todo) => todo.id === id);
      if (todoToEdit) {
        todoToEdit.desc = desc;
      }
    },
    toggle: (
      state,
      action: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const { id, isComplete } = action.payload;
      const toggleTodo = state.find((todo) => todo.id === id);
      if (toggleTodo) {
        toggleTodo.isComplete = isComplete;
      }
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const index = state.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

const selectedTodoSlice = createSlice({
  name: "selectedTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, action: PayloadAction<{ id: string }>) => action.payload.id,
  },
});

const counterSlice = createSlice({
  name: "counterSlice",
  initialState: 0 as number,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: removeTodoActionCreator,
} = todosSlice.actions;
export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

export default configureStore({
  reducer,
});
