import type { EnrollmentForm, EnrollmentAnswers } from './EnrollmentFields';

export type SavedEnrollment = EnrollmentForm & {answers:EnrollmentAnswers};
export function EnrollmentAnswerSummary({form, chinese}:{form:SavedEnrollment;chinese:boolean}) {
 const label=(item:{labelKo:string;labelZh:string})=>chinese?item.labelZh:item.labelKo;
 return <dl className="space-y-4">{form.fields.map(field=>{
  const value=form.answers[field.id];
  const values=Array.isArray(value)?value:[value];
  const answer=values.filter(v=>v!==undefined&&v!==null&&v!=='').map(v=>{
   const option=field.options?.find(o=>o.id===v);
   return option?label(option):v;
  }).join(', ')||'-';
  return <div className="flex gap-3 items-start" key={field.id}>
   <dt className="w-[100px] shrink-0 text-sm font-semibold text-[#4b5563] break-words">{label(field)}</dt>
   <dd className="min-w-0 text-sm text-[#374151] whitespace-pre-wrap break-words">{answer}</dd>
  </div>;
 })}</dl>;
}
