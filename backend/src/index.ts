import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {Pool} from "pg";

dotenv.config();

const app = express();
const port = 3001;

app.use(
	cors({
		origin: "http://localhost:3000" // Permite peticiones solo desde este origen
	})
);

const pool = new Pool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || "5432"),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

app.get("/", async (req, res) => {
	try {
		const {rows} = await pool.query("SELECT NOW() as now");
		res.send(`La fecha y hora actual en PostgreSQL es: ${rows[0].now}`);
	} catch (error) {
		console.error("Error al conectar a PostgreSQL", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/clientes", async (req, res) => {
	try {
		const {rows} = await pool.query("SELECT * FROM practica.client ORDER BY id ASC LIMIT 3");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/platos", async (req, res) => {
	try {
		const {rows} = await pool.query("select * from practica.plat LIMIT 12;");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/platos/:nom", async (req, res) => {
	try {
		const nom = req.params.nom; // Obtener el parámetro 'nom' de la URL
		const {rows} = await pool.query("select * from practica.plat WHERE nom = $1", [nom]);
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
