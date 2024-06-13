import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Clientes() {
	const [clientes, setClientes] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newClient, setNewClient] = useState({telefon: "", correu: "", adreca: ""});
	const [searchEmail, setSearchEmail] = useState("");
	const [filteredClientes, setFilteredClientes] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/clientes");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setClientes(data);
				setFilteredClientes(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setNewClient({...newClient, [name]: value});
	};

	const handleCreateClient = async () => {
		try {
			const response = await fetch("http://localhost:3001/clientes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newClient)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const createdClient = await response.json();
			setClientes([...clientes, createdClient]);
			setFilteredClientes([...clientes, createdClient]);
			setShowForm(false);
		} catch (error) {
			console.error("Could not create the client: ", error);
		}
	};

	const handleDelete = async id => {
		try {
			const response = await fetch(`http://localhost:3001/clientes/${id}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("Cliente no encontrado");
				} else {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			}
			setClientes(clientes.filter(cliente => cliente.id !== id));
			setFilteredClientes(filteredClientes.filter(cliente => cliente.id !== id));
		} catch (error) {
			console.error("Could not delete the client: ", error);
		}
	};

	const handleUpdate = id => {
		navigate(`/clientes/${id}`);
	};

	const handleSearchChange = e => {
		const value = e.target.value;
		setSearchEmail(value);
		const filtered = clientes.filter(cliente => cliente.correu.toLowerCase().includes(value.toLowerCase()));
		setFilteredClientes(filtered);
	};

	return (
		<div className="flex flex-col items-center px-32">
			<div className="mb-4 w-full max-w-md">
				<input type="text" placeholder="Buscar por correo" value={searchEmail} onChange={handleSearchChange} className="w-full p-2 border rounded-md" />
			</div>
			<button onClick={() => setShowForm(!showForm)} className="mb-14 px-4 py-2 text-white rounded-md bg-[#2F695Cff]">
				Registrar Cliente
			</button>

			{showForm && (
				<div className="mb-14 p-4 border rounded-md w-full max-w-md bg-white shadow-md">
					<h2 className="text-xl font-bold mb-4">Nuevo Cliente</h2>
					<form>
						<div className="mb-4">
							<label className="block text-gray-700">Telefono:</label>
							<input type="text" name="telefon" value={newClient.telefon} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Correo:</label>
							<input type="email" name="correu" value={newClient.correu} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Dirección:</label>
							<input type="text" name="adreca" value={newClient.adreca} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<button type="button" onClick={handleCreateClient} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-[#2F695Cff]">
							Crear
						</button>
					</form>
				</div>
			)}

			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 w-full">
				{filteredClientes.map((cliente, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index} onClick={() => navigate(`/clientes/${cliente.id}`)}>
						<div className="hover:scale-10 transition flex flex-col h-5/6 w-full p-4">
							<header className="flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Client</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">ID: {cliente.id}</h2>
								<p className="font-light text-[#202202]">Telefono: {cliente.telefon}</p>
								<p className="font-light text-[#202202]">Correo: {cliente.correu}</p>
								<p className="font-light text-[#202202]">Dirección: {cliente.adreca}</p>
							</header>
							<div className="flex justify-between">
								<button className="w-2/5 mt-6 inline-flex items-center px-4 py-2 bg-[#2F695Cff] transition ease-in-out delay-75 hover:bg-[#285c4f] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110" onClick={() => handleUpdate(cliente.id)}>
									<svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
										<path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
									</svg>
									Update
								</button>

								<button className="w-2/5 mt-6 inline-flex items-center px-4 py-2 bg-red-800 transition ease-in-out delay-75 hover:bg-red-900 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110" onClick={() => handleDelete(cliente.id)}>
									<svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
										<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
									</svg>
									Delete
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Clientes;
