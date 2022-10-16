import { Accordion, Center, List, NumberInput, Stack, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId, useMediaQuery } from '@mantine/hooks';
import type { NextPage } from 'next'
import { useEffect } from 'react';
import InputItem from '../components/input-item';
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

  const amountPerPerson = (person: string) => {
    const personSubtotal = form.values.items
      .filter(item => item.person == person)
      .map(item => item.price * item.quantity)
      .reduce((sum, value) => sum + value);
    const tip = form.values.total - subtotal;
    return personSubtotal + tip * (personSubtotal / subtotal);
  };

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const inputItem = (index: number, value: Item) => <InputItem
    index={index}
    form={form}
  />;

  const items = () => (
    <>
      {form.values.items.map((value, index) => (
        <div key={value.key} style={{
          display: "flex",
          flexDirection: "row",
          columnGap: 10,
        }}>
          {mobile ? <>
            <Accordion.Item value={value.key}>
              <Accordion.Control>
                {value.person || "New item"}
              </Accordion.Control>
              <Accordion.Panel>
                {inputItem(index, value)}
              </Accordion.Panel>
            </Accordion.Item>
          </> : inputItem(index, value)}
        </div>
      ))}
    </>
  );

  return (
    <Center p="md" pb={50}>
      <Stack>
        <h1>TipSplit</h1>
        <p>Proportionally split tips, taxes, and fees.</p>

        {mobile ? <>
          <Accordion chevronPosition="left" defaultValue={form.values.items[0].key}>
            {items()}
          </Accordion>
        </> : items()}

        <p>Subtotal: ${subtotal}</p>

        <NumberInput
          label="Payment total"
          icon={"$"}
          min={0}
          precision={2}
          step={0.01}
          {...form.getInputProps("total")}
          style={{
            width: 120,
          }}
        />

        <h3>Each person owes</h3>
        <List>
          {[...new Set(
            form.values.items
              .map(item => item.person)
              .filter(person => person != "")
          )]
            .map(person => (
              <List.Item key={person}>
                {person}: ${amountPerPerson(person)}
              </List.Item>
            ))}
        </List>
      </Stack>
    </Center>
  );
};

export default Home;
