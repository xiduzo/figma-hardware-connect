import { zodResolver } from "@hookform/resolvers/zod";
import { ReactElement, useEffect } from "react";
import {
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { Button, FormCheckBox, FormInput } from "../components";
import { Fieldset } from "../components/form/Fieldset";
import { LOCAL_STORAGE_KEYS, useLocalStorage, useSetUiOptions } from "../hooks";
import { ZodFormProvider } from "../providers";
import { useMqtt } from "../providers/MqttProvider";

const schema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  username: z.string().optional(),
  password: z.string().optional(),
  saveSettings: z.boolean().default(false).optional(),
});

type Schema = z.infer<typeof schema>;

export function Home() {
  useSetUiOptions({ width: 300, height: 440 });

  const { connect, isConnected } = useMqtt();

  const navigate = useNavigate();
  const [localState, setLocalState] = useLocalStorage<Schema>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });

  const handleValid = async (data: Schema) => {
    try {
      await connect(data);
    } finally {
      setLocalState(data.saveSettings ? data : undefined);
    }
  };

  useEffect(() => {
    formMethods.reset(localState);
  }, [formMethods.reset, localState]);

  useEffect(() => {
    if (!isConnected) return;

    navigate("/mqtt/links");
  }, [isConnected]);

  return (
    <ZodFormProvider
      schema={schema}
      onValid={handleValid}
      onInvalid={console.log}
      defaultValues={localState}
    >
      <Fieldset>
        <FormInput name="host" placeholder="my.mqtt.broker" />
        <FormInput name="port" type="number" placeholder="1883" />
        <FormInput name="username" placeholder="username" />
        <FormInput name="password" type="password" placeholder="password" />
      </Fieldset>
      <Fieldset className="my-6">
        <FormCheckBox name="saveSettings" label="Store settings" />
      </Fieldset>
      <FormActions />
    </ZodFormProvider>
  );
}

function FormActions() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Fieldset className="mt-4">
      <Button className="mx-auto" disabled={isSubmitting}>
        Connect
      </Button>
    </Fieldset>
  );
}
