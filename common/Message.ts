import { Link } from "./Link";

export enum MESSAGE_TYPE {
  CREATE_LINK = "CREATE_LINK",
  UPDATE_LINK = "UPDATE_LINK",
  DELETE_LINK = "DELETE_LINK",
  GET_LOCAL_STATE_VALUE = "GET_LOCAL_STATE_VALUE",
  SET_LOCAL_STATE_VALUE = "SET_LOCAL_STATE_VALUE",
  SET_UI_OPTIONS = "SET_UI_OPTIONS",
  SET_VARIABLE = "SET_VARIABLE",
}

type CreateLinkMessage = {
  type: MESSAGE_TYPE.CREATE_LINK;
  payload: Link;
};
export function CreateLink(payload: Link): CreateLinkMessage {
  return {
    type: MESSAGE_TYPE.CREATE_LINK,
    payload: payload,
  };
}

type DeleteLinkMessage = {
  type: MESSAGE_TYPE.DELETE_LINK;
  payload: {
    id: string;
  };
};
export function DeleteLink(id: string): DeleteLinkMessage {
  return {
    type: MESSAGE_TYPE.DELETE_LINK,
    payload: { id },
  };
}

type SetUiOptionsMessage = {
  type: MESSAGE_TYPE.SET_UI_OPTIONS;
  payload: {
    width?: number;
    height?: number;
  };
};
export function SetUiOptions(payload: {
  width?: number;
  height?: number;
}): SetUiOptionsMessage {
  return {
    type: MESSAGE_TYPE.SET_UI_OPTIONS,
    payload: payload,
  };
}

type GetSetLocalStateValueMessage<T extends unknown = unknown> = {
  type: MESSAGE_TYPE.SET_LOCAL_STATE_VALUE | MESSAGE_TYPE.GET_LOCAL_STATE_VALUE;
  payload: {
    key: string;
    value?: T;
  };
};
function GetSetLocalStateValue<T extends unknown = unknown>(
  type: MESSAGE_TYPE.SET_LOCAL_STATE_VALUE | MESSAGE_TYPE.GET_LOCAL_STATE_VALUE,
  key: string,
  value?: T,
): GetSetLocalStateValueMessage<T> {
  return {
    type,
    payload: { key, value },
  };
}
export function SetLocalStateValue<T extends any = any>(key: string, value: T) {
  return GetSetLocalStateValue(MESSAGE_TYPE.SET_LOCAL_STATE_VALUE, key, value);
}
export function GetLocalStateValue<T extends any = any>(key: string, value: T) {
  return GetSetLocalStateValue(MESSAGE_TYPE.GET_LOCAL_STATE_VALUE, key, value);
}

type SetVariableMessage<T extends unknown = unknown> = {
  type: MESSAGE_TYPE.SET_VARIABLE;
  payload: {
    id: string;
    value: T;
  };
};
export function SetValiable<T extends unknown = unknown>(
  id: string,
  value: T,
): SetVariableMessage<T> {
  return {
    type: MESSAGE_TYPE.SET_VARIABLE,
    payload: { id, value },
  };
}

export type Message =
  | SetVariableMessage
  | CreateLinkMessage
  | DeleteLinkMessage
  | GetSetLocalStateValueMessage
  | GetSetLocalStateValueMessage
  | SetVariableMessage
  | SetUiOptionsMessage;

export type PluginMessage<T extends any = any> = {
  pluginMessage: { type: MESSAGE_TYPE; payload?: T };
};
