import { waitFor, cleanup } from '@testing-library/react';
import Table from '../Table';
import { renderWithTheme as render } from '../../../lib/testing';

afterAll(cleanup);

class MockIntersectionObserver {
  private readonly callback: any;
  private options: any;
    constructor(callback: any, options: any) {
        this.callback = callback;
        this.options = options;
    }

    observe(target: any) {
        // Simulate immediate intersection
        setTimeout(() => {
            this.callback([
                {
                    isIntersecting: true,
                    target,
                    boundingClientRect: {},
                    intersectionRatio: 1,
                    intersectionRect: {},
                    rootBounds: null,
                    time: Date.now()
                }
            ], this);
        }, 0);
    }

    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
}

// Setup IntersectionObserver mock
beforeAll(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
});

describe('Table Infinite Scroll', () => {
    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Value',
            accessorKey: 'value',
        }
    ];

    const mockData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 },
        { name: 'Item 3', value: 300 },
    ];

    it('should render table without infinite scroll', () => {
        const { getByText } = render(
            <Table
                columns={columns}
                data={mockData}
            />
        );

        expect(getByText('Item 1')).toBeInTheDocument();
        expect(getByText('Item 2')).toBeInTheDocument();
        expect(getByText('Item 3')).toBeInTheDocument();
    });

    it('should render loading indicator when infinite scroll is loading', () => {
        const onLoadMore = jest.fn();

        const { getByText } = render(
            <Table
                columns={columns}
                data={mockData}
                infiniteScroll={{
                    onLoadMore,
                    isLoading: true,
                    hasMore: true
                }}
            />
        );

        expect(getByText('Loading more...')).toBeInTheDocument();
    });

    it('should call onLoadMore when scrolling to bottom', async () => {
        const onLoadMore = jest.fn();

        render(
            <Table
                columns={columns}
                data={mockData}
                infiniteScroll={{
                    onLoadMore,
                    isLoading: false,
                    hasMore: true,
                    threshold: 100
                }}
            />
        );

        // Wait for IntersectionObserver to trigger
        await waitFor(() => {
            expect(onLoadMore).toHaveBeenCalled();
        }, { timeout: 100 });
    });

    it('should not call onLoadMore when isLoading is true', () => {
        const onLoadMore = jest.fn();

        render(
            <Table
                columns={columns}
                data={mockData}
                infiniteScroll={{
                    onLoadMore,
                    isLoading: true,
                    hasMore: true
                }}
            />
        );

        // onLoadMore should not be called because isLoading is true
        expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('should not render loading indicator when hasMore is false', () => {
        const onLoadMore = jest.fn();

        const { queryByText } = render(
            <Table
                columns={columns}
                data={mockData}
                infiniteScroll={{
                    onLoadMore,
                    isLoading: false,
                    hasMore: false
                }}
            />
        );

        expect(queryByText('Loading more...')).not.toBeInTheDocument();
    });

    it('should render custom loading component', () => {
        const onLoadMore = jest.fn();
        const customLoadingComponent = <div>Custom Loading...</div>;

        const { getByText, queryByText } = render(
            <Table
                columns={columns}
                data={mockData}
                infiniteScroll={{
                    onLoadMore,
                    isLoading: true,
                    hasMore: true,
                    loadingComponent: customLoadingComponent
                }}
            />
        );

        expect(getByText('Custom Loading...')).toBeInTheDocument();
        expect(queryByText('Loading more...')).not.toBeInTheDocument();
    });
});
