import {createServerSupabaseClient} from './supabase-server';

export type Profile={id:string;full_name:string;email?:string;function_title?:string|null};
export type MarketingItem={id:string;title:string;summary:string;status:string;priority:string;publication_date:string|null;start_date:string|null;created_at:string;owner_id:string;type?:{name:string}|null;owner?:Profile|null;marketing_item_profiles?:Array<{profile?:{name:string}|null}>;tasks?:Task[]};
export type Task={id:string;title:string;status:string;assignee_id:string;marketing_item_id:string|null;deadline:string|null;planned_date:string|null;publication_date?:string|null;workload:string;actual_hours:number|null;category:string|null;deleted_at?:string|null;assignee?:Profile|null;marketing_item?:{title:string}|null;channel?:{name:string}|null};
export type DataResult<T>={data:T;error:string|null};

function fail<T>(context:string,error:unknown,fallback:T):DataResult<T>{
  console.error(`[Supabase] ${context}:`,error);
  return {data:fallback,error:'De gegevens konden niet worden geladen. Probeer het later opnieuw.'};
}

export async function getMarketingItems(mode:'active'|'archive'|'all'='active'):Promise<DataResult<MarketingItem[]>>{
  const sb=createServerSupabaseClient(); if(!sb)return fail('Supabase is niet geconfigureerd',null,[]);
  let query=sb.from('marketing_items').select('id,title,summary,status,priority,publication_date,start_date,created_at,owner_id,type:marketing_item_types(name),owner:profiles!marketing_items_owner_id_fkey(id,full_name),marketing_item_profiles(profile:communication_profiles(name)),tasks(id,status,deleted_at)').is('deleted_at',null);
  if(mode==='active')query=query.is('archived_at',null);
  if(mode==='archive')query=query.or('archived_at.not.is.null,status.eq.Gearchiveerd');
  const {data,error}=await query.order('created_at',{ascending:false});
  return error?fail('marketing_items ophalen',error,[]):{data:(data??[]) as unknown as MarketingItem[],error:null};
}

export async function getMarketingItem(id:string):Promise<DataResult<MarketingItem|null>>{
  const sb=createServerSupabaseClient(); if(!sb)return fail('Supabase is niet geconfigureerd',null,null);
  const {data,error}=await sb.from('marketing_items').select('id,title,summary,status,priority,publication_date,start_date,created_at,owner_id,type:marketing_item_types(name),owner:profiles!marketing_items_owner_id_fkey(id,full_name),marketing_item_profiles(profile:communication_profiles(name)),tasks(id,title,status,assignee_id,marketing_item_id,deadline,planned_date,workload,actual_hours,category,deleted_at,assignee:profiles!tasks_assignee_id_fkey(id,full_name),channel:channels(name))').eq('id',id).is('deleted_at',null).maybeSingle();
  return error?fail('marketing_item ophalen',error,null):{data:data as unknown as MarketingItem|null,error:null};
}

export async function getTasks(assigneeId?:string):Promise<DataResult<Task[]>>{
  const sb=createServerSupabaseClient(); if(!sb)return fail('Supabase is niet geconfigureerd',null,[]);
  let query=sb.from('tasks').select('id,title,status,assignee_id,marketing_item_id,deadline,planned_date,publication_date,workload,actual_hours,category,assignee:profiles!tasks_assignee_id_fkey(id,full_name),marketing_item:marketing_items(title),channel:channels(name)').is('deleted_at',null);
  if(assigneeId)query=query.eq('assignee_id',assigneeId);
  const {data,error}=await query.order('created_at',{ascending:false});
  return error?fail('tasks ophalen',error,[]):{data:(data??[]) as unknown as Task[],error:null};
}

export async function getCurrentProfile():Promise<DataResult<Profile|null>>{
  const sb=createServerSupabaseClient(); if(!sb)return fail('Supabase is niet geconfigureerd',null,null);
  const {data:{user},error:authError}=await sb.auth.getUser();
  if(authError)return fail('ingelogde gebruiker ophalen',authError,null);
  if(!user)return {data:null,error:null};
  const {data,error}=await sb.from('profiles').select('id,full_name,email,function_title').eq('id',user.id).maybeSingle();
  return error?fail('huidig profiel ophalen',error,null):{data,error:null};
}

export function progress(tasks:Pick<Task,'status'|'deleted_at'>[]|undefined){
  const current=(tasks??[]).filter(task=>!task.deleted_at); const done=current.filter(task=>task.status==='Afgerond'||task.status==='Gepubliceerd').length;
  return {total:current.length,done,percentage:current.length?Math.round(done/current.length*100):0};
}

export async function getReportData(){
  const sb=createServerSupabaseClient(); const empty={allocations:[] as Array<{hours:number;profile?:{name:string}|null}>,profiles:[] as Profile[],communicationProfiles:[] as Array<{id:string;name:string}>};
  if(!sb)return fail('Supabase is niet geconfigureerd',null,empty);
  const [allocations,profiles,communicationProfiles]=await Promise.all([
    sb.from('task_time_allocations').select('hours,profile:communication_profiles(name)'),
    sb.from('profiles').select('id,full_name,email,function_title').eq('is_active',true),
    sb.from('communication_profiles').select('id,name').is('deleted_at',null),
  ]);
  const error=allocations.error||profiles.error||communicationProfiles.error;
  if(error)return fail('rapportagegegevens ophalen',error,empty);
  return {data:{allocations:(allocations.data??[]) as unknown as typeof empty.allocations,profiles:(profiles.data??[]) as Profile[],communicationProfiles:communicationProfiles.data??[]},error:null};
}
