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

_router.post('', (req, res) => {});

_router.delete('', (req, res) => {});

_router.patch('', (req, res) => {});

_router.put('', (req, res) => {});

export default _router;