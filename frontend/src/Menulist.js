import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function MenuList() {
	const [items, setItems] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newPlato, setNewPlato] = useState({nom: "", descripcio: "", preu: ""});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/platos");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data);
				setItems(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setNewPlato({...newPlato, [name]: value});
	};

	const handleCreatePlato = async () => {
		try {
			const response = await fetch("http://localhost:3001/platos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newPlato)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const createdPlato = await response.json();
			console.log(createdPlato);
			setItems([...items, createdPlato]);
			setShowForm(false);
		} catch (error) {
			console.error("Could not create the plato: ", error);
		}
	};

	return (
		<div className="flex flex-col items-center px-32">
			<button onClick={() => setShowForm(!showForm)} className="mb-14 px-4 py-2 bg-[#2F695Cff] text-white rounded-md">
				Añadir Plato
			</button>

			{showForm && (
				<div className="mb-14 p-4 border rounded-md w-full max-w-md bg-white shadow-md">
					<h2 className="text-xl font-bold mb-4">Nuevo Plato</h2>
					<form>
						<div className="mb-4">
							<label className="block text-gray-700">Nombre:</label>
							<input type="text" name="nom" value={newPlato.nom} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Descripción:</label>
							<textarea name="descripcio" value={newPlato.descripcio} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md"></textarea>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Precio:</label>
							<input type="number" name="preu" value={newPlato.preu} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<button type="button" onClick={handleCreatePlato} className="px-4 py-2 bg-green-600 text-white rounded-md">
							Crear
						</button>
					</form>
				</div>
			)}

			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
				{items.map((item, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
						<Link to={`/platos/${item.nom}`} className="hover:scale-10 transition flex flex-col h-5/6 w-full">
							<picture className="flex justify-center h-4/5 w-full object-cover">
								<img src="https://knoweats.com/cdn/shop/files/carrilleras-cerdo-px-knoweats.jpg?v=1693166335&width=990" alt="" className="object-cover w-full h-full" />
							</picture>
							<header className="p-4 flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Disponible</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">{item.nom}</h2>
								<p className="font-light text-[#202202]">{item.descripcio}</p>
								<p className="pt-5 text-2xl font-extrabold text-[#202202]">{item.preu} €</p>
							</header>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default MenuList;
