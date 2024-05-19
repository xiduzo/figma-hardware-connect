import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CheckBox, CheckBoxProps, Label, Text } from "../";
import { useFormFieldError } from "./hooks/useFormFieldError";

export const FormCheckBox: FC<Props> = ({ name, label, ...checkBoxProps }) => {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-row space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CheckBox {...checkBoxProps} {...field} checked={field.value} />
        )}
      />

      <div>
        <Text>{label ?? name}</Text>
        {error && (
          <Text className="text-red-500 dark:text-red-500">{error}</Text>
        )}
      </div>
    </Label>
  );
};

type Props = {
  name: string;
  label?: string;
} & CheckBoxProps;
