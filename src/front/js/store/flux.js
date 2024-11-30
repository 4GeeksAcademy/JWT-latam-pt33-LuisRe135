const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: localStorage.getItem("token") || null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {

			signUp: async(name, email, password) =>{
				try{
					const response = await fetch("https://studious-space-happiness-w4w4x9rj66f549v-3001.app.github.dev/signup", 
						{
							method: "POST",
							body: JSON.stringify({
									"name": name,
									"email": email,
									"password": password
									
							}),
							headers: {
								'Content-Type': 'application/json'
							}
						}
					) 
					const data = await response.json()

					if (!response.ok){
						throw new Error('Error en respuesta')
					}
					
				}
				catch(err){
					console.error(err)
				}
			},

			login: async(email, password) =>{
				try{
					const response = await fetch("https://studious-space-happiness-w4w4x9rj66f549v-3001.app.github.dev/login", 
						{
							method: "POST",
							body: JSON.stringify({
									"email": email,
									"password": password
									
							}),
							headers: {
								'Content-Type': 'application/json'
							}
						}
					) 
					const data = await response.json()

					if (!response.ok){
						throw new Error('Error en respuesta')
					}
					localStorage.setItem("token", data.token);
					setStore({token: data.token})
					
				}
				catch(err){
					console.error(err)
				}
			},
			logout: async() =>{
				localStorage.removeItem("token");
				setStore({token: null})
			},
			showSecrets: async() => {
				const token = localStorage.getItem('token');
				console.log(token)

				const resp = await fetch(`https://studious-space-happiness-w4w4x9rj66f549v-3001.app.github.dev/private`, {
					method: 'GET',
					headers: { 
					"Content-Type": "application/json",
					'Authorization': 'Bearer ' + token 
					} 
				});

				if(!resp.ok) {
					throw Error("There was a problem in the login request")
				} 
				
				const data = await resp.json();
				console.log("This is the data you requested", data);
				return data
			},

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
