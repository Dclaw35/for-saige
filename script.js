document.body.classList.add('preload');
const slides = Array.from(document.querySelectorAll('.slide'));
const total = slides.length;
let index = 0;
let introTimer = null;
let autoplayTimer = null;
let userInteracted = false;
let isPlaying = false;
const current = document.getElementById('current');
const progressBar = document.getElementById('progress-bar');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const playPauseBtn = document.getElementById('playpause');
const scrubber = document.getElementById('scrubber');
const hint = document.getElementById('hint');
const counterEl = document.querySelector('.counter');
const progressEl = document.querySelector('.progress');
if(scrubber) scrubber.max = String(total);

function clearTimers(){ clearTimeout(introTimer); clearTimeout(autoplayTimer); autoplayTimer = null; }
function updateCounter(){ if(counterEl) counterEl.innerHTML = `<span id="current">${index + 1}</span> / ${total}`; }
function setPlaying(on){ isPlaying = on; playPauseBtn.textContent = on ? 'Pause' : 'Play'; if(on){ userInteracted = true; scheduleAutoplay(); } else { clearTimeout(autoplayTimer); autoplayTimer = null; } }
function scheduleAutoplay(){ if(!isPlaying) return; clearTimeout(autoplayTimer); const dur = Number(slides[index].dataset.duration || 3600); autoplayTimer = setTimeout(()=>{ if(index >= total - 1){ setPlaying(false); } else { showSlide(index + 1, false); } }, dur); }
function showSlide(nextIndex, manual=false){ if(manual) userInteracted = true; clearTimeout(introTimer); index = Math.max(0, Math.min(total - 1, nextIndex)); const slide = slides[index]; slides.forEach((s,i)=>s.classList.toggle('active', i===index)); updateCounter(); progressBar.style.width = ((index+1)/total*100)+'%'; scrubber.value = String(index + 1); prevBtn.style.opacity = index===0 ? '.35' : '1'; nextBtn.textContent = index===total-1 ? 'Start Over' : 'Next'; if(index > 7) hint.style.opacity = '.28'; document.body.classList.toggle('quiet-mode', slide.classList.contains('quiet')); document.body.classList.toggle('dark-moment', slide.classList.contains('special-darken')); document.body.classList.toggle('tv-mode', slide.classList.contains('scene-tv')); document.body.classList.toggle('hush-mode', slide.classList.contains('scene-you') || slide.classList.contains('scene-cleanbeat')); document.body.classList.toggle('hush-lite', slide.classList.contains('scene-seen')); document.body.classList.toggle('scene-hush', slide.classList.contains('scene-hush')); if(!userInteracted && !isPlaying && index < 3){ const introDur = Number(slide.dataset.duration || 2400); introTimer = setTimeout(()=>showSlide(index+1, false), introDur); } if(isPlaying) scheduleAutoplay(); }
function next(manual=true){ if(index >= total-1){ showSlide(0, manual); } else { showSlide(index+1, manual); } }
function prev(){ showSlide(index-1, true); }
nextBtn.addEventListener('click', e=>{e.stopPropagation(); next(true);}); prevBtn.addEventListener('click', e=>{e.stopPropagation(); prev();}); playPauseBtn.addEventListener('click', e=>{ e.stopPropagation(); setPlaying(!isPlaying); }); scrubber.addEventListener('input', e=>{ showSlide(Number(e.target.value)-1, true); });
document.addEventListener('click', e=>{ if(e.target.closest('button,input,textarea,label,.tap-target,.counter,.progress,.form-title')) return; next(true); });
document.addEventListener('keydown', e=>{ if(e.target.matches('input,textarea')) return; if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault(); next(true);} if(e.key===' '){ e.preventDefault(); setPlaying(!isPlaying); } if(e.key==='ArrowLeft'){e.preventDefault(); prev();}}); let touchStartX = 0; document.addEventListener('touchstart', e=>{touchStartX = e.changedTouches[0].clientX;},{passive:true}); document.addEventListener('touchend', e=>{ if(e.target.closest('button,input,textarea,label,.tap-target,.counter,.progress,.form-title')) return; const dx = e.changedTouches[0].clientX - touchStartX; if(Math.abs(dx) > 50){ dx < 0 ? next(true) : prev(); } },{passive:true});
function createPetals(){ const field = document.querySelector('.petals'); for(let i=0;i<24;i++){ const p=document.createElement('span'); p.className='petal'; p.style.left=`${Math.random()*100}vw`; p.style.animationDuration=`${18 + Math.random()*26}s`; p.style.animationDelay=`${-Math.random()*32}s`; p.style.width=`${8 + Math.random()*11}px`; p.style.height=`${15 + Math.random()*16}px`; p.style.setProperty('--drift', `${Math.random()*170 - 85}px`); field.appendChild(p); } }
function setupCopyButton(){ const btn = document.getElementById('copy-letter'); if(!btn) return; let emptyClicks = 0; btn.addEventListener('click', async e=>{ e.stopPropagation(); const name=document.getElementById('from').value.trim()||'Saige'; const letter=document.getElementById('letter').value.trim(); const status=document.getElementById('copy-status'); if(!letter){ emptyClicks += 1; status.textContent = emptyClicks >= 3 ? 'Okay now you’re just testing me.' : 'You have to write something first, beautiful.'; return; } emptyClicks = 0; try{ await navigator.clipboard.writeText(`From: ${name}

${letter}`); status.textContent='Copied. Now paste it into a text to me.'; } catch { status.textContent='Copy did not work automatically. Highlight the text and copy it the old fashioned way.'; } }); }

function pulseClass(el, name, ms=1900){
  if(!el) return;
  el.classList.remove(name);
  void el.offsetWidth;
  el.classList.add(name);
  setTimeout(()=>el.classList.remove(name), ms);
}

function flashToast(el, text, ms=1700){
  if(!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(()=>el.classList.remove('show'), ms);
}
function setupIntroNotes(){
  const context = document.getElementById('intro-context-note');
  const randomNote = document.getElementById('intro-random-note');
  if(context){
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    const hour = now.getHours();
    let line = '';
    if(month === 0 && date === 5){
      line = 'still choosing you today too. Happy anniversary, gorgeous.';
    } else if(hour < 4){
      line = 'this feels like our kind of hour.';
    } else if(hour < 12){
      line = 'good morning, favorite person.';
    } else if(hour >= 20){
      line = 'you’re up late, beautiful.';
    }
    context.textContent = line;
    if(!line) context.style.display = 'none';
  }
  if(randomNote){
    const options = [
      'I hope you smiled here.',
      'I made this part thinking about your face.',
      'You’re still my obsession.',
      'I love the life we’re building, even when it’s loud.'
    ];
    randomNote.textContent = options[Math.floor(Math.random() * options.length)];
  }
}
function setupEasterEggs(){
  const heartToast = document.getElementById('heart-toast');
  const progressToast = document.getElementById('progress-toast');
  const salonTap = document.querySelector('.tap-salon');
  const familyTap = document.querySelector('.tap-family');
  const houseTap = document.querySelector('.tap-house');
  const youTap = document.querySelector('.tap-you');
  const overthinkTap = document.querySelector('.tap-overthink');
  const worryTap = document.querySelector('.tap-worry');
  const sorryTap = document.querySelector('.tap-sorry');
  const formTitle = document.querySelector('.form-title');
  const salonSlide = document.querySelector('.easter-responsibilities');
  const treasureHearts = Array.from(document.querySelectorAll('.treasure-heart'));
  const formCard = document.querySelector('.form-card');
  const foundHearts = new Set();
  const totalHearts = treasureHearts.length;

  setupIntroNotes();

  const notePulse = (noteSel, hostSel, cls='show-note', ms=2400) => {
    const note = document.querySelector(noteSel);
    const host = document.querySelector(hostSel) || note;
    if(!note || !host) return;
    note.classList.remove(cls);
    void note.offsetWidth;
    note.classList.add(cls);
    setTimeout(()=>note.classList.remove(cls), ms);
  };

  if(salonTap && salonSlide){ salonTap.addEventListener('click', e=>{ e.stopPropagation(); pulseClass(salonSlide, 'salon-praise', 2600); }); }
  if(houseTap && salonSlide){ houseTap.addEventListener('click', e=>{ e.stopPropagation(); pulseClass(salonSlide, 'house-praise', 2600); }); }
  if(familyTap && salonSlide){ familyTap.addEventListener('click', e=>{ e.stopPropagation(); pulseClass(salonSlide, 'family-glow', 1900); }); }
  if(youTap){ youTap.addEventListener('click', e=>{ e.stopPropagation(); notePulse('.always-you-note', '.always-you-note'); }); }
  if(overthinkTap){ overthinkTap.addEventListener('click', e=>{ e.stopPropagation(); notePulse('.overthink-note', '.overthink-note'); }); }
  if(worryTap){ worryTap.addEventListener('click', e=>{ e.stopPropagation(); notePulse('.worry-note', '.worry-note'); }); }
  if(sorryTap){ sorryTap.addEventListener('click', e=>{ e.stopPropagation(); notePulse('.sorry-note', '.sorry-note'); }); }
  if(formTitle){ formTitle.addEventListener('click', e=>{ e.stopPropagation(); notePulse('.form-title-note', '.form-title-note', 'show-note', 2800); }); }

  let seqStage = 0;
  const sequenceNote = document.querySelector('.sequence-note');
  const every = document.querySelector('.tap-every');
  const single = document.querySelector('.tap-single');
  const time = document.querySelector('.tap-time');
  if(every) every.addEventListener('click', e=>{ e.stopPropagation(); seqStage = 1; flashToast(progressToast, '1 / 3', 850); });
  if(single) single.addEventListener('click', e=>{ e.stopPropagation(); if(seqStage === 1){ seqStage = 2; flashToast(progressToast, '2 / 3', 850); } else { seqStage = 0; } });
  if(time) time.addEventListener('click', e=>{ e.stopPropagation(); if(seqStage === 2 && sequenceNote){ sequenceNote.classList.remove('show-note'); void sequenceNote.offsetWidth; sequenceNote.classList.add('show-note'); flashToast(progressToast, '3 / 3', 850); setTimeout(()=>flashToast(progressToast, 'in every lifetime', 1300), 650); } seqStage = 0; });

  function markHeartFound(btn){
    if(!btn) return;
    const id = btn.dataset.heart;
    if(foundHearts.has(id)) return;
    foundHearts.add(id);
    btn.classList.add('found');
    flashToast(heartToast, `${foundHearts.size} / ${totalHearts}`, 1400);
    if(foundHearts.size === totalHearts && formCard){
      formCard.classList.add('hearts-unlocked');
      const reward = document.getElementById('heart-reward');
      if(reward) reward.setAttribute('aria-hidden','false');
      setTimeout(()=>flashToast(heartToast, 'Secret unlocked', 1800), 650);
    }
  }
  treasureHearts.forEach(btn=>{
    btn.addEventListener('click', e=>{ e.stopPropagation(); markHeartFound(btn); });
  });

  let secretTapCount = 0;
  let secretTapTimer = null;
  const registerSecretTap = ()=>{
    secretTapCount += 1;
    clearTimeout(secretTapTimer);
    if(secretTapCount >= 5){
      secretTapCount = 0;
      if(counterEl){
        counterEl.textContent = 'I / love / you';
        secretTapTimer = setTimeout(()=>updateCounter(), 2200);
      }
      return;
    }
    secretTapTimer = setTimeout(()=>{ secretTapCount = 0; }, 1400);
  };
  if(counterEl){ counterEl.addEventListener('click', e=>{ e.stopPropagation(); registerSecretTap(); }); }
  if(progressEl){ progressEl.addEventListener('click', e=>{ e.stopPropagation(); registerSecretTap(); }); }

  let holdTimer = null;
  const startHold = () => {
    clearTimeout(holdTimer);
    holdTimer = setTimeout(()=>flashToast(progressToast, 'don’t skip the good parts.', 2000), 2000);
  };
  const cancelHold = () => clearTimeout(holdTimer);
  if(progressEl){
    progressEl.addEventListener('mousedown', startHold);
    progressEl.addEventListener('touchstart', startHold, {passive:true});
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt=>progressEl.addEventListener(evt, cancelHold, {passive:true}));
  }
}

createPetals(); setupCopyButton(); setupEasterEggs();
function initDeck(){ document.body.classList.remove('preload'); showSlide(0); }
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(initDeck).catch(initDeck); } else { window.addEventListener('load', initDeck, { once: true }); }