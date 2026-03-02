import { FC } from 'react';
import Slider from './Slider';
import { PlaybackStyle, PlaySlider } from './playbackStyle';
import { HighlightsProp } from './playbackUtil';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export interface PlaybackBarProps {
    /**
     * This is to display the current duration of the playback component.
     */
    currentDuration: string;
    /**
     * This is to display the end duration of the playback component.
     */
    endDuration: string;
    /**
     * This is to set the slider position on initial render of the playback component.
     */
    currentSlider: number;
    /**
     * This is to set the max value of the playback component.
     */
    maxSlider: number;
    /**
     * This function is called when the slider is moved.
     */
    setSlider(index: number): void;
    /**
     * This is to highlight a particular section of the playback component in green.
     */
    highlights: HighlightsProp[];
    /**
     * The classes to pass to the playback bar.
     */
    className?: string;
}

/**
 *  The Playback Component renders a slider.
 *  The highlights property is an array and each item in an array has start,end and playback.
 *  The Playback component is highlighted depending on the start and end value.
 *  You can have multiple highlights in one single playback component.
 *  The slider can be moved between the start point and the end point depending upon the playback property.
 *  The playback property determines whether the slider can be moved freely or whether it is constrained to the highlighted areas.
 */
const PlaybackBar: FC<PlaybackBarProps> = ({ currentDuration,
    currentSlider,
    endDuration,
    highlights,
    maxSlider,
    setSlider,
    className
}) => {

    return (
            <PlaybackStyle className={className}>
                <PlaySlider>
                    <span>{currentDuration}</span>
                    <Slider
                        value={currentSlider}
                        max={maxSlider}
                        highlights={highlights}
                        onChange={setSlider}
                    />
                    <span>{endDuration}</span>
                </PlaySlider>
            </PlaybackStyle>
    );
};

export default PlaybackBar;
