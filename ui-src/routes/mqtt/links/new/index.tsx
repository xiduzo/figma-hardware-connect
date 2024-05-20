import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FIGMA_VARIABLE_TYPE, Link } from "../../../../../common/Link";
import { CreateLink, MESSAGE_TYPE } from "../../../../../common/Message";
import { Button, FormInput, FormSelect, Title } from "../../../../components";
import { Fieldset } from "../../../../components/form/Fieldset";
import {
  LOCAL_STORAGE_KEYS,
  useLocalStorage,
  useMessageListener,
  useSetUiOptions,
} from "../../../../hooks";
import { ZodFormProvider } from "../../../../providers";
import { typedPostMessage } from "../../../../utils/window";
import { Header } from "../../../_components/Header";
import { IconBackButton } from "../../../_components/IconBackButton";

const schema = z.object({
  topic: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(FIGMA_VARIABLE_TYPE),
});

export function NewLink() {
  useSetUiOptions({ width: 300, height: 400 });
  const [links, setLinks] = useLocalStorage<Link[]>(
    LOCAL_STORAGE_KEYS.MQTT_LINKS,
  );

  const navigate = useNavigate();

  function handleValid(data: Link) {
    typedPostMessage(CreateLink(data));
  }

  useMessageListener<Link>(MESSAGE_TYPE.CREATE_LINK, (event) => {
    const link = event.data.pluginMessage.payload;
    if (!link) return;

    setLinks(links ? [...links, link] : [link]);
    navigate(-1);
  });

  return (
    <>
      <Header title="New Link" />
      <section className="mt-2">
        <ZodFormProvider
          schema={schema}
          onValid={handleValid}
          onInvalid={console.log}
          defaultValues={{
            type: FIGMA_VARIABLE_TYPE.STRING,
          }}
        >
          <Fieldset>
            <FormInput name="topic" placeholder="/any/mqtt/topic/+" />
            <FormInput name="name" label="Variable name" />
            <FormSelect name="type" label="type">
              {Object.values(FIGMA_VARIABLE_TYPE).map((type) => (
                <option value={type}>{type.toLowerCase()}</option>
              ))}
            </FormSelect>
          </Fieldset>
          <FormActions />
        </ZodFormProvider>
      </section>
    </>
  );
}

function FormActions() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Fieldset className="mt-4">
      <Button className="mx-auto" disabled={isSubmitting}>
        Create
      </Button>
    </Fieldset>
  );
}
