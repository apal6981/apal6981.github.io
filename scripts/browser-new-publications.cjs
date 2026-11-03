const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('node:fs');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9222'),context=await browser.newContext(),page=await context.newPage();
 const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const check=(name,pass,details)=>{results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
 const draw=async(slug,t)=>page.evaluate(({slug,t})=>{const f=Fig.instances.find(f=>!f.compact&&f.el.dataset.fig===slug);f.playing=false;f.t=t;f.redraw();return f.state;},{slug,t});
 try{
 await page.goto('http://127.0.0.1:4000/');check('six publications',await page.locator('#publications .work').count()===6);
 check('workshop has local and publisher links',await page.locator('#work-ghost-modulation a[href="/assets/papers/stealthy-signals.pdf"]').count()===1&&await page.locator('#work-ghost-modulation a[href="https://dl.acm.org/doi/10.1145/3614204.3616105"]').count()===1);
 for(const slug of ['wireless-latency','spectral-coordination','ghost-channel']){
 const work=page.locator('#work-'+slug),details=page.locator('#details-'+slug);
 await work.locator('.preview-link').click();await page.waitForFunction(slug=>Fig.instances.some(f=>!f.compact&&f.el.dataset.fig===slug),slug);
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;window.dispatchEvent(new Event('themechange'));},theme);
 await details.locator('.fig-frame').scrollIntoViewIfNeeded();await page.waitForTimeout(200);await draw(slug,slug==='wireless-latency'?1.8:4);
 check(`${slug} figure overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/${slug}-${width}-${theme}.png`});
 }
 if(process.argv.includes('--write-fallback')){
 await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(180);await page.evaluate(()=>{document.documentElement.dataset.theme='light';window.dispatchEvent(new Event('themechange'));});
 await draw(slug,slug==='wireless-latency'?1.8:6);
 const data=await details.locator('canvas').evaluate(c=>c.toDataURL('image/png'));fs.writeFileSync('assets/figures/'+slug+'.png',Buffer.from(data.split(',')[1],'base64'));
 }
 if(slug==='wireless-latency'){
 const before=(await draw(slug,1.8)).encoding;await details.getByRole('button',{name:'Send bit 0'}).click();const after=(await draw(slug,1.8)).encoding;
 check('latency bit reverses spreading pattern',before.bit===1&&after.bit===0&&before.chips.every((v,i)=>v+after.chips[i]===1));
 }else if(slug==='spectral-coordination'){
 const initial=(await draw(slug,6)).packet;check('coordination request decodes',initial.decoded&&initial.centerMHz===2450&&initial.bandwidthMHz===20&&initial.durationMinutes===10);
 await details.getByRole('button',{name:'Ignore the request'}).click();check('noncompliant behavior',!(await draw(slug,6)).packet.compliant);
 await details.getByRole('button',{name:'Honor the request'}).click();check('compliant behavior',(await draw(slug,6)).packet.compliant);
 }else{
 check('clean channel',JSON.stringify((await draw(slug,4)).channel.outputs)==='["0","1"]');
 await details.getByRole('button',{name:'Add delay'}).click();check('asymmetric delay illustration',JSON.stringify((await draw(slug,4)).channel.outputs)==='["1","?"]');
 await details.getByRole('button',{name:'Drop the packets'}).click();check('dropped events are erased',JSON.stringify((await draw(slug,4)).channel.outputs)==='["?","?"]');
 await details.getByRole('button',{name:'Add extra events'}).click();check('multiple events are erased',JSON.stringify((await draw(slug,4)).channel.outputs)==='["?","?"]');
 }
 for(let n=0;n<3;n++){await details.evaluate(e=>e.open=false);await work.locator('.preview-link').click();await details.locator('[data-action="replay"]').click();}
 check(slug+' no duplicate controls',await details.locator('button').count()===3);
 await work.getByRole('link',{name:'Research background'}).click();await page.waitForURL('**/publications/'+slug+'/');
 check(slug+' contribution heading',await page.getByRole('heading',{name:'Individual contributions'}).count()===1);
 if(slug==='ghost-channel'){check('official published record is retained',await page.getByRole('link',{name:'Published version on IDEALS repository'}).getAttribute('href')==='https://www.ideals.illinois.edu/items/137292');const pdf=await page.request.get('http://127.0.0.1:4000/assets/papers/ghost-channel-arxiv.pdf');check('local arXiv PDF with explicit version label',pdf.ok()&&(await pdf.body()).subarray(0,5).toString()==='%PDF-'&&await page.getByRole('link',{name:'Read the arXiv preprint (PDF)'}).count()===1);}
 else{const response=await page.request.get('http://127.0.0.1:4000/assets/papers/'+slug+'.pdf');check(slug+' local PDF serves',response.ok()&&(await response.body()).subarray(0,5).toString()==='%PDF-');}
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.activeElement.blur();scrollTo(0,0);},theme);
 check(`${slug} page overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`artifacts/${slug}-story-${width}-${theme}.png`,fullPage:true});
 }
 await page.locator('.back-link').click();await page.waitForURL('**/#work-'+slug);check(slug+' back opens disclosure',await details.evaluate(e=>e.open));await details.evaluate(e=>e.open=false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();check('reduced motion stills',await page.evaluate(()=>Fig.instances.every(f=>!f.playing)));
 const noJS=await browser.newContext({javaScriptEnabled:false}),fallback=await noJS.newPage();await fallback.goto('http://127.0.0.1:4000/');
 for(const slug of ['wireless-latency','spectral-coordination','ghost-channel']){const img=fallback.locator('#work-'+slug+' .preview-link img');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());check(slug+' no-JS fallback',await img.evaluate(i=>i.naturalWidth>0));}
 await noJS.close();check('no JS errors',errors.length===0,errors);
 }finally{fs.writeFileSync('artifacts/new-publications-review-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
