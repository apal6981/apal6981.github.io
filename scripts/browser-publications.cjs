// Existing local Jekyll at :4000 and installed Playwright/Chromium CDP at :9222.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9222');
 const context=await browser.newContext();const page=await context.newPage();
 const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const spread=particles=>{const mx=particles.reduce((s,p)=>s+p.x,0)/particles.length,my=particles.reduce((s,p)=>s+p.y,0)/particles.length;return particles.reduce((s,p)=>s+(p.x-mx)**2+(p.y-my)**2,0)/particles.length;};
 const check=(name,pass,details)=>{results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
 fs.mkdirSync('artifacts',{recursive:true});
 async function state(slug){return page.evaluate(slug=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig===slug);return {stage:f.state.stage,particles:f.state.particles,truth:f.state.truth,beacon:f.state.beacon,halted:f.state.halted,probability:f.state.movingProbability,buttons:f.root.querySelectorAll('button').length,playing:f.playing};},slug);}
 try{
 await page.goto('http://127.0.0.1:4000/');
 check('six publications',await page.locator('#publications .work').count()===6);
 for(const slug of ['acoustic-localization','lora-localization']){
 const work=page.locator('#work-'+slug),details=page.locator('#details-'+slug);
 await work.locator('.preview-link').click();
 await page.waitForFunction(slug=>Fig.instances.some(f=>!f.compact&&f.el.dataset.fig===slug),slug);
 await page.evaluate(slug=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig===slug);f.playing=false;f._sync();},slug);
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});
 await page.evaluate(t=>{document.documentElement.dataset.theme=t;window.dispatchEvent(new Event('themechange'));},theme);
 await details.locator('.fig-frame').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
 check(`${slug} no figure overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/${slug}-${width}-${theme}.png`});
 }
 await page.evaluate(slug=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig===slug);f.t=f.cfg.stillAt;f.redraw();},slug);
 if(process.argv.includes('--write-fallback')){
 await page.evaluate(()=>{document.documentElement.dataset.theme='light';window.dispatchEvent(new Event('themechange'));});
 const data=await details.locator('canvas').evaluate(c=>c.toDataURL('image/png'));
 fs.writeFileSync(`assets/figures/${slug}.png`,Buffer.from(data.split(',')[1],'base64'));
 }
 await details.locator('[data-action="replay"]').click();
 await page.evaluate(slug=>{Fig.instances.find(f=>!f.compact&&f.el.dataset.fig===slug).playing=false;},slug);
 const step=details.getByRole('button',{name:'Step filter'});
 for(let n=0;n<3;n++){
 const before=await state(slug);await step.click();const after=await state(slug);
 check(slug+' step follows filter phases '+n,after.stage===(before.stage+1)%3&&!after.playing,{before:before.stage,after:after.stage,playing:after.playing});
 check(slug+' finite normalized particles '+n,after.particles.length===160&&after.particles.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.weight>0)&&Math.abs(after.particles.reduce((s,p)=>s+p.weight,0)-1)<1e-8);
 if(after.stage===1)check(slug+' measurements change weights',new Set(after.particles.map(p=>p.weight.toFixed(9))).size>1);
 if(after.stage===2)check(slug+' weighted resampling selects existing hypotheses',after.particles.every(p=>before.particles.some(b=>b.x===p.x&&b.y===p.y))&&new Set(after.particles.map(p=>[p.x,p.y].join(','))).size<160);
 }
 if(slug==='acoustic-localization'){
 const before=await state(slug);for(let n=0;n<3;n++)await step.click();const after=await state(slug);
 check('acoustic sequential beacon',after.beacon===(before.beacon+1)%4);
 }else{
 await details.getByRole('button',{name:'Stop the robot'}).click();const stopped=await state(slug);
 for(let n=0;n<75;n++)await step.click();const stationary=await state(slug);
 check('robot remains stopped while filter operates',stationary.halted&&stationary.truth.x===stopped.truth.x&&stationary.truth.y===stopped.truth.y);
 check('stable signal history informs stopped class',stationary.probability<.5,stationary.probability);
 check('stationary particle cloud tightens or stays bounded',spread(stationary.particles)<=Math.max(.0001,spread(stopped.particles)*1.1),{before:spread(stopped.particles),after:spread(stationary.particles)});
 await details.getByRole('button',{name:'Resume the robot'}).click();const resumed=await state(slug);
 check('resume changes signal source position',!resumed.halted&&resumed.truth.x>stationary.truth.x);
 check('moving cloud regains motion uncertainty',spread(resumed.particles)>spread(stationary.particles),{stopped:spread(stationary.particles),resumed:spread(resumed.particles)});
 }
 for(let n=0;n<3;n++){await details.evaluate(e=>e.open=false);await work.locator('.preview-link').click();await details.locator('[data-action="replay"]').click();}
 check(slug+' controls do not duplicate',(await state(slug)).buttons===(slug==='lora-localization'?4:3));
 await work.getByRole('link',{name:'Research background'}).click();await page.waitForURL(`**/publications/${slug}/`);
 check(slug+' correct supplied IEEE link',await page.getByRole('link',{name:'Published version on IEEE Xplore'}).getAttribute('href')==='https://ieeexplore.ieee.org/document/'+(slug==='lora-localization'?'10801786':'11245189'));
 check(slug+' contribution placeholder',await page.getByRole('heading',{name:'Individual contributions'}).isVisible()&&(await page.locator('.empty-state').innerText()).includes('to be added'));
 const paper=await page.request.get('http://127.0.0.1:4000/assets/papers/'+slug+'.pdf');
 check(slug+' local PDF serves',paper.ok()&&(await paper.body()).subarray(0,5).toString()==='%PDF-');
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
 const image=page.locator('.story-gallery img');await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());
 check(`${slug} no page overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});await page.screenshot({path:`artifacts/${slug}-story-${width}-${theme}.png`,fullPage:true});
 }
 await page.locator('.back-link').click();await page.waitForURL('**/#work-'+slug);
 check(slug+' back opens disclosure',await details.evaluate(e=>e.open));
 await details.evaluate(e=>e.open=false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4000/#details-lora-localization');await page.reload();
 check('reduced motion full figure stays still',await page.evaluate(()=>Fig.instances.every(f=>!f.playing)));
 const noJS=await browser.newContext({javaScriptEnabled:false});const fallback=await noJS.newPage();await fallback.goto('http://127.0.0.1:4000/');
 for(const slug of ['acoustic-localization','lora-localization']){const img=fallback.locator('#work-'+slug+' .preview-link img');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());check(slug+' no JS fallback',await img.evaluate(i=>i.naturalWidth>0));}
 await noJS.close();check('no normal-load JS errors',errors.length===0,errors);
 }finally{fs.writeFileSync('artifacts/publication-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
