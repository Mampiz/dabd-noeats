import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function ClienteDetail() {
	const {id} = useParams();
	const [cliente, setCliente] = useState(null);
	const [comandas, setComandas] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCliente = async () => {
			try {
				const response = await fetch(`http://localhost:3001/clientes/${id}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setCliente(data.client);
				setComandas(data.comandas);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
				setError("Could not fetch the data. Please try again later.");
			}
		};

		fetchCliente();
	}, [id]);

	if (error) {
		return <div>{error}</div>;
	}

	if (!cliente) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center px-32">
			<div className="p-4 flex flex-col items-center w-full max-w-2xl bg-white shadow-md">
				<h1 className="text-3xl font-bold tracking-tight text-[#202202]">ID: {cliente.id}</h1>
				<p className="font-light text-[#202202]">Telefono: {cliente.telefon}</p>
				<p className="font-light text-[#202202]">Correo: {cliente.correu}</p>
				<p className="font-light text-[#202202]">Dirección: {cliente.adreca}</p>

				<h2 className="text-xl font-bold mt-4">Comandas</h2>
				<ul className="w-full">
					{comandas.length === 0 ? (
						<p>No hay comandas disponibles para este cliente.</p>
					) : (
						comandas.map((comanda, index) => (
							<li key={index} className="border rounded-lg p-4 my-2">
								<p className="text-lg font-semibold">Comanda ID: {comanda.id}</p>
								<p className="text-sm text-gray-600">Hora: {comanda.hora}</p>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
}

export default ClienteDetail;
