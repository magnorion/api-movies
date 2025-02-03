import { parse as csvParse } from 'csv';
import fs from 'fs';
import path from 'path';
import { MovieService } from "../service/movie.service";
import { ConfigEnum } from '../enum/config.enum';
import { SystemMessageEnum } from '../enum/system-message.enum';
import databaseConfig from './database.config';
import { Movie } from '../model/movie.model';
import { validate } from 'class-validator';

/**
 * classe para configuracao da estrutura inicial dos dados
 */
export class StructureConfig {
    constructor() {}

    /**
     * metodo para o recebimento dos dados em csv e armazena-los no banco
     */
    public static async initial(_origin: ConfigEnum = ConfigEnum.MOCK_DATA): Promise<void> {
        const _folder: string = path.join(__dirname, '../../data');
        const _movieService: MovieService = new MovieService();
        const _path = `${_folder}/${_origin}`;

        try {
            // limpa o banco antes de importar os dados novos
            databaseConfig.clear();

            if (!fs.existsSync(_path)) {
                throw new Error(SystemMessageEnum.FILE_NOT_EXIST);
            }

            const dataList = fs.createReadStream(_path)
                .pipe(csvParse({
                    delimiter: ';',
                    columns: true
                }));

            for await (const _data of dataList) {
                const _dataToSave = new Movie();
                _dataToSave.year = Number(_data.year);
                _dataToSave.title = _data.title;
                _dataToSave.studios = _data.studios;
                _dataToSave.producers = _data.producers;
                _dataToSave.winner = ((_data['winner'] as string).toLowerCase() === 'yes') ? 1 : 0;

                // insere os dados no banco
                _movieService.insert(_dataToSave);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`ERROR ON READ CSV ${new Date().toISOString()}`, error.message);
            }
        }
    }
}