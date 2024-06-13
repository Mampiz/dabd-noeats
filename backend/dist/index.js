"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000"
}));
// Middleware
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query("SELECT NOW() as now");
        res.send(`La fecha y hora actual en PostgreSQL es: ${rows[0].now}`);
    }
    catch (error) {
        console.error("Error al conectar a PostgreSQL", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/clientes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query("SELECT * FROM practica.client ORDER BY id DESC LIMIT 12");
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.post("/clientes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telefon, correu, adreca } = req.body;
        const { rows } = yield pool.query("INSERT INTO practica.client (telefon, correu, adreca) VALUES ($1, $2, $3) RETURNING *", [telefon, correu, adreca]);
        res.status(201).json(rows[0]);
    }
    catch (error) {
        console.error("Error al crear el cliente", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/clientes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { rows } = yield pool.query("SELECT * FROM practica.client WHERE id = $1", [id]);
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.delete("/clientes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pool.query("DELETE FROM practica.client WHERE id = $1", [id]);
        res.status(204).send(); // No Content
    }
    catch (error) {
        console.error("Error al eliminar el cliente", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/locales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query("select * from practica.local LIMIT 12;");
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.post("/locales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ciutat, pais } = req.body;
        const { rows } = yield pool.query("INSERT INTO practica.local (ciutat, pais) VALUES ($1, $2) RETURNING *", [ciutat, pais]);
        res.status(201).json(rows[0]);
    }
    catch (error) {
        console.error("Error al crear el local", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/platos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query("select * from practica.plat LIMIT 12;");
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/platos/:nom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nom = req.params.nom;
        const platQuery = yield pool.query("SELECT * FROM practica.plat WHERE nom = $1", [nom]);
        if (platQuery.rows.length === 0) {
            return res.status(404).json({ error: "Plato no encontrado" });
        }
        const plat = platQuery.rows[0];
        res.json(plat);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/platos/:nom/descomptes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nom = req.params.nom;
        const descompteQuery = yield pool.query("SELECT * FROM practica.descompte WHERE nom_plat = $1 LIMIT 10", [nom]);
        const descomptes = descompteQuery.rows;
        res.json(descomptes);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.delete("/clientes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pool.query("DELETE FROM practica.client WHERE id = $1", [id]);
        res.status(204).send(); // No Content
    }
    catch (error) {
        console.error("Error al eliminar el cliente", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.put("/clientes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { telefon, correu, adreca } = req.body;
    try {
        const { rowCount } = yield pool.query("UPDATE practica.client SET telefon = $1, correu = $2, adreca = $3 WHERE id = $4;", [telefon, correu, adreca, id]);
        if (rowCount === 0) {
            res.status(404).send("Cliente no encontrado");
        }
        else {
            res.sendStatus(204);
        }
    }
    catch (error) {
        console.error("Error al realizar la actualización", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.delete("/locales/:ciutat/:pais", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ciutat, pais } = req.params;
    try {
        const { rowCount } = yield pool.query("DELETE FROM practica.local WHERE ciutat = $1 AND pais = $2", [ciutat, pais]);
        if (rowCount === 0) {
            res.status(404).send("Local no encontrado");
        }
        else {
            res.sendStatus(204); // No Content
        }
    }
    catch (error) {
        console.error("Error al eliminar el local", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.put("/locales/:ciutat/:pais", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ciutat, pais } = req.params;
    const { newCiutat, newPais } = req.body;
    try {
        const { rowCount } = yield pool.query("UPDATE practica.local SET ciutat = $1, pais = $2 WHERE ciutat = $3 AND pais = $4", [newCiutat, newPais, ciutat, pais]);
        if (rowCount === 0) {
            res.status(404).send("Local no encontrado");
        }
        else {
            res.sendStatus(204);
        }
    }
    catch (error) {
        console.error("Error al realizar la actualización", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.get("/locales/:ciutat/:pais", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ciutat, pais } = req.params;
        const { rows } = yield pool.query("SELECT * FROM practica.local WHERE ciutat = $1 AND pais = $2", [ciutat, pais]);
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
        res.status(500).send("Error interno del servidor");
    }
}));
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
