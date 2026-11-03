const fs=require('node:fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('timeout '+method));}},10000).unref();pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:4000/'});await delay(1300);

const ids=['hand-reconstruction','rc-racer','visual-odometry','baseball-catcher'];
const results=[];function check(name,pass,details){results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));}
fs.mkdirSync('artifacts',{recursive:true});fs.mkdirSync('assets/figures',{recursive:true});
check('seven projects and ten total works',await evaluate(`document.querySelectorAll('#projects .work').length===7&&document.querySelectorAll('.work').length===10`));
for(const id of ids){
 await evaluate(`document.querySelector('#work-${id} .preview-link').click()`);await delay(70);
 check('preview opens '+id,await evaluate(`document.getElementById('details-${id}').open`));
 await evaluate(`document.getElementById('details-${id}').open=false`);await delay(40);
 await evaluate(`document.querySelector('#work-${id} .preview-link').click()`);await delay(70);
 check('same-hash preview reopens '+id,await evaluate(`document.getElementById('details-${id}').open`));
}
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(200);
await evaluate(`document.documentElement.dataset.theme='light';window.dispatchEvent(new Event('themechange'));Fig.instances.forEach(f=>{f.playing=false;f.t=f.cfg.stillAt||4;f.redraw();})`);
if(process.argv.includes('--write-fallbacks'))for(const id of ids){
 const url=await evaluate(`Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='${id}').canvas.toDataURL('image/png')`);fs.writeFileSync(`assets/figures/${id}.png`,Buffer.from(url.split(',')[1],'base64'));
}
for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(160);
 await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'))`);
 check('no overflow '+width+' '+theme,await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
 for(const id of ids){
  await evaluate(`document.querySelector('#details-${id} .fig').scrollIntoView();Fig.instances.forEach(f=>{f.playing=false;f.t=f.cfg.stillAt||4;f.redraw();})`);await delay(80);
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`artifacts/new-${id}-${width}-${theme}.png`,Buffer.from(shot.data,'base64'));
  check('figure sized '+id+' '+width+' '+theme,await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='${id}');return f.w>0&&f.w<=innerWidth&&!f.canvas.hidden;})()`));
 }
}
check('hand stage controls',await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='hand-reconstruction');f.state.buttons.forEach((b,i)=>{b.click();if(f.state.stage!==i)throw Error('stage');});return true})()`));
check('racer cone control',await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='rc-racer');const before=f.state.cone;f.root.querySelector('.fig-input-group button').click();return f.state.cone!==before})()`));
check('odometry drift control',await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='visual-odometry');const el=f.root.querySelector('input');el.value=90;el.dispatchEvent(new Event('input'));return f.state.drift===90})()`));
check('catcher pitch control',await evaluate(`(()=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='baseball-catcher');const before=f.state.pitch;f.root.querySelector('.fig-input-group button').click();return f.state.pitch!==before})()`));
const before=await evaluate(`Fig.instances.filter(f=>!f.compact).map(f=>[f.el.dataset.fig,f.root.querySelectorAll('button,input').length])`);
for(let i=0;i<3;i++){await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=false)`);await delay(40);await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=true)`);await delay(50);await evaluate(`document.querySelectorAll('.fig [data-action="replay"]').forEach(x=>x.click())`);}
check('no duplicate controls',await evaluate(`JSON.stringify(Fig.instances.filter(f=>!f.compact&&${JSON.stringify(ids)}.includes(f.el.dataset.fig)).map(f=>[f.el.dataset.fig,f.root.querySelectorAll('button,input').length]))===${JSON.stringify(JSON.stringify(before.filter(x=>ids.includes(x[0]))))}`));
await evaluate(`document.querySelectorAll('details').forEach(x=>x.open=false)`);await delay(70);
check('closed figures paused',await evaluate(`Fig.instances.filter(f=>!f.compact).every(f=>!f.playing)`));
check('normal load and controls without JS errors',errors.length===0,errors);
fs.writeFileSync('artifacts/new-projects-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
