import Logo from "./Logo";

const Footer = () => {
    return (
    <div className="w-full h-36 bg-[#cbc07c] items-center flex flex-row justify-between px-16">
        <div className="flex flex-col gap-4">
            <h1 className="font-bold"> Conteúdo </h1>
            <div className="grid grid-cols-2 gap-1 text-xs">
                <p> Coleta</p>
                <p> Materiais</p>
                <p> Rotas</p>
                <p> Tratamento</p>
                <p> Estoque</p>
                <p> Relatórios</p>
                <p> Mercado</p>
                <p> Perfil</p>
            </div>
        </div>
        <Logo />
        <div>
            <h1> Contato </h1>
            <p> Telefone e WhatsApp</p>
            <a href="https://wa.me/553136347006" className="cursor-pointer hover:text-black"> 31 3634-7006</a>
        </div>
    </div>
    )
}
export default Footer;