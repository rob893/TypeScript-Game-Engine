import { PriorityQueue } from '../src/GameEngine/Core/Helpers/PriorityQueue';

test('Tests the priority queue', () => {
    const q = new PriorityQueue<string>();

    expect(q).toBeInstanceOf(PriorityQueue);
    expect(q.isEmpty).toBe(true);
    expect(q.count).toBe(0);

    q.enqueue('hello', 5);

    expect(q.count).toBe(1);
    expect(q.isEmpty).toBe(false);

    q.enqueue('world', 1);
    q.enqueue('asdf', 3);

    expect(q.dequeue()).toBe('world');
    
    for (let i = 0; i < 10; i++) {
        q.enqueue('test' + i, 1);
    }

    for (let i = 0; i < 10; i++) {
        expect(q.dequeue()).not.toBe('asdf');
    }

    expect(q.dequeue()).toBe('asdf');
});