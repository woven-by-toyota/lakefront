const THUMB_HALF_WIDTH = 7;

export const getPercentage = (current: number, max: number) => (100 * current) / max;

export const getValue = (percentage: number, max: number) => Math.round((max / 100) * percentage);

export const getLeft = (percentage: number) => `calc(${percentage}% - ${THUMB_HALF_WIDTH}px)`;

export const throttled = (delay: number, fn: any) => {
    let lastCall = 0;
    return (...args: any) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    };
};

/**
 * This is the structure for Highlights.
 */
export interface HighlightsProp {
    start: number;
    end: number;
    playback: boolean;
}
