
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

export type LayoutGetter = (page: ReactElement) => ReactNode;

export type NextPageWithLayout = NextPage & {
  getLayout?: LayoutGetter;
};

export interface MyAppProps extends AppProps {}

export type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};
