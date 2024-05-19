import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label, Select, SelectProps, Text } from "../";
import { useFormFieldError } from "./hooks/useFormFieldError";

export const FormSelect: FC<Props> = ({ name, label, ...inputProps }) => {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-col space-y-0.5">
      <Text>{label ?? name}</Text>
      {error && <Text className="text-red-500 dark:text-red-500">{error}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Select {...inputProps} {...field} />}
      />
    </Label>
  );
};

type Props = {
  name: string;
  label?: string;
} & SelectProps;
