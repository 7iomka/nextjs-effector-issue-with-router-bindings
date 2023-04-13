import { useGate, useUnit } from 'effector-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { $$navigation } from '@/entities/navigation';
import type { AppPropsWithLayout } from '../app.types';

export const withEffectorRouterEvents = (App: any) => {
  return function AppWithEffectorRouterEvents(props: AppPropsWithLayout) {
    const router = useRouter();
    const beforePopstateChanged = useUnit($$navigation.beforePopstateChanged);

    useGate($$navigation.RouterGate, router);

    // Handle beforePopState
    // NOTE: currently next support only single callback, that can be overwriten on updates
    // See: https://github.com/vercel/next.js/discussions/34835
    useEffect(() => {
      router.beforePopState((state) => {
        beforePopstateChanged(state);
        return true;
      });
    }, [router, beforePopstateChanged]);

    return <App {...props} />;
  };
};
