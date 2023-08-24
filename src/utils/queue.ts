import { EventEmitter } from 'eventemitter3';

/**
 * Interface for the arguments passed to the `schedule` method of `DefferedQueue`.
 *
 * @typedef {Object} EmitWithScheduleArgs
 * @property {string} event - The name of the event to be emitted.
 * @property {number} delay - The delay in milliseconds before the event is emitted.
 * @property {any[]} args - The arguments to be passed to the event listeners.
 */
export interface EmitWithScheduleArgs {
  event: string;
  delay: number;
  args: any[];
}

/**
 * Enum for representing different types of queue tasks.
 *
 * @enum {string}
 * @example
 * ```typescript
 * const taskType = QueueTask.TWEET;
 * ```
 */
export enum QueueTask {
  TWEET = 'tweet',
  REACT = 'react',
}

/**
 * Class representing a deferred queue. It extends EventEmitter and allows for
 * scheduling events to be emitted after a given delay.
 *
 * @class
 * @example
 * ```typescript
 * const queue = new DefferedQueue();
 * queue.on(QueueTask.TWEET, (message) => console.log(message));
 * queue.schedule({ event: QueueTask.TWEET, delay: 1000, args: ['Tweet message'] });
 * ```
 */
export class DefferedQueue extends EventEmitter {
  /**
   * Schedules an event to be emitted after a given delay.
   *
   * @param {EmitWithScheduleArgs} args - The arguments for scheduling the event.
   * @example
   * ```typescript
   * queue.schedule({ event: 'magic', delay: 1000, args: ['Delayed greetings from Hogwarts!'] });
   * ```
   */
  schedule({ event, delay, args }: EmitWithScheduleArgs): void {
    void setTimeout(() => {
      this.emit(event, ...args);
    }, delay);
  }
}

/**
 * A global instance of `DefferedQueue`.
 */
export const queue = new DefferedQueue();
export default queue;
