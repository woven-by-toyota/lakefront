import {
    convertToArrayPath,
    numberOrIdentity,
    JSONBuilderUtil,
    type JSONState,
    type StepFunctionJSON
} from '../JSONBuilder.util';
import { cleanup } from '@testing-library/react';
import * as R from 'ramda';

const { path: RPath } = R;

afterAll(cleanup);

describe('convertToArrayPath', () => {
    const PATH = ['a', 'b', 'c'];

    it('returns empty array if path is empty string', () => {
        expect(convertToArrayPath('')).toMatchObject([]);
    });

    it('returns the provided array if path is an array', () => {
        expect(convertToArrayPath(PATH)).toBe(PATH);
    });

    it('splits the provided path using "." as the seperator', () => {
        expect(convertToArrayPath('a.b.c')).toMatchObject(PATH);
    });
});

describe('numberOrIdentity', () => {
    it('converts argument to a number if possible.', () => {
        expect(numberOrIdentity(1)).toBe(1);
        expect(numberOrIdentity('1')).toBe(1);
        expect(numberOrIdentity(0)).toBe(0);
        expect(numberOrIdentity('0')).toBe(0);
        expect(numberOrIdentity(null)).toBe(0);
        expect(numberOrIdentity(false)).toBe(0);
        expect(numberOrIdentity([-1])).toBe(-1);
    });

    it('returns provided argument if number conversion is not possible', () => {
        expect(numberOrIdentity(undefined)).toBeUndefined();

        const obj = { a: 1 };
        expect(numberOrIdentity(obj)).toBe(obj);

        const arr = [1, 2];
        expect(numberOrIdentity(arr)).toBe(arr);
    });
});

describe('JSONBuilderUtil', () => {
    beforeEach(cleanup);
    const INITIAL_JSON = { StartAt: '', States: {} };
    const BASE_TASK_TYPES = {
        TASK: {
            Type: 'Task'
        },
        SUCCESS: {
            Type: 'Success'
        },
        CHOICE: {
            Type: 'Choice'
        },
        MAP: {
            Type: 'Map'
        },
        PARALLEL: {
            Type: 'Parallel'
        }
    };
    const NESTED_ARRAY_PATH = ['Nested', 'String', 'Path'];

    it('sets initial json to proper StepFunction object when no json provided to constructor', () => {
        const jsonBuild = new JSONBuilderUtil();
        expect(jsonBuild.json).toMatchObject(INITIAL_JSON);
    });

    it('sets json to JSON provided to constructor', () => {
        const stepFunctionJSON = { StartAt: 'Start', States: { Start: {} } };
        const jsonBuild = new JSONBuilderUtil(stepFunctionJSON);
        expect(jsonBuild.json).toBe(stepFunctionJSON);
    });

    describe('getChoiceForAdd', () => {
        it('returns a base step function "Choice" object', () => {
            expect(JSONBuilderUtil.getChoiceForAdd('next')).toMatchObject({
                Next: 'next'
            });
        });
    });

    describe('addTask', () => {
        const jsonBuild = new JSONBuilderUtil();
        const newTask = 'NewTask';

        it('adds state at provided key of type "Task"', () => {
            jsonBuild.addTask(newTask);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addTask(newTask, next);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyEndTask = 'TruthyEndTask';
            jsonBuild.addTask(newTask, undefined, false);
            jsonBuild.addTask(truthyEndTask, undefined, true);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
            expect(jsonBuild.json.States[truthyEndTask]).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                End: true
            });
        });
    });

    describe('addTaskAtPath', () => {
        const jsonBuild = new JSONBuilderUtil();

        it('adds state at provided rootPath of type "Task"', () => {
            const rootPath = 'RootPath';
            jsonBuild.addTaskAtPath(rootPath);

            expect(jsonBuild.json.States[rootPath]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });

        it('adds state at provided nested string path of type "Task"', () => {
            const nestedStringPath = 'Nested.String.Path';
            jsonBuild.addTaskAtPath(nestedStringPath);

            expect(RPath(convertToArrayPath(nestedStringPath), jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });

        it('adds state at provided nested array path of type "Task"', () => {
            jsonBuild.addTaskAtPath(NESTED_ARRAY_PATH);

            expect(RPath(NESTED_ARRAY_PATH, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addTaskAtPath(NESTED_ARRAY_PATH, next);

            expect(RPath(NESTED_ARRAY_PATH, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyNestedArrayPath = [...NESTED_ARRAY_PATH];
            jsonBuild.addTaskAtPath(NESTED_ARRAY_PATH, undefined, false);
            jsonBuild.addTaskAtPath(truthyNestedArrayPath, undefined, true);

            expect(RPath(NESTED_ARRAY_PATH, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
            expect(RPath(truthyNestedArrayPath, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                End: true
            });
        });
    });

    describe('addSuccess', () => {
        const jsonBuild = new JSONBuilderUtil();
        const newTask = 'NewTask';

        it('adds state at provided key of type "Success"', () => {
            jsonBuild.addSuccess(newTask);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addSuccess(newTask, next);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyEndTask = 'TruthyEndTask';
            jsonBuild.addSuccess(newTask, undefined, false);
            jsonBuild.addSuccess(truthyEndTask, undefined, true);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS
            });
            expect(jsonBuild.json.States[truthyEndTask]).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS,
                End: true
            });
        });
    });

    describe('addChoice', () => {
        const jsonBuild = new JSONBuilderUtil();
        const newTask = 'NewTask';
        const choices = [{ Next: 'One' }, { Next: 'Two' }, { Next: 'Three' }];

        it('adds state at provided key of type "Choice"', () => {
            jsonBuild.addChoice(newTask, choices);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.CHOICE,
                Choices: choices
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addChoice(newTask, choices, next);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.CHOICE,
                Choices: choices,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyEndTask = 'TruthyEndTask';
            jsonBuild.addChoice(newTask, choices, undefined, false);
            jsonBuild.addChoice(truthyEndTask, choices, undefined, true);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.CHOICE,
                Choices: choices
            });
            expect(jsonBuild.json.States[truthyEndTask]).toMatchObject({
                ...BASE_TASK_TYPES.CHOICE,
                Choices: choices,
                End: true
            });
        });
    });

    describe('addMap', () => {
        const jsonBuild = new JSONBuilderUtil();
        const newTask = 'NewTask';
        const iterator = {
            StartAt: 'One',
            States: {
                One: {}
            }
        };

        it('adds state at provided key of type "Map"', () => {
            jsonBuild.addMap(newTask, iterator);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.MAP,
                Iterator: iterator
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addMap(newTask, iterator, next);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.MAP,
                Iterator: iterator,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyEndTask = 'TruthyEndTask';
            jsonBuild.addMap(newTask, iterator, undefined, false);
            jsonBuild.addMap(truthyEndTask, iterator, undefined, true);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.MAP,
                Iterator: iterator
            });
            expect(jsonBuild.json.States[truthyEndTask]).toMatchObject({
                ...BASE_TASK_TYPES.MAP,
                Iterator: iterator,
                End: true
            });
        });
    });

    describe('addParallel', () => {
        const jsonBuild = new JSONBuilderUtil();
        const newTask = 'NewTask';
        const branches = [
            {
                StartAt: 'One',
                States: {
                    One: {}
                }
            },
            {
                StartAt: 'Two',
                States: {
                    Two: {}
                }
            }
        ] as StepFunctionJSON[];

        it('adds state at provided key of type "Parallel"', () => {
            jsonBuild.addParallel(newTask, branches);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.PARALLEL,
                Branches: branches
            });
        });

        it('adds provided next to added task', () => {
            const next = 'Next';
            jsonBuild.addParallel(newTask, branches, next);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.PARALLEL,
                Branches: branches,
                Next: next
            });
        });

        it('sets end to true when provided truthy end value on added task', () => {
            const truthyEndTask = 'TruthyEndTask';
            jsonBuild.addParallel(newTask, branches, undefined, false);
            jsonBuild.addParallel(truthyEndTask, branches, undefined, true);

            expect(jsonBuild.json.States[newTask]).toMatchObject({
                ...BASE_TASK_TYPES.PARALLEL,
                Branches: branches
            });
            expect(jsonBuild.json.States[truthyEndTask]).toMatchObject({
                ...BASE_TASK_TYPES.PARALLEL,
                Branches: branches,
                End: true
            });
        });
    });

    describe('addOrderedNode', () => {
        const jsonBuild = new JSONBuilderUtil();
        const nestedStringPath = 'Nested.String.Path';
        jsonBuild.addTaskAtPath(nestedStringPath);

        it('Adds provided name-state pair after sibiling by default', () => {
            const afterNodeContent = { Next: 'Next' };
            jsonBuild.addOrderedNode('AfterNode', afterNodeContent, { siblingPath: nestedStringPath });

            expect(RPath(['Nested', 'String', 'AfterNode'], jsonBuild.json.States)).toMatchObject(afterNodeContent);

            const parentContent = RPath(['Nested', 'String'], jsonBuild.json.States) as JSONState;
            expect(Object.keys(parentContent)[0]).toBe('Path');
            expect(Object.keys(parentContent)[1]).toBe('AfterNode');
        });

        it('Adds provided name-state pair after sibiling when after is true', () => {
            const afterNodeContent = { Next: 'Next' };
            jsonBuild.addOrderedNode('AfterNode', afterNodeContent, { siblingPath: nestedStringPath, after: true });

            expect(RPath(['Nested', 'String', 'AfterNode'], jsonBuild.json.States)).toMatchObject(afterNodeContent);

            const parentContent = RPath(['Nested', 'String'], jsonBuild.json.States) as JSONState;
            expect(Object.keys(parentContent)[0]).toBe('Path');
            expect(Object.keys(parentContent)[1]).toBe('AfterNode');
        });

        it('Adds provided name-state pair before sibiling when after is false', () => {
            const afterNodeContent = { Next: 'Next' };
            jsonBuild.addOrderedNode('AfterNode', afterNodeContent, { siblingPath: nestedStringPath, after: false });

            expect(RPath(['Nested', 'String', 'AfterNode'], jsonBuild.json.States)).toMatchObject(afterNodeContent);

            const parentContent = RPath(['Nested', 'String'], jsonBuild.json.States) as JSONState;
            expect(Object.keys(parentContent)[0]).toBe('AfterNode');
            expect(Object.keys(parentContent)[1]).toBe('Path');
        });
    });

    describe('editNode', () => {
        const jsonBuild = new JSONBuilderUtil();
        const taskName = 'TaskName';
        const metadata = {
            Metadata: {
                NodePath: 'TaskName'
            }
        };
        jsonBuild.addTaskAtPath(taskName);

        it('merges existing state with provided content', () => {
            expect(jsonBuild.json.States[taskName]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.editNode(taskName, {
                ...metadata
            });

            expect(jsonBuild.json.States[taskName]).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                ...metadata
            });
        });

        it('overwrites existing state when provided content includes existing state properties', () => {
            expect(jsonBuild.json.States[taskName]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.editNode(taskName, {
                ...BASE_TASK_TYPES.SUCCESS,
                ...metadata
            });

            expect(jsonBuild.json.States[taskName]).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS,
                ...metadata
            });
        });
    });

    describe('editNameAtPath', () => {
        const jsonBuild = new JSONBuilderUtil();
        jsonBuild.addTaskAtPath(NESTED_ARRAY_PATH);

        it('replaces state at path with same value under new name', () => {
            expect(RPath(NESTED_ARRAY_PATH, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.editNameAtPath(NESTED_ARRAY_PATH, 'NewPath');

            expect(RPath(NESTED_ARRAY_PATH, jsonBuild.json.States)).toBeUndefined();

            const newPath = [...JSONBuilderUtil.getNodeParentPath(NESTED_ARRAY_PATH), 'NewPath'];
            expect(RPath(newPath, jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });
    });

    describe('editNodeAtPath', () => {
        const jsonBuild = new JSONBuilderUtil();
        const taskNamePath = 'Task.Name.Path';
        const metadata = {
            Metadata: {
                NodePath: taskNamePath
            }
        };
        jsonBuild.addTaskAtPath(taskNamePath);

        it('merges existing state at path with provided content', () => {
            expect(RPath(convertToArrayPath(taskNamePath), jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.editNodeAtPath(taskNamePath, {
                ...metadata
            });

            expect(RPath(convertToArrayPath(taskNamePath), jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK,
                ...metadata
            });
        });

        it('overwrites existing state when provided content includes existing state properties', () => {
            expect(RPath(convertToArrayPath(taskNamePath), jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.editNodeAtPath(taskNamePath, {
                ...BASE_TASK_TYPES.SUCCESS,
                ...metadata
            });

            expect(RPath(convertToArrayPath(taskNamePath), jsonBuild.json.States)).toMatchObject({
                ...BASE_TASK_TYPES.SUCCESS,
                ...metadata
            });
        });
    });

    describe('editRootJSON', () => {
        const jsonBuild = new JSONBuilderUtil();

        it('overwrites root step function JSON with provided content', () => {
            const content = {
                StartAt: 'NewState'
            };
            expect(jsonBuild.json).toMatchObject(INITIAL_JSON);

            jsonBuild.editRootJSON(content);

            expect(jsonBuild.json).toMatchObject({
                ...INITIAL_JSON,
                ...content
            });
        });
    });

    describe('getJson', () => {
        it('returns current JSONBuilder json value.', () => {
            const jsonBuild = new JSONBuilderUtil();

            expect(jsonBuild.getJson()).toBe(jsonBuild.json);
        });
    });

    describe('getNodeParentPath', () => {
        it('returns the parent path of a nested node\'s path.', () => {
            const parentPath = ['root', 'parent'];

            expect(JSONBuilderUtil.getNodeParentPath('root.parent.child')).toMatchObject(parentPath);
            expect(JSONBuilderUtil.getNodeParentPath(['root', 'parent', 'child'])).toMatchObject(parentPath);
        });
    });

    describe('getNodeJson', () => {
        it('returns value at provided state name', () => {
            const jsonBuild = new JSONBuilderUtil();
            const taskName = 'TaskName';
            jsonBuild.addTaskAtPath(taskName);

            expect(jsonBuild.getNodeJson(taskName)).toMatchObject(jsonBuild.json.States[taskName]);
        });
    });

    describe('getNodeJsonAtPath', () => {
        it('returns value at provided path', () => {
            const jsonBuild = new JSONBuilderUtil();
            const taskNamePath = ['Task', 'Name'];
            jsonBuild.addTaskAtPath(taskNamePath);

            expect(jsonBuild.getNodeJsonAtPath(taskNamePath)).toMatchObject(
                RPath(taskNamePath, jsonBuild.json.States) as any[]
            );
        });

        it('returns value at provided path from root when startAtStates is false', () => {
            const jsonBuild = new JSONBuilderUtil();
            const taskNamePath = ['Task', 'Name'];
            jsonBuild.addTaskAtPath(taskNamePath);

            expect(jsonBuild.getNodeJsonAtPath(['States', ...taskNamePath], false)).toMatchObject(
                RPath(['States', ...taskNamePath], jsonBuild.json) as any[]
            );
        });
    });

    describe('setNodeStateName', () => {
        const jsonBuild = new JSONBuilderUtil();
        const taskName = 'TaskName';
        jsonBuild.addTaskAtPath(taskName);

        it('replaces state at name with same value under new name', () => {
            expect(jsonBuild.json.States[taskName]).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });

            jsonBuild.setNodeStateName(taskName, 'NewName');

            expect(jsonBuild.json.States[taskName]).toBeUndefined();

            expect(jsonBuild.json.States['NewName']).toMatchObject({
                ...BASE_TASK_TYPES.TASK
            });
        });
    });

    describe('reset', () => {
        it('sets JSONBuilder json property back to initial value', () => {
            const jsonBuild = new JSONBuilderUtil();

            expect(jsonBuild.json).toMatchObject(INITIAL_JSON);

            jsonBuild.addTaskAtPath('TaskName');

            expect(jsonBuild.json).toMatchObject({
                ...INITIAL_JSON,
                States: {
                    TaskName: {
                        ...BASE_TASK_TYPES.TASK
                    }
                }
            });

            jsonBuild.reset();

            expect(jsonBuild.json).toMatchObject(INITIAL_JSON);
        });
    });

    describe('toString', () => {
        it('returns stringified version of current JSONBuilder json value.', () => {
            const jsonBuild = new JSONBuilderUtil();

            expect(jsonBuild.toString()).toBe(JSON.stringify(jsonBuild.json));
        });
    });

    describe('updateAtPath', () => {
        const taskNamePath = 'Task.Name.Path';
        const metadata = {
            Metadata: {
                NodePath: taskNamePath
            }
        };

        it('returns copy of value with content replaced at provided path', () => {
            const originalState = { TaskName: { Iterator: { StartAt: 'One', States: { One: {} } } } };
            const content = { StartAt: 'Two', States: { Two: {} } };
            const path = ['TaskName', 'Iterator'];

            expect(JSONBuilderUtil.updateAtPath(path, content, originalState)).toMatchObject({
                TaskName: { Iterator: { ...content } }
            });
        });
    });
});
