import { Router } from 'express';
import { MovieController } from './controller/movie.controller';

const _router = Router();
const _movieController = new MovieController();

_router.get('', (req, res) => {
    const request = _movieController.getProducersInterval();
})

_router.post('', (req, res) => {});

_router.delete('', (req, res) => {});

_router.patch('', (req, res) => {});

_router.put('', (req, res) => {});

export default _router;