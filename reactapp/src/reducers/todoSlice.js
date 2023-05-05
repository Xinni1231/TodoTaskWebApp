import { createSlice } from "@reduxjs/toolkit";
import { ACTION_TYPES } from "../actions/actionTodo";

const initialState = {
    items: [],
    isLoading: false,
    errMsg: '',
    errTitle: ''
}

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        performTodoAction: (state = initialState, action) => {
            switch (action.payload.type) {
                case ACTION_TYPES.FETCH_ALL:
                    return { ...state, items: [...action.payload.data], isLoading: false }
                case ACTION_TYPES.CREATE:
                    return { ...state, items: [...state.items, action.payload.data], isLoading: false }
                case ACTION_TYPES.UPDATE:
                    return { ...state, items: state.items.map(x => x.id === action.payload.data.id ? action.payload.data : x), isLoading: false }
                case ACTION_TYPES.DELETE:
                    return { ...state, items: state.items.filter(x => x.id !== action.payload.data), isLoading: false };
                case ACTION_TYPES.START_LOADING:
                    return { ...state, isLoading: true, errTitle: '', errMsg: '' }
                case ACTION_TYPES.ERR_QUIT_LOADING:
                    return { ...state, isLoading: false, errTitle: action.payload.err.title, errMsg: action.payload.err.msg }
                case ACTION_TYPES.ERR_RESET:
                    return { ...state, isLoading: false, errTitle: '', errMsg: '' }
                default:
                    break;
            }
        }
    }
})

export const { performTodoAction } = todoSlice.actions;
export default todoSlice.reducer;