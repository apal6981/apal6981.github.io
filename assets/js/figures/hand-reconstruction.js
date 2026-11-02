/* Original schematic of the report's COLMAP -> Neuralangelo -> print pipeline.
 * The fist is parametric geometry, not a recovered hand or neural-model output.
 * Sparse SfM points delimit the region; they are not the final surface mesh. */
(function(){
  'use strict';var D=Fig.diagram,labels=['Capture','Camera poses','Neural surface','Print'];
  // Ellipsoidal volumes express the palm, wrist, curled fingers and thumb.
  var parts=[
    {x:0,y:-.05,z:0,rx:.73,ry:.89,rz:.38},
    {x:0,y:-1.02,z:0,rx:.42,ry:.50,rz:.32},
    {x:-.48,y:.64,z:.06,rx:.22,ry:.40,rz:.37},
    {x:-.15,y:.80,z:.04,rx:.22,ry:.44,rz:.40},
    {x:.19,y:.75,z:.04,rx:.21,ry:.42,rz:.38},
    {x:.49,y:.56,z:.05,rx:.19,ry:.37,rz:.34},
    {x:-.04,y:.16,z:.34,rx:.57,ry:.35,rz:.20},
    {x:-.58,y:-.12,z:.39,rx:.25,ry:.59,rz:.23,tilt:-.55}
  ];
  function point(part,u,v,detail){
    var a=u*Math.PI*2,b=v*Math.PI,xx=part.rx*Math.sin(b)*Math.cos(a),yy=part.ry*Math.cos(b),zz=part.rz*Math.sin(b)*Math.sin(a);
    // Fine grooves are schematic surface detail, not anatomically measured wrinkles.
    zz+=detail*.008*Math.sin(u*60)*Math.sin(v*34);
    var tilt=part.tilt||0;
    return {x:part.x+xx*Math.cos(tilt)-yy*Math.sin(tilt),y:part.y+xx*Math.sin(tilt)+yy*Math.cos(tilt),z:part.z+zz};
  }
  Fig.register('hand-reconstruction',{
    config:{mobileAspect:.9,stillAt:13},
    setup:function(f){
      f.state.stage=-1;f.state.buttons=[];
      labels.forEach(function(label,index){var button=f.button(label,function(){f.state.stage=index;f.redraw();});button.setAttribute('aria-pressed','false');f.state.buttons.push(button);});
      f.button('Auto stages',function(){f.state.stage=-1;f.restart(true);});
    },
    reset:function(){},
    draw:function(f,t){
      var C=f.c,c=f.ctx,narrow=f.w<480;
      var stage=f.compact?2:(f.state.stage<0?Math.floor(t/5)%4:f.state.stage);
      var progress=f.state.stage<0?(t%5)/5:.78;
      D.start(f,'From video to a printable keepsake');
      var angle=.30+(f.compact?.35:Math.sin(t*.2)*.65),cx=f.w*(narrow?.5:.38),cy=f.h*(narrow?.43:.52),scale=Math.min(f.w*(narrow?.25:.18),f.h*.26);
      function project(p){return D.project(p.x,p.y,p.z,angle,cx,cy,scale);}
      if(stage===0){
        // Distinct colored feature patches on a capture plane support pose recovery.
        for(var j=0;j<24;j++){var q={x:(j%6-2.5)*.48,y:-1.45,z:(Math.floor(j/6)-1.5)*.6};var p=project(q);D.dot(f,p.x,p.y,3,j%2?C.signal:C.third);}
      }
      if(stage<=1){
        // Bounding sphere is shown separately from the selected reconstruction surface.
        c.beginPath();c.ellipse(cx,cy,scale*1.38,scale*1.64,0,0,Math.PI*2);c.strokeStyle=C.lineStrong;c.lineWidth=1;c.setLineDash([4,4]);c.stroke();c.setLineDash([]);
        for(j=0;j<9;j++){
          var a=j/9*Math.PI*2,cam=project({x:Math.cos(a)*1.8,y:.75,z:Math.sin(a)*1.8});
          var target={x:cx,y:cy};D.line(f,[{x:cam.x-4,y:cam.y-3},target,{x:cam.x+4,y:cam.y+3}],f.alpha(C.signal,.18),1);
          D.box(f,cam.x-5,cam.y-4,10,8,C.signal,C.bg);
        }
      }
      var faces=[],coarse=stage===2&&progress<.45,cols=coarse?8:16,rows=coarse?5:9;
      parts.forEach(function(part,partIndex){
        for(var r=0;r<rows;r++)for(var u=0;u<cols;u++){
          var xyz=[point(part,u/cols,r/rows,!coarse),point(part,(u+1)/cols,r/rows,!coarse),point(part,(u+1)/cols,(r+1)/rows,!coarse),point(part,u/cols,(r+1)/rows,!coarse)];
          var points=xyz.map(project),z=points.reduce(function(s,p){return s+p.z;},0)/4;
          if(stage===1){if((r+u+partIndex)%3===0)D.dot(f,points[0].x,points[0].y,1.4,C.accent);continue;}
          var height=xyz.reduce(function(s,p){return s+p.y;},0)/4;
          faces.push({points:points,z:z,height:height,shade:.3+.5*Math.abs(Math.sin(u/cols*Math.PI*2+angle))});
        }
      });
      faces.sort(function(a,b){return a.z-b.z;});
      faces.forEach(function(face){
        var solid=stage!==3||face.height<-1.5+progress*3.4;
        c.beginPath();face.points.forEach(function(p,i){if(i)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y);});c.closePath();
        if(solid){c.fillStyle=C.bg;c.fill();c.fillStyle=f.alpha(stage===0?C.ink3:C.accent,face.shade);c.fill();c.strokeStyle=f.alpha(C.ink,coarse?.20:.055);c.lineWidth=.5;c.stroke();}
      });
      if(stage===3){
        var yy=cy+(1.5-progress*3.4)*scale;
        D.line(f,[{x:cx-scale*1.1,y:cy+scale*1.57},{x:cx+scale*1.1,y:cy+scale*1.57}],C.ink3,2);
        D.line(f,[{x:cx-scale*1.1,y:yy},{x:cx+scale*1.1,y:yy}],C.signal,1.5,true);
        D.dot(f,cx,yy,4,C.signal);
      }
      var tx=narrow?18:f.w*.70,ty=narrow?f.h-56:65;
      D.text(f,labels[stage],tx,ty,C.accent,14,650);
      var notes=[['Short video','Patterned background'],['COLMAP + region','Sparse points guide bounds'],['Neuralangelo','Coarse-to-fine surface'],['Cleanup + printing','Illustrative print layers']];
      D.text(f,notes[stage][0],tx,ty+21,C.ink2,11);
      if(!narrow)D.text(f,notes[stage][1],tx,ty+42,C.ink2,11);
      D.text(f,'Illustrative adult fist / not recovered model data',18,f.h-12,C.ink3,10.5);
      if(!f.compact)f.state.buttons.forEach(function(b,i){b.setAttribute('aria-pressed',String(i===stage));});
    }
  });
})();
