import{s as o}from"./index-CYYD0Vbk.js";async function i(a,s,e=3600){const{data:t,error:r}=await o.storage.from(a).createSignedUrl(s,e);if(r)throw r;return t.signedUrl}export{i as s};
