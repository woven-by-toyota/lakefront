import { type ComponentPropsWithoutRef, useState, useRef, useEffect } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import PlaybackBarComponent, { type PlaybackBarProps } from 'src/components/PlaybackBar';
import DocBlock from '.storybook/DocBlock';
import { emerald } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/PlaybackBar',
    component: PlaybackBarComponent,
    argTypes: {
        children: {
            table: {
                disable: true
            }
        },
        className: {
            type: 'string'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<PlaybackBarProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [index, setIndex] = useState(0);
    const [showBanner, setShowBanner] = useState(false);
    const playBackRef = useRef(null);
    const handleSetSlider = (index: number) => {
        setIndex(index);
    };

    useEffect(() => {
        if (playBackRef.current) {
            setShowBanner(true);
        }

        const timer = setTimeout(() => {
            setShowBanner(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [index]);

    return (
        <div ref={playBackRef}>
            <div
                style={{
                    minHeight: 20,
                    backgroundColor: showBanner && emerald,
                    padding: 8,
                    margin: '8px 0',
                    textAlign: 'center',
                    width: '100%'
                }}
            >
                {showBanner && `Playback is set to index ${index}`}
            </div>
            <PlaybackBarComponent currentDuration={args.currentDuration} currentSlider={args.currentSlider}
                endDuration={args.endDuration} highlights={args.highlights} maxSlider={args.maxSlider}
                setSlider={handleSetSlider}>
            </PlaybackBarComponent>
            {args.highlights.map(highlight => {
                return (<div key={`${highlight.start}-${highlight.end}`} style={{ textAlign: 'center' }}>
                    <b>Start Index:</b><span> {highlight.start}</span>&nbsp;
                    <b>End Index:</b><span> {highlight.end}</span>&nbsp;
                    <b>Playback:</b><span> {highlight.playback ? 'True' : 'False'}</span>
                </div>);
            })}
        </div>
    );
};

export const PlaybackBarSingleHighlight = Template.bind({});
PlaybackBarSingleHighlight.args = {
    currentDuration: '00:30',
    currentSlider: 100,
    endDuration: '05:15',
    highlights: [{ start: 50, end: 300, playback: false }],
    maxSlider: 720
};

export const PlaybackBarWithPlayback = Template.bind({});
PlaybackBarWithPlayback.args = {
    currentDuration: '00:30',
    currentSlider: 100,
    endDuration: '05:15',
    highlights: [{ start: 50, end: 300, playback: true }],
    maxSlider: 720
};

export const PlaybackBarMultipleHighlights = Template.bind({});
PlaybackBarMultipleHighlights.args = {
    currentDuration: '00:30',
    currentSlider: 100,
    endDuration: '05:15',
    highlights: [{ start: 50, end: 300, playback: false }, { start: 400, end: 500, playback: false }],
    maxSlider: 720
};
