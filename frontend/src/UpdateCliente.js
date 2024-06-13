import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({ telefon: "", correu: "", adreca: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await fetch(`http://localhost:3001/clientes/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCliente(data);
            } catch (error) {
                console.error("Could not fetch the client data: ", error);
                setError("Could not fetch the client data. Please try again later.");
            }
        };

        fetchCliente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cliente),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            navigate("/clientes");
        } catch (error) {
            console.error("Could not update the client data: ", error);
            setError("Could not update the client data. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center px-32">
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefon">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        id="telefon"
                        name="telefon"
                        value={cliente.telefon}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correu">
                        Correo
                    </label>
                    <input
                        type="email"
                        id="correu"
                        name="correu"
                        value={cliente.correu}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adreca">
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="adreca"
                        name="adreca"
                        value={cliente.adreca}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-[#2F695Cff] hover:bg-[#285c4f] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCliente;
