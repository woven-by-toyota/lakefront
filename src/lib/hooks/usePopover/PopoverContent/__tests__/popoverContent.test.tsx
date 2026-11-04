import { FC, useState } from 'react';
import { render, within } from '@testing-library/react';
import PopoverContent from '../PopoverContent';
import usePopover from 'src/lib/hooks/usePopover';
import * as usePopoverUtil from 'src/lib/hooks/usePopover/usePopoverUtil';

beforeAll(() => {
    jest.spyOn(usePopoverUtil, 'createObserver').mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        root: null,
        rootMargin: '0px 0px 0px 0px',
        scrollMargin: '0px 0px 0px 0px',
        thresholds: [],
        disconnect: () => null,
        takeRecords: () => [],
    }));
});

interface TestComponentProps {
    renderInPortal: boolean;
    content: string;
    deps: any[];
}

const PROPS: TestComponentProps = {
    renderInPortal: true,
    content: 'content',
    deps: []
};

const TestComponent: FC<TestComponentProps> = ({ renderInPortal, content, deps }) => {
    const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
    const { portal } = usePopover({
        popoverContainer,
        portalId: 'portal-div',
        renderInPortal
    });

    const popoverContainerMounted = (node: HTMLDivElement) => {
        setPopoverContainer(node);
    };

    return (
        <div id='popover-container' ref={popoverContainerMounted}>
            <PopoverContent portal={portal} deps={deps}>
                <div>{content}</div>
            </PopoverContent>
        </div>
    );
};

describe('PopoverContent', () => {
    describe('container behavior', () => {
        it('displays content in portal if portal is available', () => {
            const { baseElement } = render(
                <TestComponent {...PROPS} />
            );

            const portalDiv = baseElement.querySelector('#portal-div') as HTMLDivElement;
            const popoverContainerDiv = baseElement.querySelector('#popover-container') as HTMLDivElement;

            expect(portalDiv).toBeInTheDocument();
            expect(popoverContainerDiv).toBeInTheDocument();
            expect(within(portalDiv).queryByText('content')).toBeInTheDocument();
            expect(within(popoverContainerDiv).queryByText('content')).not.toBeInTheDocument();
        });

        it('displays content in closest parent (popover container) if portal is unavailable', () => {
            const { baseElement } = render(
                <TestComponent {...PROPS} renderInPortal={false} />
            );

            const portalDiv = baseElement.querySelector('#portal-div') as HTMLDivElement;
            const popoverContainerDiv = baseElement.querySelector('#popover-container') as HTMLDivElement;

            expect(portalDiv).not.toBeInTheDocument();
            expect(popoverContainerDiv).toBeInTheDocument();
            expect(within(popoverContainerDiv).queryByText('content')).toBeInTheDocument();
        });
    });

   describe('content memoization', () => {
       it('memoizes provided content', () => {
           const { queryByText, rerender } = render(
               <TestComponent {...PROPS} />
           );

           expect(queryByText('content')).toBeInTheDocument();

           rerender(
               <TestComponent {...PROPS} content='new content' />
           );

           expect(queryByText('content')).toBeInTheDocument();
       });

       it('updates memoized content when deps are updated', () => {
           const { queryByText, rerender } = render(
               <TestComponent {...PROPS} deps={['a']} />
           );

           expect(queryByText('content')).toBeInTheDocument();

           rerender(
               <TestComponent {...PROPS} content='new content' deps={['b']} />
           );

           expect(queryByText('new content')).toBeInTheDocument();
       });
   });
});
