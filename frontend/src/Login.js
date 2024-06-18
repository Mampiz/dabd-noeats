import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const LoginForm = () => {
	const [correu, setCorreu] = useState("");
	const [telefon, setTelefon] = useState("");
	const navigate = useNavigate();

	const handleLogin = async e => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3001/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({correu, telefon})
			});

			if (!response.ok) {
				throw new Error("Credenciales inválidas");
			}

			const data = await response.json();
			toast.success("Inicio de sesión exitoso");
			// Guarda el ID del cliente o cualquier otra información en el estado global o en el almacenamiento local
			navigate("/"); // Redirige a la página principal o a cualquier otra página
		} catch (error) {
			toast.error("Credenciales inválidas");
		}
	};

	return (
		<div className="min-h-screen bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
			<div className="flex justify-end">
				<div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
					<div>
						<form onSubmit={handleLogin}>
							<div>
								<span className="text-sm text-gray-900">Bienvenido a NoEats</span>
								<h1 className="text-2xl font-bold">Iniciar Sesión</h1>
							</div>
							<div className="my-3">
								<input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none" type="email" name="Email" placeholder="Correo" value={correu} onChange={e => setCorreu(e.target.value)} />
							</div>
							<div className="mt-5">
								<input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none" type="text" name="Contraseña" placeholder="Teléfono" value={telefon} onChange={e => setTelefon(e.target.value)} />
							</div>
							<div>
								<button className="mt-4 mb-3 w-full bg-[#2F695Cff] hover:bg-green-600 text-white py-2 rounded-md transition duration-100" type="submit">
									Let's go
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
