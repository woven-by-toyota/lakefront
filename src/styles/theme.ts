import colors from './lakefrontColors';
import borders from './borders';
import zIndex from './zIndex';
import { Theme } from '@emotion/react';
import { lightenDarkenColor } from './stylesUtil';

const THEME: Theme = {
    colors,
    borders,
    zIndex,
    DARKEN_MOST: -40,
    DARKEN_LEAST: -10,
    textColors: {
        primary: colors.storm,
        secondary: colors.dolphin,
        h2: colors.cinder,
        h4: colors.storm,
        error: colors.saturatedRed,
        disabled: colors.mercury,
    },
    backgroundColors: {
        primary: colors.white,
        secondary: colors.akoya,
        third: colors.akoya,
        fourth: colors.pavement,
        fifth: colors.pavement,
        primaryWidget: colors.gunpowder,
        disabled: colors.akoya,
    },
    buttonColors: {
        primary: colors.akoya,
        secondary: colors.white,
    },
    borderColors: {
        primary: colors.selago,
        secondary: colors.storm,
        disabled: colors.akoya,
        inverted: colors.dolphin
    },
    shadowColors: {
        boxShadow: colors.pavement,
    },
    backgrounds: {
        primary: colors.white,
        secondary: colors.akoya,
        tertiary: colors.akoya,
        widget: colors.gunpowder,
        disabled: colors.grey30,
        inverted: colors.storm,
        hover: colors.mercury,
        tinted: colors.akoya,
        error: colors.saturatedRed,
        errorsInverted: colors.white
    },
    foregrounds: {
        primary: colors.storm,
        secondary: colors.dolphin,
        error: colors.saturatedRed,
        disabled: colors.mercury,
        info: colors.akoya,
        warning: colors.saturatedOrange,
        inverted: colors.akoya,
        success: colors.saturatedGreen,
        hyperlink: colors.saturatedBlue,
        loading: colors.pavement,
    },
    lettering: {
        primary: {
            fontSize: 14,
            fontFamily: "Times New Roman (Serif)",
            fontWeight: 400,
        },
        secondary: {
            fontSize: 12,
            fontFamily: "Arial (Sans-serif)",
            fontWeight: 400,
        },
        h1: { fontSize: 32, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h2: { fontSize: 28, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h3: { fontSize: 24, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h4: { fontSize: 20, fontFamily: "Arial, sans-serif", fontWeight: 600 },
        h5: { fontSize: 18, fontFamily: "Arial, sans-serif", fontWeight: 600 },
        h6: { fontSize: 16, fontFamily: "Arial, sans-serif", fontWeight: 600 },
    },
};

export const DARK_THEME: Theme = {
    colors,
    borders,
    zIndex,
    DARKEN_MOST: -40,
    DARKEN_LEAST: -10,
    textColors: {
        primary: colors.akoya,
        secondary: colors.mercury,
        h2: colors.pavement,
        h4: colors.akoya,
        error: colors.saturatedRed,
        disabled: colors.mercury,
    },
    backgroundColors: {
        primary: colors.gunpowder,
        secondary: colors.storm,
        third: colors.dolphin,
        fourth: colors.cinder,
        fifth: colors.dolphin,
        primaryWidget: colors.white,
        disabled: lightenDarkenColor(colors.white, -40),
    },
    buttonColors: {
        primary: colors.dolphin,
        secondary: colors.gunpowder,
    },
    borderColors: {
        primary: colors.dolphin,
        secondary: colors.mercury,
        disabled: lightenDarkenColor(colors.white, -40),
        inverted: colors.selago
    },
    shadowColors: {
        boxShadow: "",
    },
    backgrounds: {
        primary: colors.gunpowder,
        secondary: colors.storm,
        tertiary: colors.dolphin,
        widget: colors.white,
        disabled: lightenDarkenColor(colors.white, -40),
        inverted: colors.white,
        hover: lightenDarkenColor(colors.dolphin, 5),
        tinted: colors.gunpowder,
        error: colors.red,
        errorsInverted: colors.gunpowder
    },
    foregrounds: {
        primary: colors.akoya,
        secondary: colors.mercury,
        error: colors.red,
        disabled: colors.mercury,
        info: colors.akoya,
        warning: colors.saturatedOrange,
        inverted: colors.storm,
        success: colors.green,
        hyperlink: colors.saturatedBlue,
        loading: colors.pavement
    },
    lettering: {
        primary: {
            fontSize: 12,
            fontFamily: "Times New Roman (Serif)",
            fontWeight: 400,
        },
        secondary: {
            fontSize: 12,
            fontFamily: "Arial (Sans-serif)",
            fontWeight: 400,
        },
        h1: { fontSize: 32, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h2: { fontSize: 28, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h3: { fontSize: 24, fontFamily: "Arial, sans-serif", fontWeight: 700 },
        h4: { fontSize: 20, fontFamily: "Arial, sans-serif", fontWeight: 600 },
        h5: { fontSize: 18, fontFamily: "Arial, sans-serif", fontWeight: 600 },
        h6: { fontSize: 16, fontFamily: "Arial, sans-serif", fontWeight: 600 },
    },
};


export default THEME;
