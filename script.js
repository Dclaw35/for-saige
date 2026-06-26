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

function clearTimers(){ clearTimeout(introTimer); clearInterval(autoplayTimer); autoplayTimer = null; }
function scheduleAutoplay(){ if(!isPlaying) return; clearInterval(autoplayTimer); autoplayTimer = setInterval(()=>{ if(index >= total - 1){ setPlaying(false); } else { showSlide(index + 1, false); } }, 4600); }
function setPlaying(on){ isPlaying = on; playPauseBtn.textContent = on ? 'Pause' : 'Play'; if(on){ userInteracted = true; scheduleAutoplay(); } else { clearInterval(autoplayTimer); autoplayTimer = null; } }

function showSlide(nextIndex, manual=false){
  if(manual) userInteracted = true;
  clearTimeout(introTimer);
  index = Math.max(0, Math.min(total - 1, nextIndex));
  const slide = slides[index];
  slides.forEach((s,i)=>s.classList.toggle('active', i===index));
  current.textContent = String(index + 1);
  progressBar.style.width = ((index+1)/total*100)+'%';
  scrubber.value = String(index + 1);
  prevBtn.style.opacity = index===0 ? '.35' : '1';
  nextBtn.textContent = index===total-1 ? 'Start Over' : 'Next';
  if(index > 7) hint.style.opacity = '.28';
  document.body.classList.toggle('quiet-mode', slide.classList.contains('quiet'));
  document.body.classList.toggle('dark-moment', slide.classList.contains('special-darken'));
  const auto = slide.dataset.auto;
  if(auto && !userInteracted && !isPlaying){ introTimer = setTimeout(()=>showSlide(index+1, false), Number(auto)); }
  if(isPlaying) scheduleAutoplay();
}
function next(manual=true){ if(index >= total-1){ showSlide(0, manual); } else { showSlide(index+1, manual); } }
function prev(){ showSlide(index-1, true); }
nextBtn.addEventListener('click', e=>{e.stopPropagation(); next(true);});
prevBtn.addEventListener('click', e=>{e.stopPropagation(); prev();});
playPauseBtn.addEventListener('click', e=>{ e.stopPropagation(); setPlaying(!isPlaying); });
scrubber.addEventListener('input', e=>{ showSlide(Number(e.target.value)-1, true); });

document.addEventListener('click', e=>{ if(e.target.closest('button,input,textarea,label')) return; next(true); });
document.addEventListener('keydown', e=>{ if(e.target.matches('input,textarea')) return; if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault(); next(true);} if(e.key===' '){ e.preventDefault(); setPlaying(!isPlaying); } if(e.key==='ArrowLeft'){e.preventDefault(); prev();}});
let touchStartX = 0;
document.addEventListener('touchstart', e=>{touchStartX = e.changedTouches[0].clientX;},{passive:true});
document.addEventListener('touchend', e=>{ if(e.target.closest('button,input,textarea,label')) return; const dx = e.changedTouches[0].clientX - touchStartX; if(Math.abs(dx) > 50){ dx < 0 ? next(true) : prev(); } },{passive:true});
function createPetals(){ const field = document.querySelector('.petals'); for(let i=0;i<24;i++){ const p=document.createElement('span'); p.className='petal'; p.style.left=`${Math.random()*100}vw`; p.style.animationDuration=`${18 + Math.random()*26}s`; p.style.animationDelay=`${-Math.random()*32}s`; p.style.width=`${8 + Math.random()*11}px`; p.style.height=`${15 + Math.random()*16}px`; p.style.setProperty('--drift', `${Math.random()*170 - 85}px`); field.appendChild(p); } }
function setupCopyButton(){ const btn = document.getElementById('copy-letter'); if(!btn) return; btn.addEventListener('click', async e=>{ e.stopPropagation(); const name=document.getElementById('from').value.trim()||'Saige'; const letter=document.getElementById('letter').value.trim(); const status=document.getElementById('copy-status'); if(!letter){ status.textContent='You have to write the letter first, beautiful. The button is powerful, but not psychic.'; return; } try{ await navigator.clipboard.writeText(`From: ${name}

${letter}`); status.textContent='Copied. Now paste it into a text to me.'; } catch { status.textContent='Copy did not work automatically. Highlight the text and copy it the old fashioned way.'; } }); }
createPetals(); setupCopyButton(); showSlide(0);