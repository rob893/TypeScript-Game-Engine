import { Vector2 } from './Vector2';
import { WeightedGraph } from '../Interfaces/WeightedGraph';
import { PriorityQueue } from './PriorityQueue';
import { WeightedGraphCell } from '../Interfaces/WeightedGraphCell';

export class AStarSearch {

    public static findPath(graph: WeightedGraph<WeightedGraphCell>, start: Vector2, goal: Vector2): Vector2[] | null {
        if (graph.isUnpassable(goal)) {
            return null;
        }
        console.log('searching');
        const cameFrom: Map<Vector2, Vector2> = new Map<Vector2, Vector2>();
        const costSoFar: Map<Vector2, number> = new Map<Vector2, number>();

        const frontier = new PriorityQueue<Vector2>();
        //set to new object to keep from referencing original object
        const originalGoal = new Vector2(goal.x, goal.y);

        //So that the algorithm does not reference the passed in start vector.
        start = new Vector2(start.x, start.y);
        goal = this.normalizePosition(goal, graph.cellSize);

        frontier.enqueue(start, 0);

        cameFrom.set(start, start);
        costSoFar.set(start, 0);

        while (frontier.count > 0) {
            const current = frontier.dequeue();

            if (current.equals(goal)) {
                return this.constructPath(cameFrom, current, start, originalGoal);
            }

            for (const next of graph.neighbors(current)) {
                const newCost = costSoFar.get(current) + graph.cost(current, next.position);

                if (!costSoFar.has(next.position) || newCost < costSoFar.get(next.position)) {
                    costSoFar.set(next.position, newCost);
                    const priority = newCost + this.heuristic(next.position, goal);
                    frontier.enqueue(next.position, priority);
                    cameFrom.set(next.position, current);
                }
            }
        }

        return null;
    }

    private static normalizePosition(pos: Vector2, cellSize: number): Vector2 {
        const x = cellSize * Math.round(pos.x / cellSize);
        const y = cellSize * Math.round(pos.y / cellSize);

        return new Vector2(x, y);
    }

    private static heuristic(a: Vector2, b: Vector2): number {
        return Vector2.distanceSqrd(a, b);
    }

    private static constructPath(cameFrom: Map<Vector2, Vector2>, current: Vector2, start: Vector2, goal: Vector2): Vector2[] {
        const path: Vector2[] = [current];

        if (!current.equals(goal)) {
            path.unshift(goal);
        }

        while (cameFrom.has(current) && current !== start) {
            current = cameFrom.get(current);
            path.push(current);
        }

        return path.reverse();
    }
}