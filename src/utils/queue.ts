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
  ExecuteLike = 'x_react_like',
  ExecuteRetweet = 'x_react_retweet',
  ExecuteComment = 'x_react_comment',
  ExecuteQuote = 'x_react_quote',

  /* Generic Global events */
  GlobalTweet = 'global_post_tweet',
  GlobalBroadcast = 'global_broadcast_engagement',

  /* Task Groups for Follower Broadcasts */
  /** @deprecated */
  BroadcastOpinion = 'broadcast_opinion',
  /** @deprecated */
  BroadcastReaction = 'broadcast_reaction',

  /* Task Groups for Embeddings */
  EmbedOpinion = 'embed_opinion',
  EmbedReaction = 'embed_reaction',
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
    /**
     * @var
     * We want to have at least 120 seconds delay so we can avoid
     * API Rate Limit Restrictions
     */
    const delayThreshold = delay < 120000 ? 180000 : delay;

    void setTimeout(() => {
      this.emit(event, ...args);
    }, delayThreshold);
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
