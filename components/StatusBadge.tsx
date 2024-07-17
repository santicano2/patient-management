import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "solicitado",
        "bg-blue-600": status === "pendiente",
        "bg-red-600": status === "cancelado",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="status"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-14-semibold capitalize", {
          "text-green-500": status === "solicitado",
          "text-blue-500": status === "pendiente",
          "text-red-500": status === "cancelado",
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;
