/* Head-on stereo observations feed two coordinate models of the same pitch. */
(function(){
  'use strict';var D=Fig.diagram;
  function sample(q,pitch){
    var lateral=[.24,-.23,.10][pitch],height=[.38,.54,.25][pitch];
    return {x:lateral*q,y:.80+.10*q+(height-.90)*q*q};
  }
  Fig.register('baseball-catcher',{
    config:{mobileAspect:.50,stillAt:5},
    setup:function(f){f.state.pitch=0;f.button('Switch pitch',function(){f.state.pitch=(f.state.pitch+1)%3;f.restart(true);});},
    reset:function(){},
    draw:function(f,t){
      var C=f.c,c=f.ctx,narrow=f.w<480;
      D.start(f,'Head-on stereo → predict X and Y');
      var q=f.compact?.68:Math.min(1,(t%9)/6.5),pitch=f.state.pitch;
      var current=sample(q,pitch),target=sample(1,pitch),ready=q>=.22;
      var move=Math.min(1,Math.max(0,(q-.22)/.64));move=move*move*(3-2*move);
      var catcher={x:target.x*move,y:.5+(target.y-.5)*move};
      var margin=18,gap=24,top=66,bottom=45,leftWidth=narrow?f.w-36:(f.w-60)*.61;
      var usable=f.h-top-bottom;
      var cameraHeight=narrow?usable*.23:usable*.39;
      var cameraWidth=(leftWidth-12)/2;
      var cameras=[{x:margin,y:top,w:cameraWidth,h:cameraHeight},{x:margin+cameraWidth+12,y:top,w:cameraWidth,h:cameraHeight}];
      var plane={x:margin,y:top+cameraHeight+gap,w:leftWidth,h:narrow?usable*.31:usable-cameraHeight-gap};
      var modelX=narrow?margin:margin+leftWidth+gap;
      var modelY=narrow?plane.y+plane.h+gap:top;
      var modelWidth=narrow?leftWidth:f.w-modelX-margin;
      var modelHeight=narrow?(f.h-bottom-modelY-gap)/2:(usable-gap)/2;
      var models=[{x:modelX,y:modelY,w:modelWidth,h:modelHeight},{x:modelX,y:modelY+modelHeight+gap,w:modelWidth,h:modelHeight}];
      function frame(p,title){D.text(f,title,p.x,p.y-9,C.ink2,11,650);D.box(f,p.x,p.y,p.w,p.h,C.line,C.bg);}
      function xy(p,x,y){return {x:p.x+p.w*(.12+.76*x),y:p.y+p.h*(.12+.76*y)};}
      function cross(p,color){D.line(f,[{x:p.x-5,y:p.y},{x:p.x+5,y:p.y}],color,2);D.line(f,[{x:p.x,y:p.y-5},{x:p.x,y:p.y+5}],color,2);}
      function ball(p,r){D.dot(f,p.x,p.y,r,C.accent);D.dot(f,p.x-r*.25,p.y-r*.25,Math.max(1,r*.20),C.bg);}
      // Both cameras look along the incoming direction. Disparity grows as depth falls.
      var depth=3.6-2.6*q,disparity=.11/depth;
      cameras.forEach(function(p,i){
        frame(p,i?'Right camera · head-on':'Left camera · head-on');
        var position=xy(p,.5+current.x+(i?-disparity:disparity),1-current.y);
        D.line(f,[xy(p,.5,0),xy(p,.5,1)],C.line,1,true);
        D.line(f,[xy(p,0,.5),xy(p,1,.5)],C.line,1,true);
        D.box(f,position.x-8,position.y-8,16,16,C.signal);
        ball(position,2+q*(narrow?4:5));
      });
      frame(plane,'Catcher · facing the incoming ball');
      var hit=xy(plane,.5+target.x,1-target.y),catchPoint=xy(plane,.5+catcher.x,1-catcher.y);
      D.line(f,[xy(plane,0,1-catcher.y),xy(plane,1,1-catcher.y)],C.lineStrong,2);
      D.line(f,[xy(plane,.5+catcher.x,0),xy(plane,.5+catcher.x,1)],C.lineStrong,2);
      D.box(f,catchPoint.x-13,catchPoint.y-12,26,24,C.signal);
      if(ready)cross(hit,C.accent);
      var trail=[];
      for(var n=0;n<=16;n++){
        var u=n/16;if(u>q)break;var point=sample(u,pitch);
        trail.push(xy(plane,.5+point.x,1-point.y));
      }
      trail.forEach(function(p){D.dot(f,p.x,p.y,2,C.signal);});
      ball(xy(plane,.5+current.x,1-current.y),3+q*(narrow?9:12));
      D.text(f,q===1?'Caught at predicted X, Y':'Ball grows as it approaches',plane.x+8,plane.y+plane.h-8,C.ink2,10.5);
      // These are coordinate-versus-time graphs, never a second camera perspective.
      models.forEach(function(p,index){
        frame(p,index?'Y model · elevation':'X model · left / right');
        var observed=[],predicted=[];
        function modelPoint(u){var point=sample(u,pitch);return xy(p,u,index?1-point.y:.5-point.x);}
        for(var k=0;k<=32;k++){
          var u=k/32;if(u<=q)observed.push(modelPoint(u));if(u>=q)predicted.push(modelPoint(u));
        }
        D.line(f,[xy(p,0,.5),xy(p,1,.5)],C.line,1);
        D.line(f,[xy(p,1,0),xy(p,1,1)],C.lineStrong,1,true);
        D.line(f,observed,C.signal,1.5);observed.forEach(function(point,k){if(k%2===0)D.dot(f,point.x,point.y,2,C.signal);});
        if(ready){D.line(f,[modelPoint(q)].concat(predicted),C.accent,1.5,true);cross(modelPoint(1),C.accent);}
        D.text(f,'Time → arrival',p.x+8,p.y+p.h-8,C.ink2,10.5);
      });
      D.text(f,'Same stereo samples → two models → one catch',18,f.h-14,C.ink2,narrow?10.5:11);
      f.state.projection={q:q,x:current.x,y:current.y,targetX:target.x,targetY:target.y,catcherX:catcher.x,catcherY:catcher.y,depth:depth,disparity:disparity};
    }
  });
})();
