import { AppDispatch, AppRootStateType } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {ResponseType} from "common/types";

/**
* Обертка для типизации thunk, для того чтобы не писать 3 параметр в типизации thunk.
*
*/

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null|ResponseType;
}>();
