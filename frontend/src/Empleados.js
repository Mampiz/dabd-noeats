import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Empleados() {
	const [empleados, setEmpleados] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newEmpleado, setNewEmpleado] = useState({nom: "", data_unio_empresa: "", ciutat: "", pais: ""});
	const [searchName, setSearchName] = useState("");
	const [filteredEmpleados, setFilteredEmpleados] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/empleats");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setEmpleados(data);
				setFilteredEmpleados(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setNewEmpleado({...newEmpleado, [name]: value});
	};

	const handleCreateEmpleado = async () => {
		try {
			const response = await fetch("http://localhost:3001/empleats", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newEmpleado)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const createdEmpleado = await response.json();
			setEmpleados([...empleados, createdEmpleado]);
			setFilteredEmpleados([...empleados, createdEmpleado]);
			setShowForm(false);
		} catch (error) {
			console.error("Could not create the empleado: ", error);
		}
	};

	const handleSearchChange = e => {
		const value = e.target.value;
		setSearchName(value);
		const filtered = empleados.filter(empleat => empleat.nom.toLowerCase().includes(value.toLowerCase()));
		setFilteredEmpleados(filtered);
	};

	return (
		<div className="flex flex-col items-center px-32">
			<div className="mb-4 w-full max-w-md">
				<input type="text" placeholder="Buscar por nombre" value={searchName} onChange={handleSearchChange} className="w-full p-2 border rounded-md" />
			</div>
			<button onClick={() => setShowForm(!showForm)} className="mb-14 px-4 py-2 text-white rounded-md bg-[#2F695Cff]">
				Registrar Empleado
			</button>

			{showForm && (
				<div className="mb-14 p-4 border rounded-md w-full max-w-md bg-white shadow-md">
					<h2 className="text-xl font-bold mb-4">Nuevo Empleado</h2>
					<form>
						<div className="mb-4">
							<label className="block text-gray-700">Nombre:</label>
							<input type="text" name="nom" value={newEmpleado.nom} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Fecha de unión:</label>
							<input type="date" name="data_unio_empresa" value={newEmpleado.data_unio_empresa} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Ciudad:</label>
							<input type="text" name="ciutat" value={newEmpleado.ciutat} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">País:</label>
							<input type="text" name="pais" value={newEmpleado.pais} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<button type="button" onClick={handleCreateEmpleado} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-[#2F695Cff]">
							Crear
						</button>
					</form>
				</div>
			)}

			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 w-full">
				{filteredEmpleados.map((empleat, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index} onClick={() => navigate(`/empleats/${empleat.nseguretatsocial}`)}>
						<div className="hover:scale-10 transition flex flex-col h-5/6 w-full p-4">
							<header className="flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Empleado</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">NSS: {empleat.nseguretatsocial}</h2>
								<p className="font-light text-[#202202]">Nombre: {empleat.nom}</p>
								<p className="font-light text-[#202202]">Fecha de unión: {empleat.data_unio_empresa}</p>
								<p className="font-light text-[#202202]">Ciudad: {empleat.ciutat}</p>
								<p className="font-light text-[#202202]">País: {empleat.pais}</p>
							</header>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Empleados;
