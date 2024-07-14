import { graphql, usePaginationFragment } from "react-relay";
import { recentTransactions_query$key } from "../../../../../__generated__/recentTransactions_query.graphql";
import {
  RecentTransactionsQuery,
  RecentTransactionsQuery$data,
} from "../../../../../__generated__/RecentTransactionsQuery.graphql";
import {
  Button,
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
import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  query: RecentTransactionsQuery$data;
  onSelectRow: (transactionId: string) => void;
};

export function RecentTransactions(props: Props): JSX.Element {
  const [selected, setSelected] = useState<string | undefined>();

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

  const isSelected = (id: string) => {
    return id === selected;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        {transactions?.count ? (
          <CardDescription>
            Você realizou {transactions?.count} transações.
          </CardDescription>
        ) : (
          <></>
        )}
      </CardHeader>
      <CardContent>
        {transactions?.count ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Destinatário</TableHead>
                <TableHead>Valor ($)</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.edges?.map(({ node }) => (
                <TableRow
                  className={isSelected(node?._id) ? "bg-muted/50" : ""}
                  key={node?._id}
                >
                  <TableCell className="font-medium">
                    {node.receiver?.owner.fullName}
                  </TableCell>
                  <TableCell>${Number(node.value).toFixed(2)}</TableCell>
                  <TableCell className="text-end">
                    <Button
                      variant="outline"
                      size="sm"
                      title="Detalhar Transação"
                      onClick={() => {
                        props.onSelectRow(node?._id);
                        setSelected(node?._id);
                      }}
                      disabled={isSelected(node?._id)}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Nenhuma transação foi encontrada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
