import { ComponentPropsWithoutRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';

import ModalComponent, { ModalProps } from 'src/components/Modal/Modal';
import DocBlock from '.storybook/DocBlock';
import Button from 'src/components/Button/Button';

export default {
    title: 'Lakefront/Modal',
    component: ModalComponent,
    argTypes: {
        actionButton: {
            table: {
                disable: true
            }
        },
        additionalText: {
            table: {
                disable: true
            }
        },
        children: {
            table: {
                disable: true
            }
        },
        className: {
            table: {
                disable: true
            }
        },
        isOpen: {
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

const Template: StoryFn<ModalProps & ComponentPropsWithoutRef<'div'> & { additionalText?: string }> = (args) => {
    const [visible, setVisible] = useState(false);

    const updateModalVisibility = () => {
        setVisible((isVisible) => !isVisible);
    };

    return (
        <div style={{ minHeight: 600 }}>
            <Button onClick={updateModalVisibility}>Open {args.headerText}</Button>
            <ModalComponent
                {...args}
                handleClose={updateModalVisibility}
                isOpen={visible}
                actionButton={<Button onClick={updateModalVisibility}>Confirm</Button>}
            >
                <div>
                    <span style={{ fontStyle: 'italic' }}>
                        <p>
                            The Modal component is a UI blocking dialog overlay.
                            <br />
                            You can use this for various purposes like confirmation.
                        </p>
                        {args.additionalText && <p>{args.additionalText}</p>}
                    </span>
                    <p>
                        Confirm that this is the <strong>{args.headerText}</strong> modal?
                    </p>
                </div>
            </ModalComponent>
        </div>
    );
};

export const SimpleModal = Template.bind({});
SimpleModal.args = {
    headerText: 'Small Basic Modal',
    subHeaderText: 'Created with simplicity in mind.',
    isCloseIconVisible: true,
    dialogWidth: 'xs',
    renderInPortal: false,
    additionalText:
        'If you have a really long statement and a smaller dialogWidth is specified, the dialog won\'t be as long. Longer statements or content will wrap.'
};

export const PortalModal = Template.bind({});
PortalModal.args = {
    headerText: 'Medium Portal Modal',
    subHeaderText: 'Rendered via a portal.',
    isCloseIconVisible: true,
    cancelButtonText: 'Close Portal',
    dialogWidth: 'md',
    renderInPortal: true,
    additionalText:
        'If you have a really long statement and a medium sized dialogWidth is specified, the dialog area will adjust. Statements or content that take up a lot of room will adjust as needed.'
};

export const WideDivideModal = Template.bind({});
WideDivideModal.args = {
    headerText: 'Wide Divider Modal',
    subHeaderText: 'Includes wide length and dividers.',
    isCloseIconVisible: true,
    showTopDivider: true,
    showBottomDivider: true,
    dialogWidth: 'xl',
    renderInPortal: false,
    additionalText:
        'If you have a really long statement and a large dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.'
};

export const LongDivideModal = Template.bind({});
LongDivideModal.args = {
    headerText: 'Long Divider Modal',
    subHeaderText: 'Includes long length and dividers.',
    isCloseIconVisible: true,
    showTopDivider: true,
    showBottomDivider: true,
    dialogWidth: 'xs',
    renderInPortal: false,
    additionalText: `If you have a really long statement and a large 
dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.
In order to make this fairly clear, let's repeat this statement again. If you have a really long statement and a large 
dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.
In order to make this fairly clear, let's repeat this statement again. In order to make this fairly clear, let's repeat this statement again. If you have a really long statement and a large 
dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.
In order to make this fairly clear, let's repeat this statement again. In order to make this fairly clear, let's repeat this statement again. If you have a really long statement and a large 
dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.
In order to make this fairly clear, let's repeat this statement again. In order to make this fairly clear, let's repeat this statement again. If you have a really long statement and a large 
dialogWidth is specified, the dialog area will expand quite a bit. This is great for statements or content that take up a lot of room.
In order to make this fairly clear, let's repeat this statement again.`
};
