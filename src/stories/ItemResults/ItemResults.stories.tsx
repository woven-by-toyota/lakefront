import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';
import ItemResultComponent, { type ItemResultsProps } from 'src/components/ItemResults';
import { emerald } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/ItemResults',
    component: ItemResultComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<ItemResultsProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [dataLengthValue, setDataLength] = useState(args.dataLength);
    const [totalItemsValue, setTotalItems] = useState(args.totalItems);
    const [showBanner, setShowBanner] = useState(false);
    const itemResultRef = useRef(null);

    const handleDataLengthChange = ({ target: { value } }) => {
        setDataLength(value);
    };
    const handleTotalitemsChange = ({ target: { value } }) => {
        setTotalItems(value);
    };
    const clearValues = () => {
        setDataLength('');
        setTotalItems('');
    };
    useEffect(() => {
        if (itemResultRef.current) {
            setShowBanner(true);
        }

        const timer = setTimeout(() => {
            setShowBanner(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [dataLengthValue, totalItemsValue]);
    return (
        <div ref={itemResultRef}>
            <div
                style={{
                    minHeight: 20,
                    backgroundColor: showBanner && emerald,
                    padding: 8,
                    margin: '8px 0',
                    textAlign: 'center'
                }}
            >
                {showBanner && 'This notification is displayed when the Item Result value changes.'}
            </div>
            Enter Data Length :{' '}
            <Input
                value={dataLengthValue}
                onChange={handleDataLengthChange}
            />
            Enter Total Items :
            <Input
                value={totalItemsValue}
                onChange={handleTotalitemsChange}
            />
            <Button onClick={clearValues}>Clear Value</Button>
            <br />
            <br />
            Item Result:
            <br />
            <br />
            <ItemResultComponent
                dataLength={Number(dataLengthValue)}
                totalItems={Number(totalItemsValue)}
            ></ItemResultComponent>
        </div>
    );
};

export const ItemResults = Template.bind({});
ItemResults.args = {
    dataLength: 2,
    totalItems: 5
};
