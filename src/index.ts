import bodyParser from "body-parser";
import { StructureConfig } from "./config/structure.config";
import express, { Router } from "express";
import appRouter from './router';

// inicia os o banco com os dados
StructureConfig.initial();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/v1/producers', appRouter);

app.listen(3000, () => console.log('API RUNNING AT PORT 3000'));
