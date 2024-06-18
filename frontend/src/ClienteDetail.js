import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

Modal.setAppElement("#root");

function ClienteDetail() {
	const {id} = useParams();
	const [cliente, setCliente] = useState(null);
	const [comandas, setComandas] = useState([]);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [updatedClient, setUpdatedClient] = useState({telefon: "", correu: "", adreca: ""});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCliente = async () => {
			try {
				const response = await fetch(`http://localhost:3001/clientes/${id}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setCliente(data.client);
				setUpdatedClient({telefon: data.client.telefon, correu: data.client.correu, adreca: data.client.adreca});
				setComandas(data.comandas);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
				setError("Could not fetch the data. Please try again later.");
				toast.error("Could not fetch the data. Please try again later.");
			}
		};

		fetchCliente();
	}, [id]);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setUpdatedClient({...updatedClient, [name]: value});
	};

	const handleUpdate = async () => {
		try {
			const response = await fetch(`http://localhost:3001/clientes/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updatedClient)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			toast.success("Cliente actualizado con éxito");
			setIsEditing(false);
			setCliente({...cliente, ...updatedClient});
		} catch (error) {
			console.error("Could not update the client: ", error);
			setError("Could not update the client. Please try again later.");
			toast.error("Could not update the client. Please try again later.");
		}
	};

	const confirmDelete = () => {
		setIsModalOpen(true);
	};

	const handleDelete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/clientes/${id}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			toast.success("Cliente eliminado con éxito");
			navigate("/clientes");
		} catch (error) {
			console.error("Could not delete the client: ", error);
			setError("Could not delete the client. Please try again later.");
			toast.error("No puedes eliminar este cliente ya que tiene comandas realizadas");
		}
		setIsModalOpen(false);
	};

	if (!cliente) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center px-32">
			<div className="p-4 flex flex-col items-center w-full max-w-2xl bg-white shadow-md">
				{isEditing ? (
					<>
						<h1 className="text-3xl font-bold tracking-tight text-[#202202]">Editando Cliente ID: {cliente.id}</h1>
						<form>
							<div className="mb-4">
								<label className="block text-gray-700">Telefono:</label>
								<input type="text" name="telefon" value={updatedClient.telefon} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Correo:</label>
								<input type="email" name="correu" value={updatedClient.correu} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Dirección:</label>
								<input type="text" name="adreca" value={updatedClient.adreca} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<button type="button" onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-[#2F695Cff]">
								Guardar Cambios
							</button>
							<button type="button" onClick={() => setIsEditing(false)} className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
								Cancelar
							</button>
						</form>
					</>
				) : (
					<>
						<h1 className="text-3xl font-bold tracking-tight text-[#202202]">ID: {cliente.id}</h1>
						<p className="font-light text-[#202202]">Telefono: {cliente.telefon}</p>
						<p className="font-light text-[#202202]">Correo: {cliente.correu}</p>
						<p className="font-light text-[#202202]">Dirección: {cliente.adreca}</p>
						<button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-[#2F695Cff] text-white rounded-md">
							Actualizar Cliente
						</button>
						<button onClick={confirmDelete} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
							Eliminar Cliente
						</button>
					</>
				)}

				<h2 className="text-xl font-bold mt-4">Comandas</h2>
				<ul className="w-full">
					{comandas.length === 0 ? (
						<p>No hay comandas disponibles para este cliente.</p>
					) : (
						comandas.map((comanda, index) => (
							<li key={index} className="border rounded-lg p-4 my-2">
								<p className="text-lg font-semibold">Comanda ID: {comanda.id}</p>
								<p className="text-sm text-gray-600">Hora: {comanda.hora}</p>
								<p className="text-sm text-gray-600">Seguridad Social: {comanda.nseguretatsocial}</p>
							</li>
						))
					)}
				</ul>
			</div>

			<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Confirmar Eliminación" className="bg-white p-6 w-full max-w-md mx-auto mt-20 rounded-md shadow-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
				<h2 className="text-2xl font-bold mb-4">Confirmar Eliminación</h2>
				<p>¿Estás seguro de que quieres eliminar este cliente?</p>
				<div className="flex justify-end mt-4">
					<button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
						Cancelar
					</button>
					<button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">
						Eliminar
					</button>
				</div>
			</Modal>
		</div>
	);
}

export default ClienteDetail;
