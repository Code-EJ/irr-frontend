/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { Model } from '../models/Entities';
/** Legacy screens remain gated until replaced by feature APIs generated from the v1 contract. */
class BaseService<E extends Model> {
  constructor(private readonly route:string) {}
  private unavailable():never {throw new Error('This legacy workflow is awaiting v1 integration: '+this.route);}
  async create(_data:Partial<E>|FormData):Promise<E>{return this.unavailable();}
  async get(_id:string):Promise<E>{return this.unavailable();}
  async getAll(_page:number|null=null,_limit=10):Promise<{data:E[];total:number}>{return this.unavailable();}
  async delete(_id:string):Promise<void>{return this.unavailable();}
  async update(_id:string,_data:Partial<E>|FormData):Promise<E>{return this.unavailable();}
}
export default BaseService;
