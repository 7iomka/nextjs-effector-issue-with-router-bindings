import { routesConfig } from './internal';

const api = routesConfig.build();

// Export http instance && types
export * from './internal';

export * from './error';

// Export api instance
export { api };
