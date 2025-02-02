import { Router } from 'express';
import { MovieController } from './controller/movie.controller';

const _router = Router();
const _movieController = new MovieController();

_router.get('', async (req, res) => {
    try {
        const _request = await _movieController.getProducersInterval();
        
        res.json(_request);
    } catch (err) {
        res.status(401).json({
            min: [],
            max: [],
            message: 'Nao existem dados para apresentar'
        });
    }
})

_router.post('', (req, res) => {
    res.json({
        min: [],
        max: []
    });
});

_router.delete('', (req, res) => {
    res.json({
        min: [],
        max: []
    });
});

_router.put('', (req, res) => {
    res.json({
        min: [],
        max: []
    });
});

_router.patch('', (req, res) => {
    res.json({
        min: [],
        max: []
    });
});

export default _router;