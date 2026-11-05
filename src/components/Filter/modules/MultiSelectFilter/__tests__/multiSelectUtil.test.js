import { createOption, createUniqueOptions, getUniqueOptions, parseItems } from '../multiSelectUtil';

describe('createOption', () => {
    it('returns an object with the correct label and value.', () => {
        const label = 'label';

        expect(createOption(label)).toMatchObject({
            label,
            value: label
        });

        expect(createOption()).toMatchObject({
            label: undefined,
            value: undefined
        });
    });
});

describe('createUniqueOptions', () => {
    it('returns an array of unique created options.', () => {
        const one = 'one';
        const two = 'two';
        const createdOptions = createUniqueOptions([one, one, two, two]);

        expect(createdOptions).toMatchObject([
            {
                label: one,
                value: one
            },
            {
                label: two,
                value: two
            }
        ]);

        expect(createdOptions).toHaveLength(2);
    });
});

describe('parseItems', () => {
    const newLineItems = 'a\nb\nc';
    const delimiter = '\n';

    it('returns array of single item if delimiter is falsy', () => {
        expect(parseItems(newLineItems)).toMatchObject([newLineItems]);
    });

    it('returns array of single item if item does not include delimiter', () => {
        const newCommaItems = 'a,b,c';
        expect(parseItems(newCommaItems, delimiter)).toMatchObject([newCommaItems]);
    });

    it('returns list of items parsed by specified delimiter', () => {
        expect(parseItems(newLineItems, delimiter)).toMatchObject(newLineItems.split(delimiter));
    });

    it('removes items from parsed length that are only whitespace', () => {
        const itemsWithEmptyEntries = 'a\nb\n \n   \n\n\nc';

        expect(parseItems(itemsWithEmptyEntries, delimiter)).toMatchObject(['a', 'b', 'c']);
        expect(parseItems(itemsWithEmptyEntries, delimiter)).toHaveLength(3);
    });

    it('trims preceeding and trailing whitespace from delimited items', () => {
        const items = ' spaceInFront,trailingSpace , space around and in between ';

        expect(parseItems(items, ',')).toMatchObject(['spaceInFront', 'trailingSpace', 'space around and in between']);
        expect(parseItems(items, ' ')).toMatchObject([
            'spaceInFront,trailingSpace',
            ',',
            'space',
            'around',
            'and',
            'in',
            'between'
        ]);
    });
});

describe('getUniqueOptions', () => {
    it('returns an array of unique options when duplicated values exist.', () => {
        const itemsStateMock = [
            { label: 'colors', value: 'colors' },
            { label: 'sizes', value: 'sizes' },
            { label: 'shapes', value: 'shapes' },
            { label: 'colors', value: 'colors' },
            { label: 'colors', value: 'colors' }
        ];
        const availableOptionsResult = getUniqueOptions(itemsStateMock);

        expect(availableOptionsResult).toMatchObject([
            { label: 'colors', value: 'colors' },
            { label: 'sizes', value: 'sizes' },
            { label: 'shapes', value: 'shapes' }
        ]);

        expect(availableOptionsResult).toHaveLength(3);
    });
});
