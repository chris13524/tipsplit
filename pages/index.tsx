import { Center, Divider, NumberInput, Space, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks';
import type { NextPage } from 'next'
import InputPerson from '../components/person';
import { Person } from '../lib/person';

export type FormType = {
  persons: Person[],
  total: number,
};

function personName(index: number): string {
  return `Person ${index + 1}`;
}

function itemName(index: number): string {
  return `Item ${index + 1}`;
}

const Home: NextPage = () => {
  const form = useForm<FormType>({
    initialValues: {
      persons: [{
        key: randomId(),
        name: personName(0),
        items: [{
          key: randomId(),
          name: itemName(0),
          price: 0,
        }],
      }, {
        key: randomId(),
        name: personName(1),
        items: [{
          key: randomId(),
          name: itemName(0),
          price: 0,
        }],
      }],
      total: 0,
    },
  });

  const subtotal = form.values.persons
    .flatMap(person => person.items.map(item => item.price))
    .reduce((sum, price) => sum + price);

  return (
    <Center p="md" pb={50}>
      <Stack>
        <Title>TipSplit</Title>
        <Text>Proportionally split tips, taxes, and fees.</Text>

        <Space />
        <Title order={4}>Receipt</Title>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto",
          gridAutoRows: "auto",
          gap: 10,
        }}>
          <Divider
            color="red"
            style={{
              gridColumn: "1 / 5",
            }} />
          {form.values.persons.map((person, index) => (
            <InputPerson key={person.key} index={index} form={form} />
          ))}

          <Text style={{
            gridColumn: "1 / 3",
          }}>
            Subtotal
          </Text>
          <Text style={{
            gridColumn: "3 / 5",
          }}>
            {subtotal}
          </Text>

          <Text style={{
            gridColumn: "1 / 3",
          }}>
            Payment total
          </Text>
          <NumberInput
            icon="$"
            min={0}
            precision={2}
            step={0.01}
            onFocus={(e) => e.target.select()}
            {...form.getInputProps("total")}
            style={{
              gridColumn: "3 / 5",
              width: 120,
            }}
          />
        </div>
      </Stack>
    </Center>
  );
};

export default Home;
