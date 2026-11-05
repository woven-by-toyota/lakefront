import '@emotion/react';
import { LakefrontTheme } from './types/global';

declare module '@emotion/react' {
    export interface Theme extends LakefrontTheme {}
}
