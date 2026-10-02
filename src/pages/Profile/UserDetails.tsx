/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useSession } from "../../features/identity/SessionProvider";
import Card from "../../components/Card";
export default function UserDetails() {
  const { account } = useSession();
  return (
    <Card className="profile-card">
      <p className="eyebrow">PERFIL</p>
      <h1>Minha conta</h1>
      <p className="page-description">Seus dados de acesso à plataforma.</p>
      <dl className="profile-details">
        <div>
          <dt>Nome completo</dt>
          <dd>{account?.fullName}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{account?.email}</dd>
        </div>
        <div>
          <dt>Perfil na plataforma</dt>
          <dd>
            {
              {
                ADMINISTRATOR: "Administrador",
                CITY_HALL: "Prefeitura",
                ORGANIZATION: "Organização",
                REPRESENTATIVE: "Representante",
              }[account?.userRole ?? "REPRESENTATIVE"]
            }
          </dd>
        </div>
      </dl>
      <p className="muted-note">
        As permissões de cada organização são definidas pelo seu vínculo com
        ela.
      </p>
    </Card>
  );
}
