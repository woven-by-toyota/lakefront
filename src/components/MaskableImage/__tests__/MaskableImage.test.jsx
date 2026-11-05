import { cleanup, fireEvent, render } from '@testing-library/react';
import MaskableImage from '../MaskableImage';

afterAll(cleanup);

describe('<MaskableImage />', () => {
    it('renders properly', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                dimensions={{ height: '1px', width: '2px' }}
            />
        );

        const [svg] = container.querySelectorAll('svg');
        const highlightedDiv = container.querySelectorAll('.highlighted');

        expect(highlightedDiv).toHaveLength(0);

        expect(svg).toHaveStyle('display:none');

        expect(container).toMatchSnapshot();
    });

    it('renders properly without dimensions passed as a prop', () => {
        const { container } = render(<MaskableImage url='test.com' />);

        expect(container).toMatchSnapshot();
    });

    it('renders the checkmark when hovered', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={true}
            />
        );

        const [svg] = container.querySelectorAll('svg');

        fireEvent.mouseEnter(container.firstChild);

        expect(svg).toHaveStyle('border-radius: 50%');
        expect(svg).not.toHaveStyle('border: 1px solid');
        expect(svg).not.toHaveStyle('display:none');

        expect(container).toMatchSnapshot();
    });

    it('renders the filled in checkmark when selected', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={true}
            />
        );

        const [svg] = container.querySelectorAll('svg');

        fireEvent.click(container.querySelectorAll('svg')[0]);

        expect(svg).toHaveStyle('border-radius: 50%');
        expect(svg).toHaveStyle('border: 1px solid');
        expect(svg).not.toHaveStyle('display:none');

        expect(container).toMatchSnapshot();
    });

    it('should not allow selecting when selectable is false', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={false}
            />
        );

        const [svg] = container.querySelectorAll('svg');

        fireEvent.click(container.querySelectorAll('svg')[0]);

        expect(svg).not.toHaveStyle('border-radius: 50%');
        expect(svg).not.toHaveStyle('border: 1px solid');
        expect(svg).toHaveStyle('display:none');

        expect(container).toMatchSnapshot();
    });

    it('should show highlighted overlay when highlighted prop is true', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={false}
                highlighted={true}
            />
        );

        const highlightedDiv = container.querySelectorAll('div')[1];

        expect(highlightedDiv).toHaveStyle('background-color: rgba(55,143,238,0.5);');

        expect(container).toMatchSnapshot();
    });

    it('should loading spinner when showSpinnerOnLoad is true', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={false}
                showSpinnerOnLoad={true}
                showSpinner={true}
            />
        );

        const loading = container.querySelectorAll('img')[0];

        expect(loading).toHaveStyle('width: 100%');

        expect(container).toMatchSnapshot();
    });

    it('should be slected when individual selection is set to true', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={true}
                individuallySelected={true}
            />
        );

        const [svg] = container.querySelectorAll('svg');

        fireEvent.click(container.querySelectorAll('svg')[0]);

        expect(svg).toHaveStyle('border-radius: 50%');
        expect(svg).toHaveStyle('border: 1px solid');
        expect(svg).not.toHaveStyle('display:none');
    });

    it('should show/hide select icon on mouse enter/mouse leave', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                selectable={true}
            />
        );

        fireEvent.mouseEnter(container.firstChild);

        const [svg] = container.querySelectorAll('svg');

        expect(svg).not.toHaveStyle('display:none');

        fireEvent.mouseLeave(container.firstChild);
        expect(svg).toHaveStyle('display:none');
    });

    it('should show loading on load', () => {
        const { container } = render(
            <MaskableImage
                url='test.com'
                showSpinnerOnLoad={true}
            />
        );

        fireEvent.loadStart(container.firstChild);

        const loading = container.querySelectorAll('img')[0];

        expect(loading).toHaveStyle('width: 100%');
    });
});
