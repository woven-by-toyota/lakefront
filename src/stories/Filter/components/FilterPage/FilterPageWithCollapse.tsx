import type { FC } from 'react';
import CollapsibleComponent from 'src/components/Collapsible/Collapsible';
import Filter from 'src/components/Filter/Filter';
import type { FilterComponentProps, FilterSet } from 'src/components/Filter/types';
import { useFilter } from 'src/components/Filter/util';
import { ContextSwitchMenu, FilterBar, FilterJSONConfirmationModal, FilterJSONInput, UrlPreview } from '..';
import { PageBodyWithCollapseSection, PageWrapper } from './filterPageStyles';
import { FILTERS, LOCATION } from './filterPageUtil';

interface FilterPageProps {
    pageFilters?: FilterSet;
}

const FilterPageWithCollapse: FC<
    Pick<FilterComponentProps, 'isJSONInputAllowed' | 'hideFilterBar' | 'initialActiveSection'> & FilterPageProps
> = (props) => {
    const { pageFilters = FILTERS } = props;
    const location = { ...LOCATION };
    const updateHistory = () => null;
    const filterHooks = useFilter(pageFilters, props.isJSONInputAllowed, location, updateHistory);
    const subtitle = (
        <div>
            Additional Info | <strong>100</strong> Count | Updated <strong>Today</strong>
        </div>
    );
    return (
        <PageWrapper>
            <Filter
                {...props}
                ContextSwitchMenu={ContextSwitchMenu}
                FilterBar={FilterBar}
                FilterJSONConfirmationModal={FilterJSONConfirmationModal}
                FilterJSONInput={FilterJSONInput}
                filterHooks={filterHooks}
                location={location}
                updateHistory={updateHistory}
            >
                <PageBodyWithCollapseSection>
                    <UrlPreview queryParams={filterHooks.filterUrl.substring(1)} />
                    <div>Modify filters in the left pane.</div>
                    <CollapsibleComponent
                        expanded={false}
                        title='Collapsible Component 1'
                        subtitle={subtitle}
                    >
                        <div>
                            <p>You can have any content here.</p>
                            <p>It could be text, images, graphs, etc.</p>
                            <p>You could also just leave it blank.</p>
                        </div>
                    </CollapsibleComponent>
                    <CollapsibleComponent
                        expanded={false}
                        title='Collapsible Component 2'
                        subtitle={subtitle}
                    >
                        <div>
                            <p>You can have any content here.</p>
                            <p>It could be text, images, graphs, etc.</p>
                            <p>You could also just leave it blank.</p>
                        </div>
                    </CollapsibleComponent>
                    <CollapsibleComponent
                        expanded={false}
                        title='Collapsible Component 3'
                        subtitle={subtitle}
                    >
                        <div>
                            <p>You can have any content here.</p>
                            <p>It could be text, images, graphs, etc.</p>
                            <p>You could also just leave it blank.</p>
                        </div>
                    </CollapsibleComponent>
                </PageBodyWithCollapseSection>
            </Filter>
        </PageWrapper>
    );
};

export default FilterPageWithCollapse;
