/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
/** Reads a nested value without evaluating property expressions. */
export function get(obj:unknown,path:string,defaultValue?:unknown):unknown{
 let result:unknown=obj;
 for(const key of path.split(/[,[\].]+/).filter(Boolean)){
   if(typeof result!=='object'||result===null)return defaultValue;
   result=(result as Record<string,unknown>)[key];
 }
 return result===undefined?defaultValue:result;
}
