import React from "react";
import ReactDOM from "react-dom/client";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import ClienteDetail from "./ClienteDetail"; // Importa el nuevo componente
import Clientes from "./Clientes";
import Empleados from "./Empleados"; // Importa el nuevo componente
import Footer from "./Footer";
import Header from "./Header";
import Locales from "./Locales";
import MenuList from "./Menulist";
import PlatoDetail from "./PlatoDetail";
import UpdateCliente from "./UpdateCliente";
import UpdateLocal from "./UpdateLocal";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<MenuList />} />
				<Route path="/platos" element={<MenuList />} />
				<Route path="/platos/:nom" element={<PlatoDetail />} />
				<Route path="/clientes" element={<Clientes />} />
				<Route path="/clientes/:id" element={<ClienteDetail />} />
				<Route path="/locales" element={<Locales />} />
				<Route path="/empleados" element={<Empleados />} /> {/* Añade la nueva ruta */}
				<Route path="/clientes/:id" element={<UpdateCliente />} />
				<Route path="/locales/:ciutat/:pais" element={<UpdateLocal />} />
			</Routes>
			<Footer />
		</Router>
	</React.StrictMode>
);

reportWebVitals();
