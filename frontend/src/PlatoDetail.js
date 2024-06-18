import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

Modal.setAppElement("#root");

function PlatoDetail() {
	const {nom} = useParams();
	const [plato, setPlato] = useState(null);
	const [descomptes, setDescomptes] = useState([]);
	const [newDescompte, setNewDescompte] = useState({nom: "", data_inici: "", data_final: "", percentatge: "", nom_plat: nom});
	const [isModalOpen, setIsModalOpen] = useState(false);
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

	const handleDeleteDescompte = async descompteNom => {
		try {
			const response = await fetch(`http://localhost:3001/descomptes/${descompteNom}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			setDescomptes(descomptes.filter(descompte => descompte.nom !== descompteNom));
			toast.success("Descuento eliminado exitosamente");
		} catch (error) {
			console.error("Could not delete the descompte: ", error);
			toast.error("No se pudo eliminar el descuento");
		}
	};

	const handleInputChange = e => {
		const {name, value} = e.target;
		setNewDescompte({...newDescompte, [name]: value});
	};

	const handleCreateDescompte = async e => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3001/descomptes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newDescompte)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const createdDescompte = await response.json();
			setDescomptes([...descomptes, createdDescompte]);
			setNewDescompte({nom: "", data_inici: "", data_final: "", percentatge: "", nom_plat: nom});
			setIsModalOpen(false);
			toast.success("Descuento creado exitosamente");
		} catch (error) {
			console.error("Could not create the descompte: ", error);
			toast.error("No se pudo crear el descuento");
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
							<li key={index} className="border rounded-lg p-4 my-2 flex justify-between items-center">
								<div>
									<p className="text-lg font-semibold">{descompte.nom}</p>
									<p className="text-sm text-gray-600">Inicio: {descompte.data_inici}</p>
									<p className="text-sm text-gray-600">Fin: {descompte.data_final}</p>
									<p className="text-sm text-gray-600">Descuento: {descompte.percentatge}%</p>
								</div>
								<button onClick={() => handleDeleteDescompte(descompte.nom)} className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md">
									Eliminar
								</button>
							</li>
						))
					)}
				</ul>
				<button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-[#2F695Cff] text-white rounded-md">
					Añadir Descuento
				</button>
			</div>
			<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Añadir Descuento" className="bg-white p-6 w-full max-w-md mx-auto mt-20 rounded-md shadow-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
				<h2 className="text-2xl font-bold mb-4">Añadir Descuento</h2>
				<form onSubmit={handleCreateDescompte}>
					<div className="mb-4">
						<label className="block text-gray-700">Nombre:</label>
						<input type="text" name="nom" value={newDescompte.nom} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" required />
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Fecha Inicio:</label>
						<input type="date" name="data_inici" value={newDescompte.data_inici} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" required />
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Fecha Fin:</label>
						<input type="date" name="data_final" value={newDescompte.data_final} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" required />
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Porcentaje:</label>
						<input type="number" name="percentatge" value={newDescompte.percentatge} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" required />
					</div>
					<div className="flex justify-end">
						<button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
							Cancelar
						</button>
						<button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-[#2F695Cff]">
							Añadir
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}

export default PlatoDetail;
