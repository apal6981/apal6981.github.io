const fs=require('node:fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('timeout '+method));}},10000).unref();pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:4000/'});await delay(1300);

const results=[];const check=(name,pass,details)=>{console.log(name,pass);results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(200);
for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
 await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'))`);await delay(200);
 for(const id of ['bellhop-rays','wilie-survey','ghost-modulation-sky','sss-pixels']){
 await evaluate(`document.querySelector('details .fig-frame[data-fig="${id}"]').scrollIntoView()`);await delay(100);
 const info=await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='${id}');return {width:f.w,height:f.h,viewport:innerWidth,scroll:document.documentElement.scrollWidth}})()`);
 check(`expanded ${id} ${width} ${theme}`,info.scroll<=width,info);
 if(width===375 || width===768){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`artifacts/expanded-${id}-${width}-${theme}.png`,Buffer.from(shot.data,'base64'));}
 }
}
// Each domain control changes its label/state and is safe to use repeatedly.
for(const id of ['bellhop-rays','wilie-survey','ghost-modulation-sky','sss-pixels']){
 const labels=await evaluate(`(()=>{const b=document.querySelector('details .fig-frame[data-fig="${id}"]').closest('figure').querySelector('.fig-input-group button');const before=b.textContent;b.click();return {before,after:b.textContent}})()`);check(`domain control ${id}`,labels.before!==labels.after,labels);
}
await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=false)`);await delay(100);
check('closed figures paused',await evaluate(`Fig.instances.filter(f=>!f.compact).every(f=>!f.playing)`));
await send('Page.navigate',{url:'http://127.0.0.1:4000/#details-sss'});await delay(300);
check('deep link opens SSS',await evaluate(`document.getElementById('details-sss').open`));
await evaluate(`document.getElementById('details-sss').open=false;document.querySelector('#details-sss summary').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await delay(100);
check('keyboard disclosure',await evaluate(`document.getElementById('details-sss').open`));
check('visible keyboard focus',await evaluate(`getComputedStyle(document.activeElement).outlineStyle==='solid'`));
await evaluate(`localStorage.removeItem('portfolio-theme')`);await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]});await send('Page.reload');await delay(350);
check('system dark',await evaluate(`document.documentElement.dataset.theme==='dark'`));
await evaluate(`document.querySelector('[data-theme-control]').click()`);await send('Page.reload');await delay(350);
check('explicit light persists',await evaluate(`document.documentElement.dataset.theme==='light'&&localStorage.getItem('portfolio-theme')==='light'`));
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.reload');await delay(350);await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(150);
check('reduced motion meaningful stills',await evaluate(`Fig.instances.every(f=>!f.playing)&&Fig.instances.some(f=>f.t>0)`));
// Runtime fallback and storage failure are injected before site scripts.
const injected=await send('Page.addScriptToEvaluateOnNewDocument',{source:`HTMLCanvasElement.prototype.getContext=function(){return null};Object.defineProperty(window,'localStorage',{get(){throw new Error('storage blocked')}});`});await send('Page.reload');await delay(350);await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(150);
check('canvas failure fallback',await evaluate(`[...document.querySelectorAll('.fig-frame')].every(x=>!x.querySelector('img').hidden&&x.querySelector('canvas').hidden)`));
check('storage failure theme control',await evaluate(`document.querySelector('[data-theme-control]').hidden===false`));
await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Page.reload');await delay(350);
await send('Emulation.setScriptExecutionDisabled',{value:false});
check('no JS static images',await evaluate(`[...document.querySelectorAll('.fig-frame')].every(x=>!x.querySelector('img').hidden)`));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Emulation.setEmulatedMedia',{features:[]});await send('Page.reload');await delay(350);
fs.writeFileSync('artifacts/extended-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
