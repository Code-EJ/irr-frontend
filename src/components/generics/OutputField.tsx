import { FieldType } from "./InputField";
import React from "react";

export default function OutputField({
  label,
  value,
  type
}: OutputFieldProps) {
  return (
    <div>
      <span className=" font-bold">{ label }: </span>
      <span>{ value }</span>
    </div>
  )
}

interface OutputFieldProps {
  label: string;
  value: string;
  type: FieldType
}