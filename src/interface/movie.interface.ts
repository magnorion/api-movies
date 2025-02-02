export interface MovieRequest {
    min: MovieProducerResult[],
    max: MovieProducerResult[]
}

export interface MovieProducerResult {
    producer: string,
    interval: number,
    previousWin: number,
    followingWin: number
}
