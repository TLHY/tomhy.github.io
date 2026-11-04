/* Shared course geometry and fixed-step physics (pixels and seconds). */
(() => {
    const speed = 160;
    const step = 1 / 120;
    const patterns = [
        { name: "CROSSOVER", groups: [[1.2, "floor"], [2.2, "pair"], [3.3, "ceiling"], [4.3, "stack"], [5.5, "gate"], [6.6, "pair"], [7.8, "stack"], [9, "gate"]] },
        { name: "DOUBLE BEAT", groups: [[1.2, "pair"], [2.4, "stack"], [3.6, "gate"], [4.7, "pair"], [5.9, "ceiling"], [6.9, "stack"], [8.1, "pair"], [9.2, "floor"]] },
        { name: "LOW / HIGH", groups: [[1.2, "gate"], [2.3, "stack"], [3.5, "ceiling"], [4.5, "pair"], [5.7, "gate"], [6.8, "stack"], [8, "gate"], [9.1, "pair"]] }
    ].map(({ name, groups }) => ({ name, obstacles: groups.flatMap(([time, kind]) => {
        const floor = { time, bottom: 0, width: 14, height: 24, kind: "floor" };
        const ceiling = { time, bottom: 74, width: 36, height: 62, kind: "ceiling" };
        if (kind === "ceiling") return [ceiling];
        if (kind === "gate") return [floor, ceiling];
        if (kind === "stack") return [floor, { ...floor, bottom: 24, kind: "stack" }];
        if (kind === "pair") return [floor, { ...floor, time: time + 0.14 }];
        return [floor];
    }) }));

    function advance(body, held) {
        const gravity = held && body.velocity > 0 && body.holdTime < 0.24 ? 400 : 1200;
        body.holdTime += step;
        body.velocity -= gravity * step;
        body.y = Math.max(0, body.y + body.velocity * step);
        if (body.y === 0) body.velocity = 0;
    }

    function collides(body, obstacle, elapsed) {
        const x = (obstacle.time - elapsed) * speed;
        // Small insets forgive the empty corners around the triangular spikes.
        return x + obstacle.width - 2 > 2 && x + 2 < 16
            && body.y + 16 > obstacle.bottom + 2
            && body.y + 2 < obstacle.bottom + obstacle.height - 2;
    }

    globalThis.PulseCourse = { speed, step, patterns, advance, collides };
})();
