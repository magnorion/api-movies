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
        try {
            databaseConfig.connection
                .prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)')
                .run(Object.values(dataInsert))
                .finalize();
        } catch (err) {
            console.log(err);
        }
    }

    public async getOnlyWinners(): Promise<Movie[]> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection.all('SELECT * FROM movies WHERE winner = 1 ORDER BY year ASC', (error, _movies: Movie[]) => {
                if (error) {
                    reject('Houve um erro ao buscar os dados dos filmes');
                }
    
                resolve(_movies);
            });
        });
    }
}