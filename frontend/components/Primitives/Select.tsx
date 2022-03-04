import React, { useState } from "react";
import { styled } from "@stitches/react";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import Flex from "./Flex";
import Text from "./Text";

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "$4",
  boxSizing: "border-box",
  pt: "$8",
  pl: "$16",
  fontSize: "$16",
  lineHeight: "$20",
  height: 56,
  gap: 4,
  backgroundColor: "white",
  color: "White",
  border: "1px solid var(--colors-primary200)",
  //   boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: mauve.mauve3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 35px 0 25px",
  position: "relative",
  userSelect: "none",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&:focus": {
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
});

const StyledLabel = styled(SelectPrimitive.Label, {
  padding: "0 25px",
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);

const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);

// Exports
export const SelectRoot = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectIcon = SelectPrimitive.Icon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectSeparator = StyledSeparator;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const Select: React.FC<{ value: string; values: string[]; isCheckBox?: boolean }> = ({
  value,
  values,
  isCheckBox,
}) => {
  Select.defaultProps = {
    isCheckBox: false,
  };
  const [currentValue, setCurrentValue] = useState(value);

  const setChangedValue = (val: string) => {
    setCurrentValue(val);
  };

  return (
    <Flex css={{ position: "relative", width: "100%" }}>
      <SelectRoot value={currentValue} onValueChange={setChangedValue} defaultValue="blueberry">
        <SelectTrigger aria-label="Food" css={{ width: "100%" }}>
          <SelectValue />
          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple" onClick={(e) => e.preventDefault()}>
                <SelectItemText>Apple</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="banana">
                <SelectItemText>Banana</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="blueberry">
                <SelectItemText>Blueberry</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="grapes">
                <SelectItemText>Grapes</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="pineapple">
                <SelectItemText>Pineapple</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="aubergine">
                <SelectItemText>Aubergine</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="broccoli">
                <SelectItemText>Broccoli</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="carrot" disabled>
                <SelectItemText>Carrot</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="courgette">
                <SelectItemText>Courgette</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="leek">
                <SelectItemText>leek</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Meat</SelectLabel>
              <SelectItem value="beef">
                <SelectItemText>Beef</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="chicken">
                <SelectItemText>Chicken</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="lamb">
                <SelectItemText>Lamb</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
              <SelectItem value="pork">
                <SelectItemText>Pork</SelectItemText>
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectRoot>
      <Text
        as="label"
        css={{
          fontSize: "$16",
          pl: "$17",
          top: "0",
          lineHeight: "$24",
          color: "$primary300",
          position: "absolute",
          pointerEvents: "none",
          transformOrigin: "0 0",
          transition: "all .2s ease-in-out",
        }}
      >
        {currentValue}
      </Text>
    </Flex>
  );
};

export default Select;
