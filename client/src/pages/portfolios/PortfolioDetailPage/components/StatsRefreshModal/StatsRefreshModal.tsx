import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useSettings } from "hooks/use-settings/use-settings";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";
import { useUpdatePortfolioYearStatsForced } from "hooks/use-stats/use-portfolio-stats";
import { useUpdateCompanyStockPrice } from "hooks/use-stock-prices/use-stock-prices";
import { ICompanyListItem } from "types/company";

interface Props {
  id: string | undefined;
  selectedYear: string;
  companies: ICompanyListItem[];
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

export default function StatsRefreshModal({
  id,
  selectedYear,
  companies,
}: Props): ReactElement {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxValueType[]>([]);
  const { data: settings } = useSettings();

  useEffect(() => {
    const tempCheckboxes = companies.map((company: ICompanyListItem) => {
      return `${company.name} (${company.ticker}) - #${company.id}`;
    });
    setCheckboxes(tempCheckboxes);
  }, [companies]);

  const { mutateAsync: updateStockPrice } = useUpdateCompanyStockPrice();
  const { mutateAsync: updateCompanyStats } = useUpdateYearStats();
  const { mutateAsync: updatePortfolioStats } =
    useUpdatePortfolioYearStatsForced();

  const showModal = () => {
    setVisible(true);
  };
  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? checkboxes : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = (checkedValue: CheckboxValueType[]) => {
    setCheckedList(checkedValue);
    setIndeterminate(
      !!checkedValue.length && checkedValue.length < checkboxes.length,
    );
    setCheckAll(checkedValue.length === checkboxes.length);
  };

  const getStatsForced = useCallback(
    async (companyId: string, companyName: string) => {
      setUpdateMessage(`${t("Updating stats for company")} #${companyId}`);
      try {
        await updateCompanyStats({
          companyId: +companyId,
          year: selectedYear,
          forced: updateStockPriceSwitch,
        });
        setUpdateMessage(
          `${t("Stats updated for company")}: ${companyName} ${t(
            "and year",
          )} ${selectedYear}`,
        );
      } catch (e) {
        setUpdateMessage(
          `${t("Error updating stats for company")}: ${companyName} ${t(
            "and year",
          )} ${selectedYear}`,
        );
      }
    },
    [selectedYear, t, updateCompanyStats, updateStockPriceSwitch],
  );

  const getCompanyStockPrice = useCallback(
    async (
      companyId: string,
      companyName: string,
      itemIndex: number,
      companiesLength: number,
    ) => {
      let tempYear = selectedYear;
      if (selectedYear === "all") {
        tempYear = new Date().getFullYear().toString();
      }
      setUpdateMessage(
        `${t("Updating price for company")}: ${companyName} (${
          itemIndex + 1
        }/${companiesLength})`,
      );
      try {
        await updateStockPrice({ companyId: +companyId, year: tempYear });
        setUpdateMessage(
          `${t("Price updated for company")}: ${companyName} ${t(
            "and year",
          )} ${tempYear}`,
        );
      } catch (e) {
        setUpdateMessage(
          `${t("Error updating price for company")}: ${companyName} ${t(
            "and year",
          )} ${t(tempYear)}`,
        );
      }
    },
    [selectedYear, t, updateStockPrice],
  );

  const updatePortfolioStatsForced = useCallback(async () => {
    setUpdateMessage(
      `${t("Updating stats for portfolio")} #${id} ${t("and year")} ${t(
        selectedYear,
      )}`,
    );
    try {
      await updatePortfolioStats({ portfolioId: +id!, year: selectedYear });
      setUpdateMessage(
        `${t("Stats updated for portfolio")} #${id} ${t("and year")} ${t(
          selectedYear,
        )}`,
      );
    } catch (e) {
      setUpdateMessage(
        `${t("Error updating stats for portfolio")} #${id} ${t("and year")} ${t(
          selectedYear,
        )}`,
      );
    }
  }, [t, id, selectedYear, updatePortfolioStats]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let companyId;
    if (updateStockPriceSwitch) {
      console.log("Will update stock price");
      await asyncForEach(
        checkedList,
        async (checkboxName: string, index: number) => {
          // eslint-disable-next-line prefer-destructuring
          companyId = checkboxName.split("-")[1].split("#")[1];
          await getCompanyStockPrice(
            companyId,
            checkboxName,
            index,
            checkedList.length,
          );
        },
      );
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await asyncForEach(checkedList, async (checkboxName: string) => {
        // eslint-disable-next-line prefer-destructuring
        companyId = checkboxName.split("-")[1].split("#")[1];
        await getStatsForced(companyId, checkboxName);
      });
      setConfirmLoading(false);
    }
    await updatePortfolioStatsForced();
    setConfirmLoading(false);
    onCheckAllChange({ target: { checked: false } });
    setUpdateStockPriceSwitch(false);
    setUpdateStatsSwitch(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const onStatsChange = (e: any) => {
    setUpdateStatsSwitch(e.target.checked);
  };

  const handleFormSubmit = async () => {
    try {
      await handleOk();
      form.resetFields();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  return (
    <>
      <Button
        htmlType="button"
        type="text"
        onClick={showModal}
        icon={<SyncOutlined />}
      />
      <Modal
        title={`${t("Refresh stats and stock prices for")} &quot;${t(
          selectedYear,
        )}&quot;`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={`${t("Update stats")}`}
        cancelText={`${t("Close")}`}
        onOk={handleFormSubmit}
        cancelButtonProps={{ disabled: confirmLoading }}
        closable={!confirmLoading}
      >
        <Form form={form} layout="vertical">
          {t("For each company:")}
          {settings && settings.allowFetch && (
            <Form.Item
              name="updateStockPrice"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox onChange={onStockPriceChange}>
                {t("Update the stock price from API")}
              </Checkbox>
            </Form.Item>
          )}
          <Form.Item name="updateStats" valuePropName="checked">
            <Checkbox onChange={onStatsChange}>
              {t("Update the stats for the year")} &quot;{t(selectedYear)}&quot;
            </Checkbox>
          </Form.Item>
          <Typography.Title level={5}>
            {t("Select the companies to update")}
          </Typography.Title>
          <Form.Item>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              {t("Check all")}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="companies"
            style={{ marginBottom: 10 }}
            valuePropName="checked"
          >
            <Checkbox.Group onChange={onChange} value={checkedList}>
              {checkboxes.map((company) => (
                <div key={company.toString()}>
                  <Checkbox value={company}>{company}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Typography.Paragraph>{updateMessage}</Typography.Paragraph>
        </Form>
      </Modal>
    </>
  );
}
