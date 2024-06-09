import React, { useEffect, useState } from "react";

function Clientes() {
	const [clientes, setClientes] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/clientes");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data);
				setClientes(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex justify-center px-32">
			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
				{clientes.map((cliente, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
						<a href={`/clientes/${cliente.id}`} className="hover:scale-10 transition flex flex-col h-5/6 w-full p-4">
							<header className="flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-green-500">Client</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">ID: {cliente.id}</h2>
								<p className="font-light text-[#202202]">Telefono: {cliente.telefon}</p>
								<p className="font-light text-[#202202]">Correo: {cliente.correu}</p>
								<p className="font-light text-[#202202]">Dirección: {cliente.adreca}</p>
							</header>
              <div className="flex justify-between">
              <button class="w-2/5 mt-6 inline-flex items-center px-4 py-2 bg-[#2F695Cff] transition ease-in-out delay-75 hover:bg-[#2F695Cff] text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
              >
              <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              class="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>

            Update
          </button>

          <button
            class="w-2/5 mt-6 inline-flex items-center px-4 py-2 bg-red-800 transition ease-in-out delay-75 hover:bg-red-900 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
          >
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              class="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>

            Delete
          </button>
          </div>

						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Clientes;

