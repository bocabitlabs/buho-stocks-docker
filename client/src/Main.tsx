import React, { ReactElement } from "react";
import { QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import queryClient from "api/query-client";
import App from "App";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import SetupAxios from "components/SetupAxios/SetupAxios";
import getRoute, { HOME_ROUTE } from "routes";

const BenchmarksListPage = React.lazy(
  () => import("pages/benchmarks/BenchmarksListPage/BenchmarksListPage"),
);

const CompanyDetailsPage = React.lazy(
  () => import("pages/companies/CompanyDetailsPage/CompanyDetailsPage"),
);
const CurrenciesListPage = React.lazy(
  () => import("pages/currencies/CurrenciesListPage/CurrenciesListPage"),
);
const ExchangeRatesListPage = React.lazy(
  () =>
    import("pages/exchange-rates/ExchangeRatesListPage/ExchangeRatesListPage"),
);
const ImportExportPage = React.lazy(
  () => import("pages/ImportExportPage/ImportExportPage"),
);
const ImportFromBrokerPage = React.lazy(
  () => import("pages/ImportFromBrokerPage/ImportFromBrokerPage"),
);
const MarketsListPage = React.lazy(
  () => import("pages/markets/MarketsListPage/MarketsListPage"),
);
const PortfolioDetailsPage = React.lazy(
  () => import("pages/portfolios/PortfolioDetailPage/PortfolioDetailsPage"),
);
const PortfolioChartsPage = React.lazy(
  () => import("pages/portfolios/PorfolioChartsPage/PortfolioChartsPage"),
);
const PortfoliosListPage = React.lazy(
  () => import("pages/portfolios/PortfoliosListPage/PortfoliosListPage"),
);
const PortfolioTransactionsLogPage = React.lazy(
  () =>
    import(
      "pages/portfolios/PortfolioTransactionsLogPage/PortfolioTransactionsLogPage"
    ),
);
const SectorsListPage = React.lazy(
  () => import("pages/sectors/SectorsListPage/SectorsListPage"),
);
const SettingsPage = React.lazy(
  () => import("pages/settings/SettingsPage/SettingsPage"),
);

export default function Main(): ReactElement {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={<LoadingSpin />}>
          <BrowserRouter>
            <SetupAxios />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<App />}>
                <Route
                  path=""
                  element={<Navigate to={getRoute(HOME_ROUTE)} />}
                />
                <Route path="home" element={<PortfoliosListPage />} />
                <Route path="benchmarks" element={<BenchmarksListPage />} />
                <Route
                  path="exchange-rates"
                  element={<ExchangeRatesListPage />}
                />
                <Route path="import-export" element={<ImportExportPage />} />
                <Route
                  path="import/:brokerId"
                  element={<ImportFromBrokerPage />}
                />
                <Route
                  path="portfolios/:id"
                  element={<PortfolioDetailsPage />}
                />
                <Route
                  path="portfolios/:id/log/*"
                  element={<PortfolioTransactionsLogPage />}
                />
                <Route
                  path="portfolios/:id/charts/*"
                  element={<PortfolioChartsPage />}
                />
                <Route
                  path="portfolios/:id/companies/:companyId"
                  element={<CompanyDetailsPage />}
                />
                <Route path="currencies" element={<CurrenciesListPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="sectors" element={<SectorsListPage />} />
                <Route path="markets" element={<MarketsListPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      </QueryClientProvider>
      <ToastContainer position="top-center" theme="colored" newestOnTop />
    </>
  );
}
