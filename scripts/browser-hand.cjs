const fs=require('node:fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();const errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('timeout '+method));}},10000).unref();pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:4000/'});await delay(1300);


fs.mkdirSync('artifacts',{recursive:true});const results=[];
function check(name,pass,details){results.push({name,pass,details});if(!pass)throw Error(name);}
await evaluate(`document.querySelector('#work-hand-reconstruction .preview-link').click()`);await delay(100);
check('only local report link',await evaluate(`(()=>{const links=[...document.querySelectorAll('#work-hand-reconstruction .resources a')];return links.length===1&&links[0].getAttribute('href')==='/assets/3D_Reconstruction_of_Infant_Keepsakes_Report.pdf'})()`));
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(180);
await evaluate(`document.documentElement.dataset.theme='light';window.dispatchEvent(new Event('themechange'));var hand=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='hand-reconstruction');hand.playing=false;hand.t=13;hand.state.stage=-1;hand.redraw()`);
if(process.argv.includes('--write-fallback')){const url=await evaluate(`hand.canvas.toDataURL('image/png')`);fs.writeFileSync('assets/figures/hand-reconstruction.png',Buffer.from(url.split(',')[1],'base64'));}
for(const width of [375,768,1440])for(const theme of ['light','dark']){
await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(160);
await evaluate(`document.documentElement.dataset.theme='${theme}';window.dispatchEvent(new Event('themechange'));hand.playing=false;hand.t=13;`);
for(let stage=0;stage<4;stage++){
await evaluate(`hand.state.buttons[${stage}].click();hand.el.scrollIntoView()`);await delay(100);
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`artifacts/hand-${width}-${theme}-${stage}.png`,Buffer.from(shot.data,'base64'));
check(`stage ${stage} at ${width} ${theme}`,await evaluate(`hand.state.stage===${stage}&&!hand.canvas.hidden&&document.documentElement.scrollWidth<=innerWidth`));
}
}
const buttons=await evaluate(`hand.root.querySelectorAll('button').length`);
for(let i=0;i<3;i++){await evaluate(`document.getElementById('details-hand-reconstruction').open=false`);await delay(30);await evaluate(`document.querySelector('#work-hand-reconstruction .preview-link').click()`);await delay(30);await evaluate(`hand.root.querySelector('[data-action="replay"]').click()`);}
check('no duplicated hand controls',await evaluate(`hand.root.querySelectorAll('button').length===${buttons}`));
const timing=await evaluate(`(()=>{hand.playing=false;hand.state.stage=2;var a=performance.now();for(var i=0;i<10;i++)hand.redraw();return (performance.now()-a)/10})()`);results.push({name:'average draw milliseconds on this host',value:timing});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.reload');await delay(300);await evaluate(`document.querySelector('#work-hand-reconstruction .preview-link').click()`);await delay(80);
check('reduced motion hand still',await evaluate(`(()=>{var f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='hand-reconstruction');return !f.playing&&f.t===13})()`));
check('no JavaScript errors',errors.length===0,errors);
await send('Emulation.setEmulatedMedia',{features:[]});
fs.writeFileSync('artifacts/hand-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
