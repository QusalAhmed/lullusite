import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// db type
import { VariationType } from "@/actions/store/get-product";

export interface CartState {
    carts: Array<VariationType & { quantity: number }>
}

const initialState: CartState = {
    carts: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<VariationType>) => {
            const existingItem = state.carts.find(cart =>
                cart.id === action.payload.id
            )
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.carts.push({...action.payload, quantity: 1})
            }
        },
        minusItem: (state, action: PayloadAction<{ id: string }>) => {
            const existingItem = state.carts.find(cart =>
                cart.id === action.payload.id
            )
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1
            } else if (existingItem && existingItem.quantity === 1) {
                state.carts = state.carts.filter(cart => cart.id !== action.payload.id)
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.carts = state.carts.filter(item => item.id !== action.payload)
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.carts.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
            }
        },
        addNUpdateQuantity: (state, action: PayloadAction<VariationType & { quantity: number }>) => {
            const existingItem = state.carts.find(item =>
                item.id === action.payload.id
            )
            if (existingItem) {
                existingItem.quantity = action.payload.quantity
            } else {
                state.carts.push({
                    ...action.payload,
                    quantity: action.payload.quantity
                })
            }
        },
        clearCart: (state) => {
            state.carts = []
        },
    },
})

export const {addItem, minusItem, removeItem, updateQuantity, addNUpdateQuantity, clearCart} = cartSlice.actions

export default cartSlice.reducer