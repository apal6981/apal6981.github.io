/* Shared drawing primitives for the original school-project explanations.
 * All coordinates and trajectories in these figures are illustrative. */
(function () {
  'use strict';
  Fig.diagram = {
    line: function(f, points, color, width, dashed) {
      var c=f.ctx;c.beginPath();points.forEach(function(p,i){if(i)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y);});
      c.strokeStyle=color;c.lineWidth=width||1.5;c.setLineDash(dashed?[4,4]:[]);c.stroke();c.setLineDash([]);
    },
    dot: function(f,x,y,r,color) {var c=f.ctx;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill();},
    text: function(f,text,x,y,color,size,weight) {var c=f.ctx;c.font=f.font((size||12)*Math.min(1.4,Math.max(1,f.w/740)),weight||500);c.fillStyle=color||f.c.ink2;c.textAlign='left';c.textBaseline='alphabetic';c.fillText(text,x,y);},
    box: function(f,x,y,w,h,color,fill) {var c=f.ctx;if(fill){c.fillStyle=fill;c.fillRect(x,y,w,h);}c.strokeStyle=color||f.c.line;c.lineWidth=1;c.strokeRect(x,y,w,h);},
    start: function(f,title) {
      var c=f.ctx;c.fillStyle=f.c.sunk;c.fillRect(0,0,f.w,f.h);
      this.text(f,title,18,27,f.c.ink,13,650);
    },
    project: function(x,y,z,angle,cx,cy,scale) {
      var xx=x*Math.cos(angle)+z*Math.sin(angle),zz=-x*Math.sin(angle)+z*Math.cos(angle);
      return {x:cx+xx*scale,y:cy+(-y+zz*.30)*scale,z:zz};
    },
    arrow: function(f,a,b,color) {
      this.line(f,[a,b],color,1.5);var t=Math.atan2(b.y-a.y,b.x-a.x);
      this.line(f,[{x:b.x-7*Math.cos(t-.45),y:b.y-7*Math.sin(t-.45)},b,{x:b.x-7*Math.cos(t+.45),y:b.y-7*Math.sin(t+.45)}],color,1.5);
    },
    car: function(f,x,y,angle,scale) {
      var c=f.ctx;c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=f.c.ink;c.fillRect(-10*scale,-7*scale,5*scale,5*scale);c.fillRect(5*scale,-7*scale,5*scale,5*scale);c.fillRect(-10*scale,2*scale,5*scale,5*scale);c.fillRect(5*scale,2*scale,5*scale,5*scale);
      c.fillStyle=f.c.accent;c.fillRect(-8*scale,-5*scale,16*scale,10*scale);c.fillStyle=f.c.bg;c.fillRect(2*scale,-3*scale,3*scale,6*scale);c.restore();
    }
  };
})();
