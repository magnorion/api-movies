import { parse as csvParse } from 'csv';
import fs from 'fs';
import path from 'path';
import { MovieService } from "../service/movie.service";

/**
 * classe para configuracao da estrutura inicial dos dados
 */
export class StructureConfig {
    constructor() {}

    /**
     * metodo para o recebimento dos dados em csv e armazena-los no banco
     */
    public static async initial(): Promise<void> {
        const folder: string = path.join(__dirname, '../../data');
        const movieService: MovieService = new MovieService();

        try {
            const dataList = fs.createReadStream(`${folder}/data.csv`)
                .pipe(csvParse({
                    delimiter: ';',
                    columns: true
                }));

            for await (const _data of dataList) {
                _data['winner'] = (_data['winner'] === 'yes') ? 1 : 0
                movieService.insert(_data);
            }
        } catch (err) {
            console.log(`ERROR ON READ CSV ${new Date().toISOString()}`, err);
        }
    }
}