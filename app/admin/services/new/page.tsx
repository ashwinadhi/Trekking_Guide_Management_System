"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  AdminFormShell,
  AdminFormBody,
  AdminFormSection,
  AdminFormGrid,
  AdminFormField,
  AdminFormInput,
  AdminFormTextarea,
  AdminFormSelect,
  AdminFormActions,
  AdminFormAlert,
} from "@/components/admin/admin-form";

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "trek routes",
    price: "",
    location: "",
    images: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        images: formData.images.split(",").map((img) => img.trim()).filter(Boolean),
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/services");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create service");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Add service"
        description="Create a new service listing for the public site."
      />

      {error && <AdminFormAlert type="error" message={error} />}

      <AdminFormShell
        mode="create"
        title="New service"
        description="Fill in the details below. Fields marked with * are required."
        icon={Package}
        onClose={() => router.back()}
      >
        <form onSubmit={handleSubmit}>
          <AdminFormBody>
            <AdminFormSection title="Service details">
              <AdminFormGrid cols={1}>
                <AdminFormField label="Title" required fullWidth>
                  <AdminFormInput required name="title" value={formData.title} onChange={handleChange} />
                </AdminFormField>
                <AdminFormField label="Description" required fullWidth>
                  <AdminFormTextarea required name="description" rows={5} value={formData.description} onChange={handleChange} />
                </AdminFormField>
                <AdminFormGrid>
                  <AdminFormField label="Category" required>
                    <AdminFormSelect
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      options={[
                        { value: "trek routes", label: "Trek routes" },
                        { value: "hotels", label: "Hotels" },
                        { value: "equipment", label: "Equipment" },
                      ]}
                    />
                  </AdminFormField>
                  <AdminFormField label="Price (optional)" hint="Leave blank if price varies.">
                    <AdminFormInput type="number" name="price" value={formData.price} onChange={handleChange} />
                  </AdminFormField>
                </AdminFormGrid>
                <AdminFormField label="Location" required fullWidth>
                  <AdminFormInput required name="location" value={formData.location} onChange={handleChange} />
                </AdminFormField>
                <AdminFormField label="Image URLs" hint="Comma-separated links." fullWidth>
                  <AdminFormInput name="images" value={formData.images} onChange={handleChange} placeholder="https://..." />
                </AdminFormField>
              </AdminFormGrid>
            </AdminFormSection>

            <AdminFormActions
              onCancel={() => router.back()}
              submitLabel="Save service"
              loading={submitting}
            />
          </AdminFormBody>
        </form>
      </AdminFormShell>
    </div>
  );
}
