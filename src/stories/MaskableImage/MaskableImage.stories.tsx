import { type ComponentPropsWithoutRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import MaskableImageComponent, { type MaskableImageProps } from 'src/components/MaskableImage';
import DocBlock from '.storybook/DocBlock';
import { emerald } from 'src/styles/lakefrontColors';
import imageFile from './__assets__/Nature.jpg';

export default {
    title: 'Lakefront/MaskableImage',
    component: MaskableImageComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<MaskableImageProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const onHandleImageClick = () => {
        setShowMessage(showMessage => !showMessage);
    };
    return (
        <>
            <div
                style={{
                    minHeight: 20,
                    backgroundColor: showMessage && emerald,
                    padding: 8,
                    margin: '8px 0',
                    textAlign: 'center'
                }}
            >
                {showMessage && 'This image is selected.'}
            </div>
            <MaskableImageComponent url={args.url}
                fullSizeDimensions={args.fullSizeDimensions} selectable={args.selectable} selected={args.selected}
                highlighted={args.highlighted} showSpinner={args.showSpinner} showSpinnerOnLoad={args.howSpinnerOnLoad}
                heightToWidthRatio={args.heightToWidthRatio} onSelect={onHandleImageClick} />
        </>
    );
};

export const MaskableImage = Template.bind({});
MaskableImage.args = {
    url: imageFile,
    fullSizeDimensions: { height: '1px', width: '2px' },
    selectable: true,
    selected: false,
    highlighted: false,
    showSpinner: false,
    showSpinnerOnLoad: true,
    heightToWidthRatio: 10 / 18
};
