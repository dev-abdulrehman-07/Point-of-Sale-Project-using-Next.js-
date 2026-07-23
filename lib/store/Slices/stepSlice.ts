

import { createSlice,current,PayloadAction } from "@reduxjs/toolkit";




const StepSlice  = createSlice({
name: "stepReducer",
initialState :{
        currentstep : 1,
        totalSteps : 3 
    }  ,
reducers :{
    stepincreaser : (state)=>{
        state.currentstep = Math.min(state.currentstep + 1, state.totalSteps)
    },
    stepdecreaser : (state)=>{
        state.currentstep = Math.max(state.currentstep - 1, 1)
    }

}



})


export const {stepincreaser,stepdecreaser} = StepSlice.actions

export default StepSlice.reducer