import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { useState } from 'react';
import StepFunctionGraph, { type GraphProps } from 'src/components/StepFunctionGraph/Graph';
import { choiceJson, complexJson, longJson, mapInMap, simpleJson } from './stepFunctionGraphData';

export default {
    title: 'Lakefront/StepFunctionGraph',
    component: StepFunctionGraph,
    argTypes: {
        handleSelectedNode: {
            action: 'handleSelectedNode'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<GraphProps> = (args) => {
    const [highlighted, setHighlighted] = useState<string | null>(null);

    const handleSelectedNode = (node: any) => {
        if (node) {
            const [key] = Object.keys(node);
            setHighlighted(key);
        } else {
            setHighlighted(null);
        }

        args.handleSelectedNode(node);
    };
    return (
        <div style={{ height: 700, width: '100%', maxWidth: 1000 }}>
            <StepFunctionGraph
                highlightedKey={highlighted}
                json={args.json}
                handleSelectedNode={handleSelectedNode}
            />
        </div>
    );
};

export const SimpleGraph = Template.bind({});

SimpleGraph.args = {
    json: simpleJson,
    highlightedKey: null
};

export const ComplexGraph = Template.bind({});

ComplexGraph.args = {
    json: complexJson,
    highlightedKey: null
};

export const ChoiceGraph = Template.bind({});

ChoiceGraph.args = {
    json: choiceJson,
    highlightedKey: null
};

export const LongGraph = Template.bind({});

LongGraph.args = {
    json: longJson,
    highlightedKey: null
};

export const MapGraph = Template.bind({});

MapGraph.args = {
    json: mapInMap,
    highlightedKey: null
};
