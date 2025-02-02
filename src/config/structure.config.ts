import { parse as csvParse } from 'csv';
import fs from 'fs';
import path from 'path';
import { MovieService } from "../service/movie.service";
import { ConfigEnum } from '../enum/config.enum';
import { ErrorMessageEnum } from '../enum/error.enum';
import databaseConfig from './database.config';
import { Movie } from '../model/movie.model';

/**
 * classe para configuracao da estrutura inicial dos dados
 */
export class StructureConfig {
    constructor() {}

    /**
     * metodo para o recebimento dos dados em csv e armazena-los no banco
     */
    public static async initial(_origin: ConfigEnum = ConfigEnum.REAL_DATA): Promise<void> {
        const _folder: string = path.join(__dirname, '../../data');
        const _movieService: MovieService = new MovieService();
        const _path = `${_folder}/${_origin}`;

        try {
            // limpa o banco antes de importar os dados novos
            databaseConfig.clear();

            if (!fs.existsSync(_path)) {
                throw new Error(ErrorMessageEnum.FILE_NOT_EXIST)
            }

            const dataList = fs.createReadStream(_path)
                .pipe(csvParse({
                    delimiter: ';',
                    columns: true
                }));

            for await (const _data of dataList) {
                const _dataToSave: Movie = {
                    year: _data.year,
                    title: _data.title,
                    studios: _data.studios,
                    producers: _data.producers,
                    winner: ((_data['winner'] as string).toLowerCase() === 'yes') ? 1 : 0,
                };

                _movieService.insert(_dataToSave);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`ERROR ON READ CSV ${new Date().toISOString()}`, error.message);
            }
        }
    }
}