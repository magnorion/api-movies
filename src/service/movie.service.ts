import { log } from "node:console";
import databaseConfig from "../config/database.config";
import { Movie } from "../model/movie.model";

export class MovieService {
    constructor() {}

    /**
     * recebe os dados para salvar no banco
     * @param dataInsert 
     */
    public insert(dataInsert: Movie): void {
        const dataToSave = {
            ...dataInsert,
            winner: dataInsert.status ? 1 : 0,
        };

        try {
            databaseConfig.connection
                .prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)')
                .run(Object.values(dataToSave))
                .finalize();
        } catch (err) {
            console.log(err);
        }
    }
}