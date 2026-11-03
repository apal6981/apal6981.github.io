/* Original SIFT-correspondence and drift explanation; no measured dataset. */
(function(){
  'use strict';var D=Fig.diagram;
  Fig.register('visual-odometry',{
    config:{mobileAspect:.9,stillAt:8},
    setup:function(f){
      f.state.drift=40;f.slider({label:'Illustrative drift',min:0,max:100,value:40,format:function(v){return v+'%';},onInput:function(v){f.state.drift=v;f.redraw();}});
    },
    reset:function(){},
    draw:function(f,t){
      var C=f.c,c=f.ctx,narrow=f.w<480;D.start(f,'Matches accumulate into motion');
      var left=18,top=51,fw=(narrow?f.w-48:f.w*.53-12)/2,fh=narrow?f.h*.27:f.h*.44,gap=12;
      for(var k=0;k<2;k++){
        var x=left+k*(fw+gap);D.box(f,x,top,fw,fh,C.line,C.bg);D.text(f,k?'Frame B':'Frame A',x,top-8,C.ink2,11);
        // Fixed landmarks translate between frames; a pair of mismatches is rejected.
        for(var j=0;j<15;j++){
          var xx=(j*37%83)/100,yy=(j*23%71)/100;
          var dx=k?-.05:0,px=x+fw*(.13+xx*.82+dx),py=top+fh*(.16+yy*.9);
          D.dot(f,px,py,2.5,j>12?C.bad:C.signal);
          if(k===0){var bx=x+fw+gap+fw*(.13+xx*.82-.05);D.line(f,[{x:px,y:py},{x:bx,y:py+(j>12?14:0)}],f.alpha(j>12?C.bad:C.signal,.28),1,j>12);}
        }
      }
      // Overlay correspondences after both frame backgrounds have been painted.
      for(var match=0;match<15;match++){
        var mx=(match*37%83)/100,my=(match*23%71)/100;
        var pa={x:left+fw*(.13+mx*.82),y:top+fh*(.16+my*.9)};
        var pb={x:left+fw+gap+fw*(.13+mx*.82-.05),y:pa.y+(match>12?14:0)};
        D.line(f,[pa,pb],f.alpha(match>12?C.bad:C.signal,.28),1,match>12);
      }
      var tx=narrow?18:f.w*.60,ty=narrow?top+fh+38:top,tw=narrow?f.w-36:f.w-tx-24,th=narrow?f.h-ty-28:f.h-ty-57;
      D.text(f,'Accumulated trajectory',tx,ty-9,C.ink2,11);D.box(f,tx,ty,tw,th,C.line,C.bg);
      var reference=[],estimate=[],progress=f.compact&&!f.playing?.91:(t%14)/14;
      for(var i=0;i<=90;i++){
        var q=i/90,a=q*Math.PI*1.85,x=tx+tw*(.49+.34*Math.cos(a)),y=ty+th*(.51+.34*Math.sin(a));reference.push({x:x,y:y});
        if(q<=progress)estimate.push({x:x+tw*.22*(f.state.drift/100)*q,y:y-th*.26*(f.state.drift/100)*q});
      }
      D.line(f,reference,C.lineStrong,1.5,true);D.line(f,estimate,C.accent,2.2);
      if(estimate.length){var last=estimate[estimate.length-1];D.dot(f,last.x,last.y,4,C.accent);}
      if(!narrow){D.text(f,'SIFT matches',18,top+fh+29,C.signal,12);D.text(f,'RANSAC rejects outliers',18,top+fh+51,C.ink2,12);D.text(f,'Relative pose -> next pose',18,top+fh+78,C.ink2,12);}
      D.text(f,'Reference (dashed) / estimate (copper)',tx,ty+th+18,C.ink2,10.5);
      if(!narrow)D.text(f,'Illustrative paths, not recorded ground truth',18,f.h-14,C.ink3,11);
    }
  });
})();
