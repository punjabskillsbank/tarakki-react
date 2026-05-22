import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { FieldWrapper } from "../../../components/FieldWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { PageBackground } from "../../../components/PageBackground";
import OrganisationServices from "../../../services/OrganizationServices";

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
  onCancel: () => void;
}

// ─── Input style helper ───────────────────────────────────────────────────────
const inputClass = (hasError?: boolean) =>
  [
    "h-11 w-full rounded-lg border px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150",
    "focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]",
    hasError ? "border-[#E2445C]" : "border-[#D1D5DB]",
    "bg-white",
  ].join(" ");

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateOrganizationForm({
  onCancel,
}: CreateOrganizationFormProps) {
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
      const result = await OrganisationServices.createOrganisation(data);
      localStorage.setItem("orgId", result.orgId);
      localStorage.setItem("orgName", result.orgName);
      // Success — redirect to Create-Board page (future implementation)
      console.log("Organization created successfully:", result);
      alert("Organization created successfully!");
      reset();
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
        if (error.response?.data?.message) {
          setGlobalError(error.response.data.message);
        }
      } else {
        setGlobalError(
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Cancel handler ──────────────────────────────────────────────────────────
  const handleCancel = () => {
    reset();
    setGlobalError(null);
    onCancel(); // Goes back to OrganizationDecision
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6">
      <PageBackground />
      <div
        className="w-full max-w-[640px] bg-white rounded-xl p-8"
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
          <FieldWrapper
            label="Organization Name"
            error={errors.orgName?.message}>
            <input
              {...register("orgName", {
                required: "Organization name is required",
              })}
              placeholder="Enter organization name"
              className={inputClass(!!errors.orgName)}
            />
          </FieldWrapper>

          {/* 2. Organization Description */}
          <FieldWrapper
            label="Organization Description"
            error={errors.orgDesc?.message}>
            <textarea
              {...register("orgDesc", {
                required: "Organization description is required",
              })}
              placeholder="Describe your organization"
              rows={4}
              className={[
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 resize-none",
                "focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]",
                errors.orgDesc ? "border-[#E2445C]" : "border-[#D1D5DB]",
                "bg-white",
              ].join(" ")}
              style={{ minHeight: "100px" }}
            />
          </FieldWrapper>

          <input
            type="hidden"
            {...register("ownerId")}
          />

          {/* 4. Address */}
          <FieldWrapper
            label="Organization Address"
            error={errors.orgAddress?.message}>
            <input
              {...register("orgAddress", {
                required: "Street address is required",
              })}
              placeholder="Street address"
              className={inputClass(!!errors.orgAddress)}
            />
          </FieldWrapper>

          {/* 5. City */}
          <FieldWrapper
            label="Organization City"
            error={errors.orgCity?.message}>
            <input
              {...register("orgCity", { required: "City is required" })}
              placeholder="City"
              className={inputClass(!!errors.orgCity)}
            />
          </FieldWrapper>

          {/* 6. State */}
          <FieldWrapper
            label="Organization State"
            error={errors.orgState?.message}>
            <input
              {...register("orgState", { required: "State is required" })}
              placeholder="State"
              className={inputClass(!!errors.orgState)}
            />
          </FieldWrapper>

          {/* 7. Postal Code */}
          <FieldWrapper
            label="Organization Postal Code"
            error={errors.orgPostalCode?.message}>
            <input
              {...register("orgPostalCode", {
                required: "Postal code is required",
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message:
                    "Postal code must be 6 digits and cannot start with 0",
                },
              })}
              placeholder="e.g. 132001"
              className={inputClass(!!errors.orgPostalCode)}
            />
          </FieldWrapper>

          {/* 8. Country */}
          <FieldWrapper
            label="Organization Country"
            error={errors.orgCountry?.message}>
            <input
              {...register("orgCountry", { required: "Country is required" })}
              placeholder="Country"
              className={inputClass(!!errors.orgCountry)}
            />
          </FieldWrapper>

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
