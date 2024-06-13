import React from "react";
import {Link} from "react-router-dom";
import logo from "../src/assets/knoweats_cover.jpeg";
import "./App.css";

function Header() {
	return (
		<header>
			<div className="bg-[#2F695Cff] border-b border-gray-200 lg:mb-14">
				<div className="px-4 mx-auto sm:px-6 lg:px-8">
					<nav className="relative flex items-center justify-between h-16 lg:h-20">
						<div className="hidden lg:flex lg:items-center lg:space-x-10">
							<Link to="/platos" className="text-base font-medium text-white">
								Platos
							</Link>
							<Link to="/clientes" className="text-base font-medium text-white">
								Clientes
							</Link>
							<Link to="/locales" className="text-base font-medium text-white">
								Locales
							</Link>
							<Link to="/empleados" className="text-base font-medium text-white">
								Empleados
							</Link>
						</div>
						<div className="lg:absolute lg:-translate-x-1/2 lg:inset-y-5 lg:left-1/2">
							<div className="flex-shrink-0">
								<Link to="/" className="flex">
									<img className="w-auto h-8 lg:h-10 z-50" src={logo} alt="logo" />
								</Link>
							</div>
						</div>
						<button type="button" className="flex items-center justify-center ml-auto text-white bg-white rounded-full w-9 h-9 lg:hidden">
							<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</button>
						<button type="button" className="inline-flex p-2 ml-5 text-white transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
							<svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
							</svg>
						</button>
						<div className="hidden lg:flex lg:items-center lg:space-x-10">
							<Link to="/signup" className="text-base font-medium text-white">
								Sign up
							</Link>
							<Link to="/signin" className="text-base font-medium text-white">
								Sign in
							</Link>
							<Link to="/cart" className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full">
								<svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</Link>
						</div>
					</nav>
				</div>
			</div>
			<nav className="py-4 bg-white lg:hidden">
				<div className="px-4 mx-auto sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Menu</p>
						<button type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md focus:bg-gray-100 hover:bg-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div className="mt-6">
						<div className="flex flex-col space-y-2">
							<Link to="/" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Features
							</Link>
							<Link to="/solutions" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Solutions
							</Link>
							<Link to="/resources" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Resources
							</Link>
							<Link to="/pricing" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Pricing
							</Link>
						</div>
						<hr className="my-4 border-gray-200" />
						<div className="flex flex-col space-y-2">
							<Link to="/signup" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Sign up
							</Link>
							<Link to="/signin" className="py-2 text-base font-medium text-black transition-all duration-200 focus:text-blue-600">
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}

export default Header;
