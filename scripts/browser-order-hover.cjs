const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('node:fs');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9222'),context=await browser.newContext(),page=await context.newPage();
 const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const check=(name,pass,details)=>{results.push({name,pass,details});if(!pass)throw Error(name+': '+JSON.stringify(details));};
 try{
 await page.goto('http://127.0.0.1:4000/');
 for(const section of ['projects','publications']){
 const years=await page.locator('#'+section+' .work-year').allTextContents();check(section+' newest first',years.every((y,i)=>i===0||Number(years[i-1])>=Number(y)),years);
 }
 check('hand is first project and dated 2024',await page.locator('#projects .work').first().getAttribute('id')==='work-hand-reconstruction'&&(await page.locator('#work-hand-reconstruction .work-year').innerText())==='2024');
 check('previews initially still',await page.evaluate(()=>Fig.instances.filter(f=>f.compact).every(f=>!f.playing)));
 const ids=await page.locator('.thumb-fig').evaluateAll(els=>els.map(e=>e.dataset.fig));
 for(const id of ids){
 const preview=page.locator(`.preview-link:has([data-fig="${id}"])`);
 await preview.hover();await page.waitForTimeout(150);
 const first=await page.evaluate(id=>{const f=Fig.instances.find(f=>f.compact&&f.el.dataset.fig===id);return {t:f.t,playing:f.playing,pixels:f.canvas.toDataURL()};},id);
 await page.waitForTimeout(650);
 const next=await page.evaluate(id=>{const f=Fig.instances.find(f=>f.compact&&f.el.dataset.fig===id);return {t:f.t,playing:f.playing,pixels:f.canvas.toDataURL()};},id);
 check(id+' hover advances time',first.playing&&next.playing&&next.t>first.t);
 check(id+' preview pixels animate',first.pixels!==next.pixels);
 await page.mouse.move(0,0);await page.waitForTimeout(80);
 check(id+' mouse leave restores still',await page.evaluate(id=>{const f=Fig.instances.find(f=>f.compact&&f.el.dataset.fig===id);return !f.playing&&f.t===(f.cfg.stillAt||0);},id));
 }
 const keyboard=await context.newPage();await keyboard.goto('http://127.0.0.1:4000/');await keyboard.keyboard.press('Tab');await keyboard.locator('#work-hand-reconstruction .preview-link').focus();await keyboard.waitForTimeout(120);
 check('keyboard focus previews',await keyboard.evaluate(()=>Fig.instances.find(f=>f.compact&&f.el.dataset.fig==='hand-reconstruction').playing));await keyboard.close();
 for(const width of [375,768,1440])for(const theme of ['light','dark']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;window.dispatchEvent(new Event('themechange'));},theme);
 await page.locator('#projects').scrollIntoViewIfNeeded();await page.waitForTimeout(180);check(`no overflow ${width} ${theme}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/order-hover-${width}-${theme}.png`});
 }
 const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage();await reducedPage.goto('http://127.0.0.1:4000/');await reducedPage.locator('#work-hand-reconstruction .preview-link').hover();await reducedPage.waitForTimeout(350);
 check('reduced motion suppresses hover animation',await reducedPage.evaluate(()=>Fig.instances.filter(f=>f.compact).every(f=>!f.playing)));await reduced.close();
 const touch=await browser.newContext({isMobile:true,hasTouch:true,viewport:{width:375,height:900}}),touchPage=await touch.newPage();await touchPage.goto('http://127.0.0.1:4000/');await touchPage.locator('#work-hand-reconstruction .preview-link').tap();
 check('touch opens disclosure without hover autoplay',await touchPage.locator('#details-hand-reconstruction').evaluate(e=>e.open)&&await touchPage.evaluate(()=>Fig.instances.filter(f=>f.compact).every(f=>!f.playing)));await touch.close();
 check('no JS errors',errors.length===0,errors);
 }finally{fs.writeFileSync('artifacts/order-hover-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
