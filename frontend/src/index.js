import React from "react";
import ReactDOM from "react-dom/client";
import {Route, BrowserRouter as Router, Routes, useLocation} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClienteDetail from "./ClienteDetail"; // Importa el nuevo componente
import Clientes from "./Clientes";
import ComandasList from "./ComandasList";
import EmpleadoDetail from "./EmpleadoDetail";
import Empleados from "./Empleados"; // Importa el nuevo componente
import Footer from "./Footer";
import Header from "./Header";
import Locales from "./Locales";
import Login from "./Login";
import MenuList from "./Menulist";
import PlatoDetail from "./PlatoDetail";
import UpdateCliente from "./UpdateCliente";
import UpdateLocal from "./UpdateLocal";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

function App() {
	const location = useLocation();
	const hideHeader = location.pathname === "/login"; // Oculta el header en la página de login

	return (
		<>
			{!hideHeader && <Header />}
			<Routes>
				<Route path="/" element={<MenuList />} />
				<Route path="/platos" element={<MenuList />} />
				<Route path="/platos/:nom" element={<PlatoDetail />} />
				<Route path="/clientes" element={<Clientes />} />
				<Route path="/clientes/:id" element={<ClienteDetail />} />
				<Route path="/locales" element={<Locales />} />
				<Route path="/empleados" element={<Empleados />} />
				<Route path="/empleats/:nseguretatsocial" element={<EmpleadoDetail />} />
				<Route path="/clientes/:id" element={<UpdateCliente />} />
				<Route path="/locales/:ciutat/:pais" element={<UpdateLocal />} />
				<Route path="/comandas" element={<ComandasList />} />
				<Route path="/login" element={<Login />} />
			</Routes>
			<Footer />
			<ToastContainer />
		</>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
);

reportWebVitals();
