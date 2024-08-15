import { useMemo } from "react";
import { BarChart } from "@mantine/charts";
import i18next from "i18next";
import { IPortfolioYearStats } from "types/portfolio-year-stats";

interface ChartProps {
  data: IPortfolioYearStats[];
  currency: string;
}

export default function ChartInvestedByCompanyYearly({
  data,
  currency,
}: ChartProps) {
  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const filteredData = useMemo(
    function createChartData() {
      const filteredCompanies: IPortfolioYearStats[] = data.filter(
        (item: IPortfolioYearStats) => {
          return item.sharesCount > 0 && item.invested > 0;
        },
      );

      const companies: {
        company: string;
        value: number;
      }[] = [];

      filteredCompanies.forEach((stat: IPortfolioYearStats) => {
        companies.push({
          company: stat.company.ticker,
          value: Number(stat.invested),
        });
      });

      companies.sort(
        (
          a: { company: string; value: number },
          b: { company: string; value: number },
        ) => b.value - a.value,
      );

      return companies;
    },
    [data],
  );

  return (
    <BarChart
      h={400}
      data={filteredData}
      dataKey="company"
      series={[{ name: "value", color: "red" }]}
      valueFormatter={(value: number) =>
        `${numberFormatter.format(value)} ${currency}`
      }
      xAxisProps={{
        angle: -45,
        interval: 0,
        textAnchor: "end",
        height: 50,
        tickSize: 10,
        transform: "translate(-10, 0)",
      }}
    />
  );
}
