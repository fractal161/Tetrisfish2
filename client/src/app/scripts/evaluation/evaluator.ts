import { GamePlacement } from "../../models/game-models/game-placement";
import MoveableTetromino from "../../models/game-models/moveable-tetromino";
import { TetrominoType } from "../../models/tetronimo-models/tetromino";
import { Method, fetchServer } from "../fetch-server";
import { InputSpeed } from "./input-frame-timeline";
import { EngineMovelistURL, LookaheadDepth, RateMoveURL, boardToString, generateStandardParams } from "./stack-rabbit-api";


async function fetchStackRabbitURL(url: string): Promise<any> {

    const result = await fetchServer(Method.GET, "/api/stackrabbit", {"url" : url});
    if (result.status !== 200) {
        throw new Error("Could not evaluate position");
    }

    // // fetch the URL directly from StackRabbit API without server, hopefully avoiding CORS issues
    // const result = (await fetch(url, {
    //     mode: "cors"
    // })).json();

    // return result;

    return result.content;
}

export function generateMoveListURL(placement: GamePlacement, inputSpeed: InputSpeed, useNextBox: boolean, lookaheadDepth: LookaheadDepth): string {
    // Generate the common portion of the URL
    const params = generateStandardParams(placement.grid, placement.currentPieceType, placement.statusBeforePlacement!, inputSpeed);

    return new EngineMovelistURL(params, useNextBox ? placement.nextPieceType : undefined, lookaheadDepth).getURL();
}

// returns the raw dictionary from the StackRabbit engine-movelist request
export async function fetchMovelist(placement: GamePlacement, inputSpeed: InputSpeed, useNextBox: boolean, lookaheadDepth: LookaheadDepth): Promise<any> {

    const movelistURL = generateMoveListURL(placement, inputSpeed, useNextBox, lookaheadDepth);
    return fetchStackRabbitURL(movelistURL);
}


export function generateRateMoveURL(placement: GamePlacement, inputSpeed: InputSpeed, lookaheadDepth: LookaheadDepth) {
    // Generate the common portion of the URL
    const params = generateStandardParams(placement.grid, placement.currentPieceType, placement.statusBeforePlacement!, inputSpeed);

    // Make rate-move request
    const boardWithPlacement = placement.getGridWithPlacement();
    boardWithPlacement.processLineClears();
    return new RateMoveURL(params, boardToString(boardWithPlacement), placement.nextPieceType, lookaheadDepth).getURL();
}

// returns the raw dictionary from the StackRabbit rate-move request
export async function fetchRateMove(placement: GamePlacement, inputSpeed: InputSpeed, lookaheadDepth: LookaheadDepth) {

    const rateMoveURL = generateRateMoveURL(placement, inputSpeed, lookaheadDepth);
    return fetchStackRabbitURL(rateMoveURL);
}
