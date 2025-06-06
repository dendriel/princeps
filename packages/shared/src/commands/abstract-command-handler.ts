import {CommandHandler} from "./command-handler.js";

export abstract class AbstractCommandHandler<P, T> implements CommandHandler {

    protected constructor(private _type: T) {}

    get type(): T {
        return this._type;
    }

    execute(payload: unknown): void {
        try {
            const typedPayload = payload as P;

            console.log(`Handling ${this._type} command with payload: ${JSON.stringify(typedPayload)}`);

            this.handleCommand(typedPayload);
        } catch (error: unknown) {
            console.error(`Failed to handle command ${this._type}.`, error);
        }
    }

    abstract handleCommand(payload: P): void;
}