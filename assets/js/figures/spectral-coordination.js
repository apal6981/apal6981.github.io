/* Source-grounded coordination subprotocol; signal samples/timing are illustrative. */
(function(){
 'use strict';var D=Fig.diagram;
 // A 6-bit maximal-length LFSR provides 63 chips; inverse selects a second symbol.
 function chips(){var register=63,sequence=[];for(var n=0;n<63;n++){sequence.push(register&1);var feedback=((register>>5)^register)&1;register=(register>>1)|(feedback<<5);}return sequence;}
 var code=chips(),labels=['Pilot','Pilot','Duration','2','4','5','0','BW'];
 Fig.register('spectral-coordination',{
  config:{mobileAspect:.65,stillAt:6},
  setup:function(f){f.state.compliant=true;f.button('Ignore the request',function(b){f.state.compliant=!f.state.compliant;b.textContent=f.state.compliant?'Ignore the request':'Honor the request';f.restart(true);});},
  reset:function(){},
  draw:function(f,t){
   var C=f.c,c=f.ctx,narrow=f.w<480;D.start(f,'A spectrum request across radio technologies');
   var phase=(t%7)/7,decoded=phase>=.48;
   var small=f.h<450,compact=f.h<340;
   var upper={x:18,y:57,w:f.w-36,h:narrow?f.h*.27:(small?f.h*.20:f.h*.32)};
   D.text(f,'OOK energy chips → RSSI samples → correlation',18,48,C.ink2,11);
   D.box(f,upper.x,upper.y,upper.w,upper.h,C.line,C.bg);
   var progress=Math.min(63,Math.floor(phase/.48*63));
   var signal=[];
   for(var i=0;i<63;i++){
    var x=upper.x+12+i*(upper.w-24)/63,y=upper.y+upper.h*(code[i]?.25:.70);
    if(i<=progress){signal.push({x:x,y:y});signal.push({x:x+(upper.w-24)/63,y:y});}
   }
   D.line(f,signal,C.accent,1.8);
   D.text(f,'63-chip symbol · schematic waveform',upper.x+9,upper.y+upper.h-10,C.ink2,11);
   var packetY=upper.y+upper.h+28,cell=(f.w-36)/8;
   labels.forEach(function(label,i){D.box(f,18+i*cell,packetY,cell-2,30,i<Math.min(8,Math.floor(phase/.48*8))?C.accent:C.line);D.text(f,narrow&&label==='Duration'?'Dur':label,22+i*cell,packetY+20,C.ink2,narrow?10.5:12);});
   var yy=packetY+67;
   D.text(f,decoded?'Decoded: 10 min · 2450 MHz · 20 MHz':'Receiving the eight-symbol packet…',18,yy,C.ink,12,650);
   var radios=['WiFi','LoRa','LTE'];
   if(compact)D.text(f,'WiFi · LoRa · LTE receive the request',18,yy+27,C.signal,12);
   else radios.forEach(function(name,i){
    var y=yy+30+i*(narrow?43:(small?32:48)),status=decoded?(f.state.compliant?(i===0?'Switch away':'Pause radio'):'Keeps transmitting'):'Poll channel energy';
    D.text(f,name,18,y,C.signal,12,650);
    D.text(f,status,narrow?82:f.w*.24,y,decoded?(f.state.compliant?C.signal:C.accent):C.ink2,12);
   });
   if(!compact)D.text(f,decoded&&!f.state.compliant?'Remaining RFI → downstream mitigation':'Coordination is the first mitigation layer',18,f.h-32,C.ink2,11);
   D.text(f,'Subprotocol focus · illustrative timing and samples',18,f.h-12,C.ink3,10.5);
   f.state.packet={decoded:decoded,durationMinutes:10,centerMHz:2450,bandwidthMHz:20,compliant:f.state.compliant};
  }
 });
})();
