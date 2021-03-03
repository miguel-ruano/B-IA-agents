import { AgentController, AgentControllerCallbacks } from "./agent-controller";

/**
 * This class specifies the problem to be solved
 */
export abstract class Problem {

    public controller: AgentController;
    public GoalCompleteMessage: string = 'Take the Goal !!!';
    public GoalIncompleteMessage: string = 'Does not take the goal :(';

    constructor(initialState) {
        this.controller = new AgentController();
    }

    /**
     * Check if the given solution solves the problem. You must override
     * @param {Object} solution 
     */
    goalTest(solution) {
        //TODO return boolean
    }

    /**
     * The transition model. Tells how to change the state (data) based on the given actions. You must override
     * @param {} data 
     * @param {*} action 
     * @param {*} agentID 
     */
    update(data, action, agentID) {
        //TODO modify data
    }

    /**
     * Gives the world representation for the agent at the current stage
     * @param {*} agentID 
     * @returns and object with the information to be sent to the agent
     */
    perceptionForAgent(data, agentID) {
        //TODO return the perception
    }

    /**
     * Add a new agent to solve the problem
     * @param {*} agentID 
     * @param {*} agentClass 
     * @param {*} initialState 
     */
    addAgent(agentID, agentArgs, agentClass, initialState) {
        let agent = new agentClass(agentID, agentArgs);
        this.controller.register(agent, initialState);
    }

    /**
     * Solve the given problem
     * @param {*} world 
     * @param {*} callbacks 
     */
    solve(world: number[][], callbacks: AgentControllerCallbacks) {
        this.controller.setup({ world: world, problem: this });
        this.controller.start(callbacks, false);
    }

    /**
     * Returns an interable function that allow to execute the simulation step by step
     * @param {*} world 
     * @param {*} callbacks 
     */
    interactiveSolve(world, callbacks) {
        this.controller.setup({ world: world, problem: this });
        return this.controller.start(callbacks, true);
    }

    /**
     * determines if agent associated to passed id has complete the goal
     * @param agentID agentId
     */
    abstract agentSolveProblem(agentID: string): boolean;

}

