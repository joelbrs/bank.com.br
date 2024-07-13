import { graphql, usePaginationFragment } from "react-relay";
import { recentTransactions_query$key } from "../../../../__generated__/recentTransactions_query.graphql";
import {
  RecentTransactionsQuery,
  RecentTransactionsQuery$data,
} from "../../../../__generated__/RecentTransactionsQuery.graphql";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components";

type Props = {
  query: RecentTransactionsQuery$data;
};

export function RecentTransactions(props: Props): JSX.Element {
  const { data } = usePaginationFragment<
    RecentTransactionsQuery,
    recentTransactions_query$key
  >(
    graphql`
      fragment recentTransactions_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 5 }
        after: { type: String }
      )
      @refetchable(queryName: "RecentTransactionsQuery") {
        transactions(first: $first, after: $after)
          @connection(key: "RecentTransactions_transactions", filters: []) {
          count
          edges {
            node {
              _id
              value
              receiver {
                accountNumber
                owner {
                  fullName
                }
              }
            }
          }
        }
      }
    `,
    props.query
  );

  const { transactions } = data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>
          Você realizou {transactions?.count || 0} transações no último mês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Destinatário</TableHead>
              <TableHead>Número da Conta do Desinatário</TableHead>
              <TableHead>Valor ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.edges?.map(({ node }) => (
              <TableRow key={node?._id}>
                <TableCell className="font-medium">
                  {node.receiver?.owner.fullName}
                </TableCell>
                <TableCell>{node.receiver?.accountNumber}</TableCell>
                <TableCell>+${Number(node.value).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
