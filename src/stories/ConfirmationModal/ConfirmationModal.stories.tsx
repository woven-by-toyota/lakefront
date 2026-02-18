import { ComponentPropsWithoutRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';

import ConfirmationModalComponent, { ConfirmationModalProps } from 'src/components/Modal/ConfirmationModal';
import DocBlock from '.storybook/DocBlock';
import Button from 'src/components/Button/Button';

export default {
    title: 'Lakefront/Modal/ConfirmationModal',
    component: ConfirmationModalComponent,
    argTypes: {
        actionButton: {
            table: {
                disable: true
            }
        },
        buttonLabel: {
            table: {
                disable: true
            }
        },
        className: {
            table: {
                disable: true
            }
        },
        modalVisible: {
            table: {
                disable: true
            }
        },
        onNo: {
            table: {
                disable: true
            }
        },
        onYes: {
            table: {
                disable: true
            }
        },
        renderInPortal: {
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

const Template: StoryFn<ConfirmationModalProps & ComponentPropsWithoutRef<'div'> & { buttonLabel: string }> = (args) => {
    const [visible, setVisible] = useState(false);

    const updateConfirmationModalVisibility = () => {
        setVisible((isVisible) => !isVisible);
    };

    return (
        <div style={{ minHeight: 400 }}>
            <Button onClick={updateConfirmationModalVisibility}>Open {args.buttonLabel}</Button>
            <ConfirmationModalComponent
                {...args}
                modalVisible={visible}
                onYes={updateConfirmationModalVisibility}
                onNo={updateConfirmationModalVisibility}
            />
        </div>
    );
};

export const BasicConfirm = Template.bind({});
BasicConfirm.args = {
    buttonLabel: 'Basic Confirm',
    title: 'Are you sure you want to close this modal?',
    message: '"Yes" or "No" will close this modal.'
};

export const CustomizedConfirm = Template.bind({});
CustomizedConfirm.args = {
    buttonLabel: 'Customized Confirm',
    title: 'Are you sure you want to close this modal?',
    message: (
        <div>
            <strong>Accept</strong> or <strong>Decline</strong> will close this modal.
        </div>
    ),
    yes: 'Accept',
    no: "Decline"
};

export const PortalConfirm = Template.bind({});
PortalConfirm.args = {
    buttonLabel: 'Portal Confirm',
    title: 'Was this rendered in a portal?',
    message: '"Yes" or "No" will close this modal.',
    renderInPortal: true
};
