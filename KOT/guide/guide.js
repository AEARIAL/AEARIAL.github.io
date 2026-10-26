'use strict';
const $=id=>document.getElementById(id);
let data,chapter=0,step=0,expanded=false;
const strip=text=>text.replace(/\[\/?(?:b|color(?:=#[\da-f]+)?)\]/gi,'');
const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=text=>escape(text).replace(/\[b\]/g,'<strong>').replace(/\[\/b\]/g,'</strong>').replace(/\[color=#[\da-f]+\]/gi,'').replace(/\[\/color\]/g,'');
const hash=(c,s=0)=>'#'+data.lessons[c].id+'/'+(s+1);
function navigate(c,s){location.hash=hash(c,s);}
function updatePicture(){
  const current=data.lessons[chapter].steps[step];
  const region=expanded?[0,0,...current.size]:current.focus;
  $('scene').setAttribute('viewBox',region.join(' '));
  $('picture').setAttribute('href',current.image);
  $('picture').setAttribute('width',current.size[0]);$('picture').setAttribute('height',current.size[1]);
  const [x,y,w,h]=current.target;
  for(const [name,value]of Object.entries({x:x+1.5,y:y+1.5,width:w-3,height:h-3}))$('highlight').setAttribute(name,value);
  $('scene-title').textContent=current.caption;
  $('scene-description').textContent=current.name+'を黄色の枠で示したゲーム画面。画面全体表示へ切り替えられます。';
  $('view-mode').textContent=expanded?'注目箇所に戻る':'画面全体を見る';
  $('view-mode').setAttribute('aria-pressed',String(expanded));
}
function render(){
  const parts=location.hash.slice(1).split('/');
  const found=data.lessons.findIndex(l=>l.id===parts[0]);chapter=found<0?0:found;
  step=Math.min(Math.max((Number(parts[1])||1)-1,0),data.lessons[chapter].steps.length-1);step=Math.floor(step);
  const lesson=data.lessons[chapter];expanded=false;
  document.title=lesson.nav+' | 遊び方 | Key Or Trap';
  for(const a of $('chapters').querySelectorAll('a')){if(a.dataset.chapter===String(chapter))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
  $('chapter-number').textContent=chapter<data.basicCount?'BASIC GUIDE / '+String(chapter+1).padStart(2,'0'):'AFTER THE RITUAL / TAROT';
  $('chapter-title').textContent=strip(lesson.title);
  $('tarot-note').hidden=chapter<data.basicCount;
  $('step-count').textContent='手順 '+(step+1)+' / '+lesson.steps.length;
  $('steps').replaceChildren(...lesson.steps.map((s,i)=>{const a=document.createElement('a');a.href=hash(chapter,i);a.textContent=(i+1)+' '+s.name;if(i===step)a.setAttribute('aria-current','step');return a;}));
  $('caption').textContent=lesson.steps[step].caption;
  updatePicture();
  $('previous').disabled=chapter===0&&step===0;
  const last=chapter===data.lessons.length-1&&step===lesson.steps.length-1;
  $('next').textContent=last?'最初に戻る':chapter===5&&step===lesson.steps.length-1?'タロットを見る':step===lesson.steps.length-1?'次の章へ':'次へ';
  $('progress').textContent=chapter<data.basicCount?'基本 '+(chapter+1)+' / '+data.basicCount+'章':'別枠・タロット';
  $('details').open=false;
  $('rules').innerHTML='<p>'+rich(lesson.lead)+'</p>'+lesson.cards.map(([title,body])=>'<h3>'+escape(title)+'</h3><p>'+rich(body)+'</p>').join('')+'<p class="tip">'+rich(lesson.tip)+'</p>';
  $('complete').hidden=!(last||(chapter===5&&step===lesson.steps.length-1));
  $('reader').hidden=false;$('loading').hidden=true;
  $('reader').classList.remove('enter');void $('reader').offsetWidth;$('reader').classList.add('enter');
}
function advance(direction){
  const count=data.lessons[chapter].steps.length;
  if(direction<0){if(step>0)navigate(chapter,step-1);else if(chapter>0)navigate(chapter-1,data.lessons[chapter-1].steps.length-1);}
  else if(step+1<count)navigate(chapter,step+1);else if(chapter+1<data.lessons.length)navigate(chapter+1,0);else navigate(0,0);
}
$('previous').addEventListener('click',()=>advance(-1));$('next').addEventListener('click',()=>advance(1));
$('view-mode').addEventListener('click',()=>{expanded=!expanded;updatePicture();});
$('enlarge').addEventListener('click',()=>{
  const svg=$('scene').cloneNode(true);svg.removeAttribute('id');svg.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  svg.removeAttribute('aria-labelledby');svg.setAttribute('aria-label',data.lessons[chapter].steps[step].caption);
  $('dialog-title').textContent=data.lessons[chapter].steps[step].caption;$('zoom-host').replaceChildren(svg);$('image-dialog').showModal();
});
$('close-dialog').addEventListener('click',()=>$('image-dialog').close());
$('image-dialog').addEventListener('close',()=>$('enlarge').focus({preventScroll:true}));
$('image-dialog').addEventListener('click',e=>{if(e.target===$('image-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
window.addEventListener('hashchange',()=>{if(data)render();});
async function start(){
  try{
    const response=await fetch('guide-data.json');if(!response.ok)throw Error('Guide unavailable');data=await response.json();
    for(const [i,lesson] of data.lessons.entries()){
      if(i===data.basicCount){const p=document.createElement('p');p.className='divider';p.textContent='儀式のシンボル解放後';$('chapters').append(p);}
      const a=document.createElement('a');a.href=hash(i);a.dataset.chapter=i;
      const number=document.createElement('span');number.className='chapter-id';number.textContent=i<data.basicCount?String(i+1).padStart(2,'0'):'別枠';
      const title=document.createElement('span');title.textContent=lesson.nav;a.append(number,title);$('chapters').append(a);
    }
    render();
  }catch(error){$('loading').textContent='ガイドを読み込めませんでした。ページを再読み込みしてください。';console.error(error);}
}
start();
