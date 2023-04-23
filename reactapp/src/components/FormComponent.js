import { FormControlLabel, Radio, Typography, Checkbox, Chip } from "@mui/material";
import React, { useState } from 'react';
import './style.css';

export const CommonRadioForm = ({ ikey, ivalue, chips }) => {
    return (<FormControlLabel value={ikey} control={<Radio size='small' />}
        label={
            <div className='flex-row-div'>
                <Typography fontSize={'13px'} sx={{ marginRight: '5px' }}>{ivalue}</Typography>
                {
                    chips && Object.entries(chips).map(([key, value]) => {
                        return (<Chip key={key} label={`${value.name}`} size='small'
                            sx={{
                                fontSize: '9px', paddingInline: '4px', marginLeft: '2px',
                                bgcolor: `${value.bgcolor}`, color: `${value.color}`
                            }} />);
                    })
                }
            </div>
        } />);
}

export const CommonCheckboxForm = ({ ikey, ivalue, state, chip, handleCheckboxClick }) => {
    const handleCheck = (event) => {
        handleCheckboxClick(event);
    };

    return (<FormControlLabel
        control={
            <Checkbox name={ikey} size='small' checked={state} onChange={handleCheck} />
        }
        label={
            chip ?
                <Chip label={`${chip.name}`} size='small'
                    sx={{ fontSize: '10px', paddingInline: '4px', bgcolor: `${chip.bgcolor}`, color: `${chip.color}` }} /> :
                <Typography fontSize={'13px'}>{ivalue}</Typography>
        } />);
}
export const useForm = (initialFieldValues, validate, setCurrentId) => {
    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const handleInputChange = e => {
        const { name, value } = e.target
        const fieldValue = { [name]: value }
        setValues({
            ...values,
            ...fieldValue
        })
        validate(fieldValue)
    }

    const handleDateTimeChange = (e, name) => {
        const fieldValue = { [name]: e }
        setValues({
            ...values,
            ...fieldValue
        })
        validate(fieldValue)
    }

    return {
        values,
        errors,
        setErrors,
        handleInputChange,
        handleDateTimeChange,
    };
}