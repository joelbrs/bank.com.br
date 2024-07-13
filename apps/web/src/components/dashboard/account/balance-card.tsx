import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components";
import { DollarSign } from "lucide-react";

type Props = {
  balance?: string;
};

export function BalanceCard({ balance }: Props): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="text-4xl font-bold">${Number(balance).toFixed(2)}</div>
      </CardContent>
    </Card>
  );
}
