import loaderSlice from "./loaderSlice";
import userSlice from "./userSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
   reducer: {
         users:userSlice,
         loader:loaderSlice
    },
},
);
export default store;