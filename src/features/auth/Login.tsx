import React from "react";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@mui/material";
import {useActions, useAppDispatch} from "common/hooks";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {authThunks} from "features/auth/auth.reducer";
import {FormikErrorType, LoginParamsType} from "features/auth/auth.api";
import s from './Login.module.css'
import {ResponseType} from "common/types";
import {AppRootStateType} from "app/store";

export const Login = () => {
        const dispatch = useAppDispatch();
        //const {login} = useActions(authThunks);

        const isLoggedIn = useSelector(selectIsLoggedIn);
        const isStatus = useSelector((state: AppRootStateType) => state.app.status );

        const formik = useFormik({
            validate: (values) => {
                const errors: FormikErrorType = {}
                // const result=!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                // console.log(` ${result}`)

                if (!values.email) {
                    errors.email = 'Required'
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
                }

                if (!values.password) {
                    errors.password = 'Required'
                } else if (values.password.length < 3) {
                    errors.password = 'Password should be more then 3 symbols'
                }
                return errors
            },
            initialValues: {
                email: "",
                password: "",
                rememberMe: false,
            },

            onSubmit: async (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
                try {
                    await dispatch(authThunks.login(values))
                        .unwrap()
                } catch (reason: unknown) {
                    const {fieldsErrors} = reason as ResponseType
                    if (fieldsErrors) {
                        fieldsErrors.forEach((fieldError) => {
                            formikHelpers.setFieldError(fieldError.field, fieldError.error)
                        })
                    }
                }
            },

            /*
                    onSubmit: (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
                        dispatch(authThunks.login(values))
                            //login(values)
                            .unwrap()
                            .then((res) => {
                                //debugger
                            })
                            .catch((reason: ResponseType) => {
                                const {fieldsErrors} = reason
                                //debugger
                                reason.fieldsErrors?.forEach((fieldError) => {
                                    formikHelpers.setFieldError(fieldError.field, fieldError.error)
                                })
                            })
                    },
            */

        });

        if (isLoggedIn) {
            return <Navigate to={"/"}/>;
        }

        return (
            <Grid container justifyContent="center">
                <Grid item xs={4}>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl>
                            <FormLabel>
                                <p>
                                    To log in get registered{" "}
                                    <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                                        here
                                    </a>
                                </p>
                                <p>or use common test account credentials:</p>
                                <p> Email: free@samuraijs.com</p>
                                <p>Password: free</p>
                            </FormLabel>
                            <FormGroup>
                                <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                                {formik.touched.email && formik.errors.email &&
                                    <div className={s.fieldError} /*style={{color: 'red'}}*/>{formik.errors.email}</div>}
                                <TextField type="password" label="Password"
                                           margin="normal" {...formik.getFieldProps("password")} />
                                {formik.touched.password && formik.errors.password &&
                                    <div className={s.fieldError} /*style={{color: 'red'}}*/>{formik.errors.password}</div>}
                                <FormControlLabel
                                    label={"Remember me"}
                                    control={<Checkbox {...formik.getFieldProps("rememberMe")}
                                                       checked={formik.values.rememberMe}/>}
                                />
                                <Button type={"submit"} variant={"contained"} color={"primary"} disabled={isStatus === 'loading'}>
                                    Login
                                </Button>
                            </FormGroup>
                        </FormControl>
                    </form>
                </Grid>
            </Grid>
        );
    }
;
