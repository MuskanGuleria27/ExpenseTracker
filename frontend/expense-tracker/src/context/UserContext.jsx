import React, { useState } from "react";
import { UserContext } from "./UserContext.js";

const UserProvider = ({children})=>{
    const [user,setUser] = useState(null);

    //function to update user data after login or profile update
    const updateUser=(userData)=>{
      setUser(userData);
    };
    //function to clear user data on logout
    
    const clearUser=()=>{
      setUser(null);
    };
    return(
        <UserContext.Provider value={{user,updateUser,clearUser}}>
            {children}
        </UserContext.Provider>
    );
  }
  export default UserProvider;