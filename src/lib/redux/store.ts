import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import formReducer from "./features/form/stateSlice";
import cartReducer from "./features/cart/cartSlice";

import { loadState, saveState } from "./local-storage";

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        // Merchant
        counter: counterReducer,
        formState: formReducer,
        // Page
        cart: cartReducer,

        preloadedState,
    },
});

// Save on every change (you can throttle this)
store.subscribe(() => {
    const state = store.getState();

    // Optionally only persist a slice:
    // saveState({ auth: state.auth, cart: state.cart });
    saveState(state);
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;