import {CommandHandler} from "./command-handler.js";
import {ClientCommand} from "../../../../shared/dist/princeps-shared.js"

export abstract class AbstractCommandHandler<T> implements CommandHandler {

    protected constructor(private _type: ClientCommand) {}

    get type(): ClientCommand {
        return this._type;
    }

    execute(payload: unknown): void {
        try {
            const typedPayload = payload as T;

            console.log(`Handling ${this._type} command with payload: ${JSON.stringify(typedPayload)}`);

            this.handleCommand(typedPayload);
        } catch (error) {
            console.log(`Failed to handle command ${this._type}. Error: ${JSON.stringify(error)}`);
        }
    }

    abstract handleCommand(payload: T): void;
}