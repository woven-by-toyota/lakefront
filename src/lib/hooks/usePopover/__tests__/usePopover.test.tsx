import { act, render, renderHook } from '@testing-library/react';
import { useState } from 'react';
import usePopover from '..';
import type { UsePopoverProps } from '../usePopover';
import * as usePopoverUtil from '../usePopoverUtil';

const TestComponent = (props: Omit<UsePopoverProps, 'popoverContainer'>) => {
    const [popoverContainer, setPopoverContainer] = useState<HTMLElement | null>(null);
    usePopover({ ...props, popoverContainer });

    const popoverContainerMounted = (node: HTMLDivElement) => {
        setPopoverContainer(node);
    };

    return (
        <div
            id='original-content'
            ref={popoverContainerMounted}
        ></div>
    );
};

let createObserverSpy: jest.SpyInstance;
let mockIntersectionObserver: IntersectionObserver;
let intersectionChange = jest.fn();

beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('04 Jan 2023 00:12:00 GMT').getTime());
});

beforeEach(() => {
    jest.clearAllMocks();

    mockIntersectionObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        root: null,
        rootMargin: '0px 0px 0px 0px',
        scrollMargin: '0px 0px 0px 0px',
        thresholds: [],
        disconnect: () => null,
        takeRecords: () => []
    };
    createObserverSpy = jest.spyOn(usePopoverUtil, 'createObserver').mockImplementation((callBack) => {
        intersectionChange = jest.fn(callBack);
        return mockIntersectionObserver;
    });
});

afterAll(() => {
    jest.useRealTimers();
});

const simulateIntersection = () => {
    act(() => {
        intersectionChange();
    });
};

describe('usePopover', () => {
    it('is a function', () => {
        expect(typeof usePopover).toBe('function');
    });

    describe('when renderInPortal is true', () => {
        it('appends portal div if one does not already exist', () => {
            const { baseElement } = render(<TestComponent renderInPortal />);

            expect(baseElement.children).toHaveLength(2);
            expect(baseElement.querySelector('#lakefront-portal-container')).toBeInTheDocument();
        });

        it('assigns a portal id when provided', () => {
            const { baseElement } = render(
                <TestComponent
                    renderInPortal
                    portalId='my-custom-id'
                />
            );

            expect(baseElement.querySelector('#my-custom-id')).toBeInTheDocument();
        });

        it('assigns a portal id when provided', () => {
            const { baseElement } = render(
                <TestComponent
                    renderInPortal
                    portalId='my-custom-id'
                />
            );

            expect(baseElement.querySelector('#my-custom-id')).toBeInTheDocument();
        });

        describe('portal assignment', () => {
            it('does not observe, set portal, or set update callback when portal already exists with truthy popoverContainer', () => {
                const { result } = renderHook(() =>
                    usePopover({
                        renderInPortal: true,
                        popoverContainer: null
                    })
                );

                expect(mockIntersectionObserver.observe).not.toHaveBeenCalled();
                expect(result.current.portal).toBeNull();

                simulateIntersection();
                expect(result.current.update).toBe(0);
            });

            it('observes, sets portal, and sets update callback when portal does not exist with truthy popoverContainer', () => {
                const { container } = render(<div />);
                const { result } = renderHook(() =>
                    usePopover({
                        renderInPortal: true,
                        popoverContainer: container
                    })
                );

                expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(container);
                expect(result.current.portal).not.toBeNull();

                simulateIntersection();
                expect(result.current.update).toBe(1672791120000);
            });

            it('stops observing and removes appended div on unmount', () => {
                const { baseElement, unmount } = render(<TestComponent renderInPortal />);

                expect(baseElement.children).toHaveLength(2);
                expect(baseElement.querySelector('#lakefront-portal-container')).toBeInTheDocument();
                expect(mockIntersectionObserver.unobserve).not.toHaveBeenCalled();

                unmount();

                expect(mockIntersectionObserver.unobserve).toHaveBeenCalled();
                expect(baseElement.querySelector('#lakefront-portal-container')).not.toBeInTheDocument();
            });
        });

        describe('portal styling', () => {
            it('does not apply provided portal styles after update when popoverContainer is null', () => {
                const { result } = renderHook(() =>
                    usePopover({
                        renderInPortal: true,
                        popoverContainer: null,
                        portalStyles: {
                            className: 'custom-portal',
                            styles: {
                                display: 'flex',
                                width: '100%'
                            }
                        }
                    })
                );

                const portal = result.current.portal as HTMLElement;

                expect(portal).toBeNull();
            });

            it('applies provided portal styles after update when popoverContainer and portal are available', () => {
                const { container } = render(<div />);

                const { result } = renderHook(() =>
                    usePopover({
                        renderInPortal: true,
                        popoverContainer: container,
                        portalStyles: {
                            className: 'custom-portal',
                            styles: {
                                display: 'flex',
                                width: '100%'
                            }
                        }
                    })
                );

                const portal = result.current.portal as HTMLElement;

                expect(portal.className).toBe('');
                expect(portal.style.display).toBe('');
                expect(portal.style.width).toBe('');

                // trigger update
                simulateIntersection();

                expect(portal.className).toBe('custom-portal');
                expect(portal.style.display).toBe('flex');
                expect(portal.style.width).toBe('100%');
            });
        });
    });
});
