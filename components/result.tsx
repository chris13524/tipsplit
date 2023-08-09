import { List, Space, Title } from "@mantine/core";
import { NextPage } from "next";
import { Item } from "../lib/item";

type ResultProps = {
  items: Item[],
  subtotal: number,
  total: number,
};

const getPersonSubtotal = (items: Item[], person: string) => items
  .filter(item => item.person == person)
  .map(item => item.price * 100 * item.quantity)
  .reduce((sum, value) => sum + value)

const Result: NextPage<ResultProps> = ({ items, subtotal, total }) => {
  const uniquePersons = [...new Set(
    items
      .map(item => item.person)
      .filter(person => person != "")
  )];

  // Sort persons by total item value
  // I think this ensures that any two people with the same total get the same split amount, and any extra penny get applied to someone of higher balance
  const persons = uniquePersons.sort((a, b) => getPersonSubtotal(items, a) - getPersonSubtotal(items, b));

  let remainingTotal = total;
  let remainingPercent = 1;
  const totals = Object.fromEntries(persons.map(person => {
    const personSubtotal = getPersonSubtotal(items, person);

    const percent = personSubtotal / subtotal;

    const exactOwe = remainingTotal * percent / remainingPercent;

    const truncatedOwe = Math.ceil(exactOwe);

    remainingTotal -= truncatedOwe;
    remainingPercent -= percent;

    return [person, truncatedOwe];
  }));

  return persons.length > 0 ? (
    <>
      <Space />
      <Title order={3}>Each person owes</Title>
      <List>
        {persons.map(person => (
          <List.Item key={person}>
            {person}: ${(totals[person] / 100).toFixed(2)}
          </List.Item>
        ))}
      </List>
    </>
  ) : <></>;
};

export default Result;
