import React, {useState, useContext} from 'react'
import getState, { actions} from  "../store/flux"
import { Context } from '../store/appContext'
import { useNavigate } from "react-router-dom";


const Signup = () =>{
    const [userInfo, setUserInfo] = useState({
        email: "",
        name: "",
        password: ""
    })
    const { actions} = useContext(Context)
    const navigate = useNavigate();

    return(
        <div className='container'>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control"  onChange= {(event) => {setUserInfo({... userInfo, name: event.target.value})}} />
    
            </div>
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control"  onChange= {(event) => {setUserInfo({... userInfo, email: event.target.value})}} />
    
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control"  onChange= {(event) => {setUserInfo({... userInfo, password: event.target.value})}} />
    
            </div>
            
            <button type="submit" className="btn btn-primary" onClick={()=>{actions.signUp(userInfo.name, userInfo.email, userInfo.password); navigate("/")}} >Submit</button>
        </div>
    )
}

export default Signup;
