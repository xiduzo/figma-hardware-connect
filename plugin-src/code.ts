import { Link } from "../common/Link";
import {
  CreateLink,
  GetLocalStateValue,
  LinksUpdated,
  LOCAL_STORAGE_KEYS,
  Message,
  MESSAGE_TYPE,
  SetLocalStateValue,
  UpdateLink,
} from "../common/Message";

const defaultUiSize: Pick<ShowUIOptions, "width" | "height"> = {
  height: 300,
  width: 440,
};

async function linksWhichAreStillInVariables(links: Link[]) {
  const [collection] = await figma.variables.getLocalVariableCollectionsAsync();
  return links.filter((link) =>
    collection.variableIds.find((id) => id === link.id),
  );
}

figma.showUI(__html__, {
  width: defaultUiSize.width,
  height: defaultUiSize.height,
  themeColors: true,
});

figma.ui.onmessage = async (message: Message) => {
  const { type, payload } = message;
  switch (type) {
    case MESSAGE_TYPE.SET_UI_OPTIONS: {
      figma.ui.resize(
        payload.width || defaultUiSize.width!,
        payload.height || defaultUiSize.height!,
      );
      break;
    }

    case MESSAGE_TYPE.GET_LOCAL_STATE_VALUE: {
      const localState = await figma.clientStorage.getAsync(payload.key);
      if (payload.key !== LOCAL_STORAGE_KEYS.MQTT_LINKS) {
        figma.ui.postMessage(GetLocalStateValue(payload.key, localState));
        break;
      }

      const links = localState as Link[] | undefined;
      if (!links) {
        figma.ui.postMessage(GetLocalStateValue(payload.key, localState));
        break;
      }

      const filteredLinks = await linksWhichAreStillInVariables(links);

      await figma.clientStorage.setAsync(
        LOCAL_STORAGE_KEYS.MQTT_LINKS,
        filteredLinks,
      );

      figma.ui.postMessage(GetLocalStateValue(payload.key, filteredLinks));
      break;
    }

    case MESSAGE_TYPE.SET_LOCAL_STATE_VALUE: {
      await figma.clientStorage.setAsync(payload.key, payload.value);
      figma.ui.postMessage(SetLocalStateValue(payload.key, payload.value));
      break;
    }

    case MESSAGE_TYPE.CREATE_LINK: {
      const [collection] =
        await figma.variables.getLocalVariableCollectionsAsync();

      const variable = figma.variables.createVariable(
        payload.name,
        collection,
        payload.type,
      );

      figma.ui.postMessage(
        CreateLink({
          id: variable.id,
          name: payload.name,
          topic: payload.topic,
          type: payload.type,
        }),
      );
      break;
    }

    case MESSAGE_TYPE.UPDATE_LINK: {
      console.log("UPDATE_LINK", payload);
      if (!payload.id) break;

      const variable = await figma.variables.getVariableByIdAsync(payload.id);

      if (variable) {
        variable.remove();
      }

      const [collection] =
        await figma.variables.getLocalVariableCollectionsAsync();

      const newVariable = figma.variables.createVariable(
        payload.name,
        collection,
        payload.type,
      );

      figma.ui.postMessage(
        UpdateLink({
          id: newVariable.id,
          name: payload.name,
          topic: payload.topic,
          type: payload.type,
        }),
      );

      break;
    }

    case MESSAGE_TYPE.SET_VARIABLE: {
      const [collection] =
        await figma.variables.getLocalVariableCollectionsAsync();
      const variable = await figma.variables.getVariableByIdAsync(payload.id);

      if (variable) {
        variable.setValueForMode(
          collection.defaultModeId,
          payload.value as VariableValue,
        );
      }

      break;
    }

    case MESSAGE_TYPE.DELETE_LINK: {
      const variable = await figma.variables.getVariableByIdAsync(payload.id);

      if (variable) {
        variable.remove();
      }

      break;
    }

    default: {
      console.error("Unknown message type", { type, payload });
      break;
    }
  }
};

setInterval(async () => {
  const localState = (await figma.clientStorage.getAsync(
    LOCAL_STORAGE_KEYS.MQTT_LINKS,
  )) as Link[] | undefined;

  if (!localState || !localState.length) return;

  const filteredLinks = await linksWhichAreStillInVariables(localState);

  if (filteredLinks.length === localState.length) return;

  figma.ui.postMessage(LinksUpdated(filteredLinks));
}, 5000);
