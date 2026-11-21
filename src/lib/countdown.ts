/**
 * Time left on one banner word. Pause keeps what is left, so Play continues from the same point
 * instead of restarting or skipping the word. The clock is injectable for tests.
 */
export class Countdown {
  private left: number;
  private startedAt: number | null = null;

  constructor(
    private readonly duration: number,
    private readonly now: () => number = () => performance.now(),
  ) {
    this.left = duration;
  }

  /** Start (or continue) running. Returns the ms until the word should change. */
  run(): number {
    if (this.startedAt === null) this.startedAt = this.now();
    return this.left;
  }

  /** Freeze; returns the ms still left. */
  pause(): number {
    if (this.startedAt !== null) {
      this.left = Math.max(0, this.left - (this.now() - this.startedAt));
      this.startedAt = null;
    }
    return this.left;
  }

  /** A new word: the full duration again, not running. */
  reset(): void {
    this.left = this.duration;
    this.startedAt = null;
  }

  get running(): boolean {
    return this.startedAt !== null;
  }

  /** ms left right now, running or not */
  remaining(): number {
    return this.startedAt === null ? this.left : Math.max(0, this.left - (this.now() - this.startedAt));
  }
}
