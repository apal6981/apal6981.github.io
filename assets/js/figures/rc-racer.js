/* Original illustrative perception/planning diagram, not the class controller. */
(function(){
  'use strict';var D=Fig.diagram;
  Fig.register('rc-racer',{
    config:{mobileAspect:.9,stillAt:4,cones:[{phase:.09,side:1},{phase:.28,side:-1},{phase:.47,side:1},{phase:.66,side:-1},{phase:.86,side:1}]},
    setup:function(f){f.state.cone=true;f.button('Remove the cones',function(b){f.state.cone=!f.state.cone;b.textContent=f.state.cone?'Remove the cones':'Add the cones';f.redraw();});},
    reset:function(){},
    draw:function(f,t){
      var c=f.ctx,C=f.c,narrow=f.w<480;D.start(f,'Perception to steering');
      var top=48,trackH=narrow?f.h*.42:f.h-99,trackW=narrow?f.w-36:f.w*.51;
      var x=18,y=top,w=trackW,h=trackH;
      D.box(f,x,y,w,h,C.line,C.bg);
      function path(q,base){var a=q*Math.PI*2,k=1;if(!base&&f.state.cone)f.cfg.cones.forEach(function(cone){var d=((q-cone.phase+.5)%1+1)%1-.5;k+=cone.side*.13*Math.exp(-d*d/.0016);});return {x:x+w*.5+Math.cos(a)*w*.36*k,y:y+h*.5+Math.sin(a)*h*.34*k};}
      function drawCone(p,size){c.beginPath();c.moveTo(p.x,p.y-size);c.lineTo(p.x-size*.75,p.y+size*.55);c.lineTo(p.x+size*.75,p.y+size*.55);c.closePath();c.fillStyle=C.accent;c.fill();c.strokeStyle=C.bg;c.lineWidth=1;c.stroke();}
      [1,.56].forEach(function(k,i){c.beginPath();c.ellipse(x+w*.5,y+h*.5,w*.46*k,h*.45*k,0,0,Math.PI*2);c.strokeStyle=i?C.signal:C.third;c.lineWidth=3;c.stroke();});
      if(f.state.cone)f.cfg.cones.forEach(function(cone){drawCone(path(cone.phase,true),narrow?5:8);});
      var q=(t/12+.49)%1,car=path(q),next=path(q+.01);D.car(f,car.x,car.y,Math.atan2(next.y-car.y,next.x-car.x),narrow?.8:1.2);
      var planned=[];for(var i=0;i<27;i++){var p=path(q+i*.007);planned.push(p);}D.line(f,planned,C.accent,2,true);
      var px=narrow?18:x+w+26,py=narrow?top+h+30:top+5,pw=narrow?f.w-36:f.w-px-18,ph=narrow?f.h-py-25:h-8;
      D.text(f,'Obstacle map / local plan',px,py-7,C.ink2,11);
      D.box(f,px,py,pw,ph,C.line,C.bg);
      // Camera-space boundaries widen toward the vehicle, not a race simulation.
      D.line(f,[{x:px+pw*.34,y:py+6},{x:px+8,y:py+ph-6}],C.third,4);
      D.line(f,[{x:px+pw*.66,y:py+6},{x:px+pw-8,y:py+ph-6}],C.signal,4);
      var ahead=f.state.cone?f.cfg.cones.map(function(cone){return {distance:((cone.phase-q)%1+1)%1,side:cone.side};}).filter(function(cone){return cone.distance<.48;}):[];
      ahead.forEach(function(cone){drawCone({x:px+pw*.5,y:py+ph*(.92-cone.distance/.48*.8)},narrow?4:7);});
      var curve=[];for(i=0;i<=40;i++){var u=i/40,offset=0;ahead.forEach(function(cone){var d=u-cone.distance/.48;offset+=cone.side*.18*Math.exp(-d*d/.012);});curve.push({x:px+pw*(.5+offset),y:py+ph*(.92-u*.80)});}D.line(f,curve,C.accent,2,true);
      D.arrow(f,curve[0],curve[5],C.ink);
      if(!narrow)D.text(f,f.state.cone?'Five cones / alternating avoidance':'Clear corridor',px,py+ph+24,C.ink2,12);
      D.text(f,'Synthetic track and camera map',18,f.h-10,C.ink3,10.5);
    }
  });
})();
