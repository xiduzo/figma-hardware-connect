import { useNavigate } from "react-router-dom";
import { Link } from "../../../../common/Link";
import { DeleteLink } from "../../../../common/Message";
import { Text, Title } from "../../../components";
import { IconButton } from "../../../components/IconButton";
import {
  LOCAL_STORAGE_KEYS,
  useLocalStorage,
  useSetUiOptions,
} from "../../../hooks";
import { typedPostMessage } from "../../../utils/window";
import { Header } from "../../_components/Header";

export function MqttLinks() {
  useSetUiOptions({ width: 550, height: 500 });

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
    <section>
      <Header title="Mqtt links">
        <IconButton
          icon="PlusIcon"
          onClick={() => navigate("/mqtt/links/new")}
        />
      </Header>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-start">
              <Text className="p-2">Mqtt topic</Text>
            </th>
            <th className="text-start">
              <Text className="p-2">Figma variable</Text>
            </th>
            <th className="text-start">
              <Text className="p-2">Actions</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {links?.map((link) => (
            <tr key={link.name}>
              <td>
                <Text className="p-2">{link.topic}</Text>
              </td>
              <td>
                <Text className="p-2">{link.name}</Text>
                <Text className="p-2">{link.type}</Text>
              </td>
              <td>
                <div className="flex space-x-2">
                  <IconButton icon="PencilIcon" />
                  <IconButton
                    icon="TrashIcon"
                    onClick={() => deleteLink(link.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
