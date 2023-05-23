import { Center, Divider, NumberInput, Space, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId, useMediaQuery } from '@mantine/hooks';
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react';
import { InputItem, InputItemRef } from '../components/input-item';
import Result from '../components/result';
import { Item } from '../lib/item';

function makeNewItem(): Item {
  return {
    key: randomId(),
    person: "",
    price: 0,
    quantity: 1,
    note: "",
  };
}

const Home: NextPage = () => {
  const form = useForm({
    initialValues: {
      items: [makeNewItem()],
      total: 0,
    },
  });

  const subtotal = form.values.items
    .map(item => item.price * item.quantity)
    .reduce((sum, value) => sum + value);

  useEffect(() => {
    const filteredItems = form.values.items
      .filter(item => item.person != "" || item.price > 0 || item.note != "");
    const newItem = makeNewItem();

    const origionalKey = form.values.items[form.values.items.length - 1]?.key;
    const newKey = filteredItems[filteredItems.length - 1]?.key;
    if (origionalKey != newKey) {
      newItem.key = origionalKey;
    }

    form.setFieldValue("items", [...filteredItems, newItem]);

    if (subtotal > form.values.total) {
      form.setFieldValue("total", subtotal);
    }
  }, [JSON.stringify(form.values.items)]);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const inputItemRefs = useRef<InputItemRef[]>([]);

  const inputItem = (index: number, value: Item) => <InputItem
    index={index}
    form={form}
    ref={el => inputItemRefs.current[index] = el!}
    focusNext={() => {
      const nextInputItem = inputItemRefs.current[index + 1]
      if (nextInputItem) {
        nextInputItem.focus();
      }
    }}
  />;

  const items = () => (
    <>
      {form.values.items.map((value, index) => (
        <>
          {mobile ? <>
            {inputItem(index, value)}
            {index < form.values.items.length - 1 ? <Divider /> : <></>}
          </> :
            <div key={value.key} style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
            }}>
              {inputItem(index, value)}
            </div>}
        </>
      ))}
    </>
  );

  return (
    <Center p="md" pb={50}>
      <Stack>
        <Title>TipSplit</Title>
        <Text>Proportionally split tips, taxes, and fees.</Text>

        <Space />
        <Title order={4}>Receipt</Title>
        {items()}

        <Text>Subtotal: ${subtotal}</Text>

        <NumberInput
          label="Payment total"
          icon="$"
          min={0}
          precision={2}
          step={0.01}
          {...form.getInputProps("total")}
          onFocus={(e) => e.target.select()}
          style={{
            width: 120,
          }}
        />

        <Result
          items={form.values.items.map(item => ({ ...item, price: item.price * 100 }))}
          subtotal={subtotal * 100}
          total={form.values.total * 100}
        />
      </Stack>
    </Center>
  );
};

export default Home;
