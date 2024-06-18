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
		const {rows} = await pool.query("SELECT * FROM practica.client ORDER BY id DESC LIMIT 100");
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
		const clientQuery = await pool.query("SELECT * FROM practica.client WHERE id = $1", [id]);

		if (clientQuery.rows.length === 0) {
			return res.status(404).json({error: "Cliente no encontrado"});
		}

		const client = clientQuery.rows[0];
		const comandasQuery = await pool.query("SELECT * FROM practica.comanda WHERE id_client = $1", [id]);
		const comandas = comandasQuery.rows;

		res.json({client, comandas});
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
		const {rows} = await pool.query("select * from practica.local ORDER BY ciutat ASC;");
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
		const {rows} = await pool.query("SELECT * FROM practica.plat ORDER BY nom ASC LIMIT 100");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/platos", async (req, res) => {
	try {
		const {nom, descripcio, preu} = req.body;
		const {rows} = await pool.query("INSERT INTO practica.plat (nom, descripcio, preu) VALUES ($1, $2, $3) RETURNING *", [nom, descripcio, preu]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error al crear el plato", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/platos/:nom", async (req, res) => {
	const {nom} = req.params;
	try {
		const result = await pool.query("DELETE FROM practica.plat WHERE nom = $1 RETURNING *", [nom]);
		if (result.rows.length === 0) {
			return res.status(404).json({error: "Plato no encontrado"});
		}
		res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error al eliminar el plato", error);
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
		const descompteQuery = await pool.query("SELECT * FROM practica.descompte WHERE nom_plat = $1 LIMIT 100", [nom]);

		const descomptes = descompteQuery.rows;
		res.json(descomptes);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/descomptes/:nom", async (req, res) => {
	const {nom} = req.params;
	try {
		const result = await pool.query("DELETE FROM practica.descompte WHERE nom = $1 RETURNING *", [nom]);
		if (result.rows.length === 0) {
			return res.status(404).json({error: "Descuento no encontrado"});
		}
		res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error al eliminar el descuento", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/descomptes", async (req, res) => {
	const {nom, data_inici, data_final, percentatge, nom_plat} = req.body;
	try {
		const {rows} = await pool.query("INSERT INTO practica.descompte (nom, data_inici, data_final, percentatge, nom_plat) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nom, data_inici, data_final, percentatge, nom_plat]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error al crear el descuento", error);
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

app.get("/empleats", async (req, res) => {
	try {
		const {rows} = await pool.query("SELECT * FROM practica.empleat ORDER BY nseguretatsocial DESC");
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/empleats", async (req, res) => {
	try {
		const {nom, data_unio_empresa, ciutat, pais} = req.body;
		const {rows} = await pool.query("INSERT INTO practica.empleat (nom, data_unio_empresa, ciutat, pais) VALUES ($1, $2, $3, $4) RETURNING *", [nom, data_unio_empresa, ciutat, pais]);
		res.status(201).json(rows[0]);
	} catch (error) {
		console.error("Error al crear el empleado", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.put("/empleats/:nseguretatsocial", async (req, res) => {
	const {nseguretatsocial} = req.params;
	const {nom, data_unio_empresa, ciutat, pais} = req.body;

	try {
		const {rowCount} = await pool.query("UPDATE practica.empleat SET nom = $1, data_unio_empresa = $2, ciutat = $3, pais = $4 WHERE nseguretatsocial = $5", [nom, data_unio_empresa, ciutat, pais, nseguretatsocial]);

		if (rowCount === 0) {
			res.status(404).send("Empleado no encontrado");
		} else {
			res.sendStatus(204);
		}
	} catch (error) {
		console.error("Error al realizar la actualización", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.delete("/empleats/:nseguretatsocial", async (req, res) => {
	const {nseguretatsocial} = req.params;
	try {
		await pool.query("DELETE FROM practica.empleat WHERE nseguretatsocial = $1", [nseguretatsocial]);
		res.status(204).send(); 
	} catch (error) {
		console.error("Error al eliminar el empleado", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.get("/empleats/:nseguretatsocial", async (req, res) => {
	try {
		const {nseguretatsocial} = req.params;
		const {rows} = await pool.query("SELECT * FROM practica.empleat WHERE nseguretatsocial = $1", [nseguretatsocial]);
		if (rows.length === 0) {
			return res.status(404).json({error: "Empleado no encontrado"});
		}
		res.json(rows[0]);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});


app.get("/empleats/:nseguretatsocial/comandas", async (req, res) => {
	const { nseguretatsocial } = req.params;
	try {
		const { rows } = await pool.query("SELECT * FROM practica.comanda WHERE nseguretatsocial = $1", [nseguretatsocial]);
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});


app.get("/comandas", async (req, res) => {
	const {fechaInicio, fechaFin, nseguretatsocial, id_client} = req.query;

	let query = "SELECT * FROM practica.comanda WHERE 1=1";
	const queryParams = [];

	if (fechaInicio) {
		queryParams.push(fechaInicio);
		query += ` AND hora >= $${queryParams.length}`;
	}

	if (fechaFin) {
		queryParams.push(fechaFin);
		query += ` AND hora <= $${queryParams.length}`;
	}

	if (nseguretatsocial) {
		queryParams.push(nseguretatsocial);
		query += ` AND nseguretatsocial = $${queryParams.length}`;
	}

	if (id_client) {
		queryParams.push(id_client);
		query += ` AND id_client = $${queryParams.length}`;
	}

	query += " ORDER BY hora DESC";

	try {
		const {rows} = await pool.query(query, queryParams);
		res.json(rows);
	} catch (error) {
		console.error("Error al realizar la consulta", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.post("/login", async (req, res) => {
	const {correu, telefon} = req.body;

	try {
		const clientQuery = await pool.query("SELECT * FROM practica.client WHERE correu = $1 AND telefon = $2", [correu, telefon]);

		if (clientQuery.rows.length === 0) {
			return res.status(401).json({error: "Credenciales inválidas"});
		}

		const client = clientQuery.rows[0];
		res.json({message: "Inicio de sesión exitoso", clientId: client.id});
	} catch (error) {
		console.error("Error al iniciar sesión", error);
		res.status(500).send("Error interno del servidor");
	}
});

app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
