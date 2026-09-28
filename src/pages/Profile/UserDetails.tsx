/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useSession } from '../../features/identity/SessionProvider';
import Card from '../../components/Card';
export default function UserDetails(){const {account}=useSession();return <Card><h1 className="text-2xl font-bold">Your account</h1><dl><dt>Name</dt><dd>{account?.fullName}</dd><dt>Email</dt><dd>{account?.email}</dd><dt>Platform role</dt><dd>{account?.userRole}</dd></dl></Card>;}
