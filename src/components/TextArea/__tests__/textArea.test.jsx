import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import TextArea from '../TextArea';

const LABEL = 'Label';
const ERROR = 'Error';

describe('TextArea', () => {
    describe('general rendering', () => {
        it('renders the label and its text', () => {
            const { container } = render(
                <TextArea label={LABEL} />
            );

            const [label] = container.querySelectorAll('label');

            expect(label).toHaveTextContent(LABEL);
        });

        it('should not render the label when no label prop present', () => {
            const { container } = render(
                <TextArea />
            );

            const spans = container.querySelectorAll('span');

            expect(spans.length).toBe(0);
        });

        it('should render the error message when error message present', () => {
            const { getByText } = render(
                <TextArea error={ERROR} />
            );

            const error = getByText('Error');

            expect(error).toHaveTextContent(ERROR);
        });
    });
});
