import { prisma } from '@/server/db';
import { NTPClient } from '@/utils/ntp';
import { _CONSOLE_RATE_LIMIT_ } from './constants';

/**
 * @class
 * A RollingWindow Rate Limiter class that implements the Rolling Window strategy
 * with our sentiments database model and NTPClient to get the current NTP time
 */
export class RollingWindow {
  private maxTokens: number;
  private windowSizeInMinutes: number;

  /**
   * Creates an instance of the Rolling Window rate limiter
   * @param {number} maxTokens - Maximum Agent actions allowed within time window
   * @param {number} windowSizeInMinutes - Time window size in minutes, default = 5
   */
  constructor(maxTokens: number, windowSizeInMinutes: number = 10) {
    this.maxTokens = maxTokens;
    this.windowSizeInMinutes = windowSizeInMinutes;
  }

  /**
   * Gets the current NTP time
   * @returns {Promise<Date>} The current NTP time
   */
  private async getCurrentNTPTime(): Promise<Date> {
    try {
      const ntpClient = new NTPClient();
      const date = await ntpClient.getNetworkTime();

      console.log(date);
      return date;
    } catch (error) {
      console.error(error);

      /**
       * @deprecated
       * Fallback to system date, because this is
       * error prone and can lead to inconsistencies
       */
      return new Date();
    }
  }

  /**
   * Checks if an action can be performed without consuming a token.
   * @param {string} actor - The author's unique ID
   * @returns {Promise<boolean>} Whether the action can be performed
   */
  public async canConsume(actor: string): Promise<boolean> {
    const currentTime = await this.getCurrentNTPTime();
    const pastTime = new Date(
      currentTime.getTime() - this.windowSizeInMinutes * 60 * 1000,
    );

    /**
     * @operation
     * Get a count of actor sentiments within the time window
     */
    const count = await prisma.sentiment.count({
      where: {
        author_id: actor,
        timestamp: {
          gte: pastTime,
        },
      },
    });

    console.log({
      pastTime,
      count,
      currentTime,
      from: '<><><><><><><><><<><><><><><><><><><><><><><><><><><><<>><><><><><>><><><><<><><><><><><><>',
    });

    return count < this.maxTokens;
  }

  /**
   * Checks if an action can be performed, throwing an exception if not.
   * @param {string} actor - The author's unique ID
   * @throws Will throw an error if the action cannot be performed
   */
  public async canConsumeOrThrow(actor: string): Promise<void> {
    if (!(await this.canConsume(actor))) {
      console.error(_CONSOLE_RATE_LIMIT_);
      throw new Error('Rate limit exceeded');
    }
  }
}
