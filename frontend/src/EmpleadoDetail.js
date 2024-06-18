import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

Modal.setAppElement("#root");

function EmpleadoDetail() {
	const {nseguretatsocial} = useParams();
	const [empleado, setEmpleado] = useState(null);
	const [comandas, setComandas] = useState([]);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [updatedEmpleado, setUpdatedEmpleado] = useState({nom: "", data_unio_empresa: "", ciutat: "", pais: ""});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchEmpleado = async () => {
			try {
				const response = await fetch(`http://localhost:3001/empleats/${nseguretatsocial}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setEmpleado(data);
				setUpdatedEmpleado({nom: data.nom, data_unio_empresa: data.data_unio_empresa, ciutat: data.ciutat, pais: data.pais});
			} catch (error) {
				console.error("Could not fetch the data: ", error);
				setError("Could not fetch the data. Please try again later.");
				toast.error("Could not fetch the data. Please try again later.");
			}
		};

		const fetchComandas = async () => {
			try {
				const response = await fetch(`http://localhost:3001/empleats/${nseguretatsocial}/comandas`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setComandas(data);
			} catch (error) {
				console.error("Could not fetch the comandas: ", error);
				setError("Could not fetch the comandas. Please try again later.");
				toast.error("Could not fetch the comandas. Please try again later.");
			}
		};

		fetchEmpleado();
		fetchComandas();
	}, [nseguretatsocial]);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setUpdatedEmpleado({...updatedEmpleado, [name]: value});
	};

	const handleUpdate = async () => {
		try {
			const response = await fetch(`http://localhost:3001/empleats/${nseguretatsocial}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updatedEmpleado)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			toast.success("Empleado actualizado con éxito");
			setIsEditing(false);
			setEmpleado({...empleado, ...updatedEmpleado});
		} catch (error) {
			console.error("Could not update the empleado: ", error);
			setError("Could not update the empleado. Please try again later.");
			toast.error("Could not update the empleado. Please try again later.");
		}
	};

	const confirmDelete = () => {
		setIsModalOpen(true);
	};

	const handleDelete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/empleats/${nseguretatsocial}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			toast.success("Empleado eliminado con éxito");
			navigate("/empleados");
		} catch (error) {
			console.error("Could not delete the empleado: ", error);
			setError("Could not delete the empleado. Please try again later.");
			toast.error("No puedes eliminar a este empleado ya que este tiene comandas realizadas");
		}
		setIsModalOpen(false);
	};

	if (!empleado) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center px-32">
			<div className="p-4 flex flex-col items-center w-full max-w-2xl bg-white shadow-md">
				{isEditing ? (
					<>
						<h1 className="text-3xl font-bold tracking-tight text-[#202202]">Editando Empleado NSS: {empleado.nseguretatsocial}</h1>
						<form>
							<div className="mb-4">
								<label className="block text-gray-700">Nombre:</label>
								<input type="text" name="nom" value={updatedEmpleado.nom} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Fecha de unión:</label>
								<input type="date" name="data_unio_empresa" value={updatedEmpleado.data_unio_empresa} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">Ciudad:</label>
								<input type="text" name="ciutat" value={updatedEmpleado.ciutat} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700">País:</label>
								<input type="text" name="pais" value={updatedEmpleado.pais} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
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
						<h1 className="text-3xl font-bold tracking-tight text-[#202202]">NSS: {empleado.nseguretatsocial}</h1>
						<p className="font-light text-[#202202]">Nombre: {empleado.nom}</p>
						<p className="font-light text-[#202202]">Fecha de unión: {empleado.data_unio_empresa}</p>
						<p className="font-light text-[#202202]">Ciudad: {empleado.ciutat}</p>
						<p className="font-light text-[#202202]">País: {empleado.pais}</p>
						<button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-[#2F695Cff] text-white rounded-md">
							Actualizar Empleado
						</button>
						<button onClick={confirmDelete} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
							Eliminar Empleado
						</button>
					</>
				)}

				<h2 className="text-xl font-bold mt-4">Comandas</h2>
				<ul className="w-full">
					{comandas.length === 0 ? (
						<p>No hay comandas disponibles para este empleado.</p>
					) : (
						comandas.map((comanda, index) => (
							<li key={index} className="border rounded-lg p-4 my-2">
								<p className="text-lg font-semibold">Comanda ID: {comanda.id}</p>
								<p className="text-sm text-gray-600">Hora: {new Date(comanda.hora).toLocaleString()}</p>
								<p className="text-sm text-gray-600">Cliente ID: {comanda.id_client}</p>
							</li>
						))
					)}
				</ul>
			</div>

			<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Confirmar Eliminación" className="bg-white p-6 w-full max-w-md mx-auto mt-20 rounded-md shadow-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
				<h2 className="text-2xl font-bold mb-4">Confirmar Eliminación</h2>
				<p>¿Estás seguro de que quieres eliminar este empleado?</p>
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

export default EmpleadoDetail;
