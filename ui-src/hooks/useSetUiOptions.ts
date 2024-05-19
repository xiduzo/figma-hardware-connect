import { useEffect } from "react";
import { SetUiOptions } from "../../common/Message";
import { typedPostMessage } from "../utils/window";

export function useSetUiOptions(options: Parameters<typeof SetUiOptions>[0]) {
  useEffect(() => {
    typedPostMessage(SetUiOptions(options));
  }, [options]);
}
