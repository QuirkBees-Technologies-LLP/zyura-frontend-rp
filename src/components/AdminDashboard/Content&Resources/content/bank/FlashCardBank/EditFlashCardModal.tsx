// EditFlashCardModal.tsx

import { z } from "zod";

export const editFlashCardSchema = z.object({
  frontText: z.string().min(1, "Front text is required"),
  backText: z.string().min(1, "Back text is required"),
  explanation: z.string().min(1, "Explanation is required"),
  difficulty: z.enum(
    ["Basic", "Intermediate", "Advance"],
    "Difficulty is required",
  ),
  image: z.string().optional(),
});

const difficultyLevels = [
  { label: "Basic", value: "Basic" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advance", value: "Advance" },
] as const;
export type EditFlashCardInput = z.infer<typeof editFlashCardSchema>;

import ButtonWithLoading from "@/common/button/ButtonWithLoading";
import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/custom/CommonSelect";
import { useUploadSingleImageMutation } from "@/store/features/adminDashboard/ContentResources/MCQ/mcqApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditFlashCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EditFlashCardInput) => Promise<void> | void;
  initialData: EditFlashCardInput;
  isLoading?: boolean;
}

const EditFlashCardModal: React.FC<EditFlashCardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditFlashCardInput>({
    resolver: zodResolver(editFlashCardSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  if (!isOpen) return null;

  const [uploadSingleImage, { isLoading: isUploadingImage }] =
    useUploadSingleImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageValue = watch("image");
  const [imagePreview, setImagePreview] = useState<string>(initialData.image ?? "");

  useEffect(() => {
    setImagePreview(initialData.image ?? "");
  }, [initialData.image]);

  const canRemoveImage = useMemo(() => Boolean(imageValue || imagePreview), [imagePreview, imageValue]);

  const inputClass = {
    label: "block text-sm font-normal text-black font-inter mb-2",
    input:
      "w-full border border-[#CBD5E1] bg-white rounded-md p-3 outline-none text-black text-xs",
    error: "text-red-500 text-sm mt-1",
  };
  const submit = async (values: EditFlashCardInput) => {
    await onSubmit(values);
    onClose();
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await uploadSingleImage(formData).unwrap();
      const fileUrl = result.data.fileUrl;
      setValue("image", fileUrl, { shouldDirty: true, shouldValidate: true });
      setImagePreview(fileUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldDirty: true, shouldValidate: true });
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(submit)}
        className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Flash Card</h2>

        <div className="space-y-3">
          <div>
            <label className={inputClass.label}>Image</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={`cursor-pointer ${inputClass.input}`}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadImage(e.target.files[0]);
                  }
                }}
                disabled={isUploadingImage || isLoading}
              />
              {canRemoveImage && (
                <CommonButton
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage || isLoading}
                  className="!text-red-500"
                >
                  Remove
                </CommonButton>
              )}
            </div>
            {isUploadingImage && (
              <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
            )}
            {(imagePreview || imageValue) && (
              <div className="mt-2">
                <img
                  src={imageValue || imagePreview}
                  alt="Preview"
                  className="max-h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Front Text</label>
            <input
              {...register("frontText")}
              className={inputClass.input}
              placeholder="Front text"
            />
            {errors.frontText && (
              <p className={inputClass.error}>{errors.frontText.message}</p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Back Text</label>
            <input
              {...register("backText")}
              className={inputClass.input}
              placeholder="Back text"
            />
            {errors.backText && (
              <p className="text-xs text-red-600 mt-1">
                {errors.backText.message}
              </p>
            )}
          </div>

          <div>
            <label className={inputClass.label}>Explanation</label>
            <textarea
              {...register("explanation")}
              className={inputClass.input}
              placeholder="Explanation"
              rows={4}
            />
            {errors.explanation && (
              <p className={inputClass.error}>{errors.explanation.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className={inputClass.label}>Difficulty</label>

          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <CommonSelect
                className="!bg-white border-[#CBD5E1]"
                value={field.value}
                item={difficultyLevels}
                onValueChange={(val) => field.onChange(val)}
              />
            )}
          />

          {errors.difficulty && (
            <p className={inputClass.error}>{errors.difficulty.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <CommonButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </CommonButton>
          <CommonButton
            type="submit"
            disabled={isLoading}
            className="!bg-blue-600 text-white rounded disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? <ButtonWithLoading title="Updating..." /> : "Update"}
          </CommonButton>
        </div>
      </form>
    </div>
  );
};

export default EditFlashCardModal;
