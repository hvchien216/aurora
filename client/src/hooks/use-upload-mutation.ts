import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { customMutator } from "~/lib";

interface UploadPayload {
  file: File;
}

type Response = {
  key: string;
  url: string;
};

type Variables = UploadPayload;

function createUploadFormData(payload: Variables): FormData {
  const formData = new FormData();

  formData.append("file", payload.file);
  return formData;
}

export const useUploadMutation = <
  TData extends Response,
  TVariables extends Variables,
>(
  options?: Omit<
    UseMutationOptions<TData, any, TVariables>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation<TData, any, TVariables>({
    ...options,
    mutationKey: ["UPLOAD_IMAGE"],
    mutationFn: (variables: TVariables) => {
      const formData = createUploadFormData(variables);
      return customMutator<TData, FormData>("post", `/v1/upload`, formData, {
        headers: {},
      })();
    },
  });
};
