import { FC, useState } from 'react';
import CheckboxGroupComponent from '../CheckboxGroup/CheckboxGroup';
import {
  ButtonColumnContainer,
  CheckBoxContainer,
  GridContainer,
  PanelContainer,
  StyledButton,
  StyledH4
} from './transferListStyles';

export interface ListItem {
  label: string;
  description: string;
  value: string;
}

export interface TransferListProps {
  leftListData: ListItem[];
  leftListName: string;
  rightListData: ListItem[];
  rightListName: string;
  onListChange: (leftList: ListItem[], rightList: ListItem[]) => void;
  sort?: boolean;
  className?: string;
}

const TransferList: FC<TransferListProps> = ({
  leftListData,
  leftListName,
  rightListData,
  rightListName,
  onListChange,
  sort = true,
  className
}) => {
  const [listOneValue, setListOneValue] = useState(new Set<string>());
  const [listTwoValue, setListTwoValue] = useState(new Set<string>());

  const handleListOneClick = (option: any) => {
    setListOneValue(option);
  };

  const handleListTwoClick = (option: any) => {
    setListTwoValue(option);
  };

  const sortList = (listToSort: ListItem[]) => {
    listToSort.sort((item1, item2) =>
      item1.label.toLowerCase().localeCompare(item2.label.toLowerCase())
    );
  };

  const moveItems = (
    sourceList: ListItem[],
    targetList: ListItem[],
    selected: Set<string>
  ) => {
    const itemsToMove = sourceList.filter((item) => selected.has(item.value));
    const updatedSourceList = sourceList.filter(
      (item) => !selected.has(item.value)
    );
    targetList.push(...itemsToMove);
    const updatedDestinationList = [...targetList];
    if (sort) {
      sortList(updatedSourceList);
      sortList(updatedDestinationList);
    }
    return [updatedSourceList, updatedDestinationList];
  };

  const handleMoveLeftToRight = () => {
    const [updatedListOne, updatedListTwo] = moveItems(
      leftListData,
      rightListData,
      listOneValue
    );
    onListChange(updatedListOne, updatedListTwo);
    setListOneValue(new Set<string>());
  };

  const handleMoveRightToLeft = () => {
    const [updatedListTwo, updatedListOne] = moveItems(
      rightListData,
      leftListData,
      listTwoValue
    );
    onListChange(updatedListOne, updatedListTwo);
    setListTwoValue(new Set<string>());
  };

  const handleAllRight = () => {
    if (sort) {
      sortList(leftListData);
      sortList(rightListData);
    }
    onListChange([], [...leftListData, ...rightListData]);
  };

  const handleAllLeft = () => {
    if (sort) {
      sortList(leftListData);
      sortList(rightListData);
    }
    onListChange([...rightListData, ...leftListData], []);
  };

  return (
    <GridContainer className={className}>
      <PanelContainer>
        <StyledH4>{leftListName}</StyledH4>
        <CheckBoxContainer>
          <CheckboxGroupComponent
            options={leftListData}
            name={'listOne'}
            selected={listOneValue}
            onHandleChange={handleListOneClick}
          />
        </CheckBoxContainer>
      </PanelContainer>
      <ButtonColumnContainer>
        <StyledButton
          color="secondary"
          disabled={leftListData.length === 0}
          onClick={handleAllRight}
          type={'button'}
        >
          ≫
        </StyledButton>
        <StyledButton
          color="secondary"
          disabled={listOneValue.size === 0}
          onClick={handleMoveLeftToRight}
          type={'button'}
        >
          &gt;
        </StyledButton>
        <StyledButton
          color="secondary"
          disabled={listTwoValue.size === 0}
          onClick={handleMoveRightToLeft}
          type={'button'}
        >
          &lt;
        </StyledButton>
        <StyledButton
          color="secondary"
          disabled={rightListData.length === 0}
          onClick={handleAllLeft}
          type={'button'}
        >
          ≪
        </StyledButton>
      </ButtonColumnContainer>
      <PanelContainer>
        <StyledH4>{rightListName}</StyledH4>
        <CheckBoxContainer>
          <CheckboxGroupComponent
            options={rightListData}
            name={'listTwo'}
            selected={listTwoValue}
            onHandleChange={handleListTwoClick}
          />
        </CheckBoxContainer>
      </PanelContainer>
    </GridContainer>
  );
};

export default TransferList;
