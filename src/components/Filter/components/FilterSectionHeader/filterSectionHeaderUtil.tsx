import { FilterLabels, FilterValueChip } from './filterSectionHeaderStyles';
import { FilterModule } from 'src/components/Filter/types';
import { ReactComponent as CloseIcon } from '../../../Modal/assets/closeIcon.svg';

export const DEFAULT_FILTER_COUNT = 1;

export const createChips = (values: string | string[], name: string, onClose?: (name: string, value: any) => void, label?: FilterModule<any>['label'], showX?: boolean, sectionValues?: string | string[]) => {
    const chips = Array.isArray(values) ? values : [values];
    const chipValues = Array.isArray(sectionValues) ? sectionValues : (sectionValues !== undefined ? [sectionValues] : undefined);

    if (!chips?.length) {
        return null;
    }

    return (
        <>
            {chips.map((content: string, idx: number) => {
                if (!content) {
                    return null;
                }

                return <FilterValueChip key={`${content}-${idx}`}>
                    <div>
                        {content}
                    </div>
                    <FilterLabels>{label}</FilterLabels>
                    {showX && onClose && <span onClick={() => onClose(name, chipValues?.[idx] ?? content)}><CloseIcon/></span>}
                </FilterValueChip>;
            })}
        </>
    );
};

export const getFilterCount = (value: any, filter: FilterModule<any>, filterApplied: boolean) => {
    if (filter.getFilterCount) {
        return filter.getFilterCount(value);
    }

    return filterApplied ? DEFAULT_FILTER_COUNT : 0;
};
