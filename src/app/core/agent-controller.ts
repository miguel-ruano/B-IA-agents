import { Agent } from "./agent";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export interface AgentControllerCallbacks {
    onFinish?: (any) => void,
    onTurn?: (any) => void
}

export interface AgentControllerAction {
    agentID: string, action: any, at: Date, [key: string]: any
}

export class AgentController {

    protected problem;
    protected currentAgentIndex;
    protected callbacks: AgentControllerCallbacks;
    public agents: { [key: string]: Agent } = {};
    public world0: number[][] = [];
    public actions: AgentControllerAction[] = [];
    public data = { states: {}, world: {} };
    public ui: { actionDelay: number } = { actionDelay: 0 };

    constructor() {
    }
    /**
     * Setup the configuration for the agent controller
     * @param {Object} parameter 
     */
    setup(parameter) {
        this.problem = parameter.problem;
        this.world0 = JSON.parse(JSON.stringify(parameter.world));
        this.ui = parameter.ui || { actionDelay: 0 };
        this.data.world = JSON.parse(JSON.stringify(parameter.world));
    }
    /**
     * Register the given agent in the controller pool. The second parameter stand for the initial state of the agent
     * @param {Agent} agent 
     * @param {Object} state0 
     */
    register(agent: Agent, state0) {
        if (this.agents[agent.getID()]) {
            throw 'AgentIDAlreadyExists';
        } else {
            this.agents[agent.getID()] = agent;
            this.data.states[agent.getID()] = state0;
            //TODO conver state0 to an inmutable object
            agent.setup(JSON.parse(JSON.stringify(state0)));
        }
    }
    /**
     * Remove the given agent from the controller pool
     * @param {Object} input 
     */
    unregister(input) {
        let id = "";
        if (typeof input == 'string') {
            id = input;
        } else if (typeof input == 'object') {
            id = input.getID();
        } else {
            throw 'InvalidAgentType';
        }
        let agent = this.agents[id];
        agent.stop();
        delete this.agents[id];
    }

    /**
    * This function start the virtual life. It will continously execute the actions
    * given by the agents in response to the perceptions. It stop when the solution function
    * is satisfied or when the max number of iterations is reached.
    * If it must to run in interactive mode, the start mode return this object, which is actually 
    * the controller
    * @param {Array} callbacks 
    */
    start(callbacks, interactive = false) {
        this.callbacks = callbacks;
        this.currentAgentIndex = 0;
        if (interactive === false) {
            this.loop();
            return null;
        }
        else {
            return this;
        }
    }

    /**
     * Executes the next iteration in the virtual life simulation
     */
    next() {
        if (!this.problem.goalTest(this.data)) {
            let keys = Object.keys(this.agents);
            let agent = this.agents[keys[this.currentAgentIndex]];
            agent.receive(this.problem.perceptionForAgent(this.getData(), agent.getID()));
            // Espera
            let action = agent.send();
            this.actions.push({ agentID: agent.getID(), action: action, at: new Date() });
            this.problem.update(this.data, action, agent.getID());
            if (this.problem.goalTest(this.data)) {
                this.finishAll();
                return false;
            } else {
                if (this.callbacks.onTurn) {
                    this.callbacks.onTurn({ actions: this.getActions(), data: JSON.parse(JSON.stringify(this.data)) });
                }
                if (this.currentAgentIndex >= keys.length - 1)
                    this.currentAgentIndex = 0;
                else
                    this.currentAgentIndex++;
                return true;
            }
        }
    }

    /**
     * Virtual life loop. At the end of every step it executed the onTurn call back. It could b used for animations of login
     */
    async loop() {
        let stop = false;
        while (!stop) {
            await sleep(this.ui.actionDelay);
            //Creates a thread for every single agent
            Object.values(this.agents).forEach(agent => {
                if (!this.problem.goalTest(this.data)) {
                    agent.receive(this.problem.perceptionForAgent(this.getData(), agent.getID()));
                    let action = agent.send();
                    this.actions.push({ agentID: agent.getID(), action: action, at: new Date() });
                    this.problem.update(this.data, action, agent.getID());
                    if (this.callbacks.onTurn) {
                        this.callbacks.onTurn({ actions: this.getActions(), data: this.data });
                    }
                    stop = this.problem.goalTest(this.data);
                }
            });
        }
        this.finishAll();
    }

    /**
     * This function is executed once the virtual life loop is ended. It must stop every single agent in the pool
     * and execute the onFinish callback 
     */
    finishAll() {
        const data = { actions: this.getActions(), data: this.data, agents: { ...this.agents } }
        // Stop all the agents
        Object.values(this.agents).forEach(agent => {
            agent.stop();
            //this.unregister(agent);
        });
        //Execute the callback
        if (this.callbacks.onFinish)
            this.callbacks.onFinish(data);
    }

    /**
     * Return a copu of the agent controller data. The returned object contains the data of the problem (world) and the
     * state of every single agent in the controller pool (states)
     */
    getData() {
        return this.data;
    }
    /**
     * Return the history of the actions performed by the agents during the current virtual life loop
     */
    getActions() {
        return JSON.parse(JSON.stringify(this.actions));
    }

    /**
     * This function stop all the threads started by the agent controller and stops registered agents
     */
    stop() {
        this.finishAll();
    }
}