import React, {useEffect, useState} from "react";

function MenuList() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		// Función para obtener los datos de la API
		const fetchData = async () => {
			try {
				// Realiza el fetch a la dirección dada
				const response = await fetch("http://localhost:3001/platos");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data);
				setItems(data); // Actualiza el estado con los datos obtenidos
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []); // El array vacío asegura que el efecto se ejecute sólo una vez al montar el componente

	return (
		<div class="flex justify-center px-32">
			<ul class="grid  lg:grid-cols-3 sm:grid-cols-2 gap-10">
				{items.map((item, index) => (
					<li class="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
						<a href={`/platos/${item.nom}`} class=" hover:scale-10 transition flex flex-col h-5/6 w-full">
							<picture class="flex justify-center h-4/5 w-full object-cover">
								<img src="https://knoweats.com/cdn/shop/files/carrilleras-cerdo-px-knoweats.jpg?v=1693166335&width=990" alt="" class="object-cover w-full h-full" />
							</picture>
							<header class="p-4 flex-grow">
								<span class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Disponible</span>
								<h2 class="my-2 text-3xl font-bold tracking-tight text-[#202202]">{item.nom}</h2>
								<p class="font-light text-[#202202]">{item.descripcio}</p>
								<p class="pt-5 text-2xl font-extrabold text-[#202202]">{item.preu} €</p>
							</header>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default MenuList;
