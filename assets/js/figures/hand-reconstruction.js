/* Original schematic of the report's COLMAP -> Neuralangelo -> print pipeline.
 * The hand is parametric geometry, not a recovered hand or neural-model output.
 * Sparse SfM points delimit the region; they are not the final surface mesh. */
(function(){
  'use strict';var D=Fig.diagram,labels=['Capture','Camera poses','Neural surface','Print'];
  // One watertight surface, generated from smoothly joined anatomical volumes.
  // Keep the high-resolution model outside setup/reset so controls remain stable.
  var mesh=Fig.handMesh;
  function palette(f) {
    var key=f.c.accent+f.c.bg;
    if(f.state.paletteKey===key)return f.state.palette;
    var base=f.c.accent.match(/[\d.]+/g).slice(0,3).map(Number);
    var bg=f.c.bg.match(/[\d.]+/g).slice(0,3).map(Number),colors=[];
    for(var i=0;i<=255;i++){
      var light=.25+i/255*.75;
      colors.push(base.map(function(v,j){return Math.round(bg[j]*.12+v*light*.88);}));
    }
    f.state.paletteKey=key;f.state.palette=colors;return colors;
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
      var stage=f.compact&&!f.playing?2:(f.state.stage<0?Math.floor(t/5)%4:f.state.stage);
      var progress=f.state.stage<0?(t%5)/5:.78;
      D.start(f,'From video to a printable keepsake');
      var angle=.30+(f.compact&&!f.playing?.35:Math.sin(t*.2)*.65),cx=f.w*(narrow?.5:.38),cy=f.h*(narrow?.46:.53),scale=Math.min(f.w*(narrow?.23:.18),f.h*(narrow?.175:.21));
      function project(p){return D.project(p.x,p.y,p.z,angle,cx,cy,scale);}
      if(stage===0){
        // Distinct colored feature patches on a capture plane support pose recovery.
        for(var j=0;j<24;j++){var q={x:(j%6-2.5)*.48,y:-1.94,z:(Math.floor(j/6)-1.5)*.6};var p=project(q);D.dot(f,p.x,p.y,3,j%2?C.signal:C.third);}
      }
      if(stage<=1){
        // Bounding sphere is shown separately from the selected reconstruction surface.
        c.beginPath();c.ellipse(cx,cy,scale*2.08,scale*2.08,0,0,Math.PI*2);c.strokeStyle=C.lineStrong;c.lineWidth=1;c.setLineDash([4,4]);c.stroke();c.setLineDash([]);
        for(j=0;j<9;j++){
          var a=j/9*Math.PI*2,cam=project({x:Math.cos(a)*2.30,y:.65,z:Math.sin(a)*2.30});
          var target={x:cx,y:cy};D.line(f,[{x:cam.x-4,y:cam.y-3},target,{x:cam.x+4,y:cam.y+3}],f.alpha(C.signal,.18),1);
          D.box(f,cam.x-5,cam.y-4,10,8,C.signal,C.bg);
        }
      }
      var coarse=stage===2&&progress<.45,points=[],normals=[],cos=Math.cos(angle),sin=Math.sin(angle),colors=palette(f);
      for(var v=0;v<mesh.positions.length;v+=3){
        var x=mesh.positions[v],y=mesh.positions[v+1],z=mesh.positions[v+2];
        if(coarse){x=Math.round(x/.12)*.12;y=Math.round(y/.12)*.12;z=Math.round(z/.12)*.12;}
        points.push(project({x:x,y:y,z:z}));
        normals.push({x:mesh.normals[v]*cos+mesh.normals[v+2]*sin,y:mesh.normals[v+1],z:-mesh.normals[v]*sin+mesh.normals[v+2]*cos});
      }
      if(stage===1){
        for(v=0;v<points.length;v+=7)if(normals[v].z>0)D.dot(f,points[v].x,points[v].y,1.1,C.accent);
      }else{
        // Gouraud shading with a depth buffer avoids polygon-edge artifacts and
        // correctly occludes the thumb/fingers. The buffer is reused at CSS size.
        var width=Math.ceil(f.w),height=Math.ceil(f.h),raster=f.state.raster;
        if(!raster||raster.width!==width||raster.height!==height){
          var canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
          var rc=canvas.getContext('2d');
          raster=f.state.raster={canvas:canvas,ctx:rc,width:width,height:height,image:rc.createImageData(width,height),depth:new Float32Array(width*height)};
        }
        var pixels=raster.image.data,depth=raster.depth;pixels.fill(0);depth.fill(-Infinity);
        for(v=0;v<points.length;v++){
          var n=normals[v];points[v].light=Math.max(0,Math.min(1,.46+(-n.x*.35+n.y*.5+n.z*.8)*.54));
        }
        for(var i=0;i<mesh.triangles.length;i+=3){
          var ai=mesh.triangles[i],bi=mesh.triangles[i+1],di=mesh.triangles[i+2];
          if(normals[ai].z+normals[bi].z+normals[di].z+(normals[ai].y+normals[bi].y+normals[di].y)*.30<0)continue;
          var pa=points[ai],pb=points[bi],pd=points[di];
          var denominator=(pb.y-pd.y)*(pa.x-pd.x)+(pd.x-pb.x)*(pa.y-pd.y);
          if(Math.abs(denominator)<.00001)continue;
          var xmin=Math.max(0,Math.floor(Math.min(pa.x,pb.x,pd.x))),xmax=Math.min(width-1,Math.ceil(Math.max(pa.x,pb.x,pd.x)));
          var ymin=Math.max(0,Math.floor(Math.min(pa.y,pb.y,pd.y))),ymax=Math.min(height-1,Math.ceil(Math.max(pa.y,pb.y,pd.y)));
          for(var py=ymin;py<=ymax;py++)for(var px=xmin;px<=xmax;px++){
            var aa=((pb.y-pd.y)*(px+.5-pd.x)+(pd.x-pb.x)*(py+.5-pd.y))/denominator;
            var bb=((pd.y-pa.y)*(px+.5-pd.x)+(pa.x-pd.x)*(py+.5-pd.y))/denominator,dd=1-aa-bb;
            if(aa<-.00001||bb<-.00001||dd<-.00001)continue;
            if(stage===3&&aa*mesh.positions[ai*3+1]+bb*mesh.positions[bi*3+1]+dd*mesh.positions[di*3+1]>-2+progress*4.15)continue;
            var z=aa*pa.z+bb*pb.z+dd*pd.z,index=py*width+px;
            if(z<=depth[index])continue;depth[index]=z;
            var light=aa*pa.light+bb*pb.light+dd*pd.light;
            if(coarse)light=Math.round(light*7)/7;
            var rgb=colors[Math.round(light*255)],offset=index*4;
            pixels[offset]=rgb[0];pixels[offset+1]=rgb[1];pixels[offset+2]=rgb[2];pixels[offset+3]=255;
          }
        }
        raster.ctx.putImageData(raster.image,0,0);c.drawImage(raster.canvas,0,0,f.w,f.h);
      }
      if(stage===3){
        var yy=cy+(2-progress*4.15)*scale;
        D.line(f,[{x:cx-scale*1.1,y:cy+scale*1.98},{x:cx+scale*1.1,y:cy+scale*1.98}],C.ink3,2);
        D.line(f,[{x:cx-scale*1.1,y:yy},{x:cx+scale*1.1,y:yy}],C.signal,1.5,true);
        D.dot(f,cx,yy,4,C.signal);
      }
      var tx=narrow?18:f.w*.70,ty=narrow?f.h-56:65;
      D.text(f,labels[stage],tx,ty,C.accent,14,650);
      var notes=[['Short video','Patterned background'],['COLMAP + region','Sparse points guide bounds'],['Neuralangelo','Coarse-to-fine surface'],['Cleanup + printing','Illustrative print layers']];
      D.text(f,notes[stage][0],tx,ty+21,C.ink2,11);
      if(!narrow)D.text(f,notes[stage][1],tx,ty+42,C.ink2,11);
      D.text(f,'Illustrative adult hand / not recovered model data',18,f.h-12,C.ink3,10.5);
      if(!f.compact)f.state.buttons.forEach(function(b,i){b.setAttribute('aria-pressed',String(i===stage));});
    }
  });
})();
