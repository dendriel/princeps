

export class UpdateScorePayload {

    constructor(public scores: [string, number][] = []) {}

    add(score: [string, number]) {
        this.scores.push(score);
    }
}