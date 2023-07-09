import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app.reducer";

/**
 * Обрабатывает ошибки сети сервера.
 * Проверяет какая это ошибка нативная или связанная с библиотекой Axios
 * @param {unknown} e - Ошибка или исключение.
 * @param {Dispatch} dispatch - Функция диспетчера для отправки действий.
 */

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
  const err = e as Error | AxiosError<{ error: string }>;
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : "Some error occurred";
    dispatch(appActions.setAppError({ error }));
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
  }
  // dispatch(appActions.setAppStatus({ status: "failed" }));
};
