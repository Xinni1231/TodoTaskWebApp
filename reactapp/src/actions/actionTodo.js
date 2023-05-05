import { performTodoAction } from "../reducers/todoSlice";
import api from "./api"

export const ACTION_TYPES = {
    START_LOADING: 'START_LOADING',
    ERR_QUIT_LOADING: 'ERR_QUIT_LOADING',
    ERR_RESET: 'ERR_RESET',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    FETCH_SINGLE: 'FETCH_SINGLE',
    FETCH_ALL: 'FETCH_ALL',
}

export const fetchAll = (sortedName, filters) => dispatch => {
    sortedName = sortedName || "duedate";
    filters = filters || "-";

    dispatch(performTodoAction({ type: ACTION_TYPES.START_LOADING }));
    api.todo().fetchAll(sortedName, filters).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.FETCH_ALL,
            data: res.data
        }
        ))
    }).catch(err => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.ERR_QUIT_LOADING,
            err: { title: err.message, msg: 'Failed to retrieve TO-DO items!' }
        }));
    })
};

export const createNew = (record) => dispatch => {
    dispatch(performTodoAction({ type: ACTION_TYPES.START_LOADING }));
    api.todo().createNew(record).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.CREATE,
            data: res.data
        }))
    }).catch(err => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.ERR_QUIT_LOADING,
            err: { title: err.message, msg: 'Failed to create TO-DO item!' }
        }));
    })
};

export const deleteTask = (id) => dispatch => {
    dispatch(performTodoAction({ type: ACTION_TYPES.START_LOADING }));
    api.todo().deleteTask(id).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.DELETE,
            data: id
        }))
    }).catch(err => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.ERR_QUIT_LOADING,
            err: { title: err.message, msg: 'Failed to delete TO-DO item!' }
        }));
    })
}

export const updateTask = (record) => dispatch => {
    dispatch(performTodoAction({ type: ACTION_TYPES.START_LOADING }));
    api.todo().updateTask(record).then(res => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.UPDATE,
            data: { ...record }
        }))
    }).catch(err => {
        dispatch(performTodoAction({
            type: ACTION_TYPES.ERR_QUIT_LOADING,
            err: { title: err.message, msg: 'Failed to update TO-DO item!' }
        }));
    })
}
