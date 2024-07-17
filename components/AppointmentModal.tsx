"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/types/appwrite.types";

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: {
  type: "pendiente" | "cancelado";
  patientId: string;
  userId: string;
  appointment?: Appointment;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "pendiente" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} turno</DialogTitle>
          <DialogDescription>
            Porfavor ingrese los siguientes detalles para {type} el turno
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
