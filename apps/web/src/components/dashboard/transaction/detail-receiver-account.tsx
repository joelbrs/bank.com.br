import {
  GraphQLTaggedNode,
  PreloadedQuery,
  usePreloadedQuery,
} from "react-relay";
import { createTransactionModalQuery } from "../../../../__generated__/createTransactionModalQuery.graphql";

type Props = {
  queryReference: PreloadedQuery<createTransactionModalQuery>;
  query: GraphQLTaggedNode;
};

export function ResumeTransaction({
  query,
  queryReference,
}: Props): JSX.Element {
  const { account } = usePreloadedQuery(query, queryReference);

  return (
    <div className="col-span-3 space-y-2">
      <div className="font-semibold">Informações do Destinatário</div>
      <dl className="grid gap-3">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Nome Completo</dt>
          <dd>{account?.owner.fullName}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">E-mail</dt>
          <dd>
            <span>{account?.owner.email}</span>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Número da Conta</dt>
          <dd>
            <span>{account?.accountNumber}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
