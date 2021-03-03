import { Problem } from "../../core";

function min(data) {
    let min = 9999999;
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] < min) {
                min = row[j];
            }
        }
    }
    return min;
}

/**
 * Simple reflex agent problem. Define a problem to be solved by a simple reflex agent 
 */
export class CheeseProblem extends Problem {
    public env;
    public GoalCompleteMessage: string = 'Take the Cheese !!!';
    public GoalIncompleteMessage: string = "Don't take the cheese :(";

    constructor(args) {
        super(args);
        this.env = args;
    }

    /**
     * Check if the given solution solves the problem. You must override.
     * The current states of the enviroment is maintained in data.world
     * @param {Object} solution 
     */
    goalTest(data) {
        let minX = min(data.world);
        if (data.interations >= this.env.maxIterations)
            return true;
        if (minX == 0) {
            return true;
        }
        return false;
    }

    /**
     * The transition model. 
     * Tells how to change the states (data) based on the given actions. You must override
     * In this case, the actions can be one the four movements or the TAKE action.
     * In this case, what changes based on the movement actions is the x or y position of the agent
     * or the current cell if the action is TAKE
     * @param {} data 
     * @param {*} action 
     * @param {*} agentID 
     */
    update(data, action, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        if (action == "UP") {
            agentState.y -= 1;
        }
        if (action == "DOWN") {
            agentState.y += 1;
        }
        if (action == "LEFT") {
            agentState.x -= 1;
        }
        if (action == "RIGHT") {
            agentState.x += 1;
        }
        if (action == "TAKE") {
            map[agentState.y][agentState.x] = 0;
        }
        if (!data.interations) {
            data.interations = 1;
        } else {
            data.interations++;
        }
    }

    nexState(state, action) {
        const states = { ...state };
        if (action == "UP") {
            states.y -= 1;
        }
        if (action == "DOWN") {
            states.y += 1;
        }
        if (action == "LEFT") {
            states.x -= 1;
        }
        if (action == "RIGHT") {
            states.x += 1;
        }
        return states;
    }

    /**
     * Gives the world representation for the agent at the current stage.
     * Notice that the agent don't have access to the whole labyrinth. It only "see"
     * the cell around and under it. 
     * @param {*} agentID 
     * @returns and object with the information to be sent to the agent
     */
    perceptionForAgent(data, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        let x = agentState.x;
        let y = agentState.y;
        let result = [];
        //LEFT
        result.push(x > 0 ? map[y][x - 1] : 1);
        //UP
        result.push(y > 0 ? map[y - 1][x] : 1);
        //RIGTH
        result.push(x < map[0].length - 1 ? map[y][x + 1] : 1);
        //DOWN
        result.push(y < map.length - 1 ? map[y + 1][x] : 1);

        result = result.map(value => value > 0 ? 1 : 0);

        // INITIAL WEIGHT
        result.push(0);
        //SMELL
        result.push(Math.abs(map[y][x]));
        return { path: result, coordinate: { x: x, y: y } };
    }

    agentSolveProblem(agentID: string): boolean {
        const agentState = this.controller.data.states[agentID]
        const goalCoordinate = this.goalCoordinate;
        return agentState.x == goalCoordinate.x && agentState.y == goalCoordinate.y;
    }

    get goalCoordinate() {
        const coordinate = { x: -1, y: -1 };
        for (let index = 0; index < this.controller.world0.length; index++) {
            const row = this.controller.world0[index];
            const colInd = row.indexOf(-1);
            if (colInd > -1) {
                return { x: colInd, y: index };
            }
        }
        return coordinate;
    }

}
