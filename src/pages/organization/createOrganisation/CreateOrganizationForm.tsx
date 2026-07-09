import { FormInput } from "../../../components/FormInput";
import { FormTextarea } from "../../../components/FormTextarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { PageBackground } from "../../../components/PageBackground";
import OrganizationServices from "../../../services/OrganizationServices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import config from "../../../config/indexConfig";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStoredMemberId = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("memberId") ?? "";
};

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  orgName: string;
  orgDesc: string;
  ownerId: string;
  orgAddress: string;
  orgCity: string;
  orgState: string;
  orgPostalCode: string;
  orgCountry: string;
};

interface CreateOrganizationFormProps {
  onCancel?: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateOrganizationForm({
  onCancel,
}: CreateOrganizationFormProps) {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      orgName: "",
      orgDesc: "",
      ownerId: getStoredMemberId(),
      orgAddress: "",
      orgCity: "",
      orgState: "",
      orgPostalCode: "",
      orgCountry: "",
    },
  });

  // ── Submit handler ──────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setGlobalError(null);

    if (!data.ownerId) {
      setGlobalError(
        "Owner ID is missing. Please complete onboarding or sign in again."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await OrganizationServices.createOrganization(data);

      toast.success("Organization created successfully!");
      reset();

      navigate(config.routes.organizationMembersWithOrgId(result.orgId));
    } catch (error: any) {
      const apiErrors = error.response?.data?.errors ?? error.response?.data;

      if (error.response?.status === 400) {
        if (apiErrors && typeof apiErrors === "object") {
          Object.entries(apiErrors).forEach(([key, value]) => {
            if (typeof value === "string") {
              setError(key as keyof FormData, { message: value });
            }
          });
        }
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create organization. Please check the form.";
        if (error.response?.data?.message) {
          setGlobalError(error.response.data.message);
        }
        toast.error(errorMsg);
      } else {
        const errorMsg =
          "Network error. Please check your connection and try again.";
        setGlobalError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Cancel handler ──────────────────────────────────────────────────────────
  const handleCancel = () => {
    reset();
    setGlobalError(null);
    if (onCancel) {
      onCancel();
    } else {
      // Earlier hardcoded path: navigate("/organization-decision");
      navigate(config.routes.organizationDecision);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6">
      <PageBackground />
      <div
        className="w-full max-w-[640px] bg-white/50 backdrop-blur-md rounded-xl p-8"
        style={{ boxShadow: "0px 8px 24px rgba(0,0,0,0.06)" }}>
        <PageHeader
          title="Create Organization"
          subtitle="Set up your organization details to get started"
        />

        {/* Global Error Banner */}
        {globalError && (
          <div
            className="mb-6 rounded-lg border p-3 flex items-start gap-3"
            style={{ backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#B91C1C]" />
            <p className="text-sm text-[#B91C1C]">{globalError}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4">
          {/* 1. Organization Name */}
          <FormInput
            label="Organization Name"
            id="orgName"
            placeholder="Enter organization name"
            error={errors.orgName?.message}
            maxLength={100}
            showCount
            {...register("orgName", {
              required: "Organization name is required",
            })}
          />

          {/* 2. Organization Description */}
          <FormTextarea
            label="Organization Description"
            id="orgDesc"
            placeholder="Describe your organization"
            rows={4}
            error={errors.orgDesc?.message}
            maxLength={500}
            showCount
            autoResize
            {...register("orgDesc", {
              required: "Organization description is required",
            })}
          />

          <input
            type="hidden"
            {...register("ownerId")}
          />

          {/* 4. Address */}
          <FormInput
            label="Organization Address"
            id="orgAddress"
            placeholder="Street address"
            error={errors.orgAddress?.message}
            maxLength={200}
            showCount
            {...register("orgAddress", {
              required: "Street address is required",
            })}
          />
          {/* 5. City */}
          <FormInput
            label="Organization City"
            id="orgCity"
            placeholder="City"
            error={errors.orgCity?.message}
            maxLength={100}
            showCount
            {...register("orgCity", {
              required: "City is required",
            })}
          />

          {/* 6. State */}
          <FormInput
            label="Organization State"
            id="orgState"
            placeholder="State"
            error={errors.orgState?.message}
            maxLength={100}
            showCount
            {...register("orgState", {
              required: "State is required",
            })}
          />
          {/* 7. Postal Code */}
          <FormInput
            label="Organization Postal Code"
            id="orgPostalCode"
            placeholder="e.g. 132001"
            error={errors.orgPostalCode?.message}
            maxLength={6}
            showCount
            {...register("orgPostalCode", {
              required: "Postal code is required",
              pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: "Postal code must be 6 digits and cannot start with 0",
              },
            })}
          />

          {/* 8. Country */}
          <FormInput
            label="Organization Country"
            id="orgCountry"
            placeholder="Country"
            error={errors.orgCountry?.message}
            maxLength={100}
            showCount
            {...register("orgCountry", {
              required: "Country is required",
            })}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-lg text-sm font-medium text-white transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSubmitting ? "#A0AEC0" : "#0073EA",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#005FCC";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#0073EA";
              }}>
              {isSubmitting ? "Creating..." : "Create Organization"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-150 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
