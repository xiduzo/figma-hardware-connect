import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputProps, Label, Text } from "../";
import { useFormFieldError } from "./hooks/useFormFieldError";

export const FormInput: FC<Props> = ({ name, label, ...inputProps }) => {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-col">
      <Text dimmed>{label ?? name}</Text>
      {error && <Text isError>{error}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...inputProps}
            {...field}
            onChange={(event) =>
              field.onChange(
                inputProps.type === "number"
                  ? +event.target.value
                  : event.target.value,
              )
            }
            hasError={!!error}
          />
        )}
      />
    </Label>
  );
};

type Props = {
  name: string;
  label?: string;
} & InputProps;
