const defaultUiSize: Pick<ShowUIOptions, "width" | "height"> = {
  height: 300,
  width: 440,
};

defaultUiSize.height;
figma.showUI(__html__, {
  width: defaultUiSize.width,
  height: defaultUiSize.height,
  themeColors: true,
});
import {
  CreateLink,
  GetLocalStateValue,
  Message,
  MESSAGE_TYPE,
  SetLocalStateValue,
} from "../common/Message";

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
      figma.ui.postMessage(GetLocalStateValue(payload.key, localState));
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

      console.log(type, payload);
      break;
    }

    default: {
      console.error("Unknown message type", { type, payload });
      break;
    }
  }
};
