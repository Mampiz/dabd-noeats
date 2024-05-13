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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
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
        const { rows } = yield pool.query("SELECT * FROM practica.client ORDER BY id ASC LIMIT 3");
        res.json(rows);
    }
    catch (error) {
        console.error("Error al realizar la consulta", error);
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
        const nom = req.params.nom; // Obtener el parámetro 'nom' de la URL
        const { rows } = yield pool.query("select * from practica.plat WHERE nom = $1", [nom]);
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
