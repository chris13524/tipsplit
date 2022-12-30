import { TextInput, Divider } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { NextPage } from "next";
import { FormType } from "../pages";
import InputItem from "./item";

const InputPerson: NextPage<{
  index: number,
  form: UseFormReturnType<FormType>,
}> = ({ index, form }) => {
  return <>
    <TextInput
      onFocus={(e) => e.target.select()}
      {...form.getInputProps(`persons.${index}.name`)}
      styles={{
        gridColumn: "1 / 5",
        input: {
          border: 0,
        },
      }} />
    <Divider style={{
      gridColumn: "1 / 5",
    }} />
    {form.values.persons[index].items.map((item, itemIndex) => <InputItem key={item.key} personIndex={index} index={itemIndex} form={form} />)}
    <Divider
      color="red"
      style={{
        gridColumn: "1 / 5",
      }} />
  </>;
};

export default InputPerson;
