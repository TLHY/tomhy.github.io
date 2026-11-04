const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const context = {};
runInNewContext(readFileSync(`${__dirname}/../assets/js/pulse-course.js`, 'utf8'), context);
const { patterns, advance, collides, step } = context.PulseCourse;

function peak(held) {
    const body = { y: 0, velocity: 300, holdTime: 0 };
    let max = 0;
    for (let i = 0; i < 180; i++) {
        advance(body, held);
        max = Math.max(max, body.y);
    }
    assert.equal(body.y, 0);
    return max;
}

test('tap clears a floor spike; hold clears a double stack but reaches ceiling hazards', () => {
    const low = peak(false), high = peak(true);
    assert(low > 24 && low + 18 < 74);
    assert(high > 48 && high + 18 > 74);
});

test('collision checks both height and horizontal overlap', () => {
    const floor = { time: 1, width: 14, bottom: 0, height: 24 };
    const ceiling = { ...floor, bottom: 74, height: 62 };
    assert(collides({ y: 0 }, floor, 1));
    assert(!collides({ y: 60 }, floor, 1));
    assert(!collides({ y: 0 }, ceiling, 1));
    assert(collides({ y: 80 }, ceiling, 1));
    assert(!collides({ y: 0 }, floor, 0));
});

for (const pattern of patterns) {
    test(`${pattern.name}: denser mixed course is clearable with tap/hold timing`, () => {
        assert(pattern.obstacles.length > 10);
        assert(pattern.obstacles.some(o => o.kind === 'ceiling'));
        assert(pattern.obstacles.some(o => o.kind === 'stack'));
        const times = [...new Set(pattern.obstacles.filter(o => o.kind !== 'ceiling').map(o => o.time))];
        const jumps = [];
        for (const time of times) {
            if (jumps.some(j => Math.abs(j.target + 0.14 - time) < 0.001)) continue;
            const tall = pattern.obstacles.some(o => o.time === time && o.kind === 'stack');
            const pair = pattern.obstacles.some(o => Math.abs(o.time - time - 0.14) < 0.001);
            jumps.push({ target: time, start: time - (tall || pair ? 0.33 : 0.23), hold: tall || pair ? 0.24 : 0 });
        }
        const body = { y: 0, velocity: 0, holdTime: 0 };
        for (let elapsed = step; elapsed <= 10; elapsed += step) {
            const jump = jumps.find(j => !j.used && elapsed >= j.start);
            if (jump) {
                assert.equal(body.y, 0, 'must land before the next jump');
                body.velocity = 300;
                body.holdTime = 0;
                jump.used = true;
                jump.actualStart = elapsed;
            }
            const held = jumps.some(j => j.used && elapsed - j.actualStart < j.hold);
            advance(body, held);
            for (const obstacle of pattern.obstacles) {
                assert(!collides(body, obstacle, elapsed), `hit ${obstacle.kind} at ${elapsed.toFixed(3)}s (target ${obstacle.time})`);
            }
        }
        assert(jumps.every(j => j.used));
    });
}
