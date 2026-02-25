import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import Loading from '../Loading';
import { displayIcon } from '../loadingUtil';

describe('Loading', () => {
    const renderWovenIcon = 'primary';
    const renderTRIIcon = 'secondary';
    const logo = (props) => <svg {...props} />;

    it('renders with no label by default', () => {
        const { container } = render(<Loading />);
        const noDivs = container.firstChild.querySelectorAll('div');

        expect(noDivs).toHaveLength(0);
    });

    it('renders with label', () => {
        const label = 'Loading...';
        const { container, getByText } = render(<Loading label={label} />);
        const oneDiv = container.firstChild.querySelectorAll('div');

        expect(getByText(label)).toBeInTheDocument();
        expect(oneDiv).toHaveLength(1);
    });

    it('renders with svg prop', () => {
        const logo = () => <svg />;
        const { container } = render(<Loading svg={logo} />);
        const [svg] = container.querySelectorAll('svg');

        expect(svg.getAttributeNames()).toHaveLength(0);
    });

    it('renders default height and width when not provided', () => {
        const { container } = render(<Loading />);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('height', '24');
        expect(svg).toHaveAttribute('width', '24');
    });

    it('renders with svg prop with height and width', () => {
        const { container } = render(<Loading height={10} width={10} svg={logo} />);
        const [svg] = container.querySelectorAll('svg');

        expect(svg.getAttributeNames()).toHaveLength(3);
        expect(svg).toHaveAttribute('height', '10');
        expect(svg).toHaveAttribute('width', '10');
    });

    it('renders the "Woven" icon by default', () => {
        const { container } = render(<Loading />);

        expect(container.querySelector('svg[aria-details="woven-loading-spinner"]')).toBeInTheDocument();
        expect(container.querySelector('svg[aria-label="loading"]')).toBeInTheDocument();
    });

    it('renders the "Woven" icon when iconVariant === primary', () => {
        const { container } = render(<Loading iconVariant={renderWovenIcon} />);

        expect(container.querySelector('svg[aria-details="woven-loading-spinner"]')).toBeInTheDocument();
        expect(container.querySelector('svg[aria-label="loading"]')).toBeInTheDocument();
    });

    it('renders the "Tri" icon when iconVariant === secondary', () => {
        const { container } = render(<Loading iconVariant={renderTRIIcon} />);

        expect(container.querySelector('svg[aria-details="tri-loading-spinner"]')).toBeInTheDocument();
        expect(container.querySelector('svg[aria-label="loading"]')).toBeInTheDocument();
    });

    it('renders the Svg instead of icon variant (secondary) when "svg" is truthy', () => {
        const { container } = render(<Loading svg={logo} iconVariant={renderTRIIcon} />);

        expect(container.querySelector('svg[aria-details]')).not.toBeInTheDocument();
        expect(container.querySelector('svg[aria-label="loading"]')).toBeInTheDocument();
    });

    it('renders the Svg instead of icon variant (primary) when "svg" is truthy', () => {
        const { container } = render(<Loading svg={logo} iconVariant={renderWovenIcon} />);

        expect(container.querySelector('svg[aria-details]')).not.toBeInTheDocument();
        expect(container.querySelector('svg[aria-label="loading"]')).toBeInTheDocument();
    });

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { container } = render(<Loading />);
            const svg = container.querySelector('svg');

            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('aria-label', 'loading');
        });

        it('renders correctly in dark theme', () => {
            const { container } = render(<Loading />, 'dark');
            const svg = container.querySelector('svg');

            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('aria-label', 'loading');
        });

        it('renders with label consistently across themes', () => {
            const lightLabel = 'Loading data light...';
            const darkLabel = 'Loading data dark...';

            const { getByText: lightGetByText, container: lightContainer } = render(
                <Loading label={lightLabel} />
            );

            const { getByText: darkGetByText, container: darkContainer } = render(
                <Loading label={darkLabel} />,
                'dark'
            );

            expect(lightGetByText(lightLabel)).toBeInTheDocument();
            expect(darkGetByText(darkLabel)).toBeInTheDocument();
            expect(lightContainer.firstChild.querySelectorAll('div')).toHaveLength(1);
            expect(darkContainer.firstChild.querySelectorAll('div')).toHaveLength(1);
        });

        it('renders icon variants consistently across themes', () => {
            const { container: lightWoven } = render(<Loading iconVariant="primary" />);
            const { container: darkWoven } = render(<Loading iconVariant="primary" />, 'dark');

            const { container: lightTri } = render(<Loading iconVariant="secondary" />);
            const { container: darkTri } = render(<Loading iconVariant="secondary" />, 'dark');

            // Woven icons
            expect(lightWoven.querySelector('svg[aria-details="woven-loading-spinner"]')).toBeInTheDocument();
            expect(darkWoven.querySelector('svg[aria-details="woven-loading-spinner"]')).toBeInTheDocument();

            // Tri icons
            expect(lightTri.querySelector('svg[aria-details="tri-loading-spinner"]')).toBeInTheDocument();
            expect(darkTri.querySelector('svg[aria-details="tri-loading-spinner"]')).toBeInTheDocument();
        });

        it('renders custom SVG consistently across themes', () => {
            const logo = (props) => <svg data-testid="custom-logo" {...props} />;

            const { container: lightContainer } = render(<Loading svg={logo} />);
            const { container: darkContainer } = render(<Loading svg={logo} />, 'dark');

            expect(lightContainer.querySelector('svg[data-testid="custom-logo"]')).toBeInTheDocument();
            expect(darkContainer.querySelector('svg[data-testid="custom-logo"]')).toBeInTheDocument();
        });

        it('renders with custom dimensions consistently across themes', () => {
            const customHeight = 50;
            const customWidth = 50;

            const { container: lightContainer } = render(
                <Loading height={customHeight} width={customWidth} />
            );

            const { container: darkContainer } = render(
                <Loading height={customHeight} width={customWidth} />,
                'dark'
            );

            const lightSvg = lightContainer.querySelector('svg');
            const darkSvg = darkContainer.querySelector('svg');

            expect(lightSvg).toHaveAttribute('height', customHeight.toString());
            expect(lightSvg).toHaveAttribute('width', customWidth.toString());
            expect(darkSvg).toHaveAttribute('height', customHeight.toString());
            expect(darkSvg).toHaveAttribute('width', customWidth.toString());
        });
    });
});

describe('displayIcon', () => {
    it('takes in a variant and returns an icon as svg', () => {
        const wovenIcon = displayIcon('primary');
        const triIcon = displayIcon('secondary');

        expect(wovenIcon).toBe('svg');
        expect(triIcon).toBe('svg');
    });

    it('returns the default svg if not a variant', () => {
        const nullIcon = displayIcon(null);

        expect(nullIcon).toBe('svg');
    });
});
