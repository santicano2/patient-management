"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { getAppointmentSchema } from "@/lib/validation";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import { SelectItem } from "../ui/select";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "crear" | "cancelado" | "pendiente";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "pendiente":
        status = "solicitado";
        break;
      case "cancelado":
        status = "cancelado";
        break;
      default:
        status = "pendiente";
        break;
    }

    try {
      if (type === "crear" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  let buttonLabel;

  switch (type) {
    case "cancelado":
      buttonLabel = "Cancelar turno";
      break;
    case "crear":
      buttonLabel = "Crear turno";
      break;
    case "pendiente":
      buttonLabel = "Programar turno";
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "crear" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Nuevo turno</h1>
            <p className="text-dark-700">Solicita tu turno</p>
          </section>
        )}

        {type !== "cancelado" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Elegir un doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Fecha del turno"
              showTimeSelect
              dateFormat="dd-MM-yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Motivo de la consulta"
                placeholder="Escribe el motivo de la consulta"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notas adicionales"
                placeholder="Escribe las notas adicionales"
              />
            </div>
          </>
        )}

        {type === "cancelado" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Motivo de la cancelación"
            placeholder="Escribe el motivo de la cancelación"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancelado" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
