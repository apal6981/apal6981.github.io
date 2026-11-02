/* Original illustrative perception/planning diagram, not the class controller. */
(function(){
  'use strict';var D=Fig.diagram;
  Fig.register('rc-racer',{
    config:{mobileAspect:.9,stillAt:4},
    setup:function(f){f.state.cone=true;f.button('Remove the cone',function(b){f.state.cone=!f.state.cone;b.textContent=f.state.cone?'Remove the cone':'Add the cone';f.redraw();});},
    reset:function(){},
    draw:function(f,t){
      var c=f.ctx,C=f.c,narrow=f.w<480;D.start(f,'Perception to steering');
      var top=48,trackH=narrow?f.h*.42:f.h-99,trackW=narrow?f.w-36:f.w*.51;
      var x=18,y=top,w=trackW,h=trackH;
      D.box(f,x,y,w,h,C.line,C.bg);
      function path(q,base){var a=q*Math.PI*2,d=((q-.09+.5)%1+1)%1-.5,k=1+(!base&&f.state.cone?.14*Math.exp(-d*d/.003):0);return {x:x+w*.5+Math.cos(a)*w*.36*k,y:y+h*.5+Math.sin(a)*h*.34*k};}
      [1,.63].forEach(function(k,i){c.beginPath();c.ellipse(x+w*.5,y+h*.5,w*.46*k,h*.45*k,0,0,Math.PI*2);c.strokeStyle=i?C.signal:C.third;c.lineWidth=3;c.stroke();});
      var cone=path(.09,true);
      if(f.state.cone){c.beginPath();c.moveTo(cone.x,cone.y-9);c.lineTo(cone.x-7,cone.y+5);c.lineTo(cone.x+7,cone.y+5);c.closePath();c.fillStyle=C.accent;c.fill();}
      var q=(t/12+.49)%1,car=path(q),next=path(q+.01);D.car(f,car.x,car.y,Math.atan2(next.y-car.y,next.x-car.x),narrow?.8:1.2);
      var planned=[];for(var i=0;i<27;i++){var p=path(q+i*.007);planned.push(p);}D.line(f,planned,C.accent,2,true);
      var px=narrow?18:x+w+26,py=narrow?top+h+30:top+5,pw=narrow?f.w-36:f.w-px-18,ph=narrow?f.h-py-25:h-8;
      D.text(f,'Obstacle map / local plan',px,py-7,C.ink2,11);
      D.box(f,px,py,pw,ph,C.line,C.bg);
      // Camera-space boundaries widen toward the vehicle, not a race simulation.
      D.line(f,[{x:px+pw*.34,y:py+6},{x:px+8,y:py+ph-6}],C.third,4);
      D.line(f,[{x:px+pw*.66,y:py+6},{x:px+pw-8,y:py+ph-6}],C.signal,4);
      if(f.state.cone)D.dot(f,px+pw*.5,py+ph*.47,Math.max(5,pw*.045),C.accent);
      var curve=[];for(i=0;i<=24;i++){var u=i/24;curve.push({x:px+pw*(.5+(f.state.cone?.15:0)*Math.sin(u*Math.PI)),y:py+ph*(.92-u*.80)});}D.line(f,curve,C.accent,2,true);
      D.arrow(f,curve[0],curve[5],C.ink);
      if(!narrow)D.text(f,f.state.cone?'Plan around the obstacle':'Clear corridor',px,py+ph+24,C.ink2,12);
      D.text(f,'Synthetic track and camera map',18,f.h-10,C.ink3,10.5);
    }
  });
})();
