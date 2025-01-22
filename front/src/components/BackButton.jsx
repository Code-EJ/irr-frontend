const BackButton = ({onClick, route}) => {

    return <b className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4" onClick={() => onClick(route)}> Voltar </b>
}
export default BackButton;