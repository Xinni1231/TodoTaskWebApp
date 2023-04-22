import { performTodoAction } from "../reducers/todoSlice";
import api from "./api"

export const ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    FETCH_SINGLE: 'FETCH_SINGLE',
    FETCH_ALL: 'FETCH_ALL',
}
export const fetchAll = (sortedName, filters) => dispatch => {
    sortedName = sortedName || "duedate";
    filters = filters || "-";

    api.todo().fetchAll(sortedName, filters).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.FETCH_ALL,
            data: res.data
        }
        ))
    }).catch(err => console.log(err))
};

export const createNew = (record) => dispatch => {
    api.todo().createNew(record).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.CREATE,
            data: res.data
        }))
    }).catch(err => console.log(err))
};

export const deleteTask = (id) => dispatch => {
    api.todo().deleteTask(id).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.DELETE,
            data: id
        }))
    }).catch(err => console.log(err))
}

export const updateTask = (record) => dispatch => {
    api.todo().updateTask(record).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.UPDATE,
            data: {...record}
        }))
    })
}