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
});
