import databaseConfig from "../config/database.config";
import { Movie } from "../model/movie.model";

export class MovieService {
    constructor() {}

    /**
     * recebe os dados para salvar no banco
     * @param dataInsert 
     */
    public async insert(dataInsert: Movie): Promise<number> {
        return new Promise((resolve, reject) => {
                databaseConfig.connection
                .run('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)',
                    Object.values(dataInsert), function (_err) {
                        resolve(this.lastID)
                    });
            })
    }

    public async getOnlyWinners(): Promise<Movie[]> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection.all('SELECT * FROM movies WHERE winner = 1 ORDER BY year ASC', (error, _movies: Movie[]) => {
                resolve(_movies);
            });
        });
    }

    public getById(_id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection.serialize(() => {
                databaseConfig.connection
                .all('SELECT * FROM movies WHERE id = ?', _id, (_error: Error, _result: Movie[]) => {
                    resolve(_result[0]);
                })
            })
        });
    }

    public deleteById(_id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection.serialize(() => {
                databaseConfig.connection
                .prepare('DELETE FROM movies WHERE id = ?')
                .run(_id, (_error: Error) => {
                    resolve(true);
                });
            })
        });
    }

    public updateById(_id: number, _movie: Movie): Promise<boolean> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection
            .run('UPDATE movies SET year = ?, title = ?, studios = ? , producers = ? , winner = ? WHERE id = ?',
                [
                _movie.year,
                _movie.title, 
                _movie.studios, 
                _movie.producers, 
                _movie.winner, 
                _id],
                (_error) => {
                    resolve(true);
                }
            )
        });
    }
}