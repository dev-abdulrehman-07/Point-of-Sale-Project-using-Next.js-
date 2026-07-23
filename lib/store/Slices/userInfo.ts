import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { iEmployee } from "@/model/Employee.Model";


interface userInfoInterface {

    id? : string   | null,
    name : string  | null,
    role : iEmployee["role"] | null,
    email : string | null,

}

const initialState : userInfoInterface = {

    id    : null,
    name  : null,
    role  : null ,
    email : null,
    
}


export const userInfo = createSlice({
     name: 'userInfo',
     initialState,
     reducers : {


        loginSet : (state ,action: PayloadAction<userInfoInterface>)=>{
const {id ,name, role , email } = action.payload;
state.id = id;
state.email = email;
state.name = name;
state.role = role;
        },


        logOut : (state)=>{
            state.id = null;
            state.name = null;
state.email = null;
state.role = null;
        }




    












     }
})

export const {loginSet,logOut}= userInfo.actions;

export default userInfo.reducer;
