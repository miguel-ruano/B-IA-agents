import { Agent, Problem } from "../../core";

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
export class MouseAgent extends Agent {

    problem: Problem;
    actions: { action: string, coordinate: any }[] = [];
    smart: boolean = false;

    constructor(id, args) {
        super(id);
        //LEFT, UP, RIGHT, DOWN, CELL
        this.table = args.args.commands;
        this.smart = args.args.smart;
        this.problem = args.problem;
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        let viewKey = this.perception.path.join();
        let action = this.table[viewKey] || this.table['default'];
        if (this.smart && this.actions.length > 0) {
            let lastActionIndex = this.actions.length - 1;
            let lastAction = this.actions[lastActionIndex];
            let coordinate = this.perception.coordinate;
            let lastActionLink = this.lastActionLink(coordinate);
            let nextCoordinate = this.problem.nexState(coordinate, action);
            let nextPath = this.perception.path;
            console.log('Last action', lastAction.action, 'next action', action, nextPath);
            console.log('\tFrom', action, '->', this.table[nextPath.join()], 'coordinate', coordinate, '->', nextCoordinate, 'last', lastAction?.coordinate, 'link A', lastActionLink?.a?.coordinate, 'link B', lastActionLink?.b?.coordinate);
            let exit = !this.sameCoordinate(lastAction.coordinate, nextCoordinate) &&
                !(lastActionLink ? (!lastActionLink.a || this.sameCoordinate(lastActionLink.a.coordinate, nextCoordinate)) || ((!lastActionLink.b || this.sameCoordinate(lastActionLink.b.coordinate, nextCoordinate))) : false);
            while (!exit) {
                nextPath = this.makeNextPath(nextPath);
                if (nextPath) {
                    nextCoordinate = this.problem.nexState(coordinate, this.getAction(nextPath));
                    console.log('\tIteration', action, '->', this.table[nextPath.join()], 'coordinate', coordinate, '->', nextCoordinate, 'last', lastAction?.coordinate, 'link A', lastActionLink?.a?.coordinate, 'link B', lastActionLink?.b?.coordinate);
                    action = this.table[nextPath.join()]
                    exit = !this.sameCoordinate(lastAction.coordinate, nextCoordinate) &&
                        !(lastActionLink ? (!lastActionLink.a || this.sameCoordinate(lastActionLink.a.coordinate, nextCoordinate)) || ((!lastActionLink.b || this.sameCoordinate(lastActionLink.b.coordinate, nextCoordinate))) : false);
                } else {
                    exit = true;
                    console.log('\tNextPath not found!, solution = ', lastAction.action, '->', action, nextPath);
                }
            }
        }
        this.actions.push({ action: action, coordinate: this.perception.coordinate })
        return action;
    }

    makeNextPath(path: number[]) {
        const pathCopy = [...path];
        pathCopy[4] = pathCopy[4] + 1;
        if (!this.table[pathCopy.join()]) {
            return null;
        }
        return pathCopy;
    }

    lastActionLink(coordinate) {
        if (this.actions.length >= 2) {
            for (let index = this.actions.length - 2; index >= 0; index--) {
                const action = this.actions[index];
                if (this.sameCoordinate(action.coordinate, coordinate)) {
                    return { a: index - 1 >= 0 ? this.actions[index - 1] : null, b: index + 1 <= this.actions.length - 1 ? this.actions[index + 1] : null };
                }
            }
        }
        return null;
    }

    getAction(path: number[], _default = null) {
        return this.table[path.join()] || _default;
    }

    sameCoordinate(coordA, coordB) {
        return Object.keys(coordA).every(key => coordA[key] == coordB[key]);
    }

    inSamePerception(beforePath: number[], nowPath: number[]): boolean {
        return [0, 1, 2, 3, 5].every(index => beforePath[index] == nowPath[index]);
    }

}