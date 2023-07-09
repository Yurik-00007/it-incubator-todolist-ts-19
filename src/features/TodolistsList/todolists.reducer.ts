import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions, RequestStatusType } from "app/app.reducer";
import {todolistsAPI, TodolistType, UpdateTodolistTitleArgType} from "features/TodolistsList/todolists.api";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums";
import { clearTasksAndTodolists } from "common/actions";
import {thunkTryCatch} from "common/utils/thunk-try-catch";
import {tasksThunks} from "features/TodolistsList/tasks.reducer";

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todo/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    return thunkTryCatch(thunkAPI,async ()=>{
    /*  const res = await todolistsApi.getTodolists();
      return { todolists: res.data };
*/
      const res = await todolistsAPI.getTodolists()
      const todolists = res.data
      //dispatch(todolistsActions.setTodolists({todolists: res.data}));
      todolists.forEach(tl => {
        dispatch(tasksThunks.fetchTasks(tl.id))
      })
      return {todolists: res.data};

    })
/*
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsApi.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
*/
  },
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todo/addTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI,async ()=>{
      //dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.resultCode === ResultCode.Success) {
        //dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    })

/*
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsApi.createTodolist(title);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
*/
  },
);

const removeTodolist = createAppAsyncThunk<{ id: string }, string>("todo/removeTodolist", async (id, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI,async ()=>{
    //dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
    const res = await todolistsAPI.deleteTodolist(id);
    if (res.data.resultCode === ResultCode.Success) {
      //dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  })
/*
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
    const res = await todolistsApi.deleteTodolist(id);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
*/
});

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  "todo/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI,async()=>{
      //dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.updateTodolist(arg);
      if (res.data.resultCode === ResultCode.Success) {
        //dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    })
/*
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsApi.updateTodolist(arg);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
*/
  },
);

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodolist: TodolistDomainType = {
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle",
        };
        state.unshift(newTodolist);
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.id);
        if (todo) {
          todo.title = action.payload.title;
        }
      })
      .addCase(clearTasksAndTodolists, () => {
        return [];
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, addTodolist, removeTodolist, changeTodolistTitle };

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
