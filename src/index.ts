import bodyParser from "body-parser";
import { StructureConfig } from "./config/structure.config";
import express from "express";
import appRouter from './router';
import http from 'http';
import dotenv from 'dotenv';

// aplica o .env
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/v1/producers', appRouter);

const server = http.createServer(app);

// exporta a referencia do app para ser usado em demais ocacioes
export default server;

// inicia os o banco com os dados
if (process.env.JEST_WORKER_ID === undefined) {
    StructureConfig.initial();
}

server.listen(3000, () => console.log('API RUNNING AT PORT 3000'));
