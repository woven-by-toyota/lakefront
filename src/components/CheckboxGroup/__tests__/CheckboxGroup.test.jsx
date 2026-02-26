
import React from 'react';
import CheckboxGroup from '../CheckboxGroup';
import { renderWithTheme as render } from 'src/lib/testing';

const JOB_TYPES = [
    { label: 'Finished', value: 'finished' },
    { label: 'Cancelled', value: 'canceled' },
    { label: 'Failed', value: 'failed' },
    { label: 'Running', value: 'running' },
    { label: 'Pending', value: 'enqueued' }
];

describe('CheckboxGroup', () => {
    it('renders the options', () => {
        const onChangeCallback = jest.fn();
        const container = render(
            <CheckboxGroup
                name="type"
                options={JOB_TYPES}
                selected={new Set([])}
                onHandleChange={onChangeCallback}
            />
        );

        const checkBoxes = container.queryAllByRole('checkbox');
        // 5 is for all checkboxes
        expect(checkBoxes).toHaveLength(5);

        // check value for each checkbox
        expect(checkBoxes[0]).toHaveAttribute('value', 'finished');
        expect(checkBoxes[1]).toHaveAttribute('value', 'canceled');
        expect(checkBoxes[2]).toHaveAttribute('value', 'failed');
        expect(checkBoxes[3]).toHaveAttribute('value', 'running');
        expect(checkBoxes[4]).toHaveAttribute('value', 'enqueued');

        // check first option
        checkBoxes[0].click();
        expect(onChangeCallback.mock.calls.length).toBe(1);
        const newSelection = onChangeCallback.mock.calls[0][0];
        expect(newSelection.size).toBe(1);
        expect(newSelection.has('finished')).toBe(true);
    });

    it('check toggling of items', () => {
        // start filter will all types selected
        const types = new Set(JOB_TYPES.map(item => item.value));
        const onChangeCallback = jest.fn();
        const container = render(
            <CheckboxGroup
                name="type"
                options={JOB_TYPES}
                selected={types}
                onHandleChange={onChangeCallback}
            />
        );

        const checkBoxes = container.queryAllByRole('checkbox');
        // expect all checkboxes checked
        checkBoxes.forEach(checkbox => {
            expect(checkbox.hasAttribute('checked'));
        });

        // test toggling one option
        checkBoxes[2].click();
        expect(onChangeCallback.mock.calls.length).toBe(1);
        const newSelection = onChangeCallback.mock.calls[0][0];
        expect(newSelection.size).toBe(4);
        expect(newSelection.has('failed')).toBe(false);
    });

    it('renders all as an option', () => {
        const onChangeCallback = jest.fn();
        const container = render(
            <CheckboxGroup
                name="type"
                allLabel="All"
                options={JOB_TYPES}
                selected={new Set([])}
                onHandleChange={onChangeCallback}
            />
        );

        const checkBoxes = container.queryAllByRole('checkbox');
        // 6 for all option and other 5 checkboxes
        expect(checkBoxes).toHaveLength(6);

        // check value for all checkbox
        expect(checkBoxes[0]).toHaveAttribute('value', 'all');

        // click All option will select all the options available
        checkBoxes[0].click();
        expect(onChangeCallback.mock.calls.length).toBe(1);
        const newSelection = onChangeCallback.mock.calls[0][0];
        expect(newSelection.size).toBe(5);
        // expect all checkboxes to be checked
        checkBoxes.forEach(checkbox => {
            expect(checkbox.hasAttribute('checked'));
        });

        // uncheck all option
        checkBoxes[0].click();
        // expect all checkboxes to be unchecked
        checkBoxes.forEach(checkbox => {
            expect(checkbox.hasAttribute('checked')).toBe(false);
        });
    });

    it('sets default selection on initial render', () => {
        const onChangeCallback = jest.fn();
        const container = render(
            <CheckboxGroup
                name="type"
                options={JOB_TYPES}
                selected={new Set(['finished', 'canceled'])}
                onHandleChange={onChangeCallback}
            />
        );

        const checkBoxes = container.queryAllByRole('checkbox');
        // 5 is for all checkboxes
        expect(checkBoxes).toHaveLength(5);

        // check value for each checkbox that are checked
        expect(checkBoxes[0].hasAttribute('checked'));
        expect(checkBoxes[1].hasAttribute('checked'));

        // check value for each checkbox that are unchecked
        expect(checkBoxes[2].hasAttribute('checked')).toBe(false);
        expect(checkBoxes[3].hasAttribute('checked')).toBe(false);
        expect(checkBoxes[4].hasAttribute('checked')).toBe(false);
    });

});
