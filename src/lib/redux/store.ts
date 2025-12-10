import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import formReducer from "./features/form/stateSlice";
import cartReducer from "./features/cart/cartSlice";
import storeSlugReducer from "./features/store/store-slug";

import { saveState } from "./local-storage";

// Define root reducer
const rootReducer = {
    // Merchant
    counter: counterReducer,
    formState: formReducer,
    // Page
    cart: cartReducer,
    store: storeSlugReducer,
}

export const store = configureStore({
    reducer: rootReducer,
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