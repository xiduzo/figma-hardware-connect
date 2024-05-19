import { useCallback, useEffect, useState } from "react";
import {
  GetLocalStateValue,
  MESSAGE_TYPE,
  PluginMessage,
  SetLocalStateValue,
} from "../../common/Message";
import { typedPostMessage } from "../utils/window";

export enum LOCAL_STORAGE_KEYS {
  MQTT_LINKS = "MQTT_LINKS",
  MQTT_CONNECTION = "MQTT_CONNECTION",
}

export function useLocalStorage<T>(key: LOCAL_STORAGE_KEYS, initialValue?: T) {
  const [state, setState] = useState(initialValue);

  const setLocalState = useCallback(
    (update: T | undefined) =>
      typedPostMessage(SetLocalStateValue(key, update)),
    [key],
  );

  useEffect(() => {
    typedPostMessage(GetLocalStateValue(key, initialValue));
  }, [key]);

  useEffect(() => {
    const handleEvent = ({
      data: { pluginMessage },
    }: MessageEvent<PluginMessage<{ key: LOCAL_STORAGE_KEYS; value: T }>>) => {
      const correctType = [
        MESSAGE_TYPE.GET_LOCAL_STATE_VALUE,
        MESSAGE_TYPE.SET_LOCAL_STATE_VALUE,
      ].includes(pluginMessage.type);

      if (!correctType) return;

      if (!pluginMessage.payload) return;
      if (pluginMessage.payload.key !== key) return;

      setState(pluginMessage.payload.value);
    };

    window.addEventListener("message", handleEvent);

    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, [initialValue, state, key]);

  return [state, setLocalState] as const;
}
