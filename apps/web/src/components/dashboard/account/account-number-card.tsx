import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components";
import { Activity } from "lucide-react";

type Props = {
  accountNumber?: string;
};

export function AccountNumberCard({ accountNumber }: Props): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Número da Conta</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground hidden sm:block" />
      </CardHeader>

      <CardContent>
        <div className="text-4xl font-bold">{accountNumber}</div>
      </CardContent>
    </Card>
  );
}
