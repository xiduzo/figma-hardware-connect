import { Message, PluginMessage } from "../../common/Message";

export function typedPostMessage(
  message: Message,
  targetOrigin = "*",
  transfer?: Transferable[],
) {
  parent.postMessage(
    { pluginMessage: message } satisfies PluginMessage,
    targetOrigin,
    transfer,
  );
}
