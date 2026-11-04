import * as R from 'ramda';

const { assocPath, cond, identity, last, omit, path: RPath, T: RT } = R;

export type NodeType = 'Task' | 'Success' | 'Choice' | 'Map' | 'Parallel' | 'Catch' | string;

export interface CatchJSON {
    ErrorEquals: string[];
    Next: string;
}

export interface JSONStateObject {
    Type?: NodeType;
    Next?: string;
    End?: boolean;
    Catch?: CatchJSON[];
    Branches?: StepFunctionJSON[];
    Choices?: JSONStateObject[];
    Iterator?: StepFunctionJSON;
    Metadata?: {
        SortOrder?: number;
        NodePath?: string;
    }
}

export interface JSONState {
    [key: string]: JSONStateObject;
}

export interface StepFunctionJSON {
    StartAt: string;
    States: JSONState;
}

export interface AddOrderedNodeOptions {
    siblingPath: string;
    after?: boolean;
}

/**
 * Attempts to convert a value to a number. If that is not possible,
 * the original value will be returned.
 */
export const numberOrIdentity = cond([
    [(a: any) => Number(a) === 0 || Boolean(Number(a)), Number],
    [RT, identity]
]);

/**
 * Converts a string with dot notation to an array.
 * If the provided `path` is already an array, the original
 * value will be returned.
 */
export const convertToArrayPath = (path: string | (string | number)[]) => {
    if (!path) {
        return [];
    }

    return Array.isArray(path) ? path : path.split('.');
};

/**
 * The JSONBuilderUtil class consist of various methods and standalone helper
 * functions to build valid StepFunction JSON. Initial step function configuration
 * can be provided to the constructor.
 * 
 *❗❗**NOTE: This class will mutate the provided initial JSON.**
 */
export class JSONBuilderUtil {
    json: StepFunctionJSON = { StartAt: '', States: {} };

    constructor(json?: StepFunctionJSON) {
        if (json) {
            this.json = json;
        }
    }

    static getChoiceForAdd(next: string): JSONStateObject {
        return {
            Next: next
        };
    }

    addTask(state: string, next?: string, end?: boolean): JSONBuilderUtil {
        this.json.States[state] = {
            Type: 'Task',
            ...(next && { Next: next }),
            ...(end && { End: end })
        };

        return this;
    }

    addTaskAtPath(path: string | (string | number)[], next?: string, end?: boolean): JSONBuilderUtil {
        const original = { ...this.json.States };

        this.json.States = JSONBuilderUtil.updateAtPath<JSONState>(
            path,
            {
                Type: 'Task',
                ...(next && { Next: next }),
                ...(end && { End: end })
            },
            original
        );

        return this;
    }

    addSuccess(state: string, next?: string, end?: boolean): JSONBuilderUtil {
        this.json.States[state] = {
            Type: 'Success',
            ...(next && { Next: next }),
            ...(end && { End: end })
        };

        return this;
    }

    addChoice(state: string, choices: JSONStateObject[], next?: string, end?: boolean): JSONBuilderUtil {
        this.json.States[state] = {
            Type: 'Choice',
            Choices: choices,
            ...(next && { Next: next }),
            ...(end && { End: end })
        };

        return this;
    }

    addMap(state: string, iterator: StepFunctionJSON, next?: string, end?: boolean): JSONBuilderUtil {
        this.json.States[state] = {
            Type: 'Map',
            Iterator: iterator,
            ...(next && { Next: next }),
            ...(end && { End: end })
        };

        return this;
    }

    addParallel(state: string, branches: StepFunctionJSON[], next?: string, end?: boolean): JSONBuilderUtil {
        this.json.States[state] = {
            Type: 'Parallel',
            Branches: branches,
            ...(next && { Next: next }),
            ...(end && { End: end })
        };

        return this;
    }

    addOrderedNode(
        name: string,
        value: JSONStateObject,
        { siblingPath, after = true }: AddOrderedNodeOptions
    ): JSONBuilderUtil {
        const original = { ...this.json.States };
        const nodePath = convertToArrayPath(siblingPath);
        const nodeValue = RPath<JSONStateObject>(nodePath, original);
        const parentPath = JSONBuilderUtil.getNodeParentPath(siblingPath);
        const parentValue = RPath<JSONState>(parentPath, original);
        const siblingKey = last(nodePath);

        if (parentValue && nodeValue) {
            const newState = Object.entries(parentValue).reduce<[key: string, value: JSONStateObject][]>(
                (accum, current, idx) => {
                    const [k, v] = current;

                    if (!after && k === siblingKey) {
                        return [
                            ...accum,
                            [name, { ...value, Metadata: { ...value?.Metadata, SortOrder: idx } }],
                            [k, { ...v, Metadata: { ...v?.Metadata, SortOrder: idx + 0.1 } }]
                        ];
                    }

                    if (after && k === siblingKey) {
                        // Make sure End is updated for both nodes if needed.
                        const { End } = v;
                        return [
                            ...accum,
                            [k, { ...v, Metadata: { ...v?.Metadata, SortOrder: idx }, End: undefined }],
                            [name, { ...value, Metadata: { ...value?.Metadata, SortOrder: idx + 0.1 }, End }]
                        ];
                    }

                    return [...accum, [k, { ...v, Metadata: { ...v?.Metadata, SortOrder: idx } }]];
                },
                []
            );

            this.json.States = JSONBuilderUtil.updateAtPath(parentPath, Object.fromEntries(newState), original);
        }

        return this;
    }

    editNode(state: string, content: JSONStateObject): JSONBuilderUtil {
        const original = { ...this.json.States[state] };

        this.json.States[state] = {
            ...original,
            ...content
        };

        return this;
    }

    editNameAtPath(path: string | string[], name: string): JSONBuilderUtil {
        const original = { ...this.json.States };
        const nodePath = convertToArrayPath(path);
        const nodeValue = RPath<JSONStateObject>(nodePath, original);
        const parentPath = JSONBuilderUtil.getNodeParentPath(path);
        // JSONState, not JSONStateObject: the parent is the map keyed by state name that omit works on
        const parentValue = RPath<JSONState>(parentPath, original);
        const oldName = last(nodePath);

        if (oldName && nodeValue && parentValue) {
            const newParentValue = {
                ...omit([oldName.toString()], parentValue),
                [name]: nodeValue
            };

            this.json.States = JSONBuilderUtil.updateAtPath(parentPath, newParentValue, original);
        }

        return this;
    }

    editNodeAtPath(path: string | (string | number)[], content: { [key: string]: any }): JSONBuilderUtil {
        const original = { ...this.json.States };
        const rawPath = convertToArrayPath(path);
        const nodePath = rawPath.map<string | number>(numberOrIdentity);
        const nodeValue = RPath<JSONStateObject>(nodePath, original);

        const newStates = JSONBuilderUtil.updateAtPath(
            nodePath,
            {
                ...nodeValue,
                ...content
            },
            original
        );

        this.json.States = newStates;

        return this;
    }

    editRootJSON(content: Partial<StepFunctionJSON>): JSONBuilderUtil {
        this.json = {
            ...this.json,
            ...content
        };

        return this;
    }

    getJson() {
        return this.json;
    }

    static getNodeParentPath(path: string | string[]): (string | number)[] {
        const nodePath = convertToArrayPath(path);
        return nodePath.slice(0, nodePath.length - 1);
    }

    getNodeJson(state: string): JSONStateObject {
        return this.json.States[state];
    }

    getNodeJsonAtPath(path: string | (string | number)[], startAtStates: boolean = true): JSONStateObject | StepFunctionJSON | undefined {
        const nodePath = convertToArrayPath(path);

        if (startAtStates) {
            return RPath(nodePath, this.json.States);
        }
        return RPath(nodePath, this.json);
    }

    setNodeStateName(state: string, newState: string) {
        this.json.States[newState] = { ...this.json.States[state] };
        delete this.json.States[state];
    }

    reset() {
        this.json = { StartAt: '', States: {} };
    }

    toString() {
        return JSON.stringify(this.json);
    }

    static updateAtPath<T extends JSONState, V = JSONStateObject>(
        path: string | (string | number)[],
        content: V,
        jsonStateObj: T
    ): T {
        const rawPath = convertToArrayPath(path);
        // Convert perceived indexes from strings to integers to
        // ensure arrays are not converted to objects.
        const nodePath = rawPath.map(numberOrIdentity);

        return assocPath(nodePath, content, jsonStateObj);
    }
}
