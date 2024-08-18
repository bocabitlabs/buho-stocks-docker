import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ChartCurrenciesByCompany from "./ChartCurrenciesByCompany";
import { usePortfolioYearStatsByCompany } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  selectedYear: string;
}

const ChartCurrenciesByCompanyProvider = ({ selectedYear }: Props) => {
  const { t } = useTranslation();

  const { id } = useParams();
  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = usePortfolioYearStatsByCompany(+id!, selectedYear);
  const { ref, width } = useElementSize();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>{error.message ? error.message : t("An error occurred")}</div>;
  }

  if (statsData) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Currencies")}</Title>
        </Center>
        <Center ref={ref}>
          <ChartCurrenciesByCompany data={statsData} width={width} />
        </Center>
      </Stack>
    );
  }
  return null;
};

export default ChartCurrenciesByCompanyProvider;
