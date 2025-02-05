import supertest, { Response } from 'supertest';
import { StructureConfig } from '../../src/config/structure.config';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { ConfigEnum } from '../../src/enum/config.enum';
import server from '../../src';

let request!: Response;

describe('Test winners integration', () => {
    beforeAll(async () => {
        await StructureConfig.initial(ConfigEnum.MOCK_DATA);
    })

    afterAll(() => {
        server.close();
    });

    it ('Should return response with status code 200', async () => {
        request = await supertest(server)
            .get('/v1/producers')
            .set("content-type", "application/json");
    
        expect(request.status).toBe(200);
    });

    it ('Should return a object with min and max properties', async () => {
        request = await supertest(server)
            .get('/v1/producers')
            .set("content-type", "application/json");

        expect(request.body).toHaveProperty('max');
        expect(request.body).toHaveProperty('min');
    });

    it ('Should return a object with min array and a interval value should be less than max interval', async () => {
        request = await supertest(server)
            .get('/v1/producers')
            .set("content-type", "application/json");

        expect(request.body.min.length).toBeGreaterThan(0);
        expect(request.body.max.length).toBeGreaterThan(0);
        
        expect(request.body.min[0].interval).toBeLessThan(request.body.max[0].interval);
    });

    it ('Should return one results for min and the interval is 1', async () => {
        request = await supertest(server)
            .get('/v1/producers')
            .set("content-type", "application/json");

        expect(request.body.min.length).toEqual(1);
        expect(request.body.min[0].interval).toEqual(1);
    });
    
    it ('Should return one result for max and the interval is 13', async () => {
        request = await supertest(server)
            .get('/v1/producers')
            .set("content-type", "application/json");

        expect(request.body.min.length).toEqual(1);
        expect(request.body.max[0].interval).toEqual(13);
    });

    it ('Should fails when tries to create a new movie with bad payload', async () => {
        const _movieData = {
            year: undefined,
            title: 12321312,
            studios: null,
            producers: null,
            winner: null
        };
        
        request = await supertest(server)
            .post('/v1/producers')
            .send(_movieData)
            .set("content-type", "application/json");

        expect(request.body.error).toBe(true);
        expect(request.body.message).toEqual('Os dados estao incorretos!');
        expect(request.body.content).toEqual([]);
    });

    it ('Should create a new movie', async () => {
        const _movieData = {
            year: 2050,
            title: 'Viagem de Chihiro',
            studios: 'Ghibi',
            producers: 'Miazaki',
            winner: 'yes'
        };
        
        request = await supertest(server)
            .post('/v1/producers')
            .send(_movieData)
            .set("content-type", "application/json");

        expect(request.body.error).toBe(false);
        expect(request.body.content.id).toBeTruthy();
    });
    
    it ('Should edit a movie', async () => {
        const _movieData = {
            year: 2050,
            title: 'Viagem de Chihiro',
            studios: 'Ghibi',
            producers: 'Miazaki',
            winner: 'yes',
            id: 2
        };
        
        request = await supertest(server)
            .put('/v1/producers/2')
            .send(_movieData)
            .set("content-type", "application/json");

        expect(request.body.error).toBe(false);
    });

    it ('Should fail when tries to edit a movie that does not exist', async () => {
        const _movieData = {
            year: 2050,
            title: 'Viagem de Chihiro',
            studios: 'Ghibi',
            producers: 'Miazaki',
            winner: 'yes',
            id: 999
        };
        
        request = await supertest(server)
            .put('/v1/producers/999')
            .send(_movieData)
            .set("content-type", "application/json");

        expect(request.body.error).toBe(true);
    });
    
    it ('Should delete a movie', async () => {
        request = await supertest(server)
            .delete('/v1/producers/2')
            .set("content-type", "application/json");

        expect(request.body.error).toBe(false);
    });
    
    it ('Should fail when tries to delete a movie that does not exist', async () => {
        request = await supertest(server)
            .delete('/v1/producers/999')
            .set("content-type", "application/json");

        expect(request.body.error).toBe(true);
    });
});
