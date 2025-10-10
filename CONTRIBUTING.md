# Contributing

## Adding New Components
Currently, there is no automated solution to verify components are consistently structured, exported, and documented.
Please ensure the following steps are followed before submitting a pull request:

### Use minimum component folder structure
Your new `ComponentName` folder should have the minimum structure:
```
ComponentName
\__ComponentName.tsx
\__index.ts
```

With the `ComponentName/index.ts` having the minimum contents:
```ts
import ComponentName, { ComponentNameProps } from './ComponentName';

export { ComponentNameProps };
export default ComponentName;
```
See the [next section](#Use-minimum-component-file-structure) on what the `ComponentName.tsx` should contain.

### Use minimum component file structure
The (`ComponentName.tsx`) file should resemble:

```tsx
import { FC } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export interface ComponentNameProps {
    /**
     * The classes to pass to the component.
     */
    className?: string;
}

/**
 * ComponentName Component
 *
 * The ComponentName component does things such as stuff.
 *
 */
const ComponentName: FC<ComponentNameProps> = ({ className }) => {
  return (
      <div className={className}>
          content here
      </div>
  );
};

export default ComponentName;

```
This will allow:
- external applications to easily consume Lakefront theming.
- overriding and/or making styled versions of the component.
- storybook plugins to generate component and props descriptions.

### Add exports in [Index.ts](src/index.ts)
**Alphabetically** add your component and supporting exports (e.g. types, interfaces, util) to the [index.ts](src/index.ts) in the following format(s):
```ts
export { default as ComponentName } from './components/ComponentName';
export * from './components/ComponentName';
```

### Add entries in [README => Storybook Components Table](README.md#How-to-add-components-to-this-table)
Update the [README.md Storybook components table](README.md#How-to-add-components-to-this-table).

## Using SVGs
Although the project supports absolute paths, SVGs need to be imported with a relative path, e.g., <br />`import { ReactComponent as MySVG } from ../assets/MySVG.svg`

## Adding New Github Workflow Files
❗❗**Caution:** When adding new workflow files, note that github may attempt to run the workflow as soon as you push it up to github.

## Versioning
We use `semantic versioning`. While you can update the version number manually, we recommend you use our [automated versioning](.github/workflows/versionBumpCheck.yml) workflow for updating the version.

To trigger an automatic version update, add either a `patch`, `minor`, or `major keyword` to at least one of your commit messages. Once you push it up to github, the versioning will be handled for you. If none of the `keywords` above are added, a patch version update will be applied during the PR and you will be required to pull that change down before submitting any new commits.

Examples of the `keywords` include:

    patch-wording:  'patch,Patch,PATCH,patches,Patches,PATCHES,fix,Fix,FIX,fixes,Fixes,FIXES'
    
    minor-wording:  'minor,Minor,MINOR,add,Adds,ADD,ADDS,new,New,NEW,feat,Feat,FEAT,feature,Feature,FEATURE,features,Features,FEATURES'
    
    major-wording:  'major,MAJOR,cut-major,Cut-Major,break,Break,BREAK,breaking,Breaking,BREAKING'

For the most up to date list of keywords, see the [Version Bump Check](.github/workflows/versionBumpCheck.yml) workflow file.

## Submitting Pull requests
When opening a pull request, do not push `node_modules` and `dist` folders (which are ignored by default). Use Typescript `(.ts, .tsx)` files whenever possible

Automated testing will run when submitting a pull request to test component and compile errors. If you'd like to check whether your code compiles (or not) before submitting the pull request, you can do so by running the `npm run build` script. It will compile your code in the `dist` folder.

## Creating Issues
If you have a problem with this action and/or want a new feature to be added, please open a new issue from [here](https://github.com/woven-by-toyota/lakefront/issues/new).

If you're reporting a bug please be specific and include any helpful log/workflow snippet, as this will make the process easier for everyone. 

If you're asking for a new feature to be added, please be specific about what you want it to do and which use cases are you thinking to.
