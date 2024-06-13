import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function MenuList() {
	const [items, setItems] = useState([]);

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

	return (
		<div className="flex justify-center px-32">
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
