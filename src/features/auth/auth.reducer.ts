import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/app.reducer";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {clearTasksAndTodolists} from "common/actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {ResultCode} from "common/enums";
import {thunkTryCatch} from "common/utils/thunk-try-catch";

// thunks

const initializeApp = createAppAsyncThunk<any, void>('app/initializeApp',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            //debugger
            const res = await authAPI.me()
            //debugger
            if (res.data.resultCode === ResultCode.Success) {
                //debugger
                //dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
                return { isLoggedIn: true };
            } else {
               // handleServerAppError(res.data, dispatch);
                //debugger
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        } finally {
            dispatch(appActions.setAppInitialized({isInitialized: true}));
        }
    })


const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login',
    async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            //dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.Success) {
                //dispatch(appActions.setAppStatus({status: "succeeded"}));
                //dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
                return {isLoggedIn: true};
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError);
                //handleServerAppError(res.data, dispatch);
                return rejectWithValue(res.data);
            }
        })
/*
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI.login(arg)
                if (res.data.resultCode === ResultCode.Success) {
                    dispatch(appActions.setAppStatus({status: "succeeded"}));
                    //dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
                    return {isLoggedIn: true};
                } else {
                    const isShowAppError = !res.data.fieldsErrors.length
                    handleServerAppError(res.data, dispatch, isShowAppError);
                    //handleServerAppError(res.data, dispatch);
                    return rejectWithValue(res.data);
                }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
*/
})

/*
export const _loginTC =
    (data: LoginParamsType): AppThunk =>
        (dispatch) => {
            dispatch(appActions.setAppStatus({status: "loading"}));
            authAPI
                .login(data)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
                        dispatch(appActions.setAppStatus({status: "succeeded"}));
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                });
        };
*/

const logout=createAppAsyncThunk<{isLoggedIn: boolean},void>('auth/logout',
    async (_, thunkAPI)=>{
    const{dispatch,rejectWithValue}=thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            //dispatch(appActions.setAppStatus({status: "loading"}));
            const res=await authAPI.logout()
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(clearTasksAndTodolists());
                //dispatch(appActions.setAppStatus({status: "succeeded"}));
                //dispatch(authActions.setIsLoggedIn({isLoggedIn: false}));
                return {isLoggedIn: false};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })

/*
            try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res=await authAPI.logout()
                if (res.data.resultCode === ResultCode.Success) {
                    dispatch(clearTasksAndTodolists());
                    dispatch(appActions.setAppStatus({status: "succeeded"}));
                    //dispatch(authActions.setIsLoggedIn({isLoggedIn: false}));
                    return {isLoggedIn: false};
                } else {
                    handleServerAppError(res.data, dispatch);
                    return rejectWithValue(null);

                }
    }catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);

    }
*/
})

/*
export const _logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}));
    authAPI
        .logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: false}));
                dispatch(clearTasksAndTodolists());
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        });
};
*/


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
  /*      setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            debugger
            state.isLoggedIn = action.payload.isLoggedIn;
        },*/
    },
    extraReducers:builder => {
        builder
            .addCase(login.fulfilled,(state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(logout.fulfilled,(state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(initializeApp.fulfilled,(state, action)=>{
                state.isLoggedIn = action.payload.isLoggedIn;
            })
    }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {login,logout,initializeApp};

