/* Educational WLSK/Wicket diagram only: no network traffic or frame injection. */
(function(){
 'use strict';var D=Fig.diagram,barker=[1,1,1,0,0,0,1,0,0,1,0];
 Fig.register('wireless-latency',{
  config:{mobileAspect:.67,stillAt:1.8},
  setup:function(f){f.state.bit=1;f.button('Send bit 0',function(b){f.state.bit=1-f.state.bit;b.textContent='Send bit '+(1-f.state.bit);f.restart(true);});},
  reset:function(){},
  draw:function(f,t){
   var C=f.c,c=f.ctx,narrow=f.w<480,small=f.h<450;D.start(f,'Sensor data through controlled latency');
   var progress=(t%3)/3,index=Math.min(10,Math.floor(progress*11));
   var code=barker.map(function(v){return f.state.bit?v:1-v;}),jammed=code[index]===1;
   var area={x:18,y:53,w:f.w-36,h:narrow?f.h*.40:(small?f.h*.37:f.h*.44)};
   function pos(x,y){return {x:area.x+area.w*x,y:area.y+area.h*y};}
   var sensor=pos(.13,.45),ap=pos(.62,.30),receiver=pos(.45,.72),reflector=pos(.84,.72);
   D.box(f,area.x+area.w*.31,area.y,area.w*.69,area.h,C.line,C.bg);
   D.text(f,'Trusted network',area.x+area.w*.34,area.y+17,C.ink2,11);
   D.line(f,[receiver,ap,reflector],C.lineStrong,1.5);
   D.line(f,[sensor,ap],jammed?C.accent:C.line,1.5,true);
   function node(p,label){D.dot(f,p.x,p.y,6,C.signal);c.font=f.font(11);c.textAlign='center';c.fillStyle=C.ink;c.fillText(label,Math.max(area.x+40,Math.min(area.x+area.w-40,p.x)),p.y+22);c.textAlign='left';}
   node(sensor,'Sensor');node(ap,'Access point');node(receiver,'Wired receiver');node(reflector,'Ping reflector');
   D.text(f,'Unassociated',area.x,area.y+area.h-8,C.ink2,10.5);
   if(jammed){for(var i=0;i<3;i++)D.dot(f,ap.x+(i-1)*7,ap.y-13,2,C.accent);}
   D.text(f,jammed?'AP buffers reflector traffic':'Reflector replies flow',18,area.y+area.h+24,C.ink2,11);
   var chartY=area.y+area.h+(small?44:58),chartH=small?45:(narrow?f.h*.17:f.h*.20),chartW=f.w-36;
   D.box(f,18,chartY,chartW,chartH,C.line,C.bg);
   for(var j=0;j<=index;j++){
    var x=26+(j+.5)*(chartW-16)/11,h=code[j]?chartH*.70:chartH*.12;
    D.line(f,[{x:x,y:chartY+chartH-5},{x:x,y:chartY+chartH-5-h}],code[j]?C.accent:C.signal,3);
   }
   D.text(f,'Measured reply bursts over time',18,chartY-8,C.ink2,11);
   var chipY=chartY+chartH+17,cell=(f.w-36)/11;
   code.forEach(function(value,i){D.text(f,String(value),22+i*cell,chipY,i===index?C.accent:C.ink2,11,i===index?700:500);});
   if(f.h>340)D.text(f,'11-chip spreading pattern · data bit '+f.state.bit,18,chipY+24,C.ink2,11);
   D.text(f,'Schematic traffic and illustrative timing',18,f.h-12,C.ink3,10.5);
   f.state.encoding={bit:f.state.bit,chips:code,index:index,buffering:jammed};
  }
 });
})();
