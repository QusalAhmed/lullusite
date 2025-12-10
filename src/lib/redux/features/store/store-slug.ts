import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PageSlugState {
    storeSlug: string | null
}

const initialState: PageSlugState = {
    storeSlug: null,
}

export const pageSlugSlice = createSlice({
    name: 'pageSlug',
    initialState,
    reducers: {
        setStoreSlug: (state, action: PayloadAction<string>) => {
            state.storeSlug = action.payload
        },
    },
})

export const { setStoreSlug } = pageSlugSlice.actions

export default pageSlugSlice.reducer