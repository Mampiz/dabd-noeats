import React, { useEffect, useState } from "react";

function Locales() {
	const [locales, setLocales] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3001/locales");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data);
				setLocales(data);
			} catch (error) {
				console.error("Could not fetch the data: ", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex justify-center px-32">
			<ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
				{locales.map((local, index) => (
					<li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
						<a href={`/locales/${local.id}`} className="hover:scale-10 transition flex flex-col h-5/6 w-full p-4">
							<header className="flex-grow">
								<span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-500">Local</span>
								<h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">Ciudad: {local.ciutat}</h2>
								<p className="font-light text-[#202202]">País: {local.pais}</p>
							</header>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Locales;
