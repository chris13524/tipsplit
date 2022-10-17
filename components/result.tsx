import { List, Space, Title } from "@mantine/core";
import { NextPage } from "next";
import { Item } from "../lib/item";

const Result: NextPage<{ items: Item[], subtotal: number, total: number }> = ({ items, subtotal, total }) => {
    const persons = [...new Set(
        items
            .map(item => item.person)
            .filter(person => person != "")
    )];

    let remainingTotal = total;
    let remainingPercent = 1;
    const totals = Object.fromEntries(persons.map(person => {
        const personSubtotal = items
            .filter(item => item.person == person)
            .map(item => item.price * item.quantity)
            .reduce((sum, value) => sum + value);

        const percent = personSubtotal / subtotal;

        const exactOwe = remainingTotal * percent / remainingPercent;

        const truncatedOwe = Math.ceil(exactOwe);

        remainingTotal -= truncatedOwe;
        remainingPercent -= percent;

        return [person, truncatedOwe];
    }));

    return (
        <>
            <Space />
            <Title order={3}>Each person owes</Title>
            <List>
                {[...new Set(
                    items
                        .map(item => item.person)
                        .filter(person => person != "")
                )]
                    .map(person => (
                        <List.Item key={person}>
                            {person}: ${(totals[person] / 100).toFixed(2)}
                        </List.Item>
                    ))}
            </List>
        </>
    );
};

export default Result;
