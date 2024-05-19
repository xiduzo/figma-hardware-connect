import { useNavigate } from "react-router-dom";
import { IconButton } from "../../components/IconButton";

export const IconBackButton = () => {
  const navigate = useNavigate();

  return <IconButton icon="ArrowLeftIcon" onClick={() => navigate(-1)} />;
};
