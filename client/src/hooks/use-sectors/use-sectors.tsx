import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { axiosOptionsWithAuth } from "api/api-client";
import { ISectorFormFields } from "types/sector";

interface UpdateSectorMutationProps {
  newSector: ISectorFormFields;
  sectorId: number;
}

export const fetchSectors = async () => {
  const apiUrl = "/api/v1/sectors/";
  const { data } = await axios.get(apiUrl, axiosOptionsWithAuth);
  return data;
};

export const fetchSector = async (sectorId: number | undefined) => {
  if (!sectorId) {
    throw new Error("sectorId is required");
  }
  const apiUrl = "/api/v1/sectors/";
  const { data } = await axios.get(
    `${apiUrl}${sectorId}/`,
    axiosOptionsWithAuth,
  );
  return data;
};

export const useAddSector = () => {
  const queryClient = useQueryClient();
  const apiUrl = "/api/v1/sectors/";
  const cacheKey = "sectors";

  return useMutation(
    (newSector: ISectorFormFields) =>
      axios.post(apiUrl, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  const cacheKey = "sectors";
  const apiUrl = "/api/v1/sectors/";

  return useMutation(
    (id: number) => axios.delete(`${apiUrl}${id}/`, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export const useUpdateSector = () => {
  const queryClient = useQueryClient();
  const cacheKey = "sectors";
  const apiUrl = "/api/v1/sectors/";

  return useMutation(
    ({ sectorId, newSector }: UpdateSectorMutationProps) =>
      axios.put(`${apiUrl}${sectorId}/`, newSector, axiosOptionsWithAuth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([cacheKey]);
      },
    },
  );
};

export function useSectors() {
  const cacheKey = "sectors";

  return useQuery(cacheKey, fetchSectors);
}

export function useSector(sectorId: number | undefined) {
  const cacheKey = "sectors";

  return useQuery(cacheKey, () => fetchSector(sectorId), {
    // The query will not execute until the userId exists
    enabled: !!sectorId,
  });
}

export default useSectors;
