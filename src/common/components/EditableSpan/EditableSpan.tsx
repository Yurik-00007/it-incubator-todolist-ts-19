import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

/**
 * Компонент редактируемого заголовка.
 * Применяется и в именах todolists и tasks
 * @component
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.value - Текущее значение заголовка.
 * @param {function} props.onChange - Функция для обновления значения заголовка.
 *
 * @returns {JSX.Element} - Возвращает JSX элемент редактируемого заголовка.
 */

type EditableSpanPropsType = {
    value: string;
    onChange: (newValue: string) => void;
};

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    };
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    };
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    return editMode ? (
        <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
    ) : (
        <span onDoubleClick={activateEditMode}>{props.value}</span>
    );
});
