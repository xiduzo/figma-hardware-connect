import mqtt from "mqtt";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FIGMA_VARIABLE_TYPE, Link } from "../../common/Link";
import { SetValiable } from "../../common/Message";
import { LOCAL_STORAGE_KEYS, useLocalStorage } from "../hooks";
import { toBoolean } from "../utils/typeValidators";
import { typedPostMessage } from "../utils/window";

type Callback<T> = (message: T) => void;

type MqttContext = {
  isConnected: boolean;
  connect: (options: mqtt.IClientOptions) => Promise<void>;
  disconnect: (callback?: (error?: Error) => void) => void;
  publish: (topic: string, message: string) => void;
};

const MqttContext = createContext<MqttContext>({
  isConnected: false,
  connect: async () => {
    throw new Error("MqttProvider not found");
  },
  disconnect: () => {
    throw new Error("MqttProvider not found");
  },
  publish: () => {
    throw new Error("MqttProvider not found");
  },
});

export const MqttProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useRef<mqtt.MqttClient>();
  const [isConnected, setIsConnected] = useState(false);

  const [links] = useLocalStorage<Link[]>(LOCAL_STORAGE_KEYS.MQTT_LINKS);

  const subscriptions = useRef<Map<string, Callback<any>>>(new Map());

  const connect = async (options: mqtt.IClientOptions) => {
    const newClient = await mqtt.connectAsync({ ...options, protocol: "wss" });

    subscriptions.current.forEach((_, topic) => newClient.subscribe(topic));

    newClient.on("disconnect", () => {
      client.current = undefined;
      setIsConnected(false);
    });

    newClient.on("message", (topic, message) => {
      const callback = subscriptions.current.get(topic);
      if (!callback) return;

      try {
        callback(message.toString());
      } catch (error) {
        console.error("Nothing we can do", error);
      }
    });

    client.current = newClient;
    setIsConnected(true);
  };

  const disconnect = useCallback((callback?: (error?: Error) => void) => {
    client.current?.end((error) => {
      client.current = undefined;
      setIsConnected(false);
      callback?.(error);
    });
  }, []);

  const subscribe = useCallback(
    <T extends unknown>(topic: string, callback: Callback<T>) => {
      subscriptions.current.set(topic, callback);
      return () => subscriptions.current.delete(topic);
    },
    [],
  );

  const publish = useCallback((topic: string, message: string) => {
    client?.current?.publish(topic, message);
    console.log(`Publishing to ${topic}: ${message}`);
  }, []);

  useEffect(() => {
    console.log("subscribe to", { links });
    const subscriptions = links?.map(({ topic, id, type }) =>
      subscribe(topic, (value) => {
        if (!id) return;
        switch (type) {
          case FIGMA_VARIABLE_TYPE.NUMBER:
            typedPostMessage(SetValiable(id, Number(value)));
            break;
          case FIGMA_VARIABLE_TYPE.BOOLEAN:
            typedPostMessage(SetValiable(id, toBoolean(value)));
            break;
          case FIGMA_VARIABLE_TYPE.COLOR:
          case FIGMA_VARIABLE_TYPE.STRING:
          default:
            typedPostMessage(SetValiable(id, value));
        }
        //
      }),
    );

    return () => {
      subscriptions?.forEach((unsubscribe) => unsubscribe());
    };
  }, [links]);

  return (
    <MqttContext.Provider value={{ publish, connect, disconnect, isConnected }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
