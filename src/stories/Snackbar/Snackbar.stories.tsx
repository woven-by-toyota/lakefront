import type { Meta, StoryFn } from '@storybook/react-webpack5';
import SnackbarComponent, { type SnackbarProps } from 'src/components/Snackbar/index';
import DocBlock from '.storybook/DocBlock';
import { MESSAGE_TYPES } from 'src/components/Snackbar/Snackbar.util';
import { StyledSnackbarButton } from 'src/components/Snackbar/snackbarStyles';
import { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../index';

export default {
    title: 'Lakefront/Snackbar',
    component: SnackbarComponent,
    argTypes: {
        handleClick: {
            action: 'clicked'
        },
        children: {
            table: {
                disable: true
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<SnackbarProps> = (args) => {
    const [showMsg, setShowMsg] = useState<boolean>(false);

    const showMessage = (value: boolean) => {
        setShowMsg(value);
    };

    const handleClose = () => {
        showMessage(false);
    };
    return (
        <>
            <StyledSnackbarButton onClick={() => showMessage(true)}>
                <p>Click to view snackbar </p>
            </StyledSnackbarButton>

            <SnackbarComponent {...args} open={showMsg} onClose={handleClose} />
        </>
    );
};

export const Snackbar = Template.bind({});

Snackbar.args = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    renderInPortal: false,
    message: 'File transfer initiated.',
    type: MESSAGE_TYPES.SUCCESS
};

export const PortalSnackbar = Template.bind({});

PortalSnackbar.args = {
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    renderInPortal: true,
    message: 'File transfer initiated.',
    type: MESSAGE_TYPES.SUCCESS
};
