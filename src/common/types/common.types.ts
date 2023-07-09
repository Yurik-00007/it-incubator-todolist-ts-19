

/**
 * Возвращаемый тип с данными с сервера и самотипизирующий поле date.
 *
 *
 */

export type FieldErrorType = {
  error: string
  field: string
}
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
  fieldsErrors:FieldErrorType[]
};
