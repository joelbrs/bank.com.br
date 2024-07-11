import { useEffect, useState } from "react";
import { fetchQuery, graphql } from "relay-runtime";
import { environment } from "../../relay";
import { recentTransactionsQuery$data } from "../../../__generated__/recentTransactionsQuery.graphql";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";

type Transaction = {
  _id: string;
  value: string;
  receiver: {
    owner: {
      fullName: string;
      taxId: string;
    };
  };
};

export function RecentTransactions(): JSX.Element {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const query = graphql`
    query recentTransactionsQuery {
      transactions {
        count
        edges {
          node {
            _id
            value
            receiver {
              owner {
                fullName
                taxId
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetchQuery(environment, query, {}).subscribe({
      next: (values) => {
        const { transactions } = values as recentTransactionsQuery$data;
        const edges = transactions?.edges;

        if (edges) {
          const transactionList = edges?.map((item) => item?.node);

          setTransactions(transactionList as Transaction[]);
          setTotalTransactions(transactions.count as number);
        }
      },
    });
  };

  const formatDocument = (cpfCnpj: string) => {
    return `${cpfCnpj.slice(0, 3)}.***.***-${cpfCnpj.slice(9, 11)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>
          Você realizou {totalTransactions} transações no último mês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {transactions?.map(({ receiver, value, _id }) => (
            <div key={_id} className="flex items-center">
              <div className="space-y-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {receiver?.owner?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDocument(receiver?.owner?.taxId)}
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium">
                +${Number(value).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
