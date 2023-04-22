import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import { Button, Card, Chip, FormControl, FormControlLabel, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../actions/actionTodo';
import { statusMapTable } from './TodoLists';
import { priorityMapTable } from './TodoLists';
import MenuIcon from '@mui/icons-material/Menu';
import StyleIcon from '@mui/icons-material/Style';
const TodoNode = ({ props, setId, setOpenForm }) => {
    const dispatch = useDispatch();
    const currentDT = new Date();
    const nodeDT = new Date(props.dueDate + (props.dueDate.includes("Z") ? "" : "Z"));
    const hours = (nodeDT - currentDT) / 36e5;
    const [updateStatusAnchor, setUpdateStatusAnchor] = useState(null);
    const isUpdateStatusOpen = Boolean(updateStatusAnchor);

    const handlePriorityNodeColor = () => {
        switch (props.priority) {
            case 1:
            case 2:
            case 4:
                return priorityMapTable[props.priority].bgcolor;
            default:
                return "white";
        }
    }

    const handleStatusChip = () => {
        let name = "Not Assign";
        let bgcolor = 'black'
        let color = 'white'
        switch (props.status) {
            case 1:
            case 2:
            case 4:
                name = statusMapTable[props.status].name;
                bgcolor = statusMapTable[props.status].bgcolor;
                color = statusMapTable[props.status].color;
                break;
            default:
                break;
        }
        return (<Chip label={name} sx={{ fontSize: '11px', paddingInline: '10px', bgcolor: `${bgcolor}`, color: `${color}` }} size='small' />)
    }

    const handleDueDateUI = () => {
        let left_day = "Expired";
        let color = "steelblue";

        if (hours < 0) {
            left_day = "Expired (Due: " + nodeDT.toLocaleDateString() + ")";
            color = "red";
        }
        else if (hours <= 24) {
            left_day = "Today";
        }
        else if (hours <= 48) {
            left_day = "Tomorrow";
        }
        else {
            left_day = parseInt(hours / 24) + " days left";
        }
        return (<Typography fontSize={'13px'} color={color} fontWeight={color === "red" ? 'bold' : 'normal'}>
            {left_day}
        </Typography>)
    }

    const handleDeleteTask = () => {
        dispatch(actions.deleteTask(props.id));
    }

    const handleUpdateStatus = (event) => {
        const val = { ...props, status: parseInt(event.target.name) };
        dispatch(actions.updateTask(val));
        setUpdateStatusAnchor(null);
    }

    return (<Card sx={{ width: 300, height: 410 }} elevation={3}>
        <div style={{ display: 'grid', height: '410px', gridTemplateRows: "50px 40px 280px 30px", color: '#373d3f' }}>
            <div style={{ background: `${handlePriorityNodeColor()}` }} >
                <div style={{ display: 'flex', direction: 'row', height: '50px' }} >
                    <Tooltip title={props.name}>
                        <h3 style={{
                            flex: "90%", display: 'flex', alignItems: 'center',
                            marginBlock: '0', marginInline: '10px', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '200px'
                        }}>{props.name}</h3>
                    </Tooltip>
                    <div style={{ flex: '10%', display: "flex", alignItems: "center" }}>
                        {(hours >= 0) && <Tooltip title={"Edit Task"}><IconButton onClick={() => { setId(props.id); setOpenForm(true); }}> <EditIcon /></IconButton></Tooltip>}
                        <Tooltip title={"Delete Task"}><IconButton onClick={handleDeleteTask}><ClearIcon /></IconButton></Tooltip>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', direction: 'row', height: '50px' }} >
                <span style={{ padding: '10px', flex: "90%" }}> {handleStatusChip()}  </span>
                <div style={{ flex: '10%', display: "flex", alignItems: "center" }}>
                    <Tooltip title="Update Status">
                        <IconButton onClick={(event) => { setUpdateStatusAnchor(event.currentTarget); }}><MenuIcon /></IconButton>
                    </Tooltip>
                    {isUpdateStatusOpen && (<Popover open={isUpdateStatusOpen} anchorEl={updateStatusAnchor}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        onClose={() => { setUpdateStatusAnchor(null) }}>
                        <FormControl sx={{ margin: '10px' }} >
                            <span>Update To : </span>
                            {props.status !== 1 && <Button startIcon={<StyleIcon fontSize='small' />} onClick={handleUpdateStatus} name={1}> {statusMapTable[1].name} </Button>}
                            {props.status !== 2 && <Button startIcon={<StyleIcon fontSize='small' />} onClick={handleUpdateStatus} name={2}> {statusMapTable[2].name} </Button>}
                            {props.status !== 4 && <Button startIcon={<StyleIcon fontSize='small' />} onClick={handleUpdateStatus} name={4}> {statusMapTable[4].name} </Button>}
                        </FormControl>
                    </Popover>)}
                </div>
            </div>

            <div style={{ margin: '20px', textOverflow: 'ellipsis', overflowX: 'hidden', fontSize: '14px' }}>
                {props.description}
            </div>
            <div style={{ flex: '10%', display: "flex", alignItems: "center", padding: '10px' }}>
                <EventIcon color='primary' />
                <label style={{ paddingLeft: '10px', fontSize: '13px' }}>
                    {handleDueDateUI()}
                </label>
            </div>
        </div>
    </Card>)
}

export default TodoNode;