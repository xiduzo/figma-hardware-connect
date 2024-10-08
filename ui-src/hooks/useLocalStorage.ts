import { useCallback, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import {
  GetLocalStateValue,
  LOCAL_STORAGE_KEYS,
  MESSAGE_TYPE,
  SetLocalStateValue,
} from "../../common/Message";
import { typedPostMessage } from "../utils/window";
import { useMessageListener } from "./useMessageListener";

type Update<T> = T | ((prev?: T) => T | undefined);

export function useLocalStorage<T>(
  key: LOCAL_STORAGE_KEYS,
  initialValue?: T,
  updateInterval?: number,
) {
  const [state, setState] = useState(initialValue);

  const setLocalState = useCallback(
    (update?: Update<T>) => {
      typedPostMessage(
        SetLocalStateValue(
          key,
          update instanceof Function ? update(state) : update,
        ),
      );
    },
    [key, state],
  );

  useEffect(() => {
    typedPostMessage(GetLocalStateValue(key, initialValue));
  }, [key]);

  useInterval(() => {
    typedPostMessage(GetLocalStateValue(key, initialValue));
  }, updateInterval ?? null);

  useMessageListener<{ key: LOCAL_STORAGE_KEYS; value: T | undefined }>(
    MESSAGE_TYPE.GET_LOCAL_STATE_VALUE,
    (payload) => {
      if (payload?.key !== key) return;

      setState(payload.value);
    },
  );

  useMessageListener<{ key: LOCAL_STORAGE_KEYS; value: T | undefined }>(
    MESSAGE_TYPE.SET_LOCAL_STATE_VALUE,
    (payload) => {
      if (payload?.key !== key) return;

      setState(payload?.value);
    },
  );

  return [state, setLocalState] as const;
}
