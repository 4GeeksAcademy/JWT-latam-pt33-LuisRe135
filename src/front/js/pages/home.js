import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";


export const Home = () => {
	const { store, actions } = useContext(Context);
	

	return (
		<div className="text-center mt-5">
			<h1>Shall you see the secrets?</h1>
			<Link className="m-2" to={"/Login/"} >Login here</Link>
			<Link className="m-2" to={"/Signup/"} >or Sign up here</Link>
			<h3>Only worthy people can see the secret below</h3>
			
		</div>
	);
};
