import {
  GraphQLTaggedNode,
  PreloadedQuery,
  usePreloadedQuery,
} from "react-relay";
import { createTransactionModalQuery } from "../../../../../__generated__/createTransactionModalQuery.graphql";
import { toast } from "sonner";
import { InfoTransaction } from "../info-transactions";

type Props = {
  queryReference: PreloadedQuery<createTransactionModalQuery>;
  query: GraphQLTaggedNode;
  value: string | number;
  onNotFoundAccount: () => void;
};

export function ResumeTransaction({
  query,
  queryReference,
  value,
  onNotFoundAccount,
}: Props): JSX.Element {
  const { account } = usePreloadedQuery(query, queryReference);

  if (!account) {
    toast.warning("Atenção!", {
      description: "Conta não encontrada.",
    });
    onNotFoundAccount();
    return <></>;
  }

  return <InfoTransaction account={account} value={value} />;
}
