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
    const totals = Object.fromEntries(persons.map(person => {
        const personSubtotal = items
            .filter(item => item.person == person)
            .map(item => item.price * item.quantity)
            .reduce((sum, value) => sum + value);

        const percent = personSubtotal / subtotal;

        // FIXME /() attempt actually causes us to do math on origional amount: `remainingTotal / (remainingTotal / total) == total`
        // Maybe something involving the 1/(4-1) ~~ 1/.25=4 ~~ 1/( 1/0.23 - ??)  =
        const exactOwe = remainingTotal * percent / (remainingTotal / total);

        const truncatedOwe = Math.ceil(exactOwe);

        remainingTotal -= truncatedOwe;
        console.log("remainingTotal", remainingTotal);

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
