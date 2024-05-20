import { Controller, useFormContext } from "react-hook-form";
import { CheckBox, CheckBoxProps, Label, Text } from "../";
import { useFormFieldError } from "./hooks/useFormFieldError";

export function FormCheckBox({ name, label, ...checkBoxProps }: Props) {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-row space-x-2 items-start">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CheckBox
            {...checkBoxProps}
            {...field}
            checked={field.value}
            className="mt-1.5"
          />
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
}

type Props = {
  name: string;
  label?: string;
} & CheckBoxProps;
