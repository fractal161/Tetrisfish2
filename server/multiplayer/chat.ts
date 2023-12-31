/*
Stores live chat. Only stores the last N messages.
*/

const MAX_MESSAGES_STORED = 200;

export class ChatMessage {
    constructor(
        public readonly name: string,
        public readonly userIsPro: boolean,
        public readonly userIsPlayer: boolean,
        public readonly message: string,
    ) {}
}

export class Chat {

    private messages: ChatMessage[] = [];

    constructor() {

    }

    public addMessage(message: ChatMessage) {
        this.messages.push(message);
        if (this.messages.length > MAX_MESSAGES_STORED) {
            this.messages.shift();
        }
    }

    public getMessages(): ChatMessage[] {
        return this.messages;
    }

}