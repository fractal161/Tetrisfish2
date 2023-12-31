import { ChatMessage } from "./chat";
import { SlotType } from "./slot-state/slot-state";

export interface SerializedSlot {
    slotID: string;
    type: SlotType;
    playerUserID?: string;
    playSessionID?: string;
    playerName?: string;
    numHearts: number;
}

// a serialized room sent to clients when they join a room
export interface SerializedRoom {

    roomID: string;
    adminUserID: string;
    adminName: string;
    isAdminInRoom: boolean;
    numUsersConnected: number;
    slots: SerializedSlot[];

}