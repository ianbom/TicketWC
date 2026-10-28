"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
    CircleDashed,
  UserCheck,
} from "lucide-react";

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  let color = "bg-gray-200 text-gray-700";
  let animation = "";
  let icon = null;

  switch (normalized) {
    case "open":
      color = "bg-red-100 text-red-700";
      icon = <CircleDashed className="w-4 h-4 mr-1" />;
      break;

    case "update":
      color = "bg-yellow-100 text-yellow-700";
      icon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
      break;

    case "assign":
      color = "bg-purple-100 text-purple-700";
      icon = <UserCheck className="w-4 h-4 mr-1" />;
      break;

    case "close":
    case "closed":
      color = "bg-green-100 text-green-700";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <Badge
      className={`${color} px-3 py-1 rounded-md capitalize flex items-center ${animation}`}
    >
      {icon}
      {status}
    </Badge>
  );
}
