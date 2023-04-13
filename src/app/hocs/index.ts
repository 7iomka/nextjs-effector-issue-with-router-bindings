import compose from 'lodash.flowright';
import { withEffector } from 'nextjs-effector';
import { withEffectorRouterEvents } from './with-effector-router-events';

/**
 * @hoc Application initialization logic
 * @remark Contains:
 * - Effector itinialisation logic (Provider, scope bindings, etc.) (withEffectorProvider)
 * - Effector bindings to next.js router events
 */
const withHocs = compose(withEffector, withEffectorRouterEvents);

export { withHocs };
