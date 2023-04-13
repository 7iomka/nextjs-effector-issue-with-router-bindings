import type { Gate } from 'effector-react';
import { useGate, useUnit } from 'effector-react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import type { EmptyOrPageEvent, PageContext } from 'nextjs-effector';
import { ContextNormalizers } from 'nextjs-effector';
import { assertStrict } from 'nextjs-effector';

/**
 * Runs once per `enter` enterClient event when next.js router is ready
 * If you have need for gate status and page context, use `usePageGate` instead
 */
export const useEnterClientEvent = (event: EmptyOrPageEvent<any, any>) => {
  assertStrict(event);

  const router = useRouter();
  const boundEvent = useUnit(event);
  const isEnterEventCalledRef = useRef(false);

  useEffect(() => {
    if (router.isReady && !isEnterEventCalledRef.current) {
      const context = ContextNormalizers.router(router);
      boundEvent(context);
      isEnterEventCalledRef.current = true;
    }

    return () => {
      isEnterEventCalledRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
};

/**
 * Enchanced version of useGate with page context
 * When useGate starts, router.isReady is true
 */
export const usePageGate = (gate: Gate<PageContext>) => {
  const router = useRouter();
  const context = ContextNormalizers.router(router);

  return useGate(gate, context);
};
