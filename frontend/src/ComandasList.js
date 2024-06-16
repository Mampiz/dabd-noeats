import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";

function ComandasList() {
	const [comandas, setComandas] = useState([]);
	const [filters, setFilters] = useState({fechaInicio: "", fechaFin: "", nseguretatsocial: "", id_client: ""});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const queryParams = new URLSearchParams(filters);
				const response = await fetch(`http://localhost:3001/comandas?${queryParams}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setComandas(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
				toast.error("Could not fetch the data. Please try again later.");
			}
		};

		fetchData();
	}, [filters]);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setFilters({...filters, [name]: value});
	};

	const handleFilter = e => {
		e.preventDefault();
		// Fetch new data based on filters
	};

	return (
		<div className="flex flex-col items-center px-32">
			<h1 className="text-2xl font-bold mb-4">Lista de Comandas</h1>
			<form className="mb-4 w-full max-w-md bg-white shadow-md p-4 rounded-md" onSubmit={handleFilter}>
				<div className="mb-4">
					<label className="block text-gray-700">Fecha Inicio:</label>
					<input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Fecha Fin:</label>
					<input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Nº Seguridad Social:</label>
					<input type="number" name="nseguretatsocial" value={filters.nseguretatsocial} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">ID Cliente:</label>
					<input type="number" name="id_client" value={filters.id_client} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
				</div>
			</form>

			<ul className="w-full">
				{comandas.length === 0 ? (
					<p>No hay comandas disponibles.</p>
				) : (
					comandas.map((comanda, index) => (
						<li key={index} className="border rounded-lg p-4 my-2 bg-white shadow-md">
							<p className="text-lg font-semibold">Comanda ID: {comanda.id}</p>
							<p className="text-sm text-gray-600">Hora: {new Date(comanda.hora).toLocaleString()}</p>
							<p className="text-sm text-gray-600">Cliente ID: {comanda.id_client}</p>
							<p className="text-sm text-gray-600">Seguridad Social: {comanda.nseguretatsocial}</p>
						</li>
					))
				)}
			</ul>
		</div>
	);
}

export default ComandasList;
