const fs=require('node:fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('timeout '+method));}},10000).unref();pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:4000/'});await delay(1300);


fs.mkdirSync('artifacts',{recursive:true});const results=[];function check(name,pass,details){results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));}
await evaluate(`document.querySelector('#work-rc-racer .preview-link').click()`);await delay(120);
check('five cones',await evaluate(`Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='rc-racer').cfg.cones.length===5`));
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(180);
await evaluate(`document.documentElement.dataset.theme='light';window.dispatchEvent(new Event('themechange'));var racer=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='rc-racer');racer.playing=false;racer.t=4;racer.redraw()`);
if(process.argv.includes('--write-fallback')){const url=await evaluate(`racer.canvas.toDataURL('image/png')`);fs.writeFileSync('assets/figures/rc-racer.png',Buffer.from(url.split(',')[1],'base64'));}
for(const width of [375,768,1440])for(const theme of ['light','dark']){
await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(160);
await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'));racer.playing=false;racer.t=4;racer.redraw();racer.el.scrollIntoView()`);await delay(100);
check('racer no overflow '+width+' '+theme,await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`artifacts/racer-${width}-${theme}.png`,Buffer.from(shot.data,'base64'));
}
check('remove/add all cones',await evaluate(`(()=>{var b=racer.root.querySelector('.fig-input-group button');b.click();if(racer.state.cone||b.textContent!=='Add the cones')return false;b.click();return racer.state.cone&&b.textContent==='Remove the cones';})()`));
for(let n=0;n<3;n++){await evaluate(`document.getElementById('details-rc-racer').open=false`);await delay(30);await evaluate(`document.querySelector('#work-rc-racer .preview-link').click()`);await delay(30);await evaluate(`racer.root.querySelector('[data-action="replay"]').click()`);}
check('no duplicate controls',await evaluate(`racer.root.querySelectorAll('button').length===3`));
await evaluate(`document.querySelector('#work-rc-racer a[href="/projects/rc-racer/"]').click()`);await delay(300);
check('local background opens',await evaluate(`location.pathname==='/projects/rc-racer/'&&document.querySelector('h1').textContent==='Self-Driving RC Racer'`));
check('five original project images load',await evaluate(`(async()=>{const imgs=[...document.querySelectorAll('.story-gallery img')];await Promise.all(imgs.map(i=>i.decode()));return imgs.length===5&&imgs.every(i=>i.naturalWidth>0&&i.alt.length>0)})()`));
check('no external background links',await evaluate(`[...document.querySelectorAll('a')].every(x=>!x.href.includes('drbenham.website'))`));
for(const width of [375,768,1440])for(const theme of ['light','dark']){
await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(80);
await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'));scrollTo(0,0)`);await delay(80);
check('story no overflow '+width+' '+theme,await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`artifacts/racer-story-${width}-${theme}.png`,Buffer.from(shot.data,'base64'));
await evaluate(`document.querySelector('.story-body').scrollIntoView()`);await delay(100);const bodyShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`artifacts/racer-story-body-${width}-${theme}.png`,Buffer.from(bodyShot.data,'base64'));
}
await evaluate(`document.querySelector('.back-link').click()`);await delay(300);
check('back to project disclosure',await evaluate(`location.pathname==='/'&&location.hash==='#work-rc-racer'&&document.getElementById('details-rc-racer').open`));
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.reload');await delay(300);
check('reduced-motion still',await evaluate(`Fig.instances.every(f=>!f.playing)`));
await send('Emulation.setEmulatedMedia',{features:[]});check('no JS errors',errors.length===0,errors);
fs.writeFileSync('artifacts/racer-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
