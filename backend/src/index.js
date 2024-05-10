"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : {default: mod};
	};
Object.defineProperty(exports, "__esModule", {value: true});
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000; // El puerto en el que corre el servidor
app.get("/", (req, res) => {
	res.send("Hola Mundo con Express y TypeScript!");
});
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
