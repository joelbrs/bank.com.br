import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components";
import { Activity, DollarSign } from "lucide-react";
import { RecentTransactions } from "./recent-transactions";
import { ChartTransactions } from "./chart-transactions";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import { dashboardAccount_account$key } from "../../../__generated__/dashboardAccount_account.graphql";
import { RecentTransactionsQuery } from "../../../__generated__/RecentTransactionsQuery.graphql";

type Props = {
  account?: dashboardAccount_account$key | null;
};

export function DashboardPage(props: Props): JSX.Element {
  const account = useFragment<dashboardAccount_account$key>(
    graphql`
      fragment dashboardAccount_account on Account {
        balance
        accountNumber
        owner {
          fullName
          taxId
        }
      }
    `,
    props.account
  );

  const recentTransactionsQuery = useLazyLoadQuery<RecentTransactionsQuery>(
    graphql`
      query dashboardRecentTransactionsQuery {
        ...recentTransactions_query
      }
    `,
    {}
  );

  return (
    <main className="flex flex-col items-start justify-center px-8 p-6 gap-5">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Bem-vindo, {account?.owner.fullName?.split(" ")[0]}!
          </h1>
          <h3 className="text-lg font-bold tracking-tight">
            Este é o acesso ao seu Dashboard
          </h3>
        </div>
      </div>

      <div className="flex items-start justify-center w-full gap-2 sm:flex-nowrap flex-wrap">
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 w-full">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número da Conta
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {account?.accountNumber}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Atual
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  ${Number(account?.balance).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <ChartTransactions />
          </div>
        </div>
        <RecentTransactions query={recentTransactionsQuery} />
      </div>
    </main>
  );
}
