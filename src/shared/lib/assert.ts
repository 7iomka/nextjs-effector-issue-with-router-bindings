import { Event } from "effector";

/**
 * Casts an event union into a single event by removing empty event
 * (it's very hard to use event unions in Effector flow)
 */
export function assertEventStrict<T>(
    event: Event<T> | Event<void>
  ): asserts event is Event<T> {}
  