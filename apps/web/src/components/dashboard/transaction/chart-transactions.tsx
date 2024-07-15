import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import { chartTransactionsMetricsQuery } from "../../../../__generated__/chartTransactionsMetricsQuery.graphql";

const metricsQuery = graphql`
  query chartTransactionsMetricsQuery {
    metrics {
      _id
      sent
      received
    }
  }
`;

const chartConfig = {
  received: {
    label: "Recebidas",
    color: "#00EDA3",
  },
  sent: {
    label: "Enviadas",
    color: "rgb(80% 22% 22%)",
  },
} satisfies ChartConfig;

export function ChartTransactions(): JSX.Element {
  const { metrics } = useLazyLoadQuery<chartTransactionsMetricsQuery>(
    metricsQuery,
    {}
  );

  const mapMonths = () => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    return metrics?.map((item, i) => ({ ...item, _id: months[i] }));
  };

  if (!metrics) {
    return <></>;
  }

  return (
    <>
      <h1 className="text-muted-foreground mb-3 ml-2">
        Análise Gráfica das Movimentações Financeiras
      </h1>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={mapMonths()}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="_id"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="sent"
            type="natural"
            fill="var(--color-sent)"
            fillOpacity={0.4}
            stroke="var(--color-sent)"
            stackId="a"
          />
          <Area
            dataKey="received"
            type="natural"
            fill="var(--color-received)"
            fillOpacity={0.4}
            stroke="var(--color-received)"
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </>
  );
}
