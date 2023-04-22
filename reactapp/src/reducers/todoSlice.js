import { createSlice } from "@reduxjs/toolkit";
import { ACTION_TYPES } from "../actions/actionTodo";

const initialState = {
    items: [],
    isLoading: true
}

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        performTodoAction: (state = initialState, action) => {
            switch (action.payload.type) {
                case ACTION_TYPES.FETCH_ALL:
                    return { ...state, items: [...action.payload.data], isLoading: true }
                case ACTION_TYPES.CREATE:
                    return { ...state, items: [...state.items, action.payload.data] }
                case ACTION_TYPES.UPDATE:
                    return { ...state, items: state.items.map(x => x.id === action.payload.data.id ? action.payload.data : x) }
                case ACTION_TYPES.DELETE:
                    return { ...state, items: state.items.filter(x => x.id !== action.payload.data) };
                default:
                    break;
            }
        }
    }
})

export const { performTodoAction } = todoSlice.actions;
export default todoSlice.reducer;