import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";
import {
  GraphQLTaggedNode,
  PreloadedQuery,
  usePreloadedQuery,
} from "react-relay";
import { dashboardDetailTransactionQuery } from "../../../../../__generated__/dashboardDetailTransactionQuery.graphql";
import { InfoTransaction } from "../info-transactions";

type Props = {
  queryReference: PreloadedQuery<dashboardDetailTransactionQuery>;
  query: GraphQLTaggedNode;
};

export function DetailTransaction({
  queryReference,
  query,
}: Props): JSX.Element {
  const { transaction } = usePreloadedQuery(query, queryReference);

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Transação {transaction?._id}
          </CardTitle>
          <CardDescription>Data: 17 de julho de 2024</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <InfoTransaction
          account={transaction?.receiver}
          value={transaction?.value}
        />
      </CardContent>
    </Card>
  );
}
