import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";

export function NewTransactionsCard(): JSX.Element {
  return (
    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Suas Transações</CardTitle>
        <CardDescription className="max-w-lg leading-relaxed">
          Apresentando Nosso Dinâmico Dashboard de Transações para Gestão e
          Análise Perspicaz
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Criar Nova Transação</Button>
      </CardFooter>
    </Card>
  );
}
