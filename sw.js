const V='tower-v1',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return; // las APIs externas nunca se cachean
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
    const n=fetch(e.request).then(res=>{if(res.ok){const k=res.clone();caches.open(V).then(c=>c.put(e.request,k))}return res}).catch(()=>r);
    return r||n}))});
