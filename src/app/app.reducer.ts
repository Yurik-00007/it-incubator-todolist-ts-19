import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";


//thunk

/*const initializeApp = createAppAsyncThunk<any, void>('app/initializeApp',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            debugger
            const res = await authAPI.me()
            debugger
            if (res.data.resultCode === ResultCode.Success) {
                debugger
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
                //return { isLoggedIn: true };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        } finally {
            dispatch(appActions.setAppInitialized({isInitialized: true}));
        }
    })
    */

/*
export const _initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }

    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  });
};
*/

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status;
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized;
        },
    },
    /*
  extraReducers:builder => {
    builder

        .addCase(appThunks.initializeApp.fulfilled,(state, action)=>{
            debugger
            state.isInitialized = action.payload.isLoggedIn;
        })

  }

     */
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
//export const appThunks = {initializeApp};


