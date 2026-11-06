import DocBlock from '.storybook/DocBlock';
import styled from '@emotion/styled';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { useCallback, useEffect, useRef, useState } from 'react';
import BoundingBoxesComponent, { type BoundingBoxesProps } from 'src/components/BoundingBoxes';
import resizeObserver from 'src/lib/hooks/resizeObserver';
import { emerald, mediumPurple, saturatedOrange } from 'src/styles/lakefrontColors';
import imageFile from './__assets__/ducks.jpg';
import BOUNDING_BOXES_CODE from './boundingBoxesSourceCode';

const BOUNDING_BOXES: {
    name: string;
    items: {
        confidence: number;
        bbox: number[][];
    }[];
    color: string;
}[] = [
    {
        name: 'First Duck',
        items: [
            {
                confidence: 1,
                bbox: [
                    [1390, 280],
                    [1165, 25]
                ]
            }
        ],
        color: emerald
    },
    {
        name: 'Middle Duck',
        items: [
            {
                confidence: 1,
                bbox: [
                    [1620, 590],
                    [1395, 335]
                ]
            },
            {
                confidence: 1,
                bbox: [
                    [1070, 810],
                    [845, 555]
                ]
            }
        ],
        color: saturatedOrange
    },
    {
        name: 'Last Duck',
        items: [
            {
                confidence: 1,
                bbox: [
                    [405, 900],
                    [190, 645]
                ]
            }
        ],
        color: mediumPurple
    }
];

const StoryContainer = styled.div({
    width: '100%',
    minHeight: 320,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        // intentional height over-adjustment helps contained content to fully fit width bounds for most 16:10 scenarios
        // (e.g. hide small pixel value background that shows because of rounding applied to scaled size)
        height: '100.5%',
        objectFit: 'contain'
    }
});

export default {
    title: 'Lakefront/BoundingBoxes',
    component: BoundingBoxesComponent,
    argTypes: {
        imageWidth: {
            control: false
        },
        imageHeight: {
            table: {
                disable: true
            }
        },
        outputWidth: {
            control: false
        },
        outputHeight: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: BOUNDING_BOXES_CODE
            }
        }
    }
} as Meta;

const Template: StoryFn<BoundingBoxesProps> = (args) => {
    const [boundingBoxDimensions, setBoundingBoxDimensions] = useState({ width: 1920, height: 1280 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [observedElement, setObservedElement] = useState(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const containerRef = useCallback(
        (node) => {
            if (node) {
                const { height, width } = node.getBoundingClientRect();
                setBoundingBoxDimensions({ height, width });
            }
        },
        [imageLoaded, observedElement]
    );

    useEffect(() => {
        if (imageRef.current) {
            const resizeCallback = (entries) => {
                setObservedElement(entries);
            };
            const boxResizeObserver = resizeObserver(resizeCallback);

            boxResizeObserver.observe(imageRef.current as HTMLImageElement);

            return () => {
                boxResizeObserver.disconnect();
            };
        }
    }, [imageLoaded]);

    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    return (
        <StoryContainer ref={containerRef}>
            {imageLoaded && (
                <BoundingBoxesComponent
                    {...args}
                    outputHeight={boundingBoxDimensions.height}
                    outputWidth={boundingBoxDimensions.width}
                />
            )}
            <img
                onLoad={handleImageLoaded}
                src={imageFile}
                ref={imageRef}
            />
        </StoryContainer>
    );
};

export const BoundingBoxes = Template.bind({});
BoundingBoxes.args = {
    activeBBox: '',
    imageHeight: 1280,
    imageWidth: 1920,
    boundingBoxItems: BOUNDING_BOXES
};

export const ActiveBoxes = Template.bind({});
ActiveBoxes.args = {
    activeBBox: 'Middle Duck',
    imageHeight: 1280,
    imageWidth: 1920,
    boundingBoxItems: BOUNDING_BOXES
};
