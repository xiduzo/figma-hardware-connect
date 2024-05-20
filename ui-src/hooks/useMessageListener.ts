import { useEffect } from "react";
import { MESSAGE_TYPE, PluginMessage } from "../../common/Message";
import { typedPostMessage } from "../utils/window";

export function useMessageListener<T extends any = any>(
  type: MESSAGE_TYPE,
  callback: (payload: T | undefined) => void,
) {
  useEffect(() => {
    const handler = (event: MessageEvent<PluginMessage<T>>) => {
      if (event.data.pluginMessage.type !== type) return;

      callback(event.data.pluginMessage.payload);
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [type, callback]);

  function sendMessage(payload: T) {
    typedPostMessage({
      type,
      payload: payload as any,
    });
  }

  return sendMessage;
}
