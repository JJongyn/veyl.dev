(() => {
  'use strict';
  const forms = [
    {name:'Reactor',state:'thinking',color:'#7cebdc',family:'field',description:'A thought held in a containment field.',status:'Thinking inside the containment field',inline:'Thinking…'},
    {name:'Gyre',state:'connecting',color:'#98baff',family:'field',description:'Independent systems. One center.',status:'Bringing the systems into alignment',inline:'Connecting…'},
    {name:'Prism',state:'composing',color:'#f8c6a7',family:'field',description:'An idea crystallizing into light.',status:'Crystallizing the answer',inline:'Composing…'},
    {name:'Echo',state:'searching',color:'#c4f5a1',family:'field',description:'A sweep through the unknown.',status:'Scanning for the next signal',inline:'Searching…'},
    {name:'Helix',state:'connecting',color:'#d1b0ff',family:'field',description:'Two signals learning the same rhythm.',status:'Synchronizing the signal paths',inline:'Connecting…'},
    {name:'Rift',state:'searching',color:'#84dbe9',family:'field',description:'An aperture to somewhere else.',status:'Searching beyond the threshold',inline:'Searching…'},
    {name:'Fold',state:'thinking',color:'#baf2cb',description:'Thought, finding its shape.',status:'Thinking through the possibilities',inline:'Thinking…'},
    {name:'Trace',state:'searching',color:'#8bbdff',description:'Curiosity, in continuous orbit.',status:'Searching for the right signal',inline:'Searching…'},
    {name:'Tide',state:'listening',color:'#d4b4fa',description:'A surface that feels the signal.',status:'Listening, with a little presence',inline:'Listening…'},
    {name:'Loom',state:'composing',color:'#ffc494',description:'Loose threads become an answer.',status:'Weaving the answer together',inline:'Composing…'},
    {name:'Link',state:'connecting',color:'#f2a9c2',description:'Separate worlds, finding a rhythm.',status:'Connecting the pieces',inline:'Connecting…'},
    {name:'Bloom',state:'complete',color:'#ecedbb',description:'A thought, beautifully resolved.',status:'Everything has come together',inline:'Complete'}
  ];
  forms.forEach(f=>{f.variant=f.name.toLowerCase();f.family||='organic';});
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const grid=$('#orb-grid'),studio=$('#studio-orb');
  let selected=0,heroIndex=3,allPaused=false,studioPaused=false,lightSurface=false,toastTimer;
  grid.innerHTML=forms.map((f,i)=>`<button class="orb-card" data-family="${f.family}" style="--orb-tint:${f.color}" data-form="${i}" aria-label="Customize ${f.name}, ${f.state} orb"><div class="card-top"><span>${String(i+1).padStart(2,'0')} <b class="series-tag">${f.family==='field'?'FIELD / NEW':'FILAMENT'}</b></span><span class="form-tag"><i></i>${f.state.toUpperCase()}</span></div><div class="card-stage"><veyl-signal state="${f.state}" variant="${f.variant}" size="190" label="${f.name}: ${f.state}" aria-hidden="true"></veyl-signal><span class="card-inline-label">${f.inline}</span></div><div class="card-info"><div><h3>${f.name}</h3><p>${f.description}</p></div><span class="card-arrow" aria-hidden="true">↗</span></div></button>`).join('');
  $('#form-picker').innerHTML=forms.map((f,i)=>`<button data-select="${i}" aria-pressed="${i===0}" class="${i===0?'active':''}" title="${f.state}" data-family="${f.family}">${f.name}</button>`).join('');
  function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400);}
  function currentCode(){
    const extras=[];
    if(studio.speed!==1)extras.push(`  speed="${studio.speed.toFixed(1)}"`);
    if(studio.intensity!==.8)extras.push(`  intensity="${studio.intensity.toFixed(2)}"`);
    if(studio.getAttribute('theme')==='light')extras.push('  theme="light"');
    if(studio.paused)extras.push('  paused');
    return `<veyl-signal\n  state="${studio.state}"\n  variant="${studio.variant}"\n  size="${studio.size}"${extras.length?'\n'+extras.join('\n'):''}\n  interactive\n></veyl-signal>`;
  }
  function updateCode(){ $('#live-code').textContent=currentCode(); }
  function select(index){selected=index;const f=forms[index];studio.variant=f.variant;studio.state=f.state;$('#studio-status').textContent=f.status;$('#preview-metadata').textContent=`${f.name.toUpperCase()} / ${f.state.toUpperCase()}`;$$('[data-select]').forEach(b=>{const on=Number(b.dataset.select)===index;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);});updateCode();}
  function theme(){
    const light=document.documentElement.dataset.theme==='light';
    $$('veyl-signal').forEach(o=>o.setAttribute('theme',light?'light':'dark'));
    studio.setAttribute('theme',light||lightSurface?'light':'dark');
    $('#studio-preview').classList.toggle('is-light',lightSurface);
    $('#theme-toggle').setAttribute('aria-label',`Switch to ${light?'dark':'light'} theme`);
    $('#studio-background').textContent=lightSurface?'◐ Match page':'◐ Light surface';
    $('#studio-background').setAttribute('aria-pressed',lightSurface);
    updateCode();
  }
  function pauses(){
    $$('veyl-signal').forEach(o=>o.paused=allPaused||(o===studio&&studioPaused));
    $('#pause-all').innerHTML=allPaused?'▶ Resume motion':'<span class="pause-symbol">Ⅱ</span> Pause motion';
    $('#pause-all').setAttribute('aria-pressed',allPaused);
    $('#studio-pause').textContent=studio.paused?'▶ Play':'Ⅱ Pause';
    $('#studio-pause').setAttribute('aria-pressed',studio.paused);
    updateCode();
  }
  async function copy(text,title){
    try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);toast(title);}
    catch{const dialog=$('#copy-dialog');$('#copy-dialog-title').textContent=title.replace('copied','');$('#copy-fallback').value=text;dialog.showModal();$('#copy-fallback').focus();$('#copy-fallback').select();}
  }
  $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const value=b.dataset.filter;$$('.orb-card').forEach(card=>card.hidden=value!=='all'&&card.dataset.family!==value);$$('[data-filter]').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on);});$('#form-count').textContent=value==='all'?'12 forms':value==='field'?'6 field forms':'6 filament forms';}));
  $$('[data-form]').forEach(b=>b.addEventListener('click',()=>{select(Number(b.dataset.form));$('#playground').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
  $$('[data-select]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.select))));
  $$('[data-scale]').forEach(b=>b.addEventListener('click',()=>{const inline=b.dataset.scale==='inline';grid.classList.toggle('inline-mode',inline);$$('.orb-card veyl-signal').forEach(o=>o.size=inline?32:190);$$('[data-scale]').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on);});}));
  $$('[data-size]').forEach(b=>b.addEventListener('click',()=>{studio.size=Number(b.dataset.size);$$('[data-size]').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on);});updateCode();}));
  $('#hero-next').addEventListener('click',()=>{heroIndex=(heroIndex+1)%forms.length;const f=forms[heroIndex];$('#hero-orb').variant=f.variant;$('#hero-orb').state=f.state;$('#hero-orb').setAttribute('label',`${f.name}: ${f.state}`);$('.specimen-name').textContent=`${String(heroIndex+1).padStart(2,'0')} — ${f.name}`;$('.specimen-detail').textContent=f.description;$('.art-caption>span').textContent=`SPECIMEN ${String(heroIndex+1).padStart(2,'0')}`;});
  $('#speed').addEventListener('input',(e)=>{studio.speed=e.target.value;$('#speed-output').textContent=studio.speed.toFixed(1)+'×';updateCode();});
  $('#intensity').addEventListener('input',(e)=>{studio.intensity=e.target.value;$('#intensity-output').textContent=Math.round(studio.intensity*100)+'%';updateCode();});
  $('#pause-all').addEventListener('click',()=>{allPaused=!allPaused;pauses();});
  $('#studio-pause').addEventListener('click',()=>{if(allPaused){allPaused=false;studioPaused=false;}else studioPaused=!studioPaused;pauses();});
  $('#theme-toggle').addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';theme();});
  $('#studio-background').addEventListener('click',()=>{lightSurface=!lightSurface;theme();});
  $('#reset-controls').addEventListener('click',()=>{studio.speed=1;studio.intensity=.8;studio.size=280;$('#speed').value=1;$('#intensity').value=.8;$('#speed-output').textContent='1.0×';$('#intensity-output').textContent='80%';studioPaused=false;allPaused=false;lightSurface=false;$$('[data-size]').forEach(x=>{const on=x.dataset.size==='280';x.classList.toggle('active',on);x.setAttribute('aria-pressed',on);});select(0);pauses();theme();});
  $('#copy-code').addEventListener('click',()=>copy(`<script src="./veyl.js"></script>\n\n${currentCode()}`,'Component code copied'));
  $('#copy-prompt').addEventListener('click',()=>copy(`Integrate the local Veyl component into this project. Download/copy veyl.js from this library into the app; it is not published to npm. It registers the native <veyl-signal> Web Component with no runtime dependencies. For plain HTML load a classic script. With a bundler import the file on the client only.\n\nSelected configuration:\n${currentCode()}\n\nSupported states: thinking (Fold), searching (Trace), listening (Tide), composing (Loom), connecting (Link), complete (Bloom). Bind state to the host application's actual activity. Never simulate agent work or imply microphone recording: listening is a synthetic visual, not audio capture. Use 24px for inline status, 64px for an avatar, larger sizes for a deliberate focal point. Pair it with visible status text; announce state transitions in one host role=status region. Respect reduced motion. The element automatically pauses when offscreen or the document is hidden. Variants: auto, reactor, gyre, prism, echo, helix, rift, fold, trace, tide, loom, link, bloom. The state conveys real activity; variant chooses the visual form. With variant=auto, states select the original filament forms. Attributes: state, variant, size (16–800), speed (0–3), intensity (0–1.5), theme (dark/light), color (#RRGGBB), paused and interactive boolean attributes. Use removeAttribute('paused') to resume. Keep existing app content and controls. See veyl.md for integration examples.`, 'Agent prompt copied'));
  $('#close-dialog').addEventListener('click',()=>$('#copy-dialog').close());
  $('#copy-dialog').addEventListener('click',e=>{if(e.target===$('#copy-dialog'))$('#copy-dialog').close();});
  select(0);theme();updateCode();
})();
