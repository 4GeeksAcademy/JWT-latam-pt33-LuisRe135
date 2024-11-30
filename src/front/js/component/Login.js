import React, {useState, useContext} from 'react'
import getState, {actions} from  "../store/flux"
import { Context } from '../store/appContext'
import { useNavigate } from "react-router-dom";



const Login = () =>{
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })
    const {state, actions} = useContext(Context)
    const navigate = useNavigate();

    return(
        <div className='container'>
            <div className="mb-3">
                <label  className="form-label">Email address</label>
                <input type="text" className="form-control" onChange= {(event) => {setUserInfo({... userInfo, email: event.target.value})}} />
    
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" onChange= {(event) => {setUserInfo({... userInfo, password: event.target.value})}} />
    
            </div>
            
            <button type="button" className="btn btn-primary" onClick={async()=>{await actions.login(userInfo.email, userInfo.password); navigate("/private")}} >Submit</button>
        </div>
    )
}
export default Login;