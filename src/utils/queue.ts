/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EventEmitter } from 'eventemitter3';

/**
 * `object` should be in either of the following forms:
 * ```
 * interface EventTypes {
 *   'event-with-parameters': any[]
 *   'event-with-example-handler': (...args: any[]) => void
 * }
 * ```
 */
type ValidEventTypes = string | symbol | object;

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
  /* Tweet reaction events */
  REACT_LIKE = 'react_like',
  REACT_RETWEET = 'react_retweet',
  REACT_REPLY = 'react_reply',
  REACT_QUOTE = 'react_quote',

  /* Embeddings events */
  EMBED_LIKE = 'embed_tweet_likes',
  EMBED_TWEET = 'embed_tweet',
  EMBED_REPLY = 'embed_tweet_replies',
  EMBED_QUOTE = 'embed_tweet_quote',
  EMBED_RETWEET = 'embed_tweet_retweets',

  /* Broadcast tasks */
  TWEET = 'tweet',
  BROADCAST = 'broadcast',
}

/**
 * Interface for the arguments passed to the `schedule` method of `DefferedQueue`.
 *
 * @typedef {Object} EmitWithScheduleArgs
 * @property {string} event - The name of the event to be emitted.
 * @property {number} delay - The delay in milliseconds before the event is emitted.
 * @property {any[]} args - The arguments to be passed to the event listeners.
 */
export interface EmitScheduleOptions {
  event: string | symbol;
  args: EventEmitter.EventArgs<ValidEventTypes, string>;
  delay: number;
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
   * @param {EmitScheduleOptions} args - The arguments for scheduling the event.
   * @example
   * ```typescript
   * queue.schedule({ event: QueueTask.TWEET, delay: 1000, args: ['Delayed greetings from Yaba!'] });
   * ```
   */
  schedule({ event, delay, args }: EmitScheduleOptions): void {
    void setTimeout(() => {
      this.emit(event, ...args);
    }, delay);
  }

  /**
   * Emits an event with the given arguments.
   *
   * @example
   * ```typescript
   * queue.send({ event: QueueTask.TWEET, args: ['Greetings from Yaba!'] });
   * ```
   */
  send({ event, args }: Omit<EmitScheduleOptions, 'delay'>): boolean {
    return this.emit(event, ...args);
  }
}

/**
 * A global instance of `DefferedQueue`.
 */
export const queue = new DefferedQueue();
export default queue;
