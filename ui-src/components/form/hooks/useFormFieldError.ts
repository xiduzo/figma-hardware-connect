import { useFormContext } from "react-hook-form";

export const useFormFieldError = (name: string) => {
  const { formState } = useFormContext();

  return formState.errors?.[name]?.message?.toString();
};
