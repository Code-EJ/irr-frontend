const BackButton = () => {
    return (
        <b 
            className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4" 
            onClick={() => window.history.back()}
        > 
            Voltar 
        </b>
    );
};

export default BackButton;