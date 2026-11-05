
import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import ItemGridComponent, { type ItemGridProps } from 'src/components/ItemGrid';
import DocBlock from '.storybook/DocBlock';

export default {
    title: 'Lakefront/ItemGrid',
    component: ItemGridComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<ItemGridProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const showColumns = columns => {
        const content = [];
        for (let i = 0; i < columns; i++) {
            content.push(<div key={i}>Column {i + 1}</div>);
        }
        return content;
    };
    return (
        <ItemGridComponent
            maxColumns={args.maxColumns}
            gridGap={args.gridGap}
            columnWidthMin={args.columnWidthMin}
            shouldRecalculateSize={args.shouldRecalculateSize}
            innerWidth={args.innerWidth}>
            {showColumns(args.maxColumns)}
        </ItemGridComponent>
    );
};

export const ItemGrid = Template.bind({});
ItemGrid.args = {
    shouldRecalculateSize: false,
    maxColumns: 5,
    gridGap: { rowGap: 17, columnGap: 12 },
    columnWidthMin: '100px'
};
