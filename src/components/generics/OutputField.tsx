import { FieldType } from "./InputField";

export default function OutputField({
  label,
  value,
  type
}: OutputFieldProps) {
  return (
    <div className=" mb-4 p-4 hover:bg-green-300 rounded-md shadow-md">
      <span className=" font-bold text-black">{label}: </span>
      <span className=" text-gray-700">{value}</span>
    </div>
  )
}

interface OutputFieldProps {
  label: string;
  value: string;
  type: FieldType
}