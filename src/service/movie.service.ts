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
                        if (_err) {
                            reject(null);
                        }

                        resolve(this.lastID)
                    });
            })
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

    public getById(_id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection
            .prepare('SELECT * FROM movies WHERE id = ?')
            .each(_id, (_error, _result: Movie) => {
                if (_error) {
                    reject('Houve um erro ao buscar os dados dos filmes');
                }

                resolve(_result);
            })
        });
    }

    public deleteById(_id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            databaseConfig.connection
            .run('DELETE FROM movies WHERE id = ?', [_id], (_error) => {
                if (_error) {
                    resolve(false);
                }

                resolve(true);
            });
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
                
                    if (_error) {
                        resolve(false);
                    }

                    resolve(true);
                }
            )
        });
    }
}