import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components";

export function TransactionNotFound(): JSX.Element {
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Detalhe de Transação
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm text-center">
        Nenhuma Transação foi selecionada.
      </CardContent>
    </Card>
  );
}
