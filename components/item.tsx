import { Divider, NumberInput, Text, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { NextPage } from "next";
import { FormType } from "../pages";

const InputItem: NextPage<{
  personIndex: number,
  index: number,
  form: UseFormReturnType<FormType>,
}> = ({ personIndex, index, form }) => {
  return (
    <>
      <TextInput
        onFocus={(e) => e.target.select()}
        {...form.getInputProps(`persons.${personIndex}.items.${index}.name`)}
        styles={{
          root: {
            gridColumn: "1 / 2",
          },
          input: {
            border: 0,
          },
        }} />
      <NumberInput
        icon={"$"}
        min={0}
        precision={2}
        step={0.01}
        onFocus={(e) => e.target.select()}
        {...form.getInputProps(`persons.${personIndex}.items.${index}.price`)}
        style={{
          gridColumn: "2 / 3",
          width: 120,
        }}
      />
      <Text
        style={{
          gridColumn: "3 / 4",
        }}>
        {0}
      </Text>
      <Text
        style={{
          gridColumn: "4 / 5",
        }} >
        {0}
      </Text>
      <Divider
        style={{
          gridColumn: "1 / 5",
        }} />
    </>
  );
};

export default InputItem;
