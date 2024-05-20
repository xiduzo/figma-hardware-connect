import mqtt from "mqtt";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { FIGMA_VARIABLE_TYPE, Link } from "../../common/Link";
import {
  LOCAL_STORAGE_KEYS,
  MESSAGE_TYPE,
  SetValiable,
} from "../../common/Message";
import { useLocalStorage, useMessageListener } from "../hooks";
import { toBoolean } from "../utils/typeValidators";
import { typedPostMessage } from "../utils/window";

type Callback<T> = (message: T) => void;

type MqttContext = {
  isConnected: boolean;
  connect: (options: mqtt.IClientOptions) => Promise<void>;
  disconnect: (callback?: (error?: Error) => void) => void;
  publish: (topic: string, message: string) => void;
};

export const mqttConnection = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  username: z.string().optional(),
  password: z.string().optional(),
  autoConnect: z.boolean().default(false).optional(),
});

export type MqttConnection = z.infer<typeof mqttConnection>;

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

export function MqttProvider({ children }: PropsWithChildren) {
  const client = useRef<mqtt.MqttClient>();
  const [isConnected, setIsConnected] = useState(false);

  const [links, setLinks] = useLocalStorage<Link[]>(
    LOCAL_STORAGE_KEYS.MQTT_LINKS,
  );
  const [localState, setLocalState] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const subscriptions = useRef<Map<string, Callback<any>>>(new Map());

  const connect = async (options: mqtt.IClientOptions) => {
    const newClient = await mqtt.connectAsync({ ...options, protocol: "wss" });

    newClient.on("disconnect", () => {
      client.current = undefined;
      setIsConnected(false);
    });

    newClient.on("message", (topic, message) => {
      const callback = subscriptions.current.get(topic);
      console.log("recieved message", { topic, message, callback });
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

  const disconnect = useCallback(
    (callback?: (error?: Error) => void) => {
      client.current?.end((error) => {
        client.current = undefined;
        setIsConnected(false);
        callback?.(error);
      });
      setLocalState((prev) => prev && { ...prev, autoConnect: false });
    },
    [setLocalState],
  );

  const subscribe = useCallback(
    <T extends unknown>(topic: string, callback: Callback<T>) => {
      subscriptions.current.set(topic, callback);
      const subscription = client.current?.subscribe(topic);
      return () => {
        subscription?.unsubscribe(topic);
        return subscriptions.current.delete(topic);
      };
    },
    [],
  );

  const publish = useCallback((topic: string, message: string) => {
    client?.current?.publish(topic, message);
  }, []);

  useEffect(() => {
    const subscriptions = links?.map(({ topic, id, type }) =>
      subscribe(topic, (value) => {
        if (!id) return;

        switch (type) {
          case FIGMA_VARIABLE_TYPE.FLOAT:
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
      }),
    );

    return () => {
      subscriptions?.forEach((unsubscribe) => unsubscribe());
    };
  }, [links]);

  useEffect(() => {
    if (!localState?.autoConnect) return;

    connect(localState);
  }, [localState]);

  useMessageListener<Link[]>(MESSAGE_TYPE.LINKS_UPDATED, (links) => {
    setLinks(links);
  });

  return (
    <MqttContext.Provider value={{ publish, connect, disconnect, isConnected }}>
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt() {
  return useContext(MqttContext);
}
