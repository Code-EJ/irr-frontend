import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    path: string;
}

const BackButton = ({ path }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(path);
    };

    return (
        <b 
            className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4" 
            onClick={handleBack}
        > 
            Voltar 
        </b>
    );
};

export default BackButton;
