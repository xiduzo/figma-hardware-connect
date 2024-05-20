import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  FIGMA_VARIABLE_TYPE,
  Link,
  figmaVariableTypeToString,
} from "../../../../../common/Link";
import {
  LOCAL_STORAGE_KEYS,
  MESSAGE_TYPE,
} from "../../../../../common/Message";
import { Button, FormInput, FormSelect, Text } from "../../../../components";
import { Fieldset } from "../../../../components/form/Fieldset";
import {
  useLocalStorage,
  useMessageListener,
  useSetUiOptions,
} from "../../../../hooks";
import { ZodFormProvider } from "../../../../providers";
import { Header } from "../../../_components/Header";

const schema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(FIGMA_VARIABLE_TYPE),
});

export function EditLink() {
  useSetUiOptions({ width: 350, height: 400 });
  const [links, setLinks] = useLocalStorage<Link[]>(
    LOCAL_STORAGE_KEYS.MQTT_LINKS,
  );

  const navigate = useNavigate();
  const { id } = useParams();

  const link = links?.find((link) => link.id === id);

  const sendMessage = useMessageListener<Link>(
    MESSAGE_TYPE.UPDATE_LINK,
    (link) => {
      if (!link) return;

      setLinks(
        links ? [...links.filter((prev) => prev.id !== link.id), link] : [link],
      );
      navigate(-1);
    },
  );

  return (
    <>
      <Header title="Update Link" />
      <section className="mt-2">
        <ZodFormProvider
          schema={schema}
          onValid={sendMessage}
          onInvalid={console.log}
          defaultValues={link}
        >
          <Fieldset>
            <FormInput name="topic" placeholder="/+/mqtt/topic/#" />
            <FormInput
              name="name"
              label="Variable name"
              placeholder="my variable"
            />
            <FormSelect name="type" label="type">
              {Object.values(FIGMA_VARIABLE_TYPE).map((type) => (
                <option value={type}>{figmaVariableTypeToString(type)}</option>
              ))}
            </FormSelect>
          </Fieldset>
          <FormActions disabled={!link} />
          {!link && (
            <Text dimmed className="text-center">
              Link not found
            </Text>
          )}
        </ZodFormProvider>
      </section>
    </>
  );
}

function FormActions({ disabled }: { disabled: boolean }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Fieldset className="mt-4">
      <Button className="mx-auto" disabled={disabled || isSubmitting}>
        Update
      </Button>
    </Fieldset>
  );
}
