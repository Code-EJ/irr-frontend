import Button from "./Button";

type DeleteEntityModalProps = {
  id: number;
  isVisible: boolean | null;
  onAccept: (id:number)=>void;
  onClose: ()=>void;
};

const DeleteEntityModal = ({
  id,
  isVisible,
  onAccept,
  onClose,
}: DeleteEntityModalProps) => {
  return (
    isVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-96 flex flex-col items-center shadow-2xl">
          <p className="mb-4 text-center">
            Certeza que deseja excluir a entidade?
          </p>
          <div className="flex flex-row w-[70%] justify-between">
            <u
              className="text-green-700 cursor-pointer"
              onClick={() => onClose()}
            >
              Voltar
            </u>
            <Button
              type="submit"
              titulo="Excluir"
              onClick={() => onAccept(id)}
              className="text-white hover:bg-[#5e0b12] text-sm bg-red-800"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteEntityModal;
