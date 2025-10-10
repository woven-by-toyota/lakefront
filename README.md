![main workflow](https://github.com/woven-planet/lakefront/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/%40woven-planet%2Flakefront.svg)](https://badge.fury.io/js/%40woven-planet%2Flakefront)

# lakefront
Lakefront is a simple React component library.

## Installation

Lakefront is available as an [npm package](https://www.npmjs.com/package/@woven-planet/lakefront).

```sh
// with npm
npm install @woven-planet/lakefront

// with yarn
yarn add @woven-planet/lakefront
```

Emotion's `ThemeProvider` must wrap your application for the components to style correctly.
```
import { ThemeProvider } from '@emotion/react';
import { theme } from '@woven-planet/lakefront';

<ThemeProvider theme={theme}>
    ...
</ThemeProvider>
```

## Usage
### ⚠️ <b>LakeFront requires the client application to use React 18 and the Node version in the [package.json](./package.json) ⚠️ </b>


Here is a quick example to get you started, **it's all you need**:

```jsx
import { createRoot } from 'react-dom/client';
import { Button } from '@woven-planet/lakefront';

function App() {
    return <Button>Hello World</Button>;
}

createRoot.render(<App />, document.querySelector('#app'));

```
## Contributing
If you want to contribute to the action, even by just raising a problem or proposing an idea, you can click [here](CONTRIBUTING.md) to find out how to do it.

---
## Storybook Components
We've added Storybook pages to show how each component can be used.

---
## How to add components to this table
Upon a new component being added to this table run 'npm run update-readme' for boilerplate code. Please replace the three variables with the corresponding information as needed. Also, store screenshots of components in the 'screenshots' folder.

Please do not add information below this table, the 'npm run update-readme' will not work properly if the table is not last.
---
| Component                                                                                                                                  | Picture  | Component                                                                                                                                            | Picture                                                                                                 |
|:-------------------------------------------------------------------------------------------------------------------------------------------| :------- |:-----------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------|
| [AnchorCopy](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-anchorcopy--anchor-copy)                                       | <details><summary>Screenshot</summary><img src="src/screenshots/AnchorCopy.png"></details> | [BoundingBoxes](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-boundingboxes--bounding-boxes)                                        | <details><summary>Screenshot</summary><img src="src/screenshots/BoundingBoxes.png"></details>           |
 | [Breadcrumb](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-breadcrumb--docs)                                        | <details> <summary>Screenshot</summary><img src="src/screenshots/Breadcrumb.png"></details> | [Button](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-button--all-buttons)                                                         | <details><summary>Screenshot</summary><img src="src/screenshots/Button.png"></details>                  |
 | [Card](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-card--card)                                                          | <details><summary>Screenshot</summary><img src="src/screenshots/Card.png"></details> | [Checkbox](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-checkbox--checkbox)                                                        | <details><summary>Screenshot</summary><img  src="src/screenshots/Checkbox.png"></details>               |
| [CheckboxGroup](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-checkboxgroup--checkbox-group)                              | <details><summary>Screenshot</summary><img  src="src/screenshots/CheckboxGroup.png"></details> | [PopoverContent](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-popovercontent--popover-content)                                     | <details><summary>Screenshot</summary><img src="src/screenshots/PopoverContent.png"></details>          |
| [Collapsible](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-collapsible--collapsible)                                     | <details><summary>Screenshot</summary><img src="src/screenshots/Collapsible.png"></details> | [CopyButton](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-copybutton--copy-button)                                                 | <details><summary>Screenshot</summary><img  src="src/screenshots/CopyButton.png"></details>             |
 | [Drawer](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-drawer--drawer)                                                    | <details><summary>Screenshot</summary><img src="src/screenshots/Drawer.png"></details> | [Filter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-allfilters--no-filter-bar)                                            | <details><summary>Screenshot</summary><img src="src/screenshots/Filter.png"></details>                  |
 | [AdditionalJSONFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-additionaljsonfilter--additional-json-filter) | <details><summary>Screenshot</summary><img src="src/screenshots/AdditionalJSONFilter.png"></details> | [DoubleMultiSelectFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-doublemultiselectfilter--double-multi-select-filter) | <details><summary>Screenshot</summary><img src="src/screenshots/DoubleMultiSelectFilter.png"></details> |
 | [DurationFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-durationfilter--duration-filter)                    | <details><summary>Screenshot</summary><img src="src/screenshots/DurationFilter.png"></details>| [ListFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-listfilter--list-filter)                                          | <details><summary>Screenshot</summary><img src="src/screenshots/ListFilter.png"></details>              |
 | [MultiSelectFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-multiselectfilter--multi-select-filter)          | <details><summary>Screenshot</summary><img src="src/screenshots/MultiSelectFilter.png"></details> | [RadioFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-radiofilter--radio-filter)                                       | <details><summary>Screenshot</summary><img src="src/screenshots/RadioFilter.png"></details>             |
 | [SingleSelectFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-singleselectfilter--single-select-filter)       | <details><summary>Screenshot</summary><img src="src/screenshots/SingleSelectFilter.png"></details> | [TextFilter](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-filter-textfilter--text-filter)                                          | <details><summary>Screenshot</summary><img src="src/screenshots/TextFilter.png"></details>              |
 | [Header](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-header--header)                                                    | <details><summary>Screenshot</summary><img src="src/screenshots/Header.png"></details> | [Input](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-input--placeholder)                                                           | <details><summary>Screenshot</summary><img src="src/screenshots/Input.png"></details>                   |
 | [ItemGrid](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-itemgrid--item-grid)                                             | <details><summary>Screenshot</summary><img src="src/screenshots/ItemGrid.png"></details> | [ItemResults](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-itemresults--item-results)                                              | <details><summary>Screenshot</summary><img src="src/screenshots/ItemResults.png"></details>             |
 | [Loading](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-loading--loading)                                                 | <details><summary>Screenshot</summary><img src="src/screenshots/Loading.png"></details> | [MaskableImage](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-maskableimage--maskable-image)                                        | <details><summary>Screenshot</summary><img src="src/screenshots/MaskableImage.png"></details>           |
 | [Modal](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-modal--simple-modal)                                                | <details><summary>Screenshot</summary><img src="src/screenshots/Modal.png"></details> | [ConfirmationModal](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-modal-confirmationmodal--basic-confirm)                           | <details><summary>Screenshot</summary><img src="src/screenshots/ConfirmationModal.png"></details>       |
 | [Page](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-page--page)                                                          | <details><summary>Screenshot</summary><img src="src/screenshots/Page.png"></details> | [PlaybackBar](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-playbackbar--playback-bar)                                              | <details><summary>Screenshot</summary><img src="src/screenshots/PlaybackBar.png"></details>             |
 | [Progress](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-progress-progressbar--progress-bar)                              | <details><summary>Screenshot</summary><img src="src/screenshots/Progress.png"></details> | [Circular Progress](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-progress-circularprogress--circular-progress)                     | <details><summary>Screenshot</summary><img src="src/screenshots/CircularProgress.png"></details>        |
 | [Device Progress](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-progress-deviceprogress--default-progress-bar)            | <details><summary>Screenshot</summary><img src="src/screenshots/DeviceProgress.png"></details> | [Progress Bar](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-progress-progressbar--progress-bar)                                    | <details><summary>Screenshot</summary><img src="src/screenshots/ProgressBar.png"></details>             |
 | [PropertyList](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-propertylist--property-list)                                 | <details><summary>Screenshot</summary><img src="src/screenshots/PropertyList.png"></details> | [RadioGroup](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-radiogroup--standard-radio-group)                                        | <details><summary>Screenshot</summary><img src="src/screenshots/RadioGroup.png"></details>              |
 | [RefreshToolBar](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-refreshtoolbar--refresh-toolbar)                           | <details><summary>Screenshot</summary><img src="src/screenshots/RefreshToolBar.png"></details> | [Select](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-select--select)                                                              | <details><summary>Screenshot</summary><img src="src/screenshots/Select.png"></details>                  |
 | [SelectPopover](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-selectpopover--popover)                                     | <details><summary>Screenshot</summary><img src="src/screenshots/SelectPopover.png"></details> | [Snackbar](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-snackbar)                                                                  | <details><summary>Screenshot</summary><img src="src/screenshots/Snackbar.png"></details>                |
 | [SpeedInput](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-speedinput--speed-input)                                       | <details><summary>Screenshot</summary><img src="src/screenshots/SpeedInput.png"></details> | [StackBanner](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-stack-banner--stack-banner)                                             | <details><summary>Screenshot</summary><img src="src/screenshots/StackBanner.png"></details>             |
 | [StackBannerRow](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-stack-banner-stack-banner-row--error)                      | <details><summary>Screenshot</summary><img src="src/screenshots/StackBannerRow.png"></details> | [StepFunctionAuthoring](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-stepfunctionauthoring--new-step-function)                     | <details><summary>Screenshot</summary><img src="src/screenshots/StepFunctionAuthoring.png"></details>   |
 | [StatusTable](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-statustable--status-table-with-table-card)                    | <details><summary>Screenshot</summary><img src="src/screenshots/StatusTable.png"></details> | [StepFunctionGraph](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-stepfunctiongraph--simple-graph)                                  | <details><summary>Screenshot</summary><img src="src/screenshots/StepFunctionAuthoring.png"></details>   |
 | [StepFunctionRenderer](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-stepfunctionrenderer--step-function-renderer)        |  <details><summary>Screenshot</summary><img src="src/screenshots/StepFunctionRenderer.png"></details> | [Table](https://woven-by-toyota.github.io/lakefront?path=/docs/lakefront-table--table)                                                                  | <details><summary>Screenshot</summary><img src="src/screenshots/Table.png"></details>                   |
 | [Tabs](https://woven-by-toyota.github.io/lakefront?path=/docs/lakefront-tabs--tabs)                                                           | <details><summary>Screenshot</summary><img src="src/screenshots/Tabs.png"></details> | [TextArea](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-textarea--placeholder)                                                     | <details><summary>Screenshot</summary><img src="src/screenshots/TextArea.png"></details>                |
 | [Toggle](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-toggle--toggle)                                                    | <details><summary>Screenshot</summary><img src="src/screenshots/Toggle.png"></details> | [TypeaheadSearch](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-typeaheadsearch--search-bottom-start)                               | <details><summary>Screenshot</summary><img src="src/screenshots/TypeaheadSearch.png"></details>         |
 | [ModeSelector](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-modeselector--simple-mode-selector)                          | <details><summary>Screenshot</summary><img src="src/screenshots/ModeSelector.png"></details> | [Colors](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-theme-colors--docs)                                                          | <details><summary>Screenshot</summary><img src="src/screenshots/Colors.png"></details>                  |
 | [ContextMenu](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-contextmenu--docs)                                                                        | <details><summary>Screenshot</summary><img src="src/screenshots/ContextMenu.png"></details> | [ButtonGroup](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-buttongroup--docs)                                                                                  | <details><summary>Screenshot</summary><img src="src/screenshots/ButtonGroup.gif"></details>             |
