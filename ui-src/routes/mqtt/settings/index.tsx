import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Fieldset, FormCheckBox, FormInput } from "../../../components";
import {
  LOCAL_STORAGE_KEYS,
  useLocalStorage,
  useSetUiOptions,
} from "../../../hooks";
import {
  MqttConnection,
  ZodFormProvider,
  mqttConnection,
  useMqtt,
} from "../../../providers";
import { Header } from "../../_components/Header";

export function MqttSettings() {
  const { connect } = useMqtt();
  const navigate = useNavigate();

  useSetUiOptions({ width: 300, height: 500 });

  const [localState, setLocalState] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const handleValid = async (data: MqttConnection) => {
    try {
      await connect(data);
      navigate(-1);
    } finally {
      setLocalState(data.saveSettings ? data : undefined);
    }
  };

  return (
    <div>
      <Header title="Mqtt connection settings" />
      <ZodFormProvider
        schema={mqttConnection}
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
        <Fieldset>
          <FormCheckBox name="saveSettings" label="Store settings" />
          <FormCheckBox name="autoConnect" label="Automatically connect" />
        </Fieldset>
        <FormActions />
      </ZodFormProvider>
    </div>
  );
}

function FormActions() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Fieldset>
      <Button className="mx-auto" disabled={isSubmitting}>
        Connect
      </Button>
    </Fieldset>
  );
}
