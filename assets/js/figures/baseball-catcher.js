/* Two synchronized schematic models of one pitch; not recorded model output. */
(function(){
  'use strict';var D=Fig.diagram;
  function sample(q,pitch){
    var lateral=[.24,-.23,.10][pitch],height=[.38,.54,.25][pitch];
    return {x:lateral*q,y:.80+.10*q+(height-.90)*q*q};
  }
  Fig.register('baseball-catcher',{
    config:{mobileAspect:.62,stillAt:5},
    setup:function(f){f.state.pitch=0;f.button('Switch pitch',function(){f.state.pitch=(f.state.pitch+1)%3;f.restart(true);});},
    reset:function(){},
    draw:function(f,t){
      var C=f.c,c=f.ctx,narrow=f.w<480;
      D.start(f,'Two models, one catch');
      var q=f.compact?.68:Math.min(1,(t%9)/6.5),pitch=f.state.pitch;
      var current=sample(q,pitch),target=sample(1,pitch),ready=q>=.22;
      var move=Math.min(1,Math.max(0,(q-.22)/.64));move=move*move*(3-2*move);
      var catcher={x:target.x*move,y:.5+(target.y-.5)*move};
      var gap=22,margin=18,top=65,bottom=55,panels=[];
      if(narrow){
        var height=(f.h-top-bottom-gap*2)/3;
        for(var i=0;i<3;i++)panels.push({x:margin,y:top+i*(height+gap),w:f.w-margin*2,h:height});
      }else{
        var width=(f.w-margin*2-gap*2)/3;
        for(var j=0;j<3;j++)panels.push({x:margin+j*(width+gap),y:top,w:width,h:f.h-top-bottom});
      }
      function frame(p,title){D.text(f,title,p.x,p.y-10,C.ink2,11,650);D.box(f,p.x,p.y,p.w,p.h,C.line,C.bg);}
      function xy(p,x,y){return {x:p.x+p.w*(.12+.76*x),y:p.y+p.h*(.10+.80*y)};}
      function cross(p,color){D.line(f,[{x:p.x-5,y:p.y},{x:p.x+5,y:p.y}],color,2);D.line(f,[{x:p.x,y:p.y-5},{x:p.x,y:p.y+5}],color,2);}
      function ball(p,r){D.dot(f,p.x,p.y,r,C.accent);D.dot(f,p.x-r*.25,p.y-r*.25,Math.max(1,r*.22),C.bg);}
      var front=panels[0],side=panels[1],plane=panels[2];
      frame(front,'Head-on · X model');frame(side,'Side · Y model');frame(plane,'Combined XY target');
      var frontBall=xy(front,.5+current.x,.5),frontHit=xy(front,.5+target.x,.5);
      D.line(f,[xy(front,0,.5),xy(front,1,.5)],C.lineStrong,1);
      D.line(f,[xy(front,.5,.15),xy(front,.5,.85)],C.line,1,true);
      if(ready){D.line(f,[frontBall,frontHit],C.accent,1.5,true);cross(frontHit,C.accent);}
      var frontPoints=[],sidePoints=[];
      for(var n=0;n<=16;n++){
        var u=n/16;if(u>q)break;var point=sample(u,pitch);
        frontPoints.push(xy(front,.5+point.x,.5));sidePoints.push(xy(side,u,1-point.y));
      }
      frontPoints.forEach(function(p){D.dot(f,p.x,p.y,2,C.signal);});
      ball(frontBall,3+q*7);
      D.text(f,'Left / right',front.x+9,front.y+front.h-10,C.ink2,11);
      var sideBall=xy(side,q,1-current.y),sideHit=xy(side,1,1-target.y),prediction=[];
      for(var k=0;k<=32;k++){var v=k/32;if(v>=q)prediction.push(xy(side,v,1-sample(v,pitch).y));}
      if(ready){D.line(f,[sideBall].concat(prediction),C.accent,1.5,true);cross(sideHit,C.accent);}
      D.line(f,[xy(side,1,0),xy(side,1,1)],C.lineStrong,1.5,true);
      D.line(f,sidePoints,C.signal,1.5);
      sidePoints.forEach(function(p){D.dot(f,p.x,p.y,2,C.signal);});ball(sideBall,5);
      D.text(f,'Approach → catcher',side.x+9,side.y+side.h-10,C.ink2,11);
      var hit=xy(plane,.5+target.x,1-target.y),catchPoint=xy(plane,.5+catcher.x,1-catcher.y);
      D.line(f,[xy(plane,0,1-catcher.y),xy(plane,1,1-catcher.y)],C.lineStrong,2);
      D.line(f,[xy(plane,.5+catcher.x,0),xy(plane,.5+catcher.x,1)],C.lineStrong,2);
      if(ready){D.line(f,[{x:hit.x,y:plane.y+6},{x:hit.x,y:plane.y+plane.h-24}],C.accent,1,true);cross(hit,C.accent);}
      D.box(f,catchPoint.x-10,catchPoint.y-9,20,18,C.signal);
      if(q===1)ball(hit,6);
      D.text(f,ready?'X + Y → intercept':'Collecting samples',plane.x+9,plane.y+plane.h-10,C.ink2,11);
      D.text(f,'Dots: samples · dashes: prediction',18,f.h-28,C.ink2,11);
      D.text(f,q===1?'Caught · illustrative pitch '+(pitch+1):'Ball approaches the catcher',18,f.h-10,C.ink3,11);
      // Expose the same coordinates used by the drawings for synchronization checks.
      f.state.projection={q:q,x:current.x,y:current.y,targetX:target.x,targetY:target.y,catcherX:catcher.x,catcherY:catcher.y};
    }
  });
})();
