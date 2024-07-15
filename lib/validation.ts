import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener como maximo 50 caracteres",
    }),
  email: z.string().email("Email invalido"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Teléfono invalido"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener como maximo 50 caracteres"),
  email: z.string().email("Email invalido"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Teléfono invalido"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(500, "La dirección debe tener como maximo 500 caracteres"),
  occupation: z
    .string()
    .min(2, "Ocupación debe tener al menos 2 caracteres")
    .max(500, "Ocupación debe tener como maximo 500 caracteres"),
  emergencyContactName: z
    .string()
    .min(2, "Nombre de contacto debe tener al menos 2 caracteres")
    .max(50, "Nombre de contacto debe tener como maximo 50 caracteres"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Telefono de contacto de emergencia invalido"
    ),
  primaryPhysician: z.string().min(2, "Seleccionar al menos un doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Nombre de seguro debe tener al menos 2 caracteres")
    .max(50, "Nombre de seguro debe tener como maximo 50 caracteres"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Número de poliza debe tener al menos 2 caracteres")
    .max(50, "Número de poliza debe tener como maximo 50 caracteres"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar el consentimiento para continuar",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar el consentimiento para continuar",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar el consentimiento para continuar",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccionar al menos un doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Razón debe tener al menos 2 caracteres")
    .max(500, "Razón debe tener como maximo 500 caracteres"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccionar al menos un doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccionar al menos un doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Razón debe tener al menos 2 caracteres")
    .max(500, "Razón debe tener como maximo 500 caracteres"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
