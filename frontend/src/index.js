import React from "react";
import ReactDOM from "react-dom/client";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Clientes from "./Clientes";
import Footer from "./Footer";
import Header from "./Header";
import Locales from "./Locales"; 
import MenuList from "./Menulist";
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
				<Route path="/clientes" element={<Clientes />} />
				<Route path="/locales" element={<Locales />} />
			</Routes>
			<Footer />
		</Router>
	</React.StrictMode>
);

reportWebVitals();
