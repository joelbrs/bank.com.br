import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@repo/ui/components";
  import { Activity, DollarSign } from "lucide-react";
  import { RecentTransactions } from "./recent-transactions";
  import { ChartTransactions } from "./chart-transactions";
  
  export function DashboardPage(): JSX.Element {
    return (
      <main className="flex flex-col items-start justify-center px-8 p-6 gap-5">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Bem-vindo, Joel</h1>
            <h3 className="text-lg font-bold tracking-tight">
              Este é o acesso ao seu Dashboard
            </h3>
          </div>
          {/* <Loader2 className="w-5 h-5 animate-spin" /> */}
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
                  <div className="text-2xl font-bold">123456789</div>
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
                  <div className="text-2xl font-bold">$45,231.89</div>
                </CardContent>
              </Card>
            </div>
            <div>
              <ChartTransactions />
            </div>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Você realizou 249 transações no último mês.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }