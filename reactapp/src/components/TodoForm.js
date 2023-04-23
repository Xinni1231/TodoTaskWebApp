import { Box, Button, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../actions/actionTodo';
import { useForm } from './FormComponent';
import moment from 'moment/moment';
import "../App.css"
import './style.css';

const initialFieldValues = {
    name: '',
    description: '',
    dueDate: '',
    status: '',
    priority: '',
    creator: '',
}

export const TodoForm = ({ selectedId, isOpenForm }) => {
    const priorityMap = { 1: "Low", 2: "Medium", 4: "High" }
    const [val, setVal] = useState(selectedId);
    const dispatch = useDispatch();
    const errorMsg = "* This field is required."
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : errorMsg
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : errorMsg
        if ('priority' in fieldValues)
            temp.priority = fieldValues.priority ? "" : errorMsg
        if ('dueDate' in fieldValues)
            temp.dueDate = fieldValues.dueDate ? "" : errorMsg
        setErrors({
            ...temp
        })
        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const handleClose = () => {
        isOpenForm(false);
    };

    const handleSubmitTask = () => {
        if (validate()) {
            let pval = 1;
            switch (values.priority) {
                case "Low": pval = 1; break;
                case "Medium": pval = 2; break;
                case "High": pval = 4; break;
            }
            const newVal = { ...values, priority: pval, status: 1, dueDate: values.dueDate.toISOString() };
            if (selectedId)
                dispatch(actions.updateTask(newVal));
            else
                dispatch(actions.createNew(newVal));
            isOpenForm(false);
        }
    };

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 365);
        return moment(maxDate);
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
        handleDateTimeChange,
    } = useForm(selectedId ? { ...selectedId, dueDate: moment(selectedId.dueDate), priority: priorityMap[selectedId.priority] } :
        { ...initialFieldValues, dueDate: moment(getTomorrow()) }, validate, 0)

    return (
        <Box component={'form'} autoComplete='off' marginInline={3} marginBottom={3}>
            <h1>To-Do Task</h1>
            <div style={{ margin: '10px' }}>
                <TextField label='Title' fullWidth name="name" value={values.name} onChange={handleInputChange}
                    {...(errors.name && { error: `${errors.name !== ""}`, helperText: errors.name })}
                />
            </div>
            <div style={{ margin: '10px' }}>
                <TextField label='Description' multiline minRows={4} maxRows={4} xs={7} fullWidth name="description"
                    value={values.description} onChange={handleInputChange}
                    {...(errors.description && { error: `${errors.description !== ""}`, helperText: errors.description })} />
            </div>
            <div style={{ margin: '10px' }}>
                <Select label='Priority' sx={{ width: '120px' }} name='priority' value={values.priority}
                    onChange={handleInputChange} >
                    {Object.entries(priorityMap).map(([key, value]) => {
                        return (<MenuItem key={key} value={value}>
                            {value}
                        </MenuItem>)
                    })}
                </Select>
                <DateTimePicker disablePast label='Due Date & Time' sx={{ width: '300px', marginLeft: '20px' }}
                    name="dueDate" value={values.dueDate} maxDate={getMaxDate()}
                    onChange={(newValue) => handleDateTimeChange(newValue, "dueDate")} />
            </div>
            <div style={{ margin: '10px' }}>
                {errors.priority && <FormHelperText error={`${errors.priority !== ""}`}>{errors.priority}</FormHelperText>}
            </div>
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='outlined' onClick={() => { handleClose(); }}>Cancel</Button>
                <Button variant='outlined' sx={{ marginLeft: '10px' }} onClick={handleSubmitTask}>Submit</Button>
            </div>
        </Box >
    )
};