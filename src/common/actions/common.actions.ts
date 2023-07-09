import { createAction } from "@reduxjs/toolkit";
/**
 * Очищает todolists и tasks.
 * Создание ActionCreater
 * @type {import("@reduxjs/toolkit").PayloadAction<string>}
 *
 * @property {string} type - Тип действия.
 * @property {string} payload - Данные действия.
 */
export const clearTasksAndTodolists = createAction("common/clear-tasks-todolists");
