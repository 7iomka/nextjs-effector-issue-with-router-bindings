import type { UrlObject } from 'url';
import type { NextRouter } from 'next/router';

export interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  unstable_skipClientCache?: boolean;
}
export interface NextHistoryState {
  url: string | UrlObject;
  as: string;
  options: TransitionOptions;
}
export interface RouterPushDto {
  url: Parameters<NextRouter['push']>[0];
  options?: Parameters<NextRouter['push']>[2];
}
