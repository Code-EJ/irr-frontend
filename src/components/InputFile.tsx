import React from "react";

interface InputFileProps {
  titulo: string;
  name: string;
  accept?: string;
  onChange: (file: File) => void;
}

const InputFile: React.FC<InputFileProps> = ({ titulo, name, accept, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-gray-700 font-medium mb-2">
        {titulo}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        onChange={handleFileChange}
        className="border border-gray-300 rounded px-3 py-2 bg-white"
      />
    </div>
  );
};

export default InputFile;
