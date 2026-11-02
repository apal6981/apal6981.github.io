const fs=require('node:fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('timeout '+method));}},10000).unref();pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:4000/'});await delay(1300);
fs.mkdirSync('artifacts',{recursive:true});let results=[];
for(const width of [375,768,1440])for(const theme of ['light','dark']){
await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'))`);await delay(200);
results.push({width,theme,metrics:await evaluate(`({scroll:document.documentElement.scrollWidth,viewport:innerWidth,works:document.querySelectorAll('.work').length,figures:Fig.instances.length,headings:[...document.querySelectorAll('h2')].map(x=>x.textContent),overflow:[...document.querySelectorAll('body *')].filter(x=>x.getBoundingClientRect().right>innerWidth+1).map(x=>x.className).slice(0,10)})`)});
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`artifacts/${width}-${theme}.png`,Buffer.from(shot.data,'base64'));
}
await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(500);
results.push({open:await evaluate(`Fig.instances.map(f=>({id:f.el.dataset.fig,compact:f.compact,playing:f.playing,controls:f.root.querySelectorAll('button').length,width:f.w,height:f.h}))`)});
for(let i=0;i<3;i++){await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=false)`);await delay(50);await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(50);await evaluate(`document.querySelectorAll('.fig [data-action="replay"]').forEach(x=>x.click())`)}
results.push({repeat:await evaluate(`Fig.instances.filter(f=>!f.compact).map(f=>({id:f.el.dataset.fig,buttons:f.root.querySelectorAll('button').length,labels:[...f.root.querySelectorAll('button')].map(x=>x.textContent)}))`)});
for(const f of await evaluate(`Fig.instances.filter(f=>!f.compact).map(f=>f.el.dataset.fig)`)){
await evaluate(`document.querySelector('details .fig-frame[data-fig="${f}"]').scrollIntoView()`);await delay(100);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`artifacts/figure-${f}.png`,Buffer.from(shot.data,'base64'));
}
fs.writeFileSync('artifacts/browser-results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
