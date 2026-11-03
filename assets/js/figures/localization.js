/* Educational particle filter over synthetic signal fields. No trained GP or recorded data. */
(function(){
 'use strict';var D=Fig.diagram;
 var beacons=[{x:.12,y:.14},{x:.86,y:.16},{x:.16,y:.84},{x:.87,y:.82}];
 function field(x,y,b){var p=beacons[b],d=Math.hypot(x-p.x,y-p.y);return -45-24*Math.log(1+4*d)+5*Math.sin(x*8+b)*Math.cos(y*7-b);}
 function random(s){s.seed=(1664525*s.seed+1013904223)>>>0;return s.seed/4294967296;}
 function noise(s){return Math.sqrt(-2*Math.log(Math.max(.0001,random(s))))*Math.cos(2*Math.PI*random(s));}
 function initialize(f){
  var halted=f.state.halted||false;f.state={halted:halted,seed:3257,stage:-1,cycle:0,progress:0,beacon:0,clock:-1,trace:[],similarity:.9,movingProbability:.5};
  var s=f.state;s.truth={x:.23,y:.46};s.particles=[];
  for(var i=0;i<160;i++)s.particles.push({x:.05+.9*random(s),y:.05+.9*random(s),weight:1/160});
  s.measurements=beacons.map(function(_,b){return field(s.truth.x,s.truth.y,b);});s.trace.push({x:s.truth.x,y:s.truth.y});
 }
 function advance(f,urban){
  var s=f.state;s.stage=(s.stage+1)%3;
  if(s.stage===0){
   if(s.progress>=22&&!s.halted){initialize(f);s=f.state;s.stage=0;}
   s.beacon=s.cycle%4;var previous=s.truth,old=s.measurements;
   if(!s.halted){s.progress++;s.truth={x:.23+.024*s.progress,y:.46+.17*Math.sin(s.progress*.24)};}
   s.measurements=beacons.map(function(_,b){return field(s.truth.x,s.truth.y,b)+noise(s)*.25;});
   var difference=s.measurements.reduce(function(sum,value,b){return sum+Math.pow(value-old[b],2);},0)/4;
   s.similarity=Math.exp(-difference/(2*1.5*1.5));
   // A toy moving/stopped classifier illustrates the role of the paper's trained GMM.
   s.movingProbability=1/(1+Math.exp(-14*((1-s.similarity)-.08)));
   var dx=s.truth.x-previous.x,dy=s.truth.y-previous.y;
   s.heading=Math.atan2(dy,dx||.000001);s.command=Math.hypot(dx,dy);
   var moving=urban?s.movingProbability>.5:!s.halted;
   var magnitude=urban?(moving?.035:0):s.command;
   var spread=urban?.008+.025*(1-Math.abs(s.movingProbability-.5)*2):.012;
   s.particles.forEach(function(p){var heading=s.heading+noise(s)*.15,d=magnitude+noise(s)*spread;p.x=Math.max(.02,Math.min(.98,p.x+d*Math.cos(heading)));p.y=Math.max(.02,Math.min(.98,p.y+d*Math.sin(heading)));});
   s.trace.push({x:s.truth.x,y:s.truth.y});
  }else if(s.stage===1){
   var total=0;
   s.particles.forEach(function(p){
    var weight=1;
    beacons.forEach(function(_,b){if(urban||b===s.beacon){var residual=(field(p.x,p.y,b)-s.measurements[b])/3;weight*=1/(.4+Math.abs(residual));}});
    p.weight=weight;total+=weight;
   });
   s.particles.forEach(function(p){p.weight/=total;});
  }else{
   var cumulative=[],sum=0;s.particles.forEach(function(p){sum+=p.weight;cumulative.push(sum);});
   var next=[];for(var k=0;k<s.particles.length;k++){var r=random(s),index=0;while(index<cumulative.length-1&&r>cumulative[index])index++;var parent=s.particles[index];next.push({x:parent.x,y:parent.y,weight:1/s.particles.length});}
   s.particles=next;s.cycle++;
  }
  s.estimate=s.particles.reduce(function(a,p){a.x+=p.x*p.weight;a.y+=p.y*p.weight;return a;},{x:0,y:0});
 }
 Fig.localization=function(id,urban){
  Fig.register(id,{
   config:{mobileAspect:.55,stillAt:15},
   setup:function(f){
    initialize(f);
    f.button('Step filter',function(){f.playing=false;f._sync();advance(f,urban);f.redraw();});
    if(urban)f.button('Stop the robot',function(b){f.state.halted=!f.state.halted;b.textContent=f.state.halted?'Resume the robot':'Stop the robot';advanceToMotion(f);f.redraw();});
    function advanceToMotion(f){do{advance(f,urban);}while(f.state.stage!==0);}
   },
   reset:function(f){initialize(f);if(f.inputs){var b=f.inputs.querySelectorAll('button')[1];if(b)b.textContent=f.state.halted?'Resume the robot':'Stop the robot';}},
   draw:function(f,t){
    var s=f.state;if(!s.particles){initialize(f);s=f.state;}
    var bucket=Math.floor(t/1.2);
    if(bucket<s.clock){initialize(f);s=f.state;}
    // A paused manual step retains its state until the next authored clock boundary.
    if(bucket>s.clock){for(var step=s.clock+1;step<=Math.min(bucket,s.clock+75);step++)advance(f,urban);s=f.state;s.clock=bucket;}
    var C=f.c,c=f.ctx,narrow=f.w<480;
    D.start(f,urban?'LoRa signals → motion and location':'Acoustic RSS → location belief');
    var map={x:18,y:52,w:narrow?f.w-36:f.w*.60,h:narrow?f.h*.37:f.h-108};
    D.box(f,map.x,map.y,map.w,map.h,C.line,C.bg);
    // Display a synthetic per-beacon field as a low-opacity heatmap, never range rings.
    var b=s.beacon;
    for(var y=0;y<24;y++)for(var x=0;x<30;x++){
     var value=(field((x+.5)/30,(y+.5)/24,b)+90)/50;
     c.fillStyle=f.alpha(C.signal,.04+Math.max(0,Math.min(1,value))*.25);
     var x0=Math.floor(map.x+x*map.w/30),y0=Math.floor(map.y+y*map.h/24);
     c.fillRect(x0,y0,Math.floor(map.x+(x+1)*map.w/30)-x0,Math.floor(map.y+(y+1)*map.h/24)-y0);
    }
    function project(p){return {x:map.x+p.x*map.w,y:map.y+p.y*map.h};}
    if(urban){
     [[.32,.19,.15,.16],[.57,.62,.16,.16]].forEach(function(v){D.box(f,map.x+map.w*v[0],map.y+map.h*v[1],map.w*v[2],map.h*v[3],C.lineStrong,f.alpha(C.ink,.08));});
    }else{
     [.08,.92].forEach(function(x){D.line(f,[project({x:x,y:.05}),project({x:x,y:.95})],C.lineStrong,4);});
    }
    D.line(f,s.trace.map(project),C.ink3,1,true);
    s.particles.forEach(function(p){var pos=project(p);D.dot(f,pos.x,pos.y,s.stage===1?Math.min(5,1+Math.sqrt(p.weight)*15):2,f.alpha(C.signal,.75));});
    beacons.forEach(function(p,i){var pos=project(p),active=i===s.beacon;D.dot(f,pos.x,pos.y,active?7:4,active?C.accent:C.ink2);D.text(f,String(i+1),pos.x+9,pos.y+4,C.ink,11);});
    var truth=project(s.truth),est=project(s.estimate||s.truth);
    c.save();c.translate(truth.x,truth.y);c.rotate((s.heading||0)+Math.PI/2);c.beginPath();c.moveTo(0,-7);c.lineTo(-5,6);c.lineTo(5,6);c.closePath();c.fillStyle=C.ink;c.fill();c.restore();
    D.box(f,est.x-5,est.y-5,10,10,C.accent);
    var xx=narrow?18:map.x+map.w+26,yy=narrow?map.y+map.h+26:57,ww=narrow?f.w-36:f.w-xx-18;
    D.text(f,'Beacon '+(s.beacon+1)+' signal map',xx,yy,C.ink,12,650);
    D.text(f,urban?'Four RSSI observations':'One beacon per update',xx,yy+21,C.ink2,11);
    for(var n=0;n<4;n++){
     var row=yy+44+n*19;D.text(f,String(n+1),xx,row+4,C.ink2,11);
     var width=ww-40;D.box(f,xx+19,row-5,width,7,C.line);
     c.fillStyle=(urban||n===s.beacon)?C.accent:C.lineStrong;c.fillRect(xx+19,row-5,width*Math.max(.02,Math.min(1,(s.measurements[n]+90)/50)),7);
    }
    var stages=['Motion','Measurement','Resampling'];
    stages.forEach(function(name,index){D.text(f,(s.stage===index?'→ ':'  ')+name,xx,yy+137+index*21,s.stage===index?C.accent:C.ink2,12,s.stage===index?650:500);});
    if(urban&&f.h>340){
     D.text(f,'Signal history + heading',xx,yy+213,C.ink,11,650);
     D.text(f,s.movingProbability>.5?'Classifier: likely moving':'Classifier: likely stopped',xx,yy+235,C.ink2,11);
     D.text(f,'Recent similarity: '+s.similarity.toFixed(2),xx,yy+254,C.ink3,11);
    }else if(!urban&&f.h>340){
     D.text(f,'Commanded speed + heading',xx,yy+213,C.ink2,11);
     D.text(f,'Sequential beacon updates',xx,yy+235,C.ink3,11);
    }
    D.text(f,'Dots: particles · □ estimate · ▲ reference',18,f.h-29,C.ink2,10.5);
    D.text(f,'Illustrative fields, route and timing',18,f.h-11,C.ink3,10.5);
   }
  });
 };
})();
