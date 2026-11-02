// Run against local Jekyll and Chromium's debugging port, using installed Playwright.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9222');
 const context=await browser.newContext();const page=await context.newPage();
 const results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const check=(name,pass,details)=>{results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
 fs.mkdirSync('artifacts',{recursive:true});
 try{
 await page.goto('http://127.0.0.1:4000/');
 await page.locator('#work-baseball-catcher .preview-link').click();
 await page.waitForFunction(()=>Fig.instances.some(f=>!f.compact&&f.el.dataset.fig==='baseball-catcher'));
 const draw=async t=>page.evaluate(t=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='baseball-catcher');f.playing=false;f.t=t;f.redraw();return f.state.projection;},t);
 await page.setViewportSize({width:1440,height:1000});await draw(4.5);
 if(process.argv.includes('--write-fallback')){
 const data=await page.evaluate(()=>Fig.instances.find(f=>!f.compact&&f.el.dataset.fig==='baseball-catcher').canvas.toDataURL('image/png'));
 fs.writeFileSync('assets/figures/baseball-catcher.png',Buffer.from(data.split(',')[1],'base64'));
 }
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});
 await page.evaluate(t=>{document.documentElement.dataset.theme=t;window.dispatchEvent(new Event('themechange'));},theme);
 await page.waitForTimeout(120);await draw(4.5);
 await page.locator('#details-baseball-catcher .fig-frame').scrollIntoViewIfNeeded();await page.waitForTimeout(180);await draw(4.5);
 check(`figure no overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/catcher-${width}-${theme}.png`});
 }
 const targets=[];
 for(let pitch=0;pitch<3;pitch++){
 const start=await draw(0),middle=await draw(3),end=await draw(6.5);
 check('one synchronized approach, pitch '+pitch,start.q===0&&middle.q>0&&middle.q<1&&end.q===1);
 check('elevation falls during approach, pitch '+pitch,end.y<start.y);
 check('catcher reaches both coordinates, pitch '+pitch,Math.abs(end.catcherX-end.targetX)<1e-8&&Math.abs(end.catcherY-end.targetY)<1e-8);
 targets.push([end.targetX,end.targetY]);
 await page.locator('#details-baseball-catcher button').filter({hasText:'Switch pitch'}).click();
 }
 check('three distinct XY targets',new Set(targets.map(x=>JSON.stringify(x))).size===3,targets);
 for(let i=0;i<3;i++){
 await page.evaluate(()=>document.getElementById('details-baseball-catcher').open=false);
 await page.locator('#work-baseball-catcher .preview-link').click();
 await page.locator('#details-baseball-catcher [data-action="replay"]').click();
 }
 check('no duplicate controls',await page.locator('#details-baseball-catcher button').count()===3);
 await page.locator('#work-baseball-catcher a[href="/projects/baseball-catcher/"]').click();
 await page.waitForURL('**/projects/baseball-catcher/');
 check('catcher-specific demo and caption',await page.locator('.story-heading a').innerText()==='Watch the catcher demo'&&(await page.locator('.story-preview figcaption').innerText()).includes('head-on'));
 check('four original images',await page.locator('.story-gallery img').count()===4);
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});
 await page.evaluate(t=>{document.documentElement.dataset.theme=t;},theme);
 for(const img of await page.locator('.story-gallery img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
 check(`page no overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});await page.waitForTimeout(100);
 await page.screenshot({path:`artifacts/catcher-story-${width}-${theme}.png`,fullPage:true});
 }
 await page.locator('.back-link').click();await page.waitForURL('**/#work-baseball-catcher');
 check('return opens correct project',await page.locator('#details-baseball-catcher').evaluate(e=>e.open));
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 check('reduced motion still',await page.evaluate(()=>Fig.instances.every(f=>!f.playing)));
 await page.goto('http://127.0.0.1:4000/projects/rc-racer/');
 check('racer retains own gallery and labels',await page.locator('.story-gallery img').count()===5&&(await page.locator('.story-heading a').innerText())==='Watch the race'&&(await page.locator('.story-preview figcaption').innerText()).includes('track'));
 const noJS=await browser.newContext({javaScriptEnabled:false});const fallback=await noJS.newPage();
 await fallback.goto('http://127.0.0.1:4000/');
 check('catcher fallback without JS',await (async()=>{const img=fallback.locator('#work-baseball-catcher .preview-link img');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());return img.evaluate(i=>i.naturalWidth>0);})());
 await noJS.close();check('no JavaScript errors',errors.length===0,errors);
 }finally{
 fs.writeFileSync('artifacts/catcher-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
