/* Simplified instances of the supplied preprint's per-symbol heuristic (eq. 22–23).
 * No packet acquisition, synchronization or coded BER simulation. */
(function(){
 'use strict';var D=Fig.diagram;
 Fig.register('ghost-channel',{
  config:{mobileAspect:.75,stillAt:4},
  setup:function(f){f.state.mode=0;f.button('Add delay',function(b){f.state.mode=(f.state.mode+1)%4;b.textContent=['Add delay','Drop the packets','Add extra events','Use a clean channel'][f.state.mode];f.restart(true);});},
  reset:function(){},
  draw:function(f,t){
   var C=f.c,c=f.ctx,narrow=f.w<480;D.start(f,'Timing can change a bit—or erase it');
   var phase=Math.min(1,(t%6)/3),mode=f.state.mode;
   var width=f.w-36,rowHeight=(f.h-100)/2;
   var outcomes=[];
   for(var bit=0;bit<2;bit++){
    var x=18,y=63+bit*rowHeight,slotW=width/3,h=rowHeight-55;
    D.text(f,'Sent '+bit,x,y-10,C.ink,12,650);
    ['0 slot','1 slot','Guard'].forEach(function(label,i){D.box(f,x+i*slotW,y,slotW,h,C.line,i===2?C.sunk:C.bg);D.text(f,label,x+i*slotW+6,y+19,C.ink2,11);});
    var sent=bit===0?.16:.49,received=sent+(mode===1?.30:0),shown=sent+(received-sent)*phase;
    var erased=mode>=2||received>=2/3,decoded=erased?'?':(received<1/3?'0':'1');outcomes.push(decoded);
    D.line(f,[{x:x+sent*width,y:y+29},{x:x+sent*width,y:y+h-9}],C.signal,1.2,true);
    if(mode!==2)D.dot(f,x+shown*width,y+Math.max(34,h*.6),h<60?3:5,C.accent);
    else{D.line(f,[{x:x+sent*width-5,y:y+h*.6-5},{x:x+sent*width+5,y:y+h*.6+5}],C.accent,2);D.line(f,[{x:x+sent*width+5,y:y+h*.6-5},{x:x+sent*width-5,y:y+h*.6+5}],C.accent,2);}
    if(mode===3)D.dot(f,x+(bit===0?.49:.16)*width,y+Math.max(34,h*.6),h<60?3:5,C.signal);
    D.text(f,mode===0?'Received '+decoded:mode===3?'Erasure: multiple events':erased?'Erasure: no usable event':'Crossover: received '+decoded,x,y+h+20,C.ink2,11);
   }
   D.text(f,mode===1?'The same delay affects the two sent bits differently':mode===2?'A missing event is not evidence of a zero':mode===3?'Multiple events → do not guess':'Two bit slots and a guard interval',18,f.h-38,C.ink2,narrow?10.5:12);
   D.text(f,'Simplified symbol decisions · illustrative timing',18,f.h-14,C.ink3,10.5);
   f.state.channel={mode:mode,outputs:outcomes};
  }
 });
})();
