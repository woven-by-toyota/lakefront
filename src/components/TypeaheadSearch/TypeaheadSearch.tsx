import {
    ChangeEvent,
    ComponentPropsWithoutRef,
    FC,
    FormEvent,
    ReactNode,
    createRef,
    useEffect,
    useMemo,
    useState
} from 'react';
import { ReactComponent as SearchIcon } from './assets/search.svg';
import useDebounce from 'src/lib/hooks/useDebounce';
import Input from 'src/components/Input/Input';
import { SearchResultsPopover, TypeaheadSearchContainer } from './typeaheadSearchStyles';
import TypeaheadResults, { TypeaheadResultItem } from './TypeaheadResults';
import usePopover, { PortalStyles, PopoverContent } from 'src/lib/hooks/usePopover';

export interface TypeaheadSearchResultProps {
    searchText: string;
    onResultSelect: (result: TypeaheadResultItem) => void;
    fetchResults?: (searchText: string) => Promise<TypeaheadResultItem[]>;
}

export interface TypeaheadSearchProps {
    /**
     * Whether the search input should be focused on initialization.
     */
    autoFocus?: boolean;
    /**
     * The minimum amount of characters a user must enter before a (non-submit triggered)
     * search will be initiated. `Default = 1`.
     */
    characterMinimum?: number;
    /**
     * The callback to render search text and/or asynchronous search results.
     */
    children?: (typeaheadSearchResultProps: TypeaheadSearchResultProps) => ReactNode;
    /**
     * The request to retrieve and format results using the search text. This is useful
     * if the user does not want to supply their own callback render function as children.
     */
    fetchResults?: (searchText: string) => Promise<TypeaheadResultItem[]>;
    /**
     * The initial value of the search text input.
     */
    initialSearchText?: string;
    /**
     * The time (in `ms`) to delay between keystrokes before updating the search value. `Default = 250ms`.
     */
    inputDebounceMs?: number;
    /**
     * The action to run on a selected result.
     */
    onResultSelect?: (result: TypeaheadResultItem) => void;
    /**
     * The placeholder text to display when the input is empty.
     */
    placeholder?: string;
    /**
     * Where the search results popover should render in relation to the search input.
     */
    placement?: 'bottom-start' | 'bottom-end';
    /**
     * This is the id to assign to the appended div when rendering in a portal.
     * This defaults to `lakefront-portal-container`.
     */
    portalId?: string;
    /**
     * When true, the component will mount a div to the body and render the search results through it.
     * This is useful when the popover would be inside a scrollable container or one with "overflow: hidden"
     * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed.
     */
    renderInPortal?: boolean;
    /**
     * The action to run using the entered search text on submit.
     */
    submitSearch: (searchText: string) => void;
    /**
     * The classes to pass to the typeahead search container.
     */
    className?: string;
}

/**
 * TypeaheadSearch Component
 *
 * The TypeaheadSearch component is a predictive search style input and especially useful
 * when the result list needs to be fetched asynchronously. The component can be used as
 * a stand-alone element (with no children) by providing a `fetchResults` function:
 *
 * ```jsx
 * <TypeaheadSearch
 *   autoFocus
 *   fetchResults={fetchResults}
 *   inputDebounceMs={250}
 *   onResultSelect={onResultSelect}
 *   placeholder="Search"
 *   placement="bottom-start"
 *   submitSearch={submitSearch}
 * />
 * ```
 *
 * If the default functionality needs to be extended to provide custom result rendering or
 * to control when the result popover should close, the user can provide a render callback
 * as follows:
 *
 * ```jsx
 * <TypeaheadSearch {...typeaheadSearchProps}>
 *    {(typeaheadSearchResultProps: TypeaheadSearchResultProps) => (
 *        <TypeaheadCustom {...options} />
 *    )}
 * </TypeaheadSearch>
 * ```
 *
 * ❗ **Note: In order to use the built-in handler to close the popover when selecting a**
 * **result from the list, you'll need to spread in the props (as shown above).**
 */
const TypeaheadSearch: FC<TypeaheadSearchProps & ComponentPropsWithoutRef<'input'>> = ({
    autoFocus,
    characterMinimum = 1,
    children,
    fetchResults,
    initialSearchText,
    inputDebounceMs = 250,
    onResultSelect,
    placeholder,
    placement = 'bottom-end',
    portalId,
    renderInPortal = false,
    submitSearch,
    className,
    ...restInputProps
}) => {
    const searchInputContainerRef = createRef<HTMLDivElement>();
    const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(null);
    const portalStyles: PortalStyles = useMemo(() => {
        className = 'type-ahead-search-portal';

        if (popoverElement) {
            const { left, bottom } = popoverElement.getBoundingClientRect();

            return {
                className,
                styles: {
                    position: 'absolute',
                    [placement === 'bottom-start' ? 'left' : 'right']: `${left}px`,
                    top: `${bottom + window.scrollY}px`
                }
            };
        }

        return {
            className
        };
    }, [placement, popoverElement, window.scrollY]);
    const { portal } = usePopover({
        popoverContainer: popoverElement,
        portalStyles,
        portalId,
        renderInPortal
    });

    const [searchTextChanged, setSearchTextChanged] = useState(false);
    const [searchText, setSearchText] = useState('');
    const limitedText = characterMinimum <= searchText.length ? searchText : '';
    const debouncedSearchText = useDebounce(limitedText, inputDebounceMs);

    const [resultsAnchorEl, setResultsAnchorEl] = useState<HTMLDivElement | null>(null);
    const resultsOpen = Boolean(resultsAnchorEl);

    // Use internal state if user has changed it (entered input), or if no external state provided.
    // Use external state when user has NOT changed internal state, if provided (even if empty string).
    // This lets the value get set externally (e.g. by a duplicate filter), but still allows typeahead.
    const inputValue = searchTextChanged || initialSearchText === undefined ? searchText : initialSearchText;

    const showResultsPopover = () => {
        setResultsAnchorEl(searchInputContainerRef.current);
    };

    const closeResultsPopover = () => {
        setResultsAnchorEl(null);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        submitSearch(searchText);

        // Prevent additional debounces from re-opening results popover after explicitly closing it.
        // This allows the popover to close on submit when doing something other than navigating on submit.
        setSearchTextChanged(false);
        closeResultsPopover();
    };

    const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setSearchTextChanged(true);
        setSearchText(value);
    };

    const handleResultSelect = (result: TypeaheadResultItem) => {
        setSearchText(result.value);
        setSearchTextChanged(false);
        closeResultsPopover();

        if (onResultSelect) {
            onResultSelect(result);
        }
    };

    useEffect(() => {
        if (debouncedSearchText && searchTextChanged) {
            showResultsPopover();
        } else {
            closeResultsPopover();
        }
    }, [debouncedSearchText]);

    useEffect(() => {
        // reset internal state when external text changes
        setSearchTextChanged(false);
    }, [initialSearchText]);

    const popoverNodeMounted = (node: HTMLDivElement) => {
        setPopoverElement(node);
    };

    return (
        <TypeaheadSearchContainer
            ref={searchInputContainerRef}
            placement={placement}
            resultOpen={resultsOpen}
            className={className}
        >
            <form onSubmit={handleSearchSubmit}>
                <div className="inputWrapper" ref={popoverNodeMounted}>
                    <Input
                        {...restInputProps}
                        type="text"
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={inputValue}
                        autoFocus={autoFocus}
                        className="typeaheadInput"
                    />
                    <PopoverContent
                        portal={portal}
                        deps={[children, resultsOpen, debouncedSearchText, popoverElement, placement]}
                    >
                        {resultsOpen && (
                            <SearchResultsPopover className='searchResultsPopover' placement={placement}>
                                {debouncedSearchText && children && children({
                                    searchText: debouncedSearchText,
                                    fetchResults,
                                    onResultSelect: handleResultSelect
                                })}
                                {debouncedSearchText && !children && (<TypeaheadResults
                                        debouncedText={debouncedSearchText}
                                        fetchResults={fetchResults}
                                        onResultSelect={handleResultSelect}
                                    />)}
                            </SearchResultsPopover>)}
                    </PopoverContent>
                </div>
            </form>
            <SearchIcon className="typeaheadSearchIcon" />
            {resultsOpen && <div className="searchResultsPopoverBackground" onClick={closeResultsPopover} />}
        </TypeaheadSearchContainer>
    );
};

export default TypeaheadSearch;
