/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { authenticate } from '../features/identity/api';
import { session } from '../shared/api/session';
export default {
 async login(data:{email:string;password:string}){const token=await authenticate(data.email,data.password);session.setToken(token);return {token,error:null,status:200};},
 logout:()=>session.clear()
};

