import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@repo/ui/components";
import {
  GraphQLTaggedNode,
  PreloadedQuery,
  usePreloadedQuery,
} from "react-relay";
import { dashboardDetailTransactionQuery } from "../../../../__generated__/dashboardDetailTransactionQuery.graphql";

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
        <div className="grid gap-3">
          <div className="font-semibold">Detalhes da Transação</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Valor</span>
              <span>${Number(transaction?.value).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Informações do Destinatário</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Nome Completo</dt>
              <dd>{transaction?.receiver?.owner.fullName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <span>{transaction?.receiver?.owner.fullName}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Número da Conta</dt>
              <dd>
                <span>{transaction?.receiver?.accountNumber}</span>
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
