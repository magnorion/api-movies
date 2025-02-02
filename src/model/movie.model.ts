export class Movie {
    constructor(
        public year: number,
        public title: string,
        public studios: string,
        public producers: string,
        public winner: number,
    ) {}

    get status(): boolean {
        return this.winner === 1;
    }

    set status(win: string) {
        this.winner = (win && win === 'yes') ? 1 : 0;
    }
}