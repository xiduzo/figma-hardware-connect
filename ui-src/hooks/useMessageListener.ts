import { useEffect } from "react";
import { MESSAGE_TYPE, PluginMessage } from "../../common/Message";

export function useMessageListener<T extends any = any>(
  type: MESSAGE_TYPE,
  callback: (event: MessageEvent<PluginMessage<T>>) => void,
) {
  useEffect(() => {
    const handler = (event: MessageEvent<PluginMessage<T>>) => {
      if (event.data.pluginMessage.type !== type) return;

      callback(event);
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [type, callback]);
}
