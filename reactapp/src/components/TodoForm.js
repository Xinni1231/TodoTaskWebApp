import { Box, Button, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment/moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../App.css";
import * as actions from '../actions/actionTodo';
import { useForm } from './FormComponent';
import './style.css';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { performTodoAction } from '../reducers/todoSlice';

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
    const { isLoading, errTitle, errMsg } = useSelector((state) => state.todoSlice);
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
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const handleClose = () => {
        dispatch(performTodoAction({ type: actions.ACTION_TYPES.ERR_RESET, }));
        isOpenForm(false);
    };

    const handleSubmitTask = () => {
        if (validate()) {
            let pval = 1;
            switch (values.priority) {
                case "Low": pval = 1; break;
                case "Medium": pval = 2; break;
                case "High": pval = 4; break;
                default: break;
            }
            const newVal = { ...values, priority: pval, status: 1, dueDate: values.dueDate.toISOString() };
            if (selectedId) {
                dispatch(actions.updateTask(newVal));
                if (errTitle) {
                    enqueueSnackbar(`${errTitle}. ${errMsg}`, { variant: 'error' });
                }
                else {
                    enqueueSnackbar('Task successfully updated');
                    isOpenForm(false);
                }
            }
            else {
                dispatch(actions.createNew(newVal));
                if (errTitle) {
                    enqueueSnackbar(`${errTitle}. ${errMsg}`, { variant: 'error' });
                }
                else {
                    enqueueSnackbar('Task successfully added');
                    isOpenForm(false);
                }
            }
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
            <div className='margin-ten'>
                <TextField label='Title' fullWidth name="name" value={values.name} onChange={handleInputChange}
                    inputProps={{ maxLength: 50 }}
                    {...(errors.name && { error: `${errors.name !== ""}`, helperText: errors.name })}
                />
            </div>
            <div className='margin-ten'>
                <TextField label='Description' multiline minRows={4} maxRows={4} xs={7} fullWidth name="description"
                    inputProps={{ maxLength: 500 }}
                    value={values.description} onChange={handleInputChange}
                    {...(errors.description && { error: `${errors.description !== ""}`, helperText: errors.description })} />
            </div>
            <div className='margin-ten'>
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
            <div className='margin-ten'>
                {errors.priorFormControlLabelity && <FormHelperText error={`${errors.priority !== ""}`}>{errors.priority}</FormHelperText>}
            </div>
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='outlined' size='small' disabled={isLoading} onClick={() => { handleClose(); }}>
                    Cancel
                </Button>
                <LoadingButton variant='outlined' sx={{ marginLeft: '10px', paddingInline:'30px' }} loading={isLoading} loadingIndicator="Submitting" onClick={handleSubmitTask}>
                     Submit
                </LoadingButton>
            </div>
        </Box >
    )
};