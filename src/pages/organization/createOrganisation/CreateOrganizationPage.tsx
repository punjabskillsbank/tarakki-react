import { useNavigate } from "react-router-dom";
import CreateOrganizationForm from "./CreateOrganizationForm";

export default function CreateOrganizationPage() {
  const navigate = useNavigate();

  return (
    <CreateOrganizationForm
      onCancel={() => navigate("/organization-decision")}
    />
  );
}
