import { MovieRequest } from "../interface/movie.interface";
import { Movie } from "../model/movie.model";
import { MovieService } from "../service/movie.service";

export class MovieController {
    /**
     * retorna o calculo esperado de intervalos
     */
    public async getProducersInterval(): Promise<any> {
        const movieService: MovieService = new MovieService();

        let result = null;

        try {
            const _movies = await movieService.getOnlyWinners();
            result = this.calcProducersInterval(_movies);
            
            return _movies;
        } catch (err) {
            console.log(MovieController.name, new Date().toISOString(), err);
        }

        return result;
    }

    public calcProducersInterval(_movies: Movie[]) {
        const producersMap = new Map<string, Movie[]>();

        // agrupa os filmes por produtor
        for (const _movie of _movies) {
            if (producersMap.has(_movie.producers)) {
                const _currentList = producersMap.get(_movie.producers) || [];
                _currentList.push(_movie);

                producersMap.set(_movie.producers, _currentList);
            } else {
                producersMap.set(_movie.producers, [_movie]);
            }
        }

        // itera entre os produtores
        for (const [_producer, _movies] of producersMap) {
            if (_movies.length > 1) {
                let interval = Infinity;
                
                let firstWin = 0;
                let lastWin = 0;
    
                let previousWin = 0;
                let followingWin = 0;
    
                // itera entre os filmes do produtor
                for (const [_index, _movie] of _movies.entries()) {
                    firstWin = _index === 0 ? _movie.year : firstWin;
                    lastWin = _index === (_movies.length - 1) ? _movie.year : lastWin;
    
                    previousWin = _index === 0 ? _movie.year : previousWin;
                    followingWin = _index === 0 ? _movie.year : followingWin;
                    
                    // checa os dados baseados no proximo valor do array (se ele existir)
                    if (_movies[_index + 1] !== undefined) {
                        const calcInterval = (_movies[_index + 1].year - _movie.year);
        
                        if (calcInterval < interval) {
                            previousWin = _movie.year;
                            followingWin = _movies[_index + 1].year;
                            interval = calcInterval;
                        }
                    }
                }
    
                console.log({
                    firstWin, lastWin, previousWin, followingWin, interval
                });
            }
        }
    }
}