import { Router } from 'express';
import { MovieController } from './controller/movie.controller';

const _router = Router();
const _movieController = new MovieController();

_router.get('', async (req, res) => {
    try {
        const _request = await _movieController.getProducersInterval();
        
        res.json(_request);
    } catch (err) {
        res.status(404).json({
            min: [],
            max: [],
            message: 'Nao existem dados para apresentar'
        });
    }
})

_router.post('', async (req, res) => {
    const _request = await _movieController.insertMovieData(req.body);

    if (_request.error) {
        res.status(400);
    }

    res.json(_request);
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