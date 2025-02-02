import { Database } from "sqlite3";

class DatabaseConfig {
    private _connection: Database;

    get connection(): Database {
        return this._connection;
    }

    constructor() {
        this._connection = new Database(':memory:');
        this.initial();
    }

    /**
     * todas as configuracoes iniciais do banco 
     */
    private initial(): void {
        // inicio da conexao
        this.connection.on('open', () => console.log(`DATABASE START AT ${new Date().toISOString()}`));
        
        // aviso de erro do banco de dados
        this.connection.on('error', _result => {
            console.log(`DATABASE ERROR ${new Date().toISOString()}`, _result.message);
        });
        
        // criacao da tabela
        this.connection.serialize(() => {
            this.connection.run(
                'CREATE TABLE movies (' +
                'year INTEGER,' +
                'title TEXT,' +
                'studios TEXT,' +
                'producers TEXT,' +
                'winner INTEGER' +
                ')'
            )
        });
    }

    public clear(): void {
        this.connection.serialize(() => {
            this.connection.run('DELETE FROM movies');
        });
    }
}

export default new DatabaseConfig();