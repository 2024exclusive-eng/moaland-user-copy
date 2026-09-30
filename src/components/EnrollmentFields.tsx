"use client";
export interface EnrollmentField {id:string;type:'text'|'textarea'|'number'|'date'|'url'|'select'|'multi';labelKo:string;labelZh:string;required:boolean;options?:{id:string;labelKo:string;labelZh:string}[];}
export interface EnrollmentForm {version:number;fields:EnrollmentField[];}
export type EnrollmentAnswers=Record<string,string|string[]>;
export function EnrollmentFields({form,answers,onChange,chinese}:{form:EnrollmentForm;answers:EnrollmentAnswers;onChange:(id:string,value:string|string[])=>void;chinese:boolean}) {
 const label=(v:{labelKo:string;labelZh:string})=>chinese?v.labelZh:v.labelKo;
 const css='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';
 return <div className="space-y-4">{form.fields.map(f=><fieldset key={f.id}><legend className="mb-2 text-sm font-semibold">{label(f)} {f.required?'*':chinese?'（选填）':'(선택)'}</legend>
 {f.type==='multi'?<div className="space-y-2">{f.options?.map(o=><label className="flex gap-2 text-sm" key={o.id}><input type="checkbox" checked={Array.isArray(answers[f.id])&&answers[f.id].includes(o.id)} onChange={e=>{const old=Array.isArray(answers[f.id])?answers[f.id] as string[]:[];onChange(f.id,e.target.checked?[...old,o.id]:old.filter(x=>x!==o.id));}}/>{label(o)}</label>)}</div>:f.type==='select'?<select aria-label={label(f)} className={css} value={String(answers[f.id]||'')} onChange={e=>onChange(f.id,e.target.value)}><option value="">{chinese?'请选择':'선택해 주세요'}</option>{f.options?.map(o=><option key={o.id} value={o.id}>{label(o)}</option>)}</select>:f.type==='textarea'?<textarea aria-label={label(f)} className={css} maxLength={2000} value={String(answers[f.id]||'')} onChange={e=>onChange(f.id,e.target.value)}/>:<input aria-label={label(f)} className={css} type={f.type} step={f.type==='number'?'any':undefined} maxLength={500} value={String(answers[f.id]||'')} onChange={e=>onChange(f.id,e.target.value)}/>}
 </fieldset>)}</div>;
}
