import { Center, Grid, List, NumberInput, Select, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks';
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

type Item = {
  person: string,
  price: number,
  quantity: number,
  note: string,
  key: string,
};

function makeNewItem(): Item {
  return {
    person: "",
    price: 0,
    quantity: 1,
    note: "",
    key: randomId(),
  };
}

const Home: NextPage = () => {
  const form = useForm({
    initialValues: {
      items: [makeNewItem()],
      total: 0,
    },
  });

  const [persons, setPersons] = useState([] as string[]);

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

  return (
    <Center>
      <Grid>
        <Grid.Col>
          {form.values.items.map((value, index) => (
            <div key={value.key} style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
            }}>
              <Select
                placeholder="Person"
                nothingFound="Nothing found"
                searchable
                creatable
                data={persons}
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  const item = query;
                  setPersons((current) => [...current, item]);
                  return item;
                }}
                {...form.getInputProps(`items.${index}.person`)}
                style={{
                  width: 120,
                }}
              />
              <NumberInput
                icon={"$"}
                min={0}
                precision={2}
                step={0.01}
                {...form.getInputProps(`items.${index}.price`)}
                style={{
                  width: 120,
                }}
              />
              <NumberInput
                min={1}
                icon={"x"}
                {...form.getInputProps(`items.${index}.quantity`)}
                style={{
                  width: 100,
                }} />
              <TextInput
                placeholder="Note"
                {...form.getInputProps(`items.${index}.note`)}
                style={{
                  width: 100,
                }}
              />
            </div>
          ))}
          Subtotal: ${subtotal}
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
        </Grid.Col>
        <Grid.Col>
          <Title>
            {"->"}
          </Title>
        </Grid.Col>
        <Grid.Col>
          <List>
            {persons.map(person => (
              <List.Item key={person}>
                {person}: ${amountPerPerson(person)}
              </List.Item>
            ))}
          </List>
        </Grid.Col>
      </Grid>
    </Center>
  );
};

export default Home;
