import { Center, NumberInput, Space, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks';
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
  };
}

const Home: NextPage = () => {
  const form = useForm({
    initialValues: {
      items: [makeNewItem()],
      total: 0,
    },
  });

  const subtotal100 = form.values.items
    .map(item => item.price * 100 * item.quantity)
    .reduce((sum, value) => sum + value);

  useEffect(() => {
    const filteredItems = form.values.items
      .filter(item => item.price > 0)
      .map(item => ({ ...item, person: item.person.trim() })); // auto-trim names
    const newItem = makeNewItem();

    const origionalKey = form.values.items[form.values.items.length - 1]?.key;
    const newKey = filteredItems[filteredItems.length - 1]?.key;
    if (origionalKey != newKey) {
      newItem.key = origionalKey;
    }

    form.setFieldValue("items", [...filteredItems, newItem]);

    if (subtotal100 > form.values.total * 100) {
      form.setFieldValue("total", Number((subtotal100 / 100).toFixed(2)));
    }
  }, [JSON.stringify(form.values.items)]);

  const inputItemRefs = useRef<InputItemRef[]>([]);

  const inputItem = (index: number, value: Item) => (
    <InputItem
      index={index}
      form={form}
      ref={el => inputItemRefs.current[index] = el!}
      focusNext={() => {
        const nextInputItem = inputItemRefs.current[index + 1]
        if (nextInputItem) {
          nextInputItem.focus();
        }
      }}
    />
  );

  return (
    <Center p="md" pb={50}>
      <Stack>
        <Title>TipSplit</Title>
        <Text>Proportionally split tips, taxes, and fees.</Text>

        <Space />
        <Title order={4}>Receipt</Title>
        {form.values.items.map((value, index) => (
          <div
            key={value.key}
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
            }}>
            {inputItem(index, value)}
          </div>
        ))}

        <Text>Subtotal: ${(subtotal100 / 100).toFixed(2)}</Text>

        <NumberInput
          label="Payment total"
          description="(including tips, taxes, and fees)"
          icon="$"
          min={0}
          precision={2}
          step={0.01}
          {...form.getInputProps("total")}
          onFocus={(e) => e.target.select()}
          styles={{
            wrapper: {
              width: 120,
            }
          }}
        />

        <Result
          items={form.values.items.map(item => ({ ...item, price: item.price }))}
          subtotal={subtotal100}
          total={form.values.total * 100}
        />
      </Stack>
    </Center>
  );
};

export default Home;
