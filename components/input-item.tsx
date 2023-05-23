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
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

    const priceRef = useRef<HTMLInputElement>();
    useImperativeHandle(ref, () => ({
        focus() {
            priceRef.current!.focus();
        },
    }));

    const contents = (
        <>
            <Select
                placeholder="Person"
                nothingFound="Nothing found"
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
                    width: mobile ? "100%" : 120,
                    gridColumnStart: 1,
                    gridColumnEnd: 3,
                }}
            />
            <NumberInput
                icon={"$"}
                min={0}
                precision={2}
                step={0.01}
                {...form.getInputProps(`items.${index}.price`)}
                onFocus={(e) => e.target.select()}
                ref={priceRef}
                onKeyDown={getHotkeyHandler([
                    ["Enter", focusNext],
                    ["Tab", focusNext],
                ])}
                onBlur={focusNext} // Capture Android Chromium "next field"
                style={{
                    width: mobile ? "100%" : 120,
                    gridColumnStart: 1,
                    gridColumnEnd: 2,
                }}
            />
            <NumberInput
                min={1}
                icon="x"
                {...form.getInputProps(`items.${index}.quantity`)}
                onFocus={(e) => e.target.select()}
                style={{
                    width: mobile ? "100%" : 100,
                }} />
            <TextInput
                placeholder="Note"
                {...form.getInputProps(`items.${index}.note`)}
                style={{
                    width: mobile ? "100%" : 100,
                    gridColumnStart: 1,
                    gridColumnEnd: 3,
                }}
            />
        </>
    );

    return (
        <>
            {mobile ? <>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    gap: "10px",
                }}>
                    {contents}
                </div>
            </> : contents}
        </>
    );
});

InputItem.displayName = "InputItem";
export default InputItem;
