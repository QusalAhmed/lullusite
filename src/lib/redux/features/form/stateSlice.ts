import { createSlice } from '@reduxjs/toolkit'

export interface FormState {
    id: string
    ready: boolean
}

const initialState: FormState = {
    id: '',
    ready: true,
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormReady: (state) => {
            state.ready = true
        },
        setFormId: (state, action) => {
            state.id = action.payload
        },
        setFormNotReady: (state) => {
            state.ready = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { setFormReady, setFormId, setFormNotReady } = formSlice.actions

export default formSlice.reducer