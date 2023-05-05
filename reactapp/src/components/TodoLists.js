import AddCardIcon from '@mui/icons-material/AddCard';
import EventIcon from '@mui/icons-material/Event';
import SortIcon from '@mui/icons-material/Sort';
import TuneIcon from '@mui/icons-material/Tune';
import { AppBar, Alert, AlertTitle, Button, Dialog, Divider, FormControl, FormGroup, Grid, IconButton, Popover, RadioGroup, Skeleton, Slider, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../actions/actionTodo';
import { CommonCheckboxForm, CommonRadioForm } from './FormComponent';
import { TodoForm } from './TodoForm';
import TodoNode from './TodoNode';
import './style.css';

export const statusMapTable = {
    1: { name: "Not Started", bgcolor: "#FFDEDE", color: "black" },
    2: { name: "In Progress", bgcolor: "#2F58CD", color: "white" },
    4: { name: "Completed", bgcolor: "#54B435", color: "white" }
};

export const priorityMapTable = {
    1: { name: "Low", bgcolor: "lightgrey", color: "black" },
    2: { name: "Medium", bgcolor: "#FFB84C", color: "black" },
    4: { name: "High", bgcolor: "#F16767", color: "black" }
};

const TodoList = (props) => {
    // due date properties
    const [dueValue, setDueValue] = useState(365);

    // sorting properties
    const sortOrderList = [["A", "Ascending"], ["D", "Descending"]];
    const sortList = [["duedate", "DueDate", null], ["name", "Name", null],
    ["status", "Status", statusMapTable], ["priority", "Priority", priorityMapTable]];
    const [sortValue, setSortValue] = useState("duedate");
    const [sortOrder, setSortOrder] = useState("A");
    const [sortAnchor, setSortAnchor] = useState(null);
    const isSortOpen = Boolean(sortAnchor);

    // filter properties
    const [filterStatusList, setfilterStatusList] = React.useState({ 1: { name: "Not Started", state: true }, 2: { name: "In Progress", state: true }, 4: { name: "Completed", state: true } });
    const [filterPriorityList, setfilterPriorityList] = React.useState({ 1: { name: "Low", state: true }, 2: { name: "Medium", state: true }, 4: { name: "High", state: true } });
    const [filterPriorityValue, setFilterPriorityValue] = useState(7);
    const [filterStatusValue, setFilterStatusValue] = useState(7);
    const [filterAnchor, setFilterAnchor] = useState(null);
    const isFilterOpen = Boolean(filterAnchor);

    const [openForm, setOpenForm] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(0);
    const { items, isLoading, errTitle, errMsg } = useSelector((state) => state.todoSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.fetchAll("", ""));
    }, []);

    const handleStatusCheckboxClick = (event) => {
        const val = parseInt(event.target.name);

        if (event.target.checked) {
            const newVal = filterStatusValue | val;
            setFilterStatusValue(newVal);
        }
        else {
            const newVal = filterStatusValue & ~val;
            setFilterStatusValue(newVal);
        }
        setfilterStatusList({ ...filterStatusList, [val]: { ...filterStatusList[val], state: event.target.checked } });
    };

    const handlePriorityCheckboxClick = (event) => {
        const val = parseInt(event.target.name);
        if (event.target.checked) {
            const newVal = filterPriorityValue | val;
            setFilterPriorityValue(newVal);
        }
        else {
            const newVal = filterPriorityValue & ~val;
            setFilterPriorityValue(newVal);
        }
        setfilterPriorityList({ ...filterPriorityList, [val]: { ...filterPriorityList[val], state: event.target.checked } });
    };

    const handleSliderChange = (event) => {
        setDueValue(event.target.value === '' ? '' : Number(event.target.value));
    }

    const getSelectedIdData = () => {
        return items.find(x => x.id === selectedId);
    };

    const handlePopOverClose = () => {
        const dueDayData = "duedate-" + dueValue;
        const sortData = sortOrder === "D" ? sortValue + "_desc" : sortValue;
        const filterStatusData = "status-" + filterStatusValue;
        const filterPriorityData = "priority-" + filterPriorityValue;
        console.log(dueDayData + "_" + filterStatusData + "_" + filterPriorityData);
        dispatch(actions.fetchAll(sortData, dueDayData + "_" + filterStatusData + "_" + filterPriorityData));
    }

    return (<div>
        {errMsg && !openForm &&
           <AppBar position='static'>
             <Alert variant="filled" severity="error">
                <AlertTitle sx={{fontWeight:'bold'}}>{errTitle}</AlertTitle>
                {errMsg}
            </Alert></AppBar>}
        <Toolbar direction='row' sx={{ bgcolor: '#ECF2FF' }}>
            <Button startIcon={<AddCardIcon fontSize='large' />} sx={{ fontWeight: "bold" }} variant='outlined' onClick={() => { setSelectedId(0); setOpenForm(true); }}>
                Create New
            </Button>
            <Dialog open={openForm} >
                <TodoForm isOpenForm={setOpenForm} selectedId={getSelectedIdData()} />
            </Dialog>
            <div style={{ flex: '10%', display: "flex", alignItems: "center", justifyContent: 'right' }}>
                <Tooltip title="Sort By">
                    <IconButton onClick={(event) => { setSortAnchor(event.currentTarget); }}> <SortIcon /></IconButton>
                </Tooltip>

                {isSortOpen && (<Popover open={isSortOpen} anchorEl={sortAnchor} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    onClose={() => { handlePopOverClose(); setSortAnchor(null) }}>
                    <FormControl sx={{ margin: '10px', width: '300px' }} >
                        <Typography sx={{ fontSize: '15px', fontWeight: 'semibold' }}>Order</Typography>
                        <RadioGroup sx={{ marginInline: '10px' }} value={sortOrder} onChange={(event) => { setSortOrder(event.target.value) }}>
                            {sortOrderList.map((item, index) => {
                                return (<CommonRadioForm key={index} ikey={item.at(0)} ivalue={item.at(1)} />);
                            })}
                        </RadioGroup>
                        <Divider />
                        <Typography sx={{ marginTop: '10px', fontSize: '15px', fontWeight: 'semibold' }}>Sort By</Typography>
                        <RadioGroup sx={{ marginInline: '10px' }} value={sortValue} onChange={(event) => { setSortValue(event.target.value) }}>
                            {sortList.map((item, index) => {
                                return (<CommonRadioForm key={index} ikey={item.at(0)} ivalue={item.at(1)} chips={item.at(2)} />);
                            })}
                        </RadioGroup>
                    </FormControl>
                </Popover>)}

                <Tooltip title="Filter By">
                    <IconButton onClick={(event) => { setFilterAnchor(event.currentTarget); }}> <TuneIcon /></IconButton>
                </Tooltip>

                {isFilterOpen && (<Popover open={isFilterOpen} anchorEl={filterAnchor} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    onClose={() => { handlePopOverClose(); setFilterAnchor(null) }}>
                    <FormControl sx={{ margin: '10px', width: '200px' }} >
                        <Typography sx={{ fontSize: '15px', fontWeight: 'semibold' }}>Due within <b style={{ color: 'darkblue' }}>{dueValue}</b> day(s)</Typography>
                        <FormGroup sx={{ marginInline: '10px', marginTop: '10px' }}>
                            <div className='flex-row-div'>
                                <EventIcon color='primary' fontSize='small' style={{ display: "flex", alignItems: "center" }} />
                                <Slider sx={{ marginInline: '10px' }} size='small'
                                    defaultValue={10} step={1} min={1} max={365} onChange={handleSliderChange}
                                    value={typeof dueValue === 'number' ? dueValue : 365} />
                            </div>
                        </FormGroup>
                        <Divider sx={{ marginBlock: "10px" }} />
                        <Typography sx={{ fontSize: '15px', fontWeight: 'semibold' }}>Status</Typography>
                        <FormGroup sx={{ marginInline: '10px' }}>
                            {Object.entries(filterStatusList).map(([ikey, ivalue], index) => {
                                return (<CommonCheckboxForm key={index} ikey={ikey} ivalue={ivalue.name} state={ivalue.state}
                                    chip={statusMapTable[ikey]} handleCheckboxClick={handleStatusCheckboxClick} />);
                            })}
                        </FormGroup>
                        <Divider sx={{ marginBlock: "10px" }} />
                        <Typography sx={{ fontSize: '15px', fontWeight: 'semibold' }}>Priority</Typography>
                        <FormGroup sx={{ marginInline: '10px' }} >
                            {Object.entries(filterPriorityList).map(([ikey, ivalue], index) => {
                                return (<CommonCheckboxForm key={index} ikey={ikey} ivalue={ivalue.name} state={ivalue.state}
                                    chip={priorityMapTable[ikey]} handleCheckboxClick={handlePriorityCheckboxClick} />);
                            })}
                        </FormGroup>
                    </FormControl>
                </Popover>)}
            </div>
        </Toolbar>
        <Grid container spacing={4} style={{ marginLeft: 0 }}>
            {isLoading ?
                [...Array(8)].map((item, index) => {
                    return <Grid item key={`loading-${index}`}>
                        <Stack spacing={1}>
                            <Skeleton variant='rounded' width={300} height={50} />
                            <Skeleton variant='rounded' width={300} height={350} />
                        </Stack>
                    </Grid>
                })
                :
                items.map((item, index) => {
                    return (<Grid item key={index} ><TodoNode props={{ ...item }} setId={setSelectedId} setOpenForm={setOpenForm} /></Grid>)
                })
            }
        </Grid>
    </div>);
}

export default TodoList;