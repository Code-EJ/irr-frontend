import React from "react";

export default function OutputField({
  name,
  value
}: OutputFieldProps) {
  return (
    <div>
      <span>{ name }</span>
      <span>{ value }</span>
    </div>
  )
}

interface OutputFieldProps {
  name: string;
  value: string;
}