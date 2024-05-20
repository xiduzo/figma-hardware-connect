import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Text, Title } from "../components";
import { ConnectionIndicator } from "../components/ConnectionIndicator";
import { IconButton } from "../components/IconButton";
import { useSetUiOptions } from "../hooks";
import { useMqtt } from "../providers";

export function Home() {
  useSetUiOptions({
    width: 300,
    height: 300,
  });
  return (
    <section className="space-y-5">
      <section className="text-center">
        <Title>Figma hardware linker</Title>
        <Text dimmed>made with ♥️ by xiduzo</Text>
      </section>
      <MqttSection />
      <section>
        <Title as="h2">Serial</Title>
        <Text dimmed>next release</Text>
      </section>
      <section>
        <Title as="h2">Bluetooth</Title>
        <Text dimmed>who knows...</Text>
      </section>
    </section>
  );
}

function MqttSection() {
  const navigate = useNavigate();
  const { isConnected, disconnect } = useMqtt();

  return (
    <section className="space-y-1">
      <section className="flex justify-between items-center">
        <ConnectionIndicator isConnected={isConnected}>
          <Title as="h2">Mqtt</Title>
        </ConnectionIndicator>
        <ButtonGroup>
          {isConnected && (
            <IconButton icon="SignalSlashIcon" onClick={() => disconnect()} />
          )}
          <IconButton
            icon="CogIcon"
            onClick={() => navigate("/mqtt/settings")}
          />
        </ButtonGroup>
      </section>
      <section>
        <Button onClick={() => navigate("/mqtt/links")}>Manage links</Button>
      </section>
    </section>
  );
}
