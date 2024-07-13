import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";
import { Activity, DollarSign } from "lucide-react";
import { RecentTransactions } from "./recent-transactions";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import { dashboardAccount_account$key } from "../../../__generated__/dashboardAccount_account.graphql";
import { RecentTransactionsQuery } from "../../../__generated__/RecentTransactionsQuery.graphql";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components";
import { Link } from "react-router-dom";
import { DetailTransaction } from "./detail-transaction";

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
    <main className="flex flex-col items-start justify-center px-8 p-6 gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={{ pathname: "/" }}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="flex items-center gap-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Bem-vindo, {account?.owner.fullName?.split(" ")[0]}!
          </h1>
          <h3 className="text-lg font-bold tracking-tight">
            Este é o acesso ao seu Dashboard
          </h3>
        </div>
      </section>

      <section className="flex items-start justify-center gap-2 mt-5 flex-wrap sm:flex-nowrap">
        <div className="w-full space-y-3">
          <div className="sm:grid sm:grid-cols-4 gap-3.5 space-y-5 sm:space-y-0 w-full">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Suas Transações</CardTitle>
                <CardDescription className="max-w-lg leading-relaxed">
                  Apresentando Nosso Dinâmico Dashboard de Transações para
                  Gestão e Análise Perspicaz
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Criar Nova Transação</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número da Conta
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </CardHeader>

              <CardContent>
                <div className="text-4xl font-bold">
                  {account?.accountNumber}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Atual
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-4xl font-bold">
                  ${Number(account?.balance).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <RecentTransactions query={recentTransactionsQuery} />
        </div>
        <div className="sm:w-[40vw] w-full">
          <DetailTransaction />
        </div>
      </section>
    </main>
  );
}
