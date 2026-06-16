import { useEffect, useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { PageHeader } from "../../components/PageHeader";
import MemberServices from "../../services/MemberServices";
import { LoadingScreen } from "../../components/LoadingScreen";
import { ErrorScreen } from "../../components/ErrorScreen";
import { FormInput } from "../../components/FormInput";

type Member = {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoS3Key: string;
  accountStatus: string;
};

const getStoredMemberId = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("memberId") ?? "";
};

export function UserProfile() {
  const [member, setMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberId = getStoredMemberId();
        if (!memberId) {
          setError("Member ID not found");
          return;
        }
        const data = await MemberServices.getMemberById(memberId);
        setMember(data);
        setFormData(data);
      } catch (err) {
        setError("Failed to load member profile");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="p-6">
      <PageBackground></PageBackground>
      <div>
        <PageHeader
          title="User Profile"
          subtitle=""></PageHeader>
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4 pb-4">
            <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {member?.firstName?.[0]}
              {member?.lastName?.[0]}
            </div>
            {isEditing && (
              <button className="p-2 rounded-xl border-black border">
                Upload photo
              </button>
            )}
          </div>
          <hr></hr>
          <div className="flex flex-col gap-4 p-4">
            <p className="font-bold">Personal Information</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <FormInput
                  label="First Name"
                  value={formData?.firstName ?? ""}
                  readOnly={!isEditing}
                  onChange={(e) => {
                    setFormData((prev) =>
                      prev ? { ...prev, firstName: e.target.value } : null
                    );
                  }}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  label="Last Name"
                  value={formData?.lastName ?? ""}
                  readOnly={!isEditing}
                  onChange={(e) => {
                    setFormData((prev) =>
                      prev ? { ...prev, lastName: e.target.value } : null
                    );
                  }}
                />
              </div>
            </div>
            <FormInput
              label="Email Address"
              value={formData?.email ?? ""}
              readOnly={!isEditing}
              onChange={(e) => {
                setFormData((prev) =>
                  prev ? { ...prev, email: e.target.value } : null
                );
              }}
            />
          </div>
          <hr></hr>
          {!isEditing ? (
            <div className="flex justify-end gap-4 p-4">
              <button
                className="px-4 py-2 rounded-xl  bg-blue-500 text-white border-blue-500 border"
                onClick={() => {
                  setIsEditing(true);
                }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="flex justify-end gap-4 p-4">
              <button
                className="px-4 py-2 rounded-xl border-gray-300 border"
                onClick={() => {
                  setFormData(member);
                  setIsEditing(false);
                }}>
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl  bg-blue-500 text-white border-blue-500 border"
                onClick={() => {
                  setMember(formData);
                  setIsEditing(false);
                  alert("Profile updated successfully!");
                  // API call to update member profile
                }}>
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
