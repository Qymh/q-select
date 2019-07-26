import { easeOutCubic } from './uitls';

window.requestAnimationFrame =
  window.requestAnimationFrame || window.webkitRequestAnimationFrame;

window.cancelAnimationFrame =
  window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

class Animate {
  private start: number;

  private end: number;

  private diff: number;

  private count: number;

  public ratio: number;

  private result: number;

  private pipline: boolean;

  private dir: AnimateDir;

  private duration: number;

  public animateId: number;

  constructor(duration: number = 200) {
    this.start = 0;
    this.end = 0;
    this.diff = 0;
    this.dir = 'bottom';
    this.count = 0;
    this.ratio = 0;
    this.result = 0;
    this.animateId = 0;
    this.duration = duration;
    this.pipline = true;
  }

  getAnimateCount(duration: number): number {
    return duration / 16;
  }

  getDirection(): AnimateDir {
    return this.start > this.end ? 'top' : 'bottom';
  }

  run(
    start: number,
    end: number,
    callback: Function,
    last: Function,
    duration?: number
  ) {
    if (start === end) {
      last && last(end);
      return;
    }
    if (duration === 0) {
      last && last(end);
      return;
    }
    this.pipline = true;
    this.ratio = 0;
    this.start = start;
    this.end = end;
    this.result = start;
    this.diff = Math.abs(this.start - this.end);
    this.count = Math.ceil(this.getAnimateCount(duration || this.duration));
    this.dir = this.getDirection();
    this.doAnimate(callback, last);
  }

  stop() {
    this.pipline = false;
    this.ratio = 0;
    window.cancelAnimationFrame(this.animateId);
  }

  doAnimate(callback: Function, last: Function) {
    if (!this.pipline) {
      return;
    }
    this.ratio += 1 / this.count;
    if (this.ratio <= 1) {
      this.result =
        this.start +
        this.diff * easeOutCubic(this.ratio) * (this.dir === 'bottom' ? 1 : -1);
      this.animateId = window.requestAnimationFrame(
        this.doAnimate.bind(this, callback, last)
      );
    } else {
      this.result = this.end;
      window.cancelAnimationFrame(this.animateId);
      last && last(this.end);
      this.ratio = 0;
    }
    callback && callback(this.result);
  }
}

export default Animate;
