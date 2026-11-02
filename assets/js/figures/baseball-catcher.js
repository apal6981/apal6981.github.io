/* Original schematic stereo triangulation and catch-plane prediction. */
(function(){
  'use strict';var D=Fig.diagram;
  Fig.register('baseball-catcher',{
    config:{mobileAspect:.9,stillAt:5},
    setup:function(f){f.state.pitch=0;f.button('Switch pitch',function(){f.state.pitch=(f.state.pitch+1)%3;f.restart(true);});},
    reset:function(){},
    draw:function(f,t){
      var C=f.c,c=f.ctx,narrow=f.w<480;D.start(f,'Stereo vision to an intercept');
      var phase=f.compact?.68:(t%9)/9,variant=f.state.pitch;
      var field={x:18,y:48,w:narrow?f.w-36:f.w*.60,h:narrow?f.h*.43:f.h-92};
      D.box(f,field.x,field.y,field.w,field.h,C.line,C.bg);
      var a={x:field.x+field.w*.10,y:field.y+field.h*.84},b={x:field.x+field.w*.88,y:field.y+field.h*.84};
      [a,b].forEach(function(p,i){D.box(f,p.x-8,p.y-6,16,12,C.ink,C.sunk);D.text(f,i?'R':'L',p.x-4,p.y+22,C.ink2,11);});
      function trajectory(q){return {x:field.x+field.w*(.20+q*(.55-variant*.06)),y:field.y+field.h*(.18+.53*q*q)};}
      var sample=trajectory(phase),path=[],observed=[];
      for(var i=0;i<=40;i++){var p=trajectory(i/40);path.push(p);if(i/40<=phase&&i%4===0)observed.push(p);}
      D.line(f,path,C.accent,1.5,true);D.line(f,[a,sample,b],f.alpha(C.signal,.7),1.2);
      observed.forEach(function(p){D.dot(f,p.x,p.y,2.5,C.signal);});D.dot(f,sample.x,sample.y,5,C.accent);
      D.text(f,'Stereo observations',field.x+10,field.y+18,C.ink2,11);
      var xx=narrow?18:field.x+field.w+28,yy=narrow?field.y+field.h+34:field.y+18,ww=narrow?f.w-36:f.w-xx-18,hh=narrow?f.h-yy-29:field.h-15;
      D.text(f,'XY catcher plane',xx,yy-9,C.ink2,11);D.box(f,xx,yy,ww,hh,C.line,C.bg);
      var hit={x:xx+ww*(.63-variant*.12),y:yy+hh*(.40+variant*.12)},move=Math.min(1,Math.max(0,(phase-.25)/.5));
      var catcher={x:xx+ww*.5+(hit.x-xx-ww*.5)*move,y:yy+hh*.75+(hit.y-yy-hh*.75)*move};
      D.line(f,[{x:xx+7,y:catcher.y},{x:xx+ww-7,y:catcher.y}],C.lineStrong,2);D.line(f,[{x:catcher.x,y:yy+6},{x:catcher.x,y:yy+hh-6}],C.lineStrong,2);
      D.box(f,catcher.x-12,catcher.y-10,24,20,C.signal);
      D.line(f,[{x:hit.x-5,y:hit.y},{x:hit.x+5,y:hit.y}],C.accent,2);D.line(f,[{x:hit.x,y:hit.y-5},{x:hit.x,y:hit.y+5}],C.accent,2);
      D.text(f,'Predicted intercept',xx+8,yy+hh-10,C.accent,11);
      if(!narrow)D.text(f,'Pitch '+(variant+1)+' / synthetic samples and timing',18,f.h-14,C.ink3,11);
    }
  });
})();
