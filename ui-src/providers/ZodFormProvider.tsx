import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useEffect } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
  useForm,
} from "react-hook-form";
import { ZodType, ZodTypeDef, z } from "zod";

export function ZodFormProvider({
  schema,
  onValid,
  onInvalid,
  children,
  ...useFormProps
}: Props) {
  const formMethods = useForm({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    ...useFormProps,
  });

  useEffect(() => {
    if (!useFormProps.defaultValues) return;

    formMethods.reset(useFormProps.defaultValues as FieldValues);
  }, [formMethods.reset, useFormProps.defaultValues]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onValid, onInvalid)}
        className="space-y-4"
      >
        {children}
      </form>
    </FormProvider>
  );
}

// TODO: this typing should be improved
// to do actual typing support you know...
type Props<
  Output extends FieldValues = Record<string, unknown>,
  Schema extends ZodType<Output, ZodTypeDef> = ZodType<Output, ZodTypeDef>,
> = PropsWithChildren & {
  schema: Schema;
  onValid: (data: any) => void | Promise<void>;
  onInvalid: SubmitErrorHandler<Output>;
} & Omit<UseFormProps<z.infer<Schema>>, "resolver">;
