/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import currenciesList from "./responses/currencies";

export const handlers = [
  rest.get("/api/v1/currencies/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(currenciesList));
  }),
];

export default handlers;