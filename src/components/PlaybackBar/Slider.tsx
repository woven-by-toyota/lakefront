import { type FC, useMemo, useRef } from 'react';

import { getLeft, getPercentage, getValue, throttled, type HighlightsProp } from './playbackUtil';
import { SliderContainer, SliderBar, SliderStyle, ThumbStyle } from './playbackStyle';
import HighlightSections from './HighlightSections';

interface SliderProps {
    value: number;
    max: number;
    highlights: HighlightsProp[];
    onChange(index: number): void;
}

const Slider: FC<SliderProps> = ({ value, max, highlights, onChange }) => {
    const initialPercentage = getPercentage(value, max);

    const range = useMemo(() => {
        let minRange = 0;
        let maxRange = max;
        if (highlights && highlights.length > 0 && highlights[0].playback) {
            minRange = highlights[0].start;
            maxRange = highlights[0].end;
        }
        return { min: minRange, max: maxRange };
    }, [max, highlights]);

    const sliderRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const mouseMoveHandler = useRef(() => { });

    const triggerThumbMove = (xPos: any) => {
        if (sliderRef.current && thumbRef.current) {
            let newX = xPos;
            const sliderWidth = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
            const start = Math.round((range.min / max) * sliderWidth);
            const end = Math.round((range.max / max) * sliderWidth);

            if (newX < start) {
                newX = start;
            }

            if (newX > end) {
                newX = end;
            }

            const newPercentage = getPercentage(newX, sliderWidth);
            const newValue = getValue(newPercentage, max);

            thumbRef.current.style.left = getLeft(newPercentage);

            if (value !== newValue) {
                onChange(newValue);
            }
        }
    };

    const handleClick = (event: any) => {
        if (sliderRef.current) {
            const xPos = event.clientX - sliderRef.current.getBoundingClientRect().left;
            triggerThumbMove(xPos);
        }
    };

    const handleMouseUp = () => {
        if (thumbRef.current) {
            thumbRef.current.style.cursor = 'grab';
        }
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', mouseMoveHandler.current);
    };

    const handleMouseDown = () => {
        mouseMoveHandler.current = throttled(100, handleMouseMove);
        document.addEventListener('mousemove', mouseMoveHandler.current);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: any) => {
        if (sliderRef.current && thumbRef.current) {
            const xPos = event.clientX - sliderRef.current.getBoundingClientRect().left;
            thumbRef.current.style.cursor = 'grabbing';
            triggerThumbMove(xPos);
        }
    };

    return (
        <SliderContainer>
            <SliderBar />

            <HighlightSections highlights={highlights} max={max} />

            <SliderStyle ref={sliderRef} onClick={handleClick} data-testid="slider" />

            <ThumbStyle
                ref={thumbRef}
                onMouseDown={handleMouseDown}
                left={getLeft(initialPercentage)}
                data-testid="thumb"
            />
        </SliderContainer>
    );
};

export default Slider;
