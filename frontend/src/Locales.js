import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Locales() {
	const [locales, setLocales] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newLocal, setNewLocal] = useState({ciutat: "", pais: ""});
	const [searchCountry, setSearchCountry] = useState("");
	const [filteredLocales, setFilteredLocales] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/locales");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setLocales(data);
				setFilteredLocales(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = e => {
		const {name, value} = e.target;
		setNewLocal({...newLocal, [name]: value});
	};

	const handleCreateLocal = async () => {
		try {
			const response = await fetch("http://localhost:3001/locales", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newLocal)
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const createdLocal = await response.json();
			setLocales([...locales, createdLocal]);
			setFilteredLocales([...locales, createdLocal]);
			setShowForm(false);
		} catch (error) {
			console.error("Could not create the local: ", error);
		}
	};

	const handleDelete = async (ciutat, pais) => {
		try {
			const response = await fetch(`http://localhost:3001/locales/${ciutat}/${pais}`, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			setLocales(locales.filter(local => !(local.ciutat === ciutat && local.pais === pais)));
			setFilteredLocales(filteredLocales.filter(local => !(local.ciutat === ciutat && local.pais === pais)));
		} catch (error) {
			console.error("Could not delete the local: ", error);
		}
	};

	const handleUpdate = (ciutat, pais) => {
		navigate(`/locales/${ciutat}/${pais}`);
	};

	const handleSearchChange = e => {
		const value = e.target.value;
		setSearchCountry(value);
		const filtered = locales.filter(local => local.pais.toLowerCase().includes(value.toLowerCase()));
		setFilteredLocales(filtered);
	};

	return (
		<div className="flex flex-col items-center px-32">
			<div className="mb-4 w-full max-w-md">
				<input type="text" placeholder="Buscar por país" value={searchCountry} onChange={handleSearchChange} className="w-full p-2 border rounded-md" />
			</div>
			<button onClick={() => setShowForm(!showForm)} className="mb-14 px-4 py-2 bg-[#2F695Cff] text-white rounded-md">
				Registrar Local
			</button>

			{showForm && (
				<div className="mb-14 p-4 border rounded-md w-full max-w-md bg-white shadow-md">
					<h2 className="text-xl font-bold mb-4">Nuevo Local</h2>
					<form>
						<div className="mb-4">
							<label className="block text-gray-700">Ciudad:</label>
							<input type="text" name="ciutat" value={newLocal.ciutat} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">País:</label>
							<input type="text" name="pais" value={newLocal.pais} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
						</div>
						<button type="button" onClick={handleCreateLocal} className="px-4 py-2 bg-green-600 text-white rounded-md">
							Crear
						</button>
					</form>
				</div>
			)}

			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 w-full">
				{filteredLocales.map((local, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
						<div className="flex flex-col h-5/6 w-full p-4">
							<header className="flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Local</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">Ciudad: {local.ciutat}</h2>
								<p className="font-light text-[#202202]">País: {local.pais}</p>
							</header>
							<div className="flex justify-end">
								<button className="w-2/5 mt-6 inline-flex items-center px-4 py-2 bg-red-800 transition ease-in-out delay-75 hover:bg-red-900 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110" onClick={() => handleDelete(local.ciutat,local.pais)}>
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

export default Locales;
