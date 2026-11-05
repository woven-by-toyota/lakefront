import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import CardComponent, { type CardProps } from 'src/components/Card/Card';
import Snackbar from 'src/components/Snackbar';
import { MESSAGE_TYPES } from 'src/components/Snackbar/Snackbar.util';
import { StyledCard } from './CardStyles';

export default {
    title: 'Lakefront/Card',
    component: CardComponent
} as Meta;

const Template: StoryFn<CardProps> = () => {
    const [showMsg, setShowMsg] = useState<boolean>(false);

    const showMessage = (_value: boolean) => {
        setShowMsg(value => !value);
    };

    const handleClose = () => {
        showMessage(false);
    };

    return (
        <div>
            <Snackbar message='Clicked' open={showMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose} type={MESSAGE_TYPES.SUCCESS} />
            <CardComponent
                title='Card Title'
                description='A description of the card being used.'
                disabled={false}
                onClick={() => showMessage(true)}
                >
                <span>Card content</span>
                </CardComponent>
        </div>
    );
};

const MultiTemplateCard: StoryFn<CardProps> = () => {
    const [showMsg, setShowMsg] = useState<boolean>(false);

    const showMessage = (_value: boolean) => {
        setShowMsg(value => !value);
    };

    const handleClose = () => {
        showMessage(false);
    };

    return (
        <div>
            <Snackbar message='Clicked' open={showMsg} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose} type={MESSAGE_TYPES.SUCCESS} />
            <StyledCard
                title='Card 1'
                description='A description of the card being used.'
                content={<span>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
            <StyledCard
                title='Card 2'
                description='A description of the card being used.'
                content={<span>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
            <StyledCard
                title='Card 3'
                description='A description of the card being used.'
                content={<span>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
            <StyledCard
                title='Card 4'
                description='A description of the card being used.'
                content={<span>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
            <StyledCard
                title='Card 5'
                description='A description of the card being used.'
                content={<span>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
            <StyledCard
                title='Card 6'
                description='A description of the card being used.'
                content={<span style={{ height: 250, width: 500 }}>Card content</span>}
                disabled={false}
                onClick={() => showMessage(true)}
            />
        </div>
    );
};

export const Card = Template.bind({});

export const MultiCard = MultiTemplateCard.bind({});
