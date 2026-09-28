const API=(import.meta as any).env.VITE_API_URL || "http://localhost:8000";
let token=localStorage.getItem("rk_token") || "";

export function setToken(v:string){token=v;localStorage.setItem("rk_token",v)}
export function clearToken(){token="";localStorage.removeItem("rk_token")}
export function hasToken(){return !!token}

export async function api(path:string,opts:any={}){
  const headers:any={"Content-Type":"application/json",...(opts.headers||{})};
  if(token) headers.Authorization="Bearer "+token;
  const r=await fetch(API+"/api/v1"+path,{...opts,headers});
  if(r.status===401){clearToken();throw new Error("AUTH")}
  if(!r.ok){
    let m="Request failed";
    try{m=(await r.json()).detail||m}catch{}
    throw new Error(m)
  }
  return r.json();
}
