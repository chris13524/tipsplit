import { NumberInput, Select, TextInput, useMantineTheme } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { getHotkeyHandler, useMediaQuery } from "@mantine/hooks";
import { Item } from "../lib/item";
import { forwardRef, useImperativeHandle, useRef } from "react";

type Props = {
  index: number,
  form: UseFormReturnType<{
    items: Item[],
    total: number,
  }>,
  focusNext: () => void,
};

export type InputItemRef = {
  focus: () => void,
};

export const InputItem = forwardRef<InputItemRef, Props>(({ index, form, focusNext }, ref) => {
  const priceRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => ({
    focus() {
      priceRef.current!.focus();
    },
  }));

  return (
    <>
      <NumberInput
        icon={"$"}
        min={0}
        precision={2}
        step={0.01}
        {...form.getInputProps(`items.${index}.price`)}
        onFocus={(e) => e.target.select()}
        ref={priceRef}
        onKeyDown={keyEvent => {
          console.log({ keyEvent });
          return getHotkeyHandler([
            ["Enter", focusNext],
            ["Tab", focusNext],
          ])(keyEvent);
        }}
        // onBlur={focusNext} // Capture Android Chromium "next field"
        style={{
          width: 100,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        }}
        hideControls
      />
      <NumberInput
        min={1}
        icon="x"
        {...form.getInputProps(`items.${index}.quantity`)}
        onFocus={(e) => e.target.select()}
        style={{
          width: 60,
        }}
        hideControls
      />
      <Select
        placeholder="Person"
        searchable
        creatable
        data={[...new Set(form.values.items.map(item => item.person))]}
        getCreateLabel={(query) => `+ Create ${query}`}
        // onCreate={(query) => {
        //     const item = query;
        //     onChange(value.person);
        //     // setPersons((current) => [...current, item]);
        //     return item;
        // }}
        {...form.getInputProps(`items.${index}.person`)}
        style={{
          width: 120,
          gridColumnStart: 1,
          gridColumnEnd: 3,
        }}
        rightSection={null}
      />
    </>
  );
});

InputItem.displayName = "InputItem";
export default InputItem;
