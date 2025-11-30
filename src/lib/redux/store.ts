import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import formReducer from "./features/form/stateSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        formState: formReducer,
    },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;