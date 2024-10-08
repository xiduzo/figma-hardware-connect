import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../../../../common/Message";
import { Button, Fieldset, FormCheckBox, FormInput } from "../../../components";
import { useLocalStorage, useSetUiOptions } from "../../../hooks";
import {
  MqttConnection,
  ZodFormProvider,
  mqttConnection,
  useMqtt,
} from "../../../providers";
import { Header } from "../../_components/Header";

export function MqttSettings() {
  const { connect, isConnected } = useMqtt();
  const navigate = useNavigate();

  useSetUiOptions({ width: 275, height: 500 });

  const [localState, setLocalState] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const handleValid = async (data: MqttConnection) => {
    try {
      await connect(data);
      navigate(-1);
    } finally {
      setLocalState(data.autoConnect ? data : undefined);
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
          <FormInput
            name="host"
            disabled={isConnected}
            placeholder="my.mqtt.broker"
          />
          <FormInput
            name="port"
            disabled={isConnected}
            type="number"
            placeholder="1883"
          />
          <FormInput
            name="username"
            disabled={isConnected}
            placeholder="username"
          />
          <FormInput
            name="password"
            disabled={isConnected}
            type="password"
            placeholder="password"
          />
        </Fieldset>
        <Fieldset>
          <FormCheckBox
            name="autoConnect"
            disabled={isConnected}
            label="Store settings & automatically connect"
          />
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
  const { isConnected, disconnect } = useMqtt();

  return (
    <Fieldset>
      {!isConnected && (
        <Button type="submit" className="mx-auto" disabled={isSubmitting}>
          Connect
        </Button>
      )}
      {isConnected && (
        <Button type="button" className="mx-auto" onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
    </Fieldset>
  );
}
