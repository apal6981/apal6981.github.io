// Installed Playwright; existing local Jekyll/CDP fixture, matching publication checks.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9222');
 const context=await browser.newContext();const page=await context.newPage(),results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const check=(name,pass,details)=>{results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
 async function draw(t){return page.evaluate(t=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='ghost-modulation-sky');f.playing=false;f.t=t;f.redraw();return f.state.antenna;},t);}
 try{
 await page.goto('http://127.0.0.1:4000/#details-ghost-modulation');
 await page.waitForFunction(()=>Fig.instances.some(f=>!f.compact&&f.el.dataset.fig==='ghost-modulation-sky'));
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;window.dispatchEvent(new Event('themechange'));},theme);
 await page.locator('#details-ghost-modulation .fig-frame').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
 const angles=[];
 for(const t of [2.5,4.4,6.2]){const a=await draw(t);check(`main lobe clears observatory ${width} ${theme} at ${t}`,Math.abs(a.mainTargetX-a.dishX)>a.spread,a);angles.push(a.sideOffset);}
 check(`sidelobe fixed relative to boresight ${width} ${theme}`,Math.max(...angles)-Math.min(...angles)<1e-8);
 await draw(4.4);check(`no page overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/ghost-sidelobe-${width}-${theme}.png`});
 if(width===1440&&theme==='light'&&process.argv.includes('--write-fallback')){
 const data=await page.locator('#details-ghost-modulation canvas').evaluate(c=>c.toDataURL('image/png'));fs.writeFileSync('assets/figures/ghost-modulation.png',Buffer.from(data.split(',')[1],'base64'));
 }
 }
 const button=page.locator('#details-ghost-modulation .fig-input-group button');await button.click();await draw(7);
 check('replay mode remains available',(await button.innerText())==='Show a normal pass');
 await page.screenshot({path:'artifacts/ghost-replay-1440-dark.png'});await button.click();await draw(10.2);
 check('normal mode returns',(await button.innerText())==='Show a replay attack');
 for(let n=0;n<3;n++){await page.locator('#details-ghost-modulation').evaluate(e=>e.open=false);await page.locator('#work-ghost-modulation .preview-link').click();}
 check('no duplicate controls',await page.locator('#details-ghost-modulation button').count()===3);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();check('reduced motion remains paused',await page.evaluate(()=>Fig.instances.every(f=>!f.playing)));
 check('no JS errors',errors.length===0,errors);
 }finally{fs.writeFileSync('artifacts/ghost-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
