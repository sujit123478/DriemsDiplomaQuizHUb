import {createSlice} from '@reduxjs/toolkit';
const userSlicer = createSlice(
    {
        name: 'users',
        initialState:{
            user:null,
        },
        reducers:{
            setUser:(state,action) => {
            state.user = action.payload
            },

        },
    },
);

export const {setUser} = userSlicer.actions;
export default userSlicer.reducer;