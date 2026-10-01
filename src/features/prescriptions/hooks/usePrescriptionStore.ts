"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prescription } from "../types/prescription.types";
import { uploadPrescriptionAction } from "../actions/uploadPrescription";
import { processPrescriptionAction } from "../actions/processPrescription";
import { validatePrescriptionFile } from "../utils/prescriptionValidation";

export type ProcessingStep =
  | "idle"
  | "uploading"
  | "reading"
  | "identifying"
  | "generating"
  | "completed";

export interface PrescriptionStore {
  prescription: Prescription | null;
  prescriptions: Prescription[];
  processing: boolean;
  processingStep: ProcessingStep;
  error: string;
  openUpload: () => void;
  processFile: (file: File) => Promise<boolean>;
  selectPrescription: (id: string) => void;
  clear: () => void;
}

export const usePrescriptionStore = create<PrescriptionStore>()(
  persist(
    (set, get) => ({
      prescription: null,
      prescriptions: [
        {
          id: "demo-rx-1",
          fileName: "Dr_Sharma_Prescription.jpg",
          status: "completed",
          doctorName: "Dr. S. K. Sharma (MD, General Medicine)",
          prescriptionDate: "2026-09-28",
          diagnosis: "Acute Bronchitis & Viral Fever",
          summary: "You have been prescribed 3 medicines. Two are to be taken after food and one before food.",
          additionalInstructions: "Take steam inhalation twice daily. Drink warm water.",
          medicines: [
            {
              id: "med-1",
              name: "Paracetamol (Dolo 650)",
              normalizedName: "paracetamol",
              strength: "650 mg",
              dosage: "1 tablet",
              frequency: "Twice daily",
              duration: "5 days",
              timing: "After food",
              route: "Oral",
              instructions: "Take 1 tablet after breakfast and dinner. Do not exceed prescribed dose.",
              ingredients: ["Paracetamol (Acetaminophen)"],
              uses: "Commonly used to relieve mild to moderate pain (headache, body ache) and bring down fever.",
              sideEffects: ["Mild nausea", "Stomach upset if taken on an empty stomach"],
              seriousWarnings: ["Liver toxicity with excess dosage", "Severe allergic rash"],
              warnings: ["Never take multiple paracetamol products together", "Avoid alcohol"],
              confidence: "High",
              confidenceScore: 0.95,
              needsVerification: false
            },
            {
              id: "med-2",
              name: "Pantoprazole",
              normalizedName: "pantoprazole",
              strength: "40 mg",
              dosage: "1 tablet",
              frequency: "Once daily (Morning)",
              duration: "7 days",
              timing: "Before food",
              route: "Oral",
              instructions: "Take early morning on an empty stomach 30 minutes before breakfast.",
              ingredients: ["Pantoprazole Sodium"],
              uses: "Reduces excessive stomach acid; prevents heartburn and gastritis.",
              sideEffects: ["Mild headache", "Flatulence"],
              seriousWarnings: ["Long term calcium depletion"],
              warnings: ["Swallow whole; do not chew or crush"],
              confidence: "High",
              confidenceScore: 0.92,
              needsVerification: false
            },
            {
              id: "med-3",
              name: "Cetirizine Hydrochloride",
              normalizedName: "cetirizine",
              strength: "10 mg",
              dosage: "1 tablet",
              frequency: "Once daily at bedtime",
              duration: "3 days",
              timing: "At bedtime",
              route: "Oral",
              instructions: "Take in the evening. May cause mild drowsiness.",
              ingredients: ["Cetirizine Dihydrochloride"],
              uses: "Relieves allergic symptoms like sneezing, runny nose, and throat itch.",
              sideEffects: ["Drowsiness", "Dry mouth"],
              seriousWarnings: ["Urinary retention"],
              warnings: ["Avoid driving or operating machinery after taking"],
              confidence: "High",
              confidenceScore: 0.9,
              needsVerification: false
            }
          ]
        }
      ],
      processing: false,
      processingStep: "idle",
      error: "",

      openUpload: () => {
        document.getElementById("prescription-file-input")?.click();
      },

      processFile: async (file: File) => {
        const validation = validatePrescriptionFile(file);
        if (!validation.isValid) {
          set({ error: validation.error || "Invalid file", processing: false, processingStep: "idle" });
          return false;
        }

        set({ processing: true, error: "", processingStep: "uploading" });

        try {
          // 1. Upload
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await uploadPrescriptionAction(formData);

          if (!uploadRes.success) {
            throw new Error(uploadRes.error || "File upload failed");
          }

          // 2. Reading
          set({ processingStep: "reading" });
          await new Promise((r) => setTimeout(r, 600));

          // 3. Identifying medicines & structured extraction
          set({ processingStep: "identifying" });
          let base64: string | undefined;

          if (file.type.startsWith("image/")) {
            base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                const b64 = result.split(",")[1];
                resolve(b64);
              };
              reader.readAsDataURL(file);
            });
          }

          // 4. Generating schedule & finalizing
          set({ processingStep: "generating" });
          const processRes = await processPrescriptionAction({
            prescriptionId: uploadRes.prescriptionId!,
            filePath: uploadRes.filePath,
            fileName: file.name,
            imageBase64: base64,
            mimeType: file.type
          });

          if (!processRes.success || !processRes.prescription) {
            throw new Error(processRes.error || "Prescription extraction failed");
          }

          const parsedPrescription = processRes.prescription;
          const updatedPrescriptions = [
            parsedPrescription,
            ...get().prescriptions.filter((p) => p.id !== parsedPrescription.id)
          ];

          set({
            prescription: parsedPrescription,
            prescriptions: updatedPrescriptions,
            processing: false,
            processingStep: "completed"
          });

          return true;
        } catch (err: any) {
          set({
            processing: false,
            processingStep: "idle",
            error: err.message || "We couldn't process this prescription right now. Please try again."
          });
          return false;
        }
      },

      selectPrescription: (id: string) => {
        const item = get().prescriptions.find((p) => p.id === id);
        if (item) {
          set({ prescription: item });
        }
      },

      clear: () => set({ prescription: null, error: "", processingStep: "idle" })
    }),
    {
      name: "medidecode-prescriptions-v2"
    }
  )
);
