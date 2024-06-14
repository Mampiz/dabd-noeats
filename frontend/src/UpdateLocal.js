import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateLocal = () => {
    const { ciutat, pais } = useParams();
    const navigate = useNavigate();
    const [local, setLocal] = useState({ ciutat: "", pais: "" });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocal = async () => {
            try {
                const response = await fetch(`http://localhost:3001/locales/${ciutat}/${pais}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLocal(data);
            } catch (error) {
                console.error("Could not fetch the local data: ", error);
                setError("Could not fetch the local data. Please try again later.");
            }
        };

        fetchLocal();
    }, [ciutat, pais]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocal({ ...local, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/locales/${ciutat}/${pais}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(local),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            navigate("/locales");
        } catch (error) {
            console.error("Could not update the local data: ", error);
            setError("Could not update the local data. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center px-32">
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ciutat">
                        Ciudad
                    </label>
                    <input
                        type="text"
                        id="ciutat"
                        name="ciutat"
                        value={local.ciutat}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pais">
                        País
                    </label>
                    <input
                        type="text"
                        id="pais"
                        name="pais"
                        value={local.pais}
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

export default UpdateLocal;

