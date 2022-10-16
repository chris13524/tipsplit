import { NumberInput, Select, TextInput, useMantineTheme } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { NextPage } from "next";
import { Item } from "../lib/item";

const InputItem: NextPage<{
    index: number,
    form: UseFormReturnType<{
        items: Item[],
        total: number,
    }>,
}> = ({ index, form }) => {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

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
                style={{
                    width: mobile ? "100%" : 120,
                    gridColumnStart: 1,
                    gridColumnEnd: 2,
                }}
            />
            <NumberInput
                min={1}
                icon={"x"}
                {...form.getInputProps(`items.${index}.quantity`)}
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
};

export default InputItem;
