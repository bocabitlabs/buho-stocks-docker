import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getAxiosOptionsWithAuth } from "api/api-client";
import { IMarketFormFields } from "types/market";

interface UpdateMarketMutationProps {
  newMarket: IMarketFormFields;
  marketId: number;
}

export const fetchMarkets = async () => {
  const { data } = await axios.get(
    "/api/v1/markets/",
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const fetchMarket = async (marketId: number | undefined) => {
  if (!marketId) {
    throw new Error("marketId is required");
  }
  const { data } = await axios.get(
    `/api/v1/markets/${marketId}/`,
    getAxiosOptionsWithAuth(),
  );
  return data;
};

export const useAddMarket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newMarket: IMarketFormFields) =>
      axios.post("/api/v1/markets/", newMarket, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        // refetch the markets
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const useDeleteMarket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: number) =>
      axios.delete(`/api/v1/markets/${id}/`, getAxiosOptionsWithAuth()),
    {
      onSuccess: () => {
        // refetch the markets
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export const useUpdateMarket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ marketId, newMarket }: UpdateMarketMutationProps) =>
      axios.put(
        `/api/v1/markets/${marketId}/`,
        newMarket,
        getAxiosOptionsWithAuth(),
      ),
    {
      onSuccess: () => {
        // refetch the markets
        queryClient.invalidateQueries(["markets"]);
      },
    },
  );
};

export function useMarkets() {
  return useQuery("markets", fetchMarkets);
}

export function useMarket(marketId: number | undefined) {
  console.log(`Calling useMarket with marketId: ${marketId}`);
  return useQuery(["markets", marketId], () => fetchMarket(marketId), {
    // The query will not execute until the userId exists
    enabled: !!marketId,
  });
}

export default useMarkets;
