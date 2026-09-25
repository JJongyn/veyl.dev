/* Veyl · original procedural geometry · MIT */
(() => {
  'use strict';
  if (customElements.get('veyl-signal')) return;
  const TAU = Math.PI * 2;
  const states = ['thinking','searching','listening','composing','connecting','complete'];
  const variants = ['fold','trace','tide','loom','link','bloom','reactor','gyre','prism','echo','helix','rift'];
  const colors = ['#baf2cb','#8bbdff','#d4b4fa','#ffc494','#f2a9c2','#ecedbb','#7cebdc','#98baff','#f8c6a7','#c4f5a1','#d1b0ff','#84dbe9'];
  const labels = ['Thinking','Searching','Listening','Composing','Connecting','Complete'];
  const active = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, last = 0;
  function tick(now) {
    frame = 0;
    const delta = Math.min((now-last)/1000 || 0, .045); last = now;
    for (const orb of active) {
      if (orb.visible && !document.hidden && (!orb.paused && !reduced.matches || orb.dirty)) {
        if (!orb.paused && !reduced.matches) orb.time += delta * orb.speed;
        orb.draw(delta);
      }
    }
    if (!document.hidden && [...active].some(o => o.visible && (!o.paused && !reduced.matches || o.dirty))) frame = requestAnimationFrame(tick);
  }
  function wake() { if (!frame && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); } }
  document.addEventListener('visibilitychange', wake);
  reduced.addEventListener('change', () => { active.forEach(o => o.dirty = true); wake(); });
  function hex(value) { return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16)); }
  const palettes = colors.map(hex);
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  function number(value,fallback,min,max) { const n=Number(value); return value===null || !Number.isFinite(n)?fallback:clamp(n,min,max); }

  // Every form shares a strand/point topology, making transitions continuous.
  function position(mode,u,v,time,energy) {
    const theta=u*TAU, phi=v*TAU;
    if (mode===0) { // Mӧbius-like shells: thought continually folds back into itself.
      const a=theta + time*.15;
      const radius=.72 + .19*Math.cos(phi*3 + theta*2 + time*.36)*energy;
      return [radius*Math.cos(a)*Math.sin(phi), radius*Math.sin(a)*Math.sin(phi), .80*Math.cos(phi)+.12*Math.sin(theta*3+time*.3)*energy];
    }
    if (mode===1) { // Nested, tilted orbital searches around an open center.
      const tilt=(u-.5)*2.1;
      const r=.60+.24*Math.sin(u*Math.PI);
      const a=phi+time*.25;
      const x=r*Math.cos(a), y=r*Math.sin(a);
      return [x, y*Math.cos(tilt), y*Math.sin(tilt)+.19*Math.sin(theta+time*.6)*energy];
    }
    if (mode===2) { // A flexible spherical membrane, driven by a synthetic demo envelope.
      const beat=.5+.5*Math.sin(time*1.8);
      const r=.72 + energy*(.065*Math.sin(phi*8-time*1.7+theta*2)+.06*beat*Math.cos(theta*4));
      return [r*Math.cos(theta)*Math.sin(phi),r*Math.sin(theta)*Math.sin(phi),r*Math.cos(phi)];
    }
    if (mode===3) { // Continuous fibers braid into a coherent volume.
      const a=phi + theta*2 + time*.26;
      const major=.48, minor=.25+.035*Math.sin(theta*5-time)*energy;
      return [(major+minor*Math.cos(theta))*Math.cos(a),(major+minor*Math.cos(theta))*Math.sin(a),minor*Math.sin(theta)+.22*Math.sin(a*3+theta)*energy];
    }
    if (mode===4) { // Two linked fields with a visible bridge.
      const a=phi+time*.22;
      const r=.33+.11*Math.sin(theta);
      const x=(.41+r*Math.cos(a))*Math.cos(theta);
      const z=(.41+r*Math.cos(a))*Math.sin(theta);
      return [x, r*Math.sin(a)+.19*Math.cos(theta*2+time*.5)*energy, z];
    }
    if(mode>=6){
      const r=.7+.05*Math.sin(theta*6+time*.2)*energy;
      if(mode===8)return [r*Math.sin(phi)*Math.cos(theta), .9*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta)];
      if(mode===10)return [.36*Math.cos(phi*2+theta+time*.65),(v-.5)*1.72,.36*Math.sin(phi*2+theta+time*.65)];
      return [r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta)];
    }
    // A radial blossom resolving to a stable center.
    const radius=.72 + .12*Math.sin(theta*7)*Math.pow(Math.sin(phi),2)*energy;
    return [radius*Math.sin(phi)*Math.cos(theta),radius*Math.sin(phi)*Math.sin(theta),.47*Math.cos(phi)+.11*Math.sin(phi*4)*energy];
  }

  // Facets, fields and particles use the same 3D projection as the filament forms.
  function machinery(ctx,w,t,mode,e,ink,dark,project) {
    const rgb=ink.join(',');
    const stroke=(a=.5)=>`rgba(${rgb},${a})`;
    const glow=dark?1:.25;
    function path(points,alpha,width=1,close=false,fill=0){
      ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(close)ctx.closePath();
      if(fill){ctx.fillStyle=stroke(fill);ctx.fill();}ctx.strokeStyle=stroke(alpha);ctx.lineWidth=width;ctx.stroke();
    }
    function dot(p,r=1.4,a=.9){ctx.beginPath();ctx.arc(p[0],p[1],Math.max(.45,r),0,TAU);ctx.fillStyle=stroke(a);ctx.fill();}
    function halo(x,y,r,a){if(!dark)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,stroke(a));g.addColorStop(.25,stroke(a*.3));g.addColorStop(1,stroke(0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
    function ring(radius,tilt,spin,alpha=.65,segments=1){
      for(let s=0;s<segments;s++){
        const pts=[];const count=w<60?10:32;
        for(let j=0;j<=count;j++){const a=(s+(j/count)*(segments>1?.8:1))/segments*TAU+spin;const x=radius*Math.cos(a),y=radius*Math.sin(a);pts.push(project(x,y*Math.cos(tilt),y*Math.sin(tilt)));}
        path(pts,alpha,w<60?.6:.9);
      }
    }
    function nucleus(radius=.19){
      const c=project(0,0,0),r=w*.395*radius;
      halo(c[0],c[1],r*3,.2*glow);
      const g=ctx.createRadialGradient(c[0]-r*.3,c[1]-r*.4,r*.03,c[0],c[1],r);
      g.addColorStop(0,dark?'#f2ffff':stroke(.95));g.addColorStop(.12,stroke(.95));g.addColorStop(.5,stroke(.4));g.addColorStop(1,stroke(.04));
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(c[0],c[1],r,0,TAU);ctx.fill();
      ctx.strokeStyle=stroke(.7);ctx.lineWidth=.65;ctx.stroke();
    }
    if(mode===6){ // Reactor: separated spherical containment plates around a radiant core.
      nucleus(.24+.015*Math.sin(t)*e);
      const faces=[],rows=6,sectors=12;
      const sphere=(lat,lon,r)=>project(r*Math.cos(lat)*Math.cos(lon),r*Math.sin(lat),r*Math.cos(lat)*Math.sin(lon));
      for(let i=0;i<rows;i++)for(let j=0;j<sectors;j++){
        const lat0=-1.25+i*2.5/rows+.04,lat1=-1.25+(i+1)*2.5/rows-.04;
        const a0=j*TAU/sectors+.045+t*.13,a1=(j+1)*TAU/sectors-.045+t*.13;
        const r=.72+.025*Math.sin(t*1.1+i+j*.4)*e;
        const p=[sphere(lat0,a0,r),sphere(lat0,a1,r),sphere(lat1,a1,r),sphere(lat1,a0,r)];
        faces.push({p,z:p.reduce((a,b)=>a+b[2],0)/4});
      }
      faces.sort((a,b)=>a.z-b.z).forEach(({p,z})=>{path(p,.18+Math.max(0,z)*.68,.7,true,.025+Math.max(0,z)*.13);if(z>.35&&w>80)dot(p[0],.7,.8);});
      ring(.94,.16+t*.07,-t*.12,.35,12);
      ring(.96,.16+t*.07,-t*.12,.6,3);
    }else if(mode===7){ // Gyre: independently articulated gimbals, mechanical rather than soft.
      nucleus(.23);
      for(let k=0;k<3;k++){
        const tilt=.65+k*.94+Math.sin(t*.24+k)*.5*e,spin=t*(k%2?-.23:.19)+k;
        ring(.66+k*.10,tilt,spin,.72,4);ring(.68+k*.10,tilt,spin,.22,1);
        const a=spin*1.7+k;
        const p=project((.66+k*.10)*Math.cos(a),(.66+k*.10)*Math.sin(a)*Math.cos(tilt),(.66+k*.10)*Math.sin(a)*Math.sin(tilt));
        halo(p[0],p[1],w*.045,.28);dot(p,w*.008,1);
      }
    }else if(mode===8){ // Prism: floating crystalline octahedra with transmitted light.
      const verts=[[0,-.96,0],[.61,0,0],[0,0,.61],[-.61,0,0],[0,0,-.61],[0,.96,0]];
      const ids=[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]];
      const shells=[1,.56];
      for(const scale of shells){
        const p=verts.map(([x,y,z])=>project(x*scale,y*scale+Math.sin(t*.8)*.035*e,z*scale));
        ids.map(f=>({p:f.map(i=>p[i]),z:f.reduce((a,i)=>a+p[i][2],0)/3})).sort((a,b)=>a.z-b.z).forEach(({p,z})=>path(p,.32+Math.max(0,z)*.8,.8,true,.04+Math.max(0,z)*.22));
        p.forEach(v=>dot(v,w<60?.7:1.5,.8));
      }
      path([project(0,-1.08,0),project(0,1.08,0)],.3,.7);
      ring(.78,Math.PI/2,t*.1,.28,8);halo(w/2,w/2,w*.18,.15);
    }else if(mode===9){ // Echo: a scanning plane activates a sampled point-cloud sphere.
      const scan=Math.sin(t*.7)*(.25+.35*e), count=w<60?170:650;
      const planeR=Math.sqrt(Math.max(0,.78*.78-scan*scan));
      const ringPts=[];
      for(let j=0;j<=80;j++){const a=j/80*TAU;ringPts.push(project(planeR*Math.cos(a),scan,planeR*Math.sin(a)));}
      path(ringPts,.75,.8,true,.045);
      for(let i=0;i<count;i++){
        const y=1-2*(i+.5)/count,a=i*2.399963,r=Math.sqrt(1-y*y);
        const x=.78*r*Math.cos(a),yy=.78*y,z=.78*r*Math.sin(a),p=project(x,yy,z);
        const band=Math.exp(-Math.pow((yy-scan)*12,2));
        dot(p,(w<60?.42:.66)+band*(w<60?.5:1.05),.14+Math.max(0,p[2])*.25+band*.54);
      }
      const p=project(planeR,scan,0);halo(p[0],p[1],w*.07,.18);
    }else if(mode===10){ // Helix: twin chains with a timed signal crossing their rungs.
      for(let k=0;k<2;k++){
        const p=[];
        for(let j=0;j<=100;j++){const y=(j/100-.5)*1.72,a=j/100*TAU*1.8+t*.65+k*Math.PI;const r=.35+.06*Math.sin(j/100*Math.PI)*e;p.push(project(r*Math.cos(a),y,r*Math.sin(a)));}
        path(p,.75,w<60?.85:1.5);
      }
      for(let i=0;i<23;i++){
        const v=i/22,y=(v-.5)*1.72,a=v*TAU*1.8+t*.65,r=.35+.06*Math.sin(v*Math.PI)*e;
        const p=project(r*Math.cos(a),y,r*Math.sin(a)),q=project(-r*Math.cos(a),y,-r*Math.sin(a));
        const signal=.5+.5*Math.cos(v*TAU-t*1.3);
        path([p,q],.15+signal*.4,.6);dot(p,w<60?.65:1.7,.9);dot(q,w<60?.65:1.7,.9);
      }
      ring(.71,0,t*.12,.12,12);
    }else if(mode===11){ // Rift: folded accretion paths surrounding an opaque aperture.
      for(let k=0;k<24;k++){
        const pts=[],r=.42+k*.014;
        for(let j=0;j<=100;j++){const a=j/100*TAU+t*(.10+k*.002),rr=r+.05*Math.sin(a*3+k*.17+t*.25)*e;pts.push(project(rr*Math.cos(a),rr*Math.sin(a),.16*Math.sin(a*2+k*.15)*e));}
        path(pts,.13+k/24*.4,.7);
      }
      const c=project(0,0,0),r=w*.11;
      const aperture=ctx.createRadialGradient(c[0],c[1],r*.2,c[0],c[1],r*1.6);
      aperture.addColorStop(0,dark?'#05090d':'#e5e9e7');aperture.addColorStop(.65,dark?'#05090dfa':'#e5e9e7fa');aperture.addColorStop(1,dark?'#05090d00':'#e5e9e700');
      ctx.fillStyle=aperture;ctx.fillRect(c[0]-r*1.6,c[1]-r*1.6,r*3.2,r*3.2);
      ring(.93,.95+Math.sin(t*.2)*.15,t*.23,.65,2);
      for(let i=0;i<9;i++){const a=t*.45+i*TAU/9;const p=project(.88*Math.cos(a),.88*Math.sin(a)*Math.cos(.95),.88*Math.sin(a)*Math.sin(.95));dot(p,w<60?.7:1.3,.9);}
    }
  }

  class VeylSignal extends HTMLElement {
    static get observedAttributes() { return ['state','variant','size','speed','intensity','paused','theme','color','label','interactive']; }
    constructor() {
      super(); this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML=`<style>:host{display:inline-block;width:var(--orb-size,160px);height:var(--orb-size,160px);vertical-align:middle;contain:layout style;flex-shrink:0}canvas{display:block;width:100%;height:100%;pointer-events:none}</style><canvas aria-hidden="true"></canvas>`;
      this.canvas=this.shadowRoot.querySelector('canvas');
      this.ctx=this.canvas.getContext('2d');
      this.time=2.6; this.visible=true; this.dirty=true; this.mix=1;
      this.pointer={x:0,y:0}; this.aim={x:0,y:0}; this.mode=0; this.from=0;
      this.onPointer=(e)=>{if(!this.hasAttribute('interactive'))return; const b=this.getBoundingClientRect();this.aim={x:(e.clientX-b.left)/b.width-.5,y:(e.clientY-b.top)/b.height-.5};this.dirty=true;wake();};
      this.onLeave=()=>{this.aim={x:0,y:0};this.dirty=true;wake();};
    }
    connectedCallback() {
      this.mode=this.variantIndex;this.from=this.mode;
      this.update(); active.add(this);
      this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this);
      this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;if(this.visible){this.dirty=true;wake();}},{rootMargin:'40px'});this.observer.observe(this);
      this.addEventListener('pointermove',this.onPointer);this.addEventListener('pointerleave',this.onLeave);
      this.resize();wake();
    }
    disconnectedCallback() { active.delete(this);this.resizeObserver?.disconnect();this.observer?.disconnect();this.removeEventListener('pointermove',this.onPointer);this.removeEventListener('pointerleave',this.onLeave); }
    attributeChangedCallback(name,oldValue,newValue) {
      if(oldValue===newValue)return;
      if(name==='variant'){
        const next=this.variantIndex;
        // Explicit variants are authored silhouettes; keep their chosen geometry stable.
        if(next>=6){this.mode=next;this.from=next;this.mix=1;}
        else if(next!==this.mode){this.from=this.mode;this.mode=next;this.mix=0;}
      }else if(name==='state'&&this.variant==='auto'){
        const next=this.variantIndex;
        if(next!==this.mode){this.from=this.mode;this.mode=next;this.mix=0;}
      }
      this.update();if(this.isConnected)this.resize();
    }
    get state(){return states.includes(this.getAttribute('state'))?this.getAttribute('state'):'thinking';}
    set state(v){this.setAttribute('state',v);}
    get variant(){return variants.includes(this.getAttribute('variant'))?this.getAttribute('variant'):'auto';}
    set variant(v){this.setAttribute('variant',v);}
    get variantIndex(){return this.variant==='auto'?Math.max(0,states.indexOf(this.state)):variants.indexOf(this.variant);}
    get size(){return number(this.getAttribute('size'),160,16,800);}
    set size(v){this.setAttribute('size',v);}
    get speed(){return number(this.getAttribute('speed'),1,0,3);}
    set speed(v){this.setAttribute('speed',v);}
    get intensity(){return number(this.getAttribute('intensity'),.8,0,1.5);}
    set intensity(v){this.setAttribute('intensity',v);}
    get paused(){return this.hasAttribute('paused');}
    set paused(v){this.toggleAttribute('paused',Boolean(v));}
    update(){
      this.style.setProperty('--orb-size',`${this.size}px`);
      this.setAttribute('role','img');this.setAttribute('aria-label',this.getAttribute('label')||labels[Math.max(0,states.indexOf(this.state))]);
      this.dirty=true;wake();
    }
    resize(){const width=this.getBoundingClientRect().width;if(!width)return;this.width=width;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(width*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);this.dirty=true;wake();}
    draw(delta){
      if(!this.width)return;
      const ctx=this.ctx,w=this.width,t=this.time;
      ctx.clearRect(0,0,w,w);
      const stopped=this.paused||reduced.matches;
      this.mix=stopped?1:Math.min(1,this.mix+delta*1.3);
      const blend=this.mix*this.mix*(3-2*this.mix);
      this.pointer.x+=(this.aim.x-this.pointer.x)*.08;this.pointer.y+=(this.aim.y-this.pointer.y)*.08;
      const yaw=t*.12 + this.pointer.x*.5, pitch=.43+this.pointer.y*.5;
      const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
      const color=this.getAttribute('color');
      const rgb=/^#[0-9a-f]{6}$/i.test(color||'')?hex(color):palettes[this.mode];
      const dark=this.getAttribute('theme')!=='light';
      const ink=dark?rgb:rgb.map(c=>Math.round(c*.43));
      const strands=w<48?14:w<100?25:52;
      const steps=w<48?32:w<100?55:94;
      const scale=w*.395, e=this.intensity;
      const points=[];
      function project(x,y,z){const xx=x*cy+z*sy,zz=-x*sy+z*cy;const yy=y*cx-zz*sx,depth=y*sx+zz*cx;const p=2.9/(2.9-depth);return [w*.5+xx*scale*p,w*.5+yy*scale*p,depth,p];}
      if(this.mode<6||blend<1) for(let i=0;i<strands;i++){
        const line=[];
        for(let j=0;j<=steps;j++){
          const u=i/strands, v=j/steps;
          let p=position(this.mode,u,v,t,e);
          if(blend<1){const a=position(this.from,u,v,t,e);p=p.map((x,k)=>a[k]+(x-a[k])*blend);}
          line.push(project(...p));
        }
        points.push(line);
      }
      // Far-to-near passes retain the depth of the fine, translucent threads.
      ctx.save();
      ctx.globalAlpha=this.mode>=6?1-blend:1;
      const widths=w<48?.65:.62;
      for(let pass=0;pass<3;pass++){
        const low=-1.2+pass*.8,high=low+.8;
        ctx.lineWidth=widths;ctx.lineCap='round';
        ctx.strokeStyle=`rgba(${ink.join(',')},${dark?[.15,.36,.78][pass]:[.12,.26,.5][pass]})`;
        ctx.beginPath();
        for(const line of points){for(let j=1;j<line.length;j++){const p=line[j],a=line[j-1];if(p[2]>=low&&p[2]<high){ctx.moveTo(a[0],a[1]);ctx.lineTo(p[0],p[1]);}}}
        ctx.stroke();
      }
      // Pinpoint glints travel along actual strands rather than a random starfield.
      if(w>=48){
        for(let i=0;i<points.length;i+=3){const line=points[i];const j=Math.floor(((t*.07+i*.173)%1)*steps);const p=line[j];if(p[2]<-.15)continue;
          ctx.fillStyle=`rgba(${ink.join(',')},${.55+p[2]*.3})`;ctx.beginPath();ctx.arc(p[0],p[1],clamp(w/300,.7,1.6)*p[3],0,TAU);ctx.fill();
        }
      }
      ctx.restore();
      if(this.mode>=6){ctx.save();ctx.globalAlpha=blend;machinery(ctx,w,t,this.mode,e,ink,dark,project);ctx.restore();}
      if(dark&&w>64){ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(w*.5,w*.5,0,w*.5,w*.5,w*.38);g.addColorStop(0,`rgba(${rgb.join(',')},.055)`);g.addColorStop(1,`rgba(${rgb.join(',')},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,w,w);ctx.globalCompositeOperation='source-over';}
      this.dirty=false;
    }
  }
  customElements.define('veyl-signal',VeylSignal);
})();
