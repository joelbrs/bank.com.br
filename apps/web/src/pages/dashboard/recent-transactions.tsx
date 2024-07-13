import { graphql, usePaginationFragment } from "react-relay";
import { recentTransactions_query$key } from "../../../__generated__/recentTransactions_query.graphql";
import {
  RecentTransactionsQuery,
  RecentTransactionsQuery$data,
} from "../../../__generated__/RecentTransactionsQuery.graphql";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
        <div className="space-y-5">
          {transactions?.edges?.map(({ node }) => (
            <div key={node?._id} className="flex items-center">
              <div className="space-y-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {node.receiver?.owner.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {node.receiver?.accountNumber}
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium">
                +${Number(node.value).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
