import { useNavigate } from "react-router-dom";
import { FIGMA_VARIABLE_TYPE, Link } from "../../../../common/Link";
import { DeleteLink, LOCAL_STORAGE_KEYS } from "../../../../common/Message";
import { Button, ButtonGroup, Icon, Text, Title } from "../../../components";
import { IconButton } from "../../../components/IconButton";
import { useLocalStorage, useSetUiOptions } from "../../../hooks";
import { typedPostMessage } from "../../../utils/window";
import { Header } from "../../_components/Header";

export function MqttLinks() {
  useSetUiOptions({ width: 350, height: 385 });

  const navigate = useNavigate();
  const [links, setLinks] = useLocalStorage<Link[]>(
    LOCAL_STORAGE_KEYS.MQTT_LINKS,
  );

  function deleteLink(id?: string) {
    if (!id) return;

    typedPostMessage(DeleteLink(id));
    setLinks(links?.filter((link) => link.id !== id));
  }

  return (
    <>
      <Header title="Mqtt links">
        <IconButton
          icon="PlusIcon"
          onClick={() => navigate("/mqtt/links/new")}
        />
      </Header>
      {!links?.length && (
        <section className="flex justify-center flex-col items-center h-72">
          <Text>No links found</Text>
          <Text dimmed className="text-center">
            By creating a link you will be able to control Figma variables from
            a MQTT topic
          </Text>
          <Button
            onClick={() => navigate("/mqtt/links/new")}
            className="flex justify-center items-center mt-5"
          >
            <Icon icon="PlusIcon" />
            <span className="grow">Create link</span>
          </Button>
        </section>
      )}
      <section
        className={`divide-y divide-zinc-700 max-h-80 -mx-2.5 px-2.5 ${
          links && links.length > 5 ? "overflow-y-scroll" : ""
        }`}
      >
        {links?.map((link) => (
          <section key={link.name} className="py-2 flex justify-between">
            <section className="flex flex-col">
              <div className="flex items-center space-x-2">
                <TypeIcon type={link.type} />
                <Text className="text-ellipsis max-w-56 overflow-hidden">
                  {link.name}
                </Text>
              </div>
              <Text dimmed className="text-ellipsis max-w-60 overflow-hidden">
                {link.topic}
              </Text>
            </section>
            <ButtonGroup>
              <IconButton icon="PencilIcon" />
              <IconButton
                icon="TrashIcon"
                onClick={() => deleteLink(link.id)}
              />
            </ButtonGroup>
          </section>
        ))}
      </section>
    </>
  );
}

function TypeIcon({ type }: { type: FIGMA_VARIABLE_TYPE }) {
  switch (type) {
    case FIGMA_VARIABLE_TYPE.COLOR:
      return <Icon icon="SwatchIcon" />;
    case FIGMA_VARIABLE_TYPE.BOOLEAN:
      return <Icon icon="StopCircleIcon" />;
    case FIGMA_VARIABLE_TYPE.FLOAT:
      return <Icon icon="HashtagIcon" />;
    case FIGMA_VARIABLE_TYPE.STRING:
      return <Icon icon="LanguageIcon" />;
    default:
      return <Title>{type}</Title>;
  }
}
