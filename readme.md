API Movies
===

## Instalacao
Instale as dependencias usando o npm 
```
npm i
```

> pode usar tambem outras ferramentas como o yarn ou pnpm

## Inicializacao
Apos instalar as dependencias, deve rodar o comando inicial:
```
npm start
```

Ao iniciar, a api inicia uma varredura de dados no arquivo ./data/data.csv e alimenta o banco de dados em memoria (SQLite). Voce pode alterar os dados do arquivo, porem deve preservar o nome e a extensao, caso contrario havera uma mensagem informando que o arquivo nao existe. A api deve seguir funcionando mesmo sem dados!

## Urls
Seguimos a api rodando inicialmente na porta 3000 e temos estes endpoints:
* GET: /v1/producers - deve retornar um objeto com os calculos de menor e maior espaco de tempo de ganhadores da premiacao.
```json
{
    "min": [
        {
            "producer": "Allan Carr",
            "interval": 1,
            "previousWin": 1980,
            "followingWin": 1981
        }
    ],
    "max": [
        {
            "producer": "Frank Yablans",
            "interval": 14,
            "previousWin": 1981,
            "followingWin": 1995
        }
    ]
}
```

* POST: /v1/producers - usado para salvar dados de forma manual, o objeto segue desta forma:
```json
{
    "year": 2050,
    "title": "Viagem de Chihiro",
    "studios": "Ghibi",
    "producers": "Miazaki",
    "winner": ""
}
```

* PUT: /v1/producers/:id - deve seguir a mesma linha que o POST, porem passando o id do objeto que deseja alterar.
```json
{
    "year": 2050,
    "title": "Viagem de Chihiro",
    "studios": "Ghibi",
    "producers": "Miazaki",
    "winner": ""
}
```

* DELETE /v1/producers/:id - recebe um id pela url e deleta o dado
```json
{
    "message": "Os dados foram removidos com sucesso!",
    "error": false,
    "content": {
        "id": 207,
        "year": 2050,
        "title": "Viagem de Chihiro",
        "studios": "Ghibi",
        "producers": "Miazaki",
        "winner": 0
    }
}
```

## Testes
Este projeto usa o jest como ferramenta para testes. Voce so precisa rodar o comando:
```
npm test
```
Ao usar o comando, deve rodar os testes usando o arquivo de mock que esta localizado na pasta ./data/data.mock.csv

Este arquivo pode ser alterado, so precisa preservar o nome e sua extensao, caso contrario havera uma mensagem informando que o arquivo nao existe.

## Build
Caso deseja executar um build para rodar a aplicacao em um ambiente fora do desenvolvimento, basta rodar o comando:
```
npm run build
```

A pasta ./dist sera criada no root do projeto, ja pronto para deploy.

## Dependencias
Este projeto utiliza destas ferramentas:
* typescript
* jest
* expressjs
* babel