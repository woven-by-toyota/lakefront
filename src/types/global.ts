import colors from '../styles/lakefrontColors';
import borders from '../styles/borders';
import zIndex from '../styles/zIndex';

/**
 * JSONObject is a wrapper for a generic JSON object structure.
 */
export interface JSONObject {
    [key: string]: any;
}

/**
 * This is the structure of a selectable option.
 */
export interface SelectOption<T> {
    label: string;
    value: T;
}

/**
 * This is the structure of Tabs.
 */
export interface TabDef {
    key: string;
    caption: string;
}

type ColorsType = typeof colors;
type BordersType = typeof borders;
type ZIndexType = typeof zIndex;

export interface LakefrontTheme {
    colors: ColorsType;
    borders: BordersType;
    zIndex: ZIndexType;
    DARKEN_MOST: number;
    DARKEN_LEAST: number;
    textColors: {
        primary: string;
        secondary: string;
        h2: string;
        h4: string;
        error: string;
        disabled: string;
    };
    backgroundColors: {
        primary: string;
        secondary: string;
        third: string;
        fourth: string;
        fifth: string;
        primaryWidget: string;
        disabled: string;
    };
    borderColors: {
        primary: string;
        secondary: string;
        disabled: string;
        inverted: string;
    };
    buttonColors: {
        primary: string;
        secondary: string;
    };
    shadowColors: {
        boxShadow: string;
    };
    backgrounds: {
        primary: string;
        secondary: string;
        tertiary: string;
        widget: string;
        disabled: string;
        inverted: string;
        hover: string;
        tinted: string;
        error: string;
        errorsInverted: string;
    };
    foregrounds: {
        primary: string;
        secondary: string;
        error: string;
        disabled: string;
        info: string;
        warning: string;
        inverted: string;
        success: string;
        hyperlink: string;
        loading: string;
    };
    lettering: {
        primary: {
            fontSize: number;
            fontFamily: string;
            fontWeight: number;
        };
        secondary: {
            fontSize: number;
            fontFamily: string;
            fontWeight: number;
        };
        h1: { fontSize: number; fontFamily: string; fontWeight: number };
        h2: { fontSize: number; fontFamily: string; fontWeight: number };
        h3: { fontSize: number; fontFamily: string; fontWeight: number };
        h4: { fontSize: number; fontFamily: string; fontWeight: number };
        h5: { fontSize: number; fontFamily: string; fontWeight: number };
        h6: { fontSize: number; fontFamily: string; fontWeight: number };
    };
}

