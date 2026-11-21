import { describe, expect, it } from 'vitest';
import { Countdown } from './countdown';

function clock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

describe('Countdown', () => {
  it('starts with the full duration', () => {
    const c = clock();
    const cd = new Countdown(5200, c.now);
    expect(cd.run()).toBe(5200);
    expect(cd.running).toBe(true);
  });

  it('pause keeps what is left, and run continues from there', () => {
    const c = clock();
    const cd = new Countdown(5200, c.now);
    cd.run();
    c.advance(2000);
    expect(cd.pause()).toBe(3200);
    c.advance(10_000); // time while paused does not count
    expect(cd.remaining()).toBe(3200);
    expect(cd.run()).toBe(3200);
    c.advance(1200);
    expect(cd.remaining()).toBe(2000);
  });

  it('several pauses add up, and never go below zero', () => {
    const c = clock();
    const cd = new Countdown(1000, c.now);
    cd.run();
    c.advance(400);
    cd.pause();
    cd.run();
    c.advance(400);
    expect(cd.pause()).toBe(200);
    cd.run();
    c.advance(900);
    expect(cd.pause()).toBe(0);
  });

  it('pausing twice or running twice changes nothing', () => {
    const c = clock();
    const cd = new Countdown(1000, c.now);
    cd.run();
    c.advance(300);
    cd.run();
    expect(cd.pause()).toBe(700);
    c.advance(300);
    expect(cd.pause()).toBe(700);
  });

  it('reset gives a new word the full duration, stopped', () => {
    const c = clock();
    const cd = new Countdown(1000, c.now);
    cd.run();
    c.advance(600);
    cd.reset();
    expect(cd.running).toBe(false);
    expect(cd.remaining()).toBe(1000);
  });
});
