import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

function PlatoDetail() {
	const {nom} = useParams();
	const [plato, setPlato] = useState(null);
	const [descomptes, setDescomptes] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPlato = async () => {
			try {
				const response = await fetch(`http://localhost:3001/platos/${nom}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setPlato(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		const fetchDescomptes = async () => {
			try {
				const response = await fetch(`http://localhost:3001/platos/${nom}/descomptes`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log("Descuentos recibidos:", data);
				setDescomptes(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchPlato();
		fetchDescomptes();
	}, [nom]);

	const handleDelete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/platos/${nom}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			navigate("/platos");
		} catch (error) {
			console.error("Could not delete the plato: ", error);
			toast.error("No se puede borrar el plato, elimine los descuentos antes");
		}
	};

	if (!plato) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center px-32">
			<picture className="flex justify-center h-96 w-full object-cover">
				<img src="https://knoweats.com/cdn/shop/files/carrilleras-cerdo-px-knoweats.jpg?v=1693166335&width=990" alt="" className="object-cover w-full h-full" />
			</picture>
			<div className="p-4 flex flex-col items-center w-full bg-white shadow-md">
				<h1 className="text-3xl font-bold tracking-tight text-[#202202]">{plato.nom}</h1>
				<p className="font-light text-[#202202]">{plato.descripcio}</p>
				<p className="pt-5 text-2xl font-extrabold text-[#202202]">{plato.preu} €</p>
				<button onClick={handleDelete} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
					Eliminar Plato
				</button>
				<h2 className="text-xl font-bold mt-4">Descuentos</h2>
				<ul className="w-full">
					{descomptes.length === 0 ? (
						<p>No hay descuentos disponibles para este plato.</p>
					) : (
						descomptes.map((descompte, index) => (
							<li key={index} className="border rounded-lg p-4 my-2">
								<p className="text-lg font-semibold">{descompte.nom}</p>
								<p className="text-sm text-gray-600">Inicio: {descompte.data_inici}</p>
								<p className="text-sm text-gray-600">Fin: {descompte.data_final}</p>
								<p className="text-sm text-gray-600">Descuento: {descompte.percentatge}%</p>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
}

export default PlatoDetail;