/*
Deserializes SR rate-move deep/shallow request and stores as a model
A numerical rating of a move considering both the current and next piece
rate-move returns a dictionary of the form:
{
    playerMoveNoAdjustment: number (player move's eval not considering next box),
    playerMoveAfterAdjustment: number (player move's eval considering next box),
    bestMoveNoAdjustment: number (best move's eval not considering next box),
    bestMoveAfterAdjustment: number (best move's eval considering next box),
}
*/

import { fetchRateMove } from "../../scripts/evaluation/evaluator";
import { InputSpeed } from "../../scripts/evaluation/input-frame-timeline";
import { LookaheadDepth } from "../../scripts/evaluation/stack-rabbit-api";
import { Rating, getRatingFromRelativeEval } from "../evaluation-models/rating";
import { GamePlacement } from "../game-models/game-placement";

abstract class RateMove {

    public playerNNB: number | undefined = -1;
    public playerNB: number | undefined = -1;
    public bestNNB: number = -1;
    public bestNB: number = -1;

    constructor(dict: any) {
        // console.log("rate move created", dict);
        if (dict) {

            const playerNNB = Number(dict["playerMoveNoAdjustment"]);
            this.playerNNB = isNaN(playerNNB) ? undefined : playerNNB;

            const playerNB = Number(dict["playerMoveAfterAdjustment"]);
            this.playerNB = isNaN(playerNB) ? undefined : playerNB;

            this.bestNNB = Number(dict["bestMoveNoAdjustment"]);
            this.bestNB = Number(dict["bestMoveAfterAdjustment"]);
        }
    }
}

export class RateMoveDeep extends RateMove {

    public readonly rating: Rating;
    public readonly diff: number | undefined;

    static async fetch(placement: GamePlacement, inputSpeed: InputSpeed): Promise<RateMoveDeep> {
        const response = await fetchRateMove(placement, inputSpeed, LookaheadDepth.DEEP);
        return new RateMoveDeep(response);
    }

    constructor(dict: any) {
        super(dict);
        this.diff = this.playerNB ? (this.playerNB - this.bestNB) : undefined;
        this.rating = getRatingFromRelativeEval(this.diff);
    }

}
export class RateMoveShallow extends RateMove {

    static async fetch(placement: GamePlacement, inputSpeed: InputSpeed): Promise<RateMoveShallow> {
        const response = await fetchRateMove(placement, inputSpeed, LookaheadDepth.SHALLOW);
        return new RateMoveShallow(response);
    }
    
}