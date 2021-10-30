import { Button, Form, Input, PageHeader } from "antd";
import { IRegistrationData } from "api/api-client";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const auth = useAuthContext();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    const devData = {
      username: "pepe",
      password: "ABCD12345!",
      password2: "ABCD12345!",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@fakeemail.com"
    };
    const data: IRegistrationData = {
      username: values.username? values.username : devData.username,
      password: values.password? values.password: devData.password,
      password2: values.password2? values.password2: devData.password2,
      first_name: values.firstName? values.firstName: devData.firstName,
      last_name: values.lastName? values.lastName: devData.lastName,
      email: values.email? values.email: devData.email
    };

    auth.register(data);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <PageHeader
        className="site-page-header-responsive"
        title="Buho Stocks"
        subTitle={t("Register")}
      >
        <Form.Item
          name="username"
          label={t("Username")}
          tooltip={t("What do you want others to call you?")}
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("E-mail")}
          rules={[
            {
              type: "email",
              message: t("The input is not valid E-mail")
            },
            {
              required: true,
              message: t("Please input your E-mail")
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("Password")}
          rules={[
            {
              required: true,
              message: t("Please input your password")
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password2"
          label={t("Confirm Password")}
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: t("Please confirm your password")
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("The two passwords that you entered do not match"))
                );
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="firstName"
          label={t("First Name")}
          tooltip={t("What do you want others to call you?")}
          rules={[
            {
              required: true,
              message: t("Please input your first name"),
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t("Last name")}
          tooltip={t("What is your last name?")}
          rules={[
            {
              required: true,
              message: t("Please input your last name"),
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Register")}
          </Button> {t("Already registered?")} <Link to="/app/login">sign in!</Link>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>{t("Dev register")}</Button>
        )}
      </PageHeader>
    </Form>
  );
};

export default RegisterForm;