import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import ContextMenu, { type ContextMenuProps, type MenuItem } from 'src/components/ContextMenu/ContextMenu';

export default {
    title: 'Lakefront/ContextMenu',
    component: ContextMenu,
    argTypes: {
        children: {
            control: false,
            table: { disable: true }
        },
        menuItems: {
            control: 'object'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                transform: (source: string) => {
                    return source
                        .replace(/function noRefCheck\(\)\s\{\}/g, '() => {}')
                        .replace(/\n/g, '')
                        .replace(/[ ]{2,}/g, ' ');
                }
            }
        }
    }
} as Meta;

const MENU_ITEMS: MenuItem[] = [
    { key: 'edit-item', label: 'Edit', onClick: () => alert('Edit clicked') },
    { key: 'copy-item', label: 'Copy', onClick: () => alert('Copy clicked') },
    { isSeparator: true },
    { key: 'paste-item', label: 'Paste', onClick: () => alert('Paste clicked'), disabled: true },
    { isSeparator: true },
    { key: 'delete-item', label: 'Delete', onClick: () => alert('Delete clicked') }
];

const Template: StoryFn<ContextMenuProps> = (args) => {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <p>Right-click on the area below to trigger the context menu.</p>
            <ContextMenu {...args}>
                <div
                    style={{
                        width: '10%',
                        border: '2px dashed',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none'
                    }}
                >
                    Right-Click Here
                </div>
            </ContextMenu>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    menuItems: MENU_ITEMS,
    renderInPortal: true
};
