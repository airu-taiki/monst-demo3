document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const intro = document.getElementById('intro');
  const alertVideo = document.getElementById('alertVideo');
  const bgmVideo = document.getElementById('bgmVideo');
  const glitchVideo = document.getElementById('glitchVideo');
  const dolphinLayer = document.getElementById('dolphinLayer');
  const hud = document.getElementById('hud');
  const bossBlock = document.getElementById('bossBlock');
  const comboLabel = document.getElementById('comboLabel');
  const hitCounter = document.getElementById('hitCounter');
  const strikeShot = document.getElementById('strikeShot');
  const systemError = document.getElementById('systemError');
  const systemFailure = document.getElementById('systemFailure');
  const awareness = document.getElementById('awareness');

  let running = false;
  let hitValue = 1;
  let dolphinTimer = null;

  function show(el){ if(el) el.classList.remove('hidden'); }
  function hide(el){ if(el) el.classList.add('hidden'); }
  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function safePlay(video){
    if(!video) return;
    try{
      video.muted = false;
      video.currentTime = 0;
      await video.play();
    }catch(e){
      console.log('play error', e);
    }
  }

  function reset(){
    [alertVideo,bgmVideo,glitchVideo,hud,bossBlock,
     comboLabel,hitCounter,strikeShot,systemError,
     systemFailure,awareness].forEach(hide);

    try{ alertVideo.pause(); }catch(e){}
    try{ bgmVideo.pause(); }catch(e){}
    try{ glitchVideo.pause(); }catch(e){}

    if(alertVideo){
      alertVideo.currentTime = 0;
      alertVideo.volume = 1.0;
    }
    if(bgmVideo){
      bgmVideo.currentTime = 0;
      bgmVideo.volume = 0.7;
    }
    if(glitchVideo){
      glitchVideo.currentTime = 0;
      glitchVideo.volume = 0.8;
    }

    if(dolphinLayer) dolphinLayer.innerHTML = '';
  }

  function spawnDolphin(speed=8000){
    if(!dolphinLayer) return;

    const img = document.createElement('img');
    img.src = 'assets/dolphin.png';
    img.className = 'dolphin';

    const y = Math.random()*window.innerHeight;
    img.style.top = y + 'px';
    img.style.left = '-100px';

    dolphinLayer.appendChild(img);

    requestAnimationFrame(()=>{
      img.style.transition = speed + 'ms linear';
      img.style.left = window.innerWidth + 'px';
    });

    setTimeout(()=>img.remove(), speed);
  }

  function startDolphins(){
    spawnDolphin();
    dolphinTimer = setInterval(()=>spawnDolphin(3000), 300);
  }

  function stopDolphins(){
    if(dolphinTimer) clearInterval(dolphinTimer);
  }

  async function playGlitch(){
    if(!glitchVideo) return;
    show(glitchVideo);
    await safePlay(glitchVideo);
    await wait(2200);
    glitchVideo.pause();
    hide(glitchVideo);
  }

  function animateHits(max){
    return new Promise(resolve=>{
      const t = setInterval(()=>{
        hitValue += Math.floor(Math.random()*10)+1;
        hitCounter.textContent = hitValue + " Hits";
        if(hitValue >= max){
          clearInterval(t);
          resolve();
        }
      },100);
    });
  }

  async function start(){
    if(running) return;
    running = true;

    reset();
    hide(intro);

    // アラート
    show(alertVideo);
    await safePlay(alertVideo);
    await wait(2000);
    hide(alertVideo);

    // BGM開始（背景）
    show(bgmVideo);
    await safePlay(bgmVideo);

    startDolphins();

    await wait(2000);
    show(hud);

    await wait(1000);
    show(bossBlock);

    await wait(1500);
    show(comboLabel);
    show(hitCounter);
    hitValue = 1;
    await animateHits(100);

    show(strikeShot);
    await animateHits(300);

    hide(strikeShot);
    show(systemError);

    await wait(1200);
    hide(systemError);
    show(systemFailure);

    await wait(800);
    hide(systemFailure);

    // グリッチ（ここ重要）
    await playGlitch();

    stopDolphins();
    hide(hud);
    hide(comboLabel);
    hide(hitCounter);

    bgmVideo.pause();
    hide(bgmVideo);

    show(awareness);

    running = false;
  }

  if(startBtn){
    startBtn.addEventListener('click', start);
  }
});