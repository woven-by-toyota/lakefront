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
        inverted: colors.dolphin,
        pronounced: colors.mercury,
        alert: colors.watermelon,
        dark: colors.dolphin
    },
    shadowColors: {
        boxShadow: colors.pavement,
    },
    backgrounds: {
        primary: colors.white,
        secondary: colors.akoya,
        tertiary: colors.akoya,
        table: {
            groupedRowPrimary: colors.white,
            groupedRowSecondary: colors.selago,
        },
        widget: {
          primary: colors.gunpowder,
          dark: colors.storm,
          secondaryDark: colors.gunpowder,
          light: colors.white,
        },
        disabled: colors.akoya,
        inverted: colors.storm,
        hover: colors.mercury,
        tinted: colors.akoya,
        error: colors.saturatedRed,
        warning: colors.saturatedOrange,
        errorsInverted: colors.white,
    },
    foregrounds: {
        primary: colors.storm,
        secondary: colors.dolphin,
        error: colors.saturatedRed,
        alert: colors.watermelon,
        disabled: colors.mercury,
        info: colors.akoya,
        warning: colors.saturatedOrange,
        inverted: colors.akoya,
        success: colors.saturatedGreen,
        hyperlink: colors.saturatedBlue,
        loading: colors.pavement,
        tableHeading: colors.pavement,
        widget: {
          primary: colors.akoya,
          dark: colors.akoya,
          secondaryDark: colors.akoya,
          light: colors.storm,
        },
    },
    lettering: {
        primary: {
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
            fontWeight: 400,
        },
        secondary: {
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
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
        inverted: colors.selago,
        pronounced: colors.mercury,
        alert: colors.watermelon,
        dark: colors.dolphin
    },
    shadowColors: {
        boxShadow: `${colors.black}80`,
    },
    backgrounds: {
        primary: colors.gunpowder,
        secondary: colors.storm,
        tertiary: colors.dolphin,
        table: {
            groupedRowPrimary: colors.gunpowder,
            groupedRowSecondary: colors.dolphin,
        },
        widget: {
          primary: colors.white,
          dark: colors.storm,
          secondaryDark: colors.gunpowder,
          light: colors.white
        },
        disabled: lightenDarkenColor(colors.white, -40),
        inverted: colors.white,
        hover: lightenDarkenColor(colors.dolphin, 5),
        tinted: colors.gunpowder,
        error: colors.red,
        warning: colors.orange,
        errorsInverted: colors.gunpowder,
    },
    foregrounds: {
        primary: colors.akoya,
        secondary: colors.mercury,
        error: colors.red,
        alert: colors.watermelon,
        disabled: colors.mercury,
        info: colors.akoya,
        warning: colors.saturatedOrange,
        inverted: colors.storm,
        success: colors.green,
        hyperlink: colors.saturatedBlue,
        loading: colors.akoya,
        tableHeading: colors.pavement,
        widget: {
          primary: colors.storm,
          dark: colors.akoya,
          secondaryDark: colors.akoya,
          light: colors.storm,
        },
    },
    lettering: {
        primary: {
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
            fontWeight: 400,
        },
        secondary: {
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
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
