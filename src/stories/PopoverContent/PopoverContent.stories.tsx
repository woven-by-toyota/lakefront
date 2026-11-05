import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { useMemo, useState } from 'react';
import usePopover, { PopoverContent as PopoverContentComponent, type PortalStyles } from 'src/lib/hooks/usePopover';

export default {
    title: 'Lakefront/PopoverContent',
    component: PopoverContentComponent,
    argTypes: {
        children: {
            table: {
                disable: true
            }
        },
        content: {
            type: 'string'
        },
        renderInPortal: {
            type: 'boolean'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

interface TemplateProps {
    content: string;
    demoDependency: string;
    renderInPortal: boolean;
}

const Template: StoryFn<TemplateProps> = ({ content, renderInPortal }) => {
    const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
    const portalStyles: PortalStyles = useMemo(() => {
        const className = 'select-popover-portal';

        if (popoverContainer) {
            const { left, bottom } = popoverContainer.getBoundingClientRect();

            return {
                className,
                styles: {
                    position: 'absolute',
                    left: `${left}px`,
                    top: `${bottom - 26 + window.scrollY}px`
                }
            };
        }

        return {
            className
        };
    }, [popoverContainer, window.scrollY]);
    const { portal } = usePopover({
        popoverContainer,
        portalId: 'portal-div',
        portalStyles,
        renderInPortal
    });

    const popoverContainerMounted = (node: HTMLDivElement) => {
        setPopoverContainer(node);
    };

    return (
        <div ref={popoverContainerMounted}>
            <PopoverContentComponent
                portal={portal}
                deps={[]}
            >
                <div>{content}</div>
            </PopoverContentComponent>
        </div>
    );
};

export const PopoverContent = Template.bind({});
PopoverContent.args = {
    content: 'content in popover',
    renderInPortal: false
};

export const PopoverContentInPortal = Template.bind({});
PopoverContentInPortal.args = {
    content: 'content in portal',
    renderInPortal: true
};
