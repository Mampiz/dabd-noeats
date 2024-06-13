import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Locales() {
    const [locales, setLocales] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newLocal, setNewLocal] = useState({ ciutat: "", pais: "" });
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
            } catch (error) {
                console.error("Could not fetch the data: ", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLocal({ ...newLocal, [name]: value });
    };

    const handleCreateLocal = async () => {
        try {
            const response = await fetch("http://localhost:3001/locales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newLocal),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const createdLocal = await response.json();
            setLocales([...locales, createdLocal]);
            setShowForm(false);
        } catch (error) {
            console.error("Could not create the local: ", error);
        }
    };

    const handleDelete = async (ciutat, pais) => {
        try {
            const response = await fetch(`http://localhost:3001/locales/${ciutat}/${pais}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLocales(locales.filter((local) => !(local.ciutat === ciutat && local.pais === pais)));
        } catch (error) {
            console.error("Could not delete the local: ", error);
        }
    };

    const handleUpdate = (ciutat, pais) => {
        navigate(`/locales/${ciutat}/${pais}`);
    };

    return (
        <div className="flex flex-col items-center px-32">
            <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                Crear Local
            </button>

            {showForm && (
                <div className="mb-4 p-4 border rounded-md w-full max-w-md bg-white shadow-md">
                    <h2 className="text-xl font-bold mb-4">Nuevo Local</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Ciudad:</label>
                            <input
                                type="text"
                                name="ciutat"
                                value={newLocal.ciutat}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">País:</label>
                            <input
                                type="text"
                                name="pais"
                                value={newLocal.pais}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCreateLocal}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Crear
                        </button>
                    </form>
                </div>
            )}

            <ul className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 w-full">
                {locales.map((local, index) => (
                    <li className="border rounded-lg hover:bg-gray-300 shadow-md" key={index}>
                        <div className="flex flex-col h-5/6 w-full p-4">
                            <header className="flex-grow">
                                <span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-500">Local</span>
                                <h2 className="my-2 text-3xl font-bold tracking-tight text-[#202202]">Ciudad: {local.ciutat}</h2>
                                <p className="font-light text-[#202202]">País: {local.pais}</p>
                            </header>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                                    onClick={() => handleUpdate(local.ciutat, local.pais)}
                                >
                                    Update
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                    onClick={() => handleDelete(local.ciutat, local.pais)}
                                >
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
