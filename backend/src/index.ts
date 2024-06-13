import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {Pool} from "pg";

dotenv.config();

const app = express();
const port = 3001;

app.use(
	cors({
		origin: "http://localhost:3000"
	})
);

// Middleware
app.use(express.json());

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
		const {rows} = await pool.query("SELECT * FROM practica.client ORDER BY id DESC LIMIT 12");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/clientes", async (req, res) => {
	try {
		const {telefon, correu, adreca} = req.body;
		const {rows} = await pool.query("INSERT INTO practica.client (telefon, correu, adreca) VALUES ($1, $2, $3) RETURNING *", [telefon, correu, adreca]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error al crear el cliente", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/clientes/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const {rows} = await pool.query("SELECT * FROM practica.client WHERE id = $1", [id]);
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/clientes/:id", async (req, res) => {
	const {id} = req.params;
	try {
		await pool.query("DELETE FROM practica.client WHERE id = $1", [id]);
		res.status(204).send(); // No Content
	} catch (error) {
		console.error("Error al eliminar el cliente", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/locales", async (req, res) => {
	try {
		const {rows} = await pool.query("select * from practica.local LIMIT 12;");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/locales", async (req, res) => {
	try {
		const {ciutat, pais} = req.body;
		const {rows} = await pool.query("INSERT INTO practica.local (ciutat, pais) VALUES ($1, $2) RETURNING *", [ciutat, pais]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error al crear el local", error);
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
		const nom = req.params.nom;
		const platQuery = await pool.query("SELECT * FROM practica.plat WHERE nom = $1", [nom]);

		if (platQuery.rows.length === 0) {
			return res.status(404).json({error: "Plato no encontrado"});
		}

		const plat = platQuery.rows[0];
		res.json(plat);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/platos/:nom/descomptes", async (req, res) => {
	try {
		const nom = req.params.nom;
		const descompteQuery = await pool.query("SELECT * FROM practica.descompte WHERE nom_plat = $1 LIMIT 10", [nom]);

		const descomptes = descompteQuery.rows;
		res.json(descomptes);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/clientes/:id", async (req, res) => {
	const {id} = req.params;
	try {
		await pool.query("DELETE FROM practica.client WHERE id = $1", [id]);
		res.status(204).send(); // No Content
	} catch (error) {
		console.error("Error al eliminar el cliente", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.put("/clientes/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const {telefon, correu, adreca} = req.body;

	try {
		const {rowCount} = await pool.query("UPDATE practica.client SET telefon = $1, correu = $2, adreca = $3 WHERE id = $4;", [telefon, correu, adreca, id]);

		if (rowCount === 0) {
			res.status(404).send("Cliente no encontrado");
		} else {
			res.sendStatus(204);
		}
	} catch (error) {
		console.error("Error al realizar la actualización", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/locales/:ciutat/:pais", async (req, res) => {
	const {ciutat, pais} = req.params;
	try {
		const {rowCount} = await pool.query("DELETE FROM practica.local WHERE ciutat = $1 AND pais = $2", [ciutat, pais]);
		if (rowCount === 0) {
			res.status(404).send("Local no encontrado");
		} else {
			res.sendStatus(204); // No Content
		}
	} catch (error) {
		console.error("Error al eliminar el local", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.put("/locales/:ciutat/:pais", async (req, res) => {
	const {ciutat, pais} = req.params;
	const {newCiutat, newPais} = req.body;

	try {
		const {rowCount} = await pool.query("UPDATE practica.local SET ciutat = $1, pais = $2 WHERE ciutat = $3 AND pais = $4", [newCiutat, newPais, ciutat, pais]);

		if (rowCount === 0) {
			res.status(404).send("Local no encontrado");
		} else {
			res.sendStatus(204);
		}
	} catch (error) {
		console.error("Error al realizar la actualización", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/locales/:ciutat/:pais", async (req, res) => {
	try {
		const {ciutat, pais} = req.params;
		const {rows} = await pool.query("SELECT * FROM practica.local WHERE ciutat = $1 AND pais = $2", [ciutat, pais]);
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
