import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "app/store";
import {appActions} from "app/app.reducer";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {ResponseType} from "common/types";

/**
 * Обертка для выполнения асинхронных thunk-функций с блоком try-catch.
 *
 * @param {BaseThunkAPI<AppRootStateType, any, AppDispatch, null | ResponseType>} thunkAPI - Объект `thunkAPI` для доступа к функциям диспетчера и прочим утилитам.
 * @param {Function} logic - Функция, содержащая логику выполнения асинхронной операции.
 *
 * @returns {Promise<any>} - Объект Promise, который разрешается со значением, возвращаемым из `logic()`.
 */
export const thunkTryCatch=async (thunkAPI:BaseThunkAPI<AppRootStateType, any, AppDispatch, null | ResponseType>,
                                  logic:Function)=>{
    //debugger
    const {dispatch,rejectWithValue}=thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
        //debugger
        return await logic()
    }catch (e) {
        //debugger
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }finally {
        //debugger
        dispatch(appActions.setAppStatus({ status: "idle" }));
    }
}