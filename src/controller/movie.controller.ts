import { validate } from "class-validator";
import { MovieProducerResult, MovieRequest } from "../interface/movie.interface";
import { Movie } from "../model/movie.model";
import { MovieService } from "../service/movie.service";
import { SystemMessageEnum } from "../enum/system-message.enum";
import { RequestInterface } from "../interface/request.interface";

export class MovieController {
    private calcProducersInterval(_movies: Movie[]) {
        const _producersMap = new Map<string, Movie[]>();
        const _results: MovieProducerResult[] = [];

        // agrupa os filmes por produtor
        for (const _movie of _movies) {
            if (_producersMap.has(_movie.producers)) {
                const _currentList = _producersMap.get(_movie.producers) || [];
                _currentList.push(_movie);

                _producersMap.set(_movie.producers, _currentList);
            } else {
                _producersMap.set(_movie.producers, [_movie]);
            }
        }

        // itera entre os produtores e calcula quem teve o menor espaco de ganho e o maior
        for (const [_producer, _movies] of _producersMap) {
            if (_movies.length > 1) {
                let interval = Infinity;
                
                let firstWin = 0;
                let lastWin = 0;
    
                let previousWin = 0;
                let followingWin = 0;
                let isConsecutive: boolean = false;

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
                            interval = Math.abs(calcInterval);
                            isConsecutive = interval === 1;

                            // alimenta o array de dados de resultado
                            _results.push({
                                producer: _producer,
                                interval,
                                previousWin, 
                                followingWin, 
                            });
                        }
                    }
                }
            }
        }

        // retorna um conjunto de dados ja calculados
        return _results;
    }

    /**
     * retorna o calculo esperado de intervalos
     */
    public async getProducersInterval(): Promise<MovieRequest> {
        const movieService: MovieService = new MovieService();
        const _returnData: MovieRequest = {
            min: [],
            max: [],
        };

        try {
            const _movies = await movieService.getOnlyWinners();
            
            if (_movies.length > 0) {
                const _results: MovieProducerResult[] = this.calcProducersInterval(_movies);

                if (_results.length > 0) {
                    const _intervals = _results.map(_result => _result.interval);
    
                    // calcula qual seria o valor a ser considerado como menor
                    const _maxIntervalToBeUsedAsMin = _intervals
                        .reduce((_previous, _current) => _current <= _previous ? _current : _previous , _results[0].interval);
                    
                    // calcula qual seria o valor a ser considerado como maior
                    const _maxIntervalToBeUsedAsMax = _intervals
                        .reduce((_previous, _current) => _current >= _previous ? _current : _previous , _results[0].interval);
    
                    for (const _result of _results) {
                        // remove o extraFields
                        delete _result.extraFields;
    
                        if (_result.interval === _maxIntervalToBeUsedAsMin) {
                            _returnData.min.push(_result);
                        } else if (_result.interval === _maxIntervalToBeUsedAsMax) {
                            _returnData.max.push(_result);
                        }
                    }
                }
            }
        } catch (err) {
            console.log(MovieController.name, new Date().toISOString(), err);
        }

        return _returnData;
    }

    /**
     * trata os dados da rota de insercao
     * @param _data 
     */
    public async insertMovieData(_data: Movie): Promise<RequestInterface> {
        let response: RequestInterface = { message: '', error: false, content: [] };

        try {
            const _dataToSave = new Movie();

            _dataToSave.year = Number(_data.year);
            _dataToSave.title = _data.title;
            _dataToSave.studios = _data.studios;
            _dataToSave.producers = _data.producers;
            _dataToSave.winner = ((_data['winner'] as unknown as string).toLowerCase() === 'yes') ? 1 : 0;

            const checkForErrors = await validate(_dataToSave);
            
            if (checkForErrors && checkForErrors.length > 0) {
                response.content = checkForErrors;
                throw new Error(SystemMessageEnum.DATA_VALIDATION_ERROR);
            }

            const _movieService = new MovieService();

            // insere os dados no banco
            _movieService.insert(_dataToSave);

            response.message = SystemMessageEnum.VALID_DATA_INSERT;
        } catch (err) {
            if (err instanceof Error) {
                console.log(`ERROR ON INSERT DATA ${new Date().toISOString()}`, err.message);
                
                response.message = SystemMessageEnum.DATA_VALIDATION_ERROR;
                response.error = true;
            }
        }

        return response;
    }
}