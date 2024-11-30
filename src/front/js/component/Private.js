import React, {useEffect, useContext} from 'react'

import { Context } from '../store/appContext'
import { useNavigate } from "react-router-dom";

const Private = ()=>{

    const navigate = useNavigate()
    const {store, actions} = useContext(Context)
    useEffect(() => {
        if (!store.token) {
            navigate("/login");
        }
    }, [store.token])

    return (
        <div>
            <h1>
            El secreto es 4Geeks!

            </h1>
            <button onClick={()=>{actions.logout()}}>logout</button>
        </div>
    )
}
export default Private