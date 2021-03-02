import { Agent } from "../core";

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
export class MiceAgent extends Agent {
    constructor(id, table) {
        super(id);
        //LEFT, UP, RIGHT, DOWN, CELL
        this.table = table;
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        let viewKey = this.perception.join();
        //let action = foo(this.internalState, this.perception)
        //this.internalState = updatex(this.internalState, this.perception, action)
        //return action;

        if (this.table[viewKey]) {
            return this.table[viewKey];
        } else {
            return this.table["default"];
        }

    }

}