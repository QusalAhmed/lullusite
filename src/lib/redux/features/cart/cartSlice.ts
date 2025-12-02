import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
    items: Array<{ id: string; name: string; quantity: number; price: number }>
}

const initialState: CartState = {
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<{ id: string; name: string; price: number }>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1 })
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
            }
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer