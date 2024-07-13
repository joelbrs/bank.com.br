import { RecentTransactions } from "../../components/dashboard/transaction/recent-transactions";
import {
  graphql,
  useFragment,
  useLazyLoadQuery,
  useQueryLoader,
} from "react-relay";
import { dashboardAccount_account$key } from "../../../__generated__/dashboardAccount_account.graphql";
import { RecentTransactionsQuery } from "../../../__generated__/RecentTransactionsQuery.graphql";
import { DetailTransaction } from "../../components/dashboard/transaction/detail-transaction";
import {
  AccountNumberCard,
  BalanceCard,
  ChartTransactions,
  DashboardNavigation,
  LoadingSpinner,
  NewTransactionsCard,
} from "../../components";
import { Suspense } from "react";
import { dashboardDetailTransactionQuery } from "../../../__generated__/dashboardDetailTransactionQuery.graphql";

type Props = {
  account?: dashboardAccount_account$key | null;
};

const TransactionPage = graphql`
  query dashboardDetailTransactionQuery($_id: String!) {
    transaction(_id: $_id) {
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
`;

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

  const [queryReference, loadQuery] =
    useQueryLoader<dashboardDetailTransactionQuery>(TransactionPage);

  return (
    <main className="flex flex-col items-start justify-center px-8 p-6 gap-2">
      <DashboardNavigation />

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

      <section className="flex items-start justify-center gap-2 mt-5 flex-wrap sm:flex-nowrap w-full">
        <div className="w-full space-y-3">
          <div className="sm:grid sm:grid-cols-4 gap-3.5 space-y-5 sm:space-y-0 w-full">
            <NewTransactionsCard />
            <AccountNumberCard accountNumber={account?.accountNumber} />
            <BalanceCard balance={account?.balance} />
          </div>
          <div className="flex items-center gap-2">
            <RecentTransactions
              query={recentTransactionsQuery}
              onSelectRow={($event: string) => loadQuery({ _id: $event })}
            />
            {/* <ChartTransactions /> */}
          </div>
        </div>
        {queryReference && (
          <div className="sm:w-[40vw] w-full space-y-5">
            <Suspense fallback={<LoadingSpinner />}>
              <DetailTransaction
                queryReference={queryReference}
                query={TransactionPage}
              />
              <ChartTransactions />
            </Suspense>
          </div>
        )}
      </section>
    </main>
  );
}
