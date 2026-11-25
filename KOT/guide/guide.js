// ガイドの準備時、「use strict」。
'use strict';
// $の実行時、$を呼び出す際の引数と処理を定義する。
const $=id=>document.getElementById(id);
// ガイドの準備時、操作データを後続処理で設定するために用意する。chapterに0を保持する。手順に0を保持する。expandedに偽を保持する。
let data,chapter=0,step=0,expanded=false;
// stripの実行時、stripを呼び出す際の引数と処理を定義する。
const strip=text=>text.replace(/\[\/?(?:b|color(?:=#[\da-f]+)?)\]/gi,'');
// escapeの実行時、escapeを呼び出す際の引数と処理を定義する。
const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// richの実行時、richを呼び出す際の引数と処理を定義する。
const rich=text=>escape(text).replace(/\[b\]/g,'<strong>').replace(/\[\/b\]/g,'</strong>').replace(/\[color=#[\da-f]+\]/gi,'').replace(/\[\/color\]/g,'');
// hashの実行時、hashを呼び出す際の引数と処理を定義する。
const hash=(c,s=0)=>'#'+data.lessons[c].id+'/'+(s+1);
// locationのhashをhashの結果（c・ゲーム状態）に更新する。
function navigate(c,s){location.hash=hash(c,s);}
// 呼び出し時にupdatePictureの処理を開始する。
function updatePicture(){
  // updatePictureの実行時、現在に操作データのlessons［chapter］のsteps［手順］を保持する。
  const current=data.lessons[chapter].steps[step];
  // updatePictureの実行時、regionに条件「expanded」に応じて一覧［0・0・...current.size］または現在のfocusを保持する。
  const region=expanded?[0,0,...current.size]:current.focus;
  // updatePictureの実行時、$の結果（「scene」）のsetAttributeを実行する。渡す値は「viewBox」・regionのjoinの結果（「 」）。
  $('scene').setAttribute('viewBox',region.join(' '));
  // updatePictureの実行時、$の結果（「picture」）のsetAttributeを実行する。渡す値は「href」・現在のimage。
  $('picture').setAttribute('href',current.image);
  // updatePictureの実行時、$の結果（「picture」）のsetAttributeを実行する。渡す値は「幅」・現在のサイズ［0］。$の結果（「picture」）のsetAttributeを実行する。渡す値は「高さ」・現在のサイズ［1］。
  $('picture').setAttribute('width',current.size[0]);$('picture').setAttribute('height',current.size[1]);
  // updatePictureの実行時、[x,y,w,h]に現在の対象を保持する。
  const [x,y,w,h]=current.target;
  // updatePictureの実行時、Objectのentriesの結果（項目（x・y・幅・高さ）を持つデータ）の各項目について、$の結果（「highlight」）のsetAttributeを実行する。渡す値は名前・値。
  for(const [name,value]of Object.entries({x:x+1.5,y:y+1.5,width:w-3,height:h-3}))$('highlight').setAttribute(name,value);
  // updatePictureの実行時、$の結果（「scene-title」）のtextContentを現在のcaptionに更新する。
  $('scene-title').textContent=current.caption;
  // updatePictureの実行時、$の結果（「scene-description」）のtextContentを（現在の名前 + 「を黄色の枠で示したゲーム画面。画面全体表示へ切り替えられます。」）に更新する。
  $('scene-description').textContent=current.name+'を黄色の枠で示したゲーム画面。画面全体表示へ切り替えられます。';
  // updatePictureの実行時、$の結果（「view-mode」）のtextContentを条件「expanded」に応じて「注目箇所に戻る」または「画面全体を見る」に更新する。
  $('view-mode').textContent=expanded?'注目箇所に戻る':'画面全体を見る';
  // updatePictureの実行時、$の結果（「view-mode」）のsetAttributeを実行する。渡す値は「aria-pressed」・Stringの結果（expanded）。
  $('view-mode').setAttribute('aria-pressed',String(expanded));
// updatePictureの実行時で使う処理範囲をここで閉じる。
}
// 呼び出し時にrenderの処理を開始する。
function render(){
  // 画面を描画するとき、partsにlocationのhashの1以降のコピーのsplitの結果（「/」）を保持する。
  const parts=location.hash.slice(1).split('/');
  // 画面を描画するとき、foundに操作データのlessonsのfindIndexの結果（引数 l を使う処理）を保持する。chapterを条件「foundが0より小さい」に応じて0またはfoundに更新する。
  const found=data.lessons.findIndex(l=>l.id===parts[0]);chapter=found<0?0:found;
  // 画面を描画するとき、手順を（Numberの結果（parts［1］）、または1 - 1）と0の最大値と（操作データのlessons［chapter］のstepsの要素数 - 1）の最小値に更新する。手順を手順を切り捨てた整数に更新する。
  step=Math.min(Math.max((Number(parts[1])||1)-1,0),data.lessons[chapter].steps.length-1);step=Math.floor(step);
  // 画面を描画するとき、lessonに操作データのlessons［chapter］を保持する。expandedを偽に更新する。
  const lesson=data.lessons[chapter];expanded=false;
  // 画面を描画するとき、documentの見出しを（lessonのnav + 「 | 遊び方 | Key Or Trap」）に更新する。
  document.title=lesson.nav+' | 遊び方 | Key Or Trap';
  // 画面を描画するとき、$の結果（「chapters」）のquerySelectorAllの結果（「a」）の各項目について、以下を繰り返す。
  for(const a of $('chapters').querySelectorAll('a')){if(a.dataset.chapter===String(chapter))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
  // 画面を描画するとき、$の結果（「chapter-number」）のtextContentを条件「chapterが操作データのbasicCountより小さい」に応じて（「BASIC GUIDE / 」 + Stringの結果（（chapter + 1））のpadStartの結果（2・「0」））または「ALTAR / REVELATION」に更新する。
  $('chapter-number').textContent=chapter<data.basicCount?'BASIC GUIDE / '+String(chapter+1).padStart(2,'0'):'ALTAR / REVELATION';
  // 画面を描画するとき、$の結果（「chapter-title」）のtextContentをstripの結果（lessonの見出し）に更新する。
  $('chapter-title').textContent=strip(lesson.title);
  // 画面を描画するとき、$の結果（「tarot-note」）の非公開情報をchapterが操作データのbasicCountより小さいに更新する。
  $('tarot-note').hidden=chapter<data.basicCount;
  // 画面を描画するとき、$の結果（「step-count」）のtextContentを（（（「手順 」 + （手順 + 1）） + 「 / 」） + lessonのstepsの要素数）に更新する。
  $('step-count').textContent='手順 '+(step+1)+' / '+lesson.steps.length;
  // 画面を描画するとき、$の結果（「steps」）のreplaceChildrenを実行する。渡す値は...lesson.steps.map((s,i)=>{const a=document.createElement('a');a.href=hash(cha…。
  $('steps').replaceChildren(...lesson.steps.map((s,i)=>{const a=document.createElement('a');a.href=hash(chapter,i);a.textContent=(i+1)+' '+s.name;if(i===step)a.setAttribute('aria-current','step');return a;}));
  // 画面を描画するとき、$の結果（「caption」）のtextContentをlessonのsteps［手順］のcaptionに更新する。
  $('caption').textContent=lesson.steps[step].caption;
  // 画面を描画するとき、updatePictureを実行する。
  updatePicture();
  // 画面を描画するとき、$の結果（「変更前の予約」）の操作不可フラグをchapterが0と等しい、かつ手順が0と等しいに更新する。
  $('previous').disabled=chapter===0&&step===0;
  // 画面を描画するとき、直前にchapterが（操作データのlessonsの要素数 - 1）と等しい、かつ手順が（lessonのstepsの要素数 - 1）と等しいを保持する。
  const last=chapter===data.lessons.length-1&&step===lesson.steps.length-1;
  // 画面を描画するとき、$の結果（「next」）のtextContentを条件「直前」に応じて「最初に戻る」または条件「chapterが5と等しい、かつ手順が（lessonのstepsの要素数 - 1）と等しい」に応じて「祭壇の啓示を見る」または条件「手順が（lessonのstepsの要素数 - 1）と等しい」に応じて「次の章へ」ま…に更新する。
  $('next').textContent=last?'最初に戻る':chapter===5&&step===lesson.steps.length-1?'祭壇の啓示を見る':step===lesson.steps.length-1?'次の章へ':'次へ';
  // 画面を描画するとき、$の結果（「progress」）のtextContentを条件「chapterが操作データのbasicCountより小さい」に応じて（（（（「基本 」 + （chapter + 1）） + 「 / 」） + 操作データのbasicCount） + 「章」）または「別枠・祭壇の啓示」に更新する。
  $('progress').textContent=chapter<data.basicCount?'基本 '+(chapter+1)+' / '+data.basicCount+'章':'別枠・祭壇の啓示';
  // 画面を描画するとき、$の結果（「details」）のopenを偽に更新する。
  $('details').open=false;
  // 画面を描画するとき、$の結果（「rules」）のinnerHTMLを（（（（（（「<p>」 + richの結果（lesson.lead）） + 「</p>」） + lessonのcardsの各項目を変換した一覧のjoinの結果（「」）） + 「<p class="tip">」） + richの結果（lessonのtip）） …に更新する。
  $('rules').innerHTML='<p>'+rich(lesson.lead)+'</p>'+lesson.cards.map(([title,body])=>'<h3>'+escape(title)+'</h3><p>'+rich(body)+'</p>').join('')+'<p class="tip">'+rich(lesson.tip)+'</p>';
  // 画面を描画するとき、$の結果（「complete」）の非公開情報を直前、またはchapterが5と等しい、かつ手順が（lesson.steps.length - 1）と等しいが偽に更新する。
  $('complete').hidden=!(last||(chapter===5&&step===lesson.steps.length-1));
  // 画面を描画するとき、$の結果（「reader」）の非公開情報を偽に更新する。$の結果（「loading」）の非公開情報を真に更新する。
  $('reader').hidden=false;$('loading').hidden=true;
  // 画面を描画するとき、$の結果（「reader」）のclassListのremoveを実行する。渡す値は「enter」。$の結果（「reader」）のclassListに「enter」を追加する。
  $('reader').classList.remove('enter');void $('reader').offsetWidth;$('reader').classList.add('enter');
// 画面を描画するときで使う処理範囲をここで閉じる。
}
// 呼び出し時にadvanceの処理を開始する。
function advance(direction){
  // advanceの実行時、件数に操作データのlessons［chapter］のstepsの要素数を保持する。
  const count=data.lessons[chapter].steps.length;
  // advanceの実行時、条件「進行方向が0より小さい」のとき、条件「手順が0より大きい」のとき、navigateを実行する。渡す値はchapter・（手順 - 1）。
  if(direction<0){if(step>0)navigate(chapter,step-1);else if(chapter>0)navigate(chapter-1,data.lessons[chapter-1].steps.length-1);}
  // advanceの実行時、条件「（手順 + 1）が件数より小さい」のとき、navigateを実行する。渡す値はchapter・（手順 + 1）。
  else if(step+1<count)navigate(chapter,step+1);else if(chapter+1<data.lessons.length)navigate(chapter+1,0);else navigate(0,0);
// advanceの実行時で使う処理範囲をここで閉じる。
}
// ガイドの準備時、$の結果（「変更前の予約」）のaddEventListenerを実行する。渡す値は「click」・引数 を使う処理。$の結果（「next」）のaddEventListenerを実行する。渡す値は「click」・引数 を使う処理。
$('previous').addEventListener('click',()=>advance(-1));$('next').addEventListener('click',()=>advance(1));
// ガイドの準備時、$の結果（「view-mode」）のaddEventListenerを実行する。渡す値は「click」・引数 を使う処理。
$('view-mode').addEventListener('click',()=>{expanded=!expanded;updatePicture();});
// ガイドの準備時、$の結果（「enlarge」）のaddEventListenerを実行する。渡す値は「click」・引数 を使う処理。
$('enlarge').addEventListener('click',()=>{
  // ガイドの準備時、svgに$の結果（「scene」）のcloneNodeの結果（真）を保持する。svgのremoveAttributeを実行する。渡す値は「識別子」。svgのquerySelectorAllの結果（「[id]」）のforEachを実行する。渡す値は引数 e を使う処理。
  const svg=$('scene').cloneNode(true);svg.removeAttribute('id');svg.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  // ガイドの準備時、svgのremoveAttributeを実行する。渡す値は「aria-labelledby」。svgのsetAttributeを実行する。渡す値は「aria-label」・操作データのlessons［chapter］のsteps［手順］のcaption。
  svg.removeAttribute('aria-labelledby');svg.setAttribute('aria-label',data.lessons[chapter].steps[step].caption);
  // ガイドの準備時、$の結果（「dialog-title」）のtextContentを操作データのlessons［chapter］のsteps［手順］のcaptionに更新する。$の結果（「zoom-host」）のreplaceChildrenを実行する。渡す値はsvg。$の結果（「image-dialog」）のshowModalを実行する。
  $('dialog-title').textContent=data.lessons[chapter].steps[step].caption;$('zoom-host').replaceChildren(svg);$('image-dialog').showModal();
// ガイドで使う引数または呼び出しをここで閉じる。
});
// ガイドの準備時、$の結果（「close-dialog」）のaddEventListenerを実行する。渡す値は「click」・引数 を使う処理。
$('close-dialog').addEventListener('click',()=>$('image-dialog').close());
// ガイドの準備時、$の結果（「image-dialog」）のaddEventListenerを実行する。渡す値は「close」・引数 を使う処理。
$('image-dialog').addEventListener('close',()=>$('enlarge').focus({preventScroll:true}));
// ガイドの準備時、$の結果（「image-dialog」）のaddEventListenerを実行する。渡す値は「click」・引数 e を使う処理。
$('image-dialog').addEventListener('click',e=>{if(e.target===$('image-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
// ガイドの準備時、ウィンドウのaddEventListenerを実行する。渡す値は「hashchange」・引数 を使う処理。
window.addEventListener('hashchange',()=>{if(data)render();});
// 呼び出し時にstartの処理を開始する。
async function start(){
  // startの実行時、失敗時に対応できるよう、対象の操作をこの範囲で試す。
  try{
    // startの実行時、応答にfetchの結果（「guide-data.json」）の完了結果を保持する。条件「応答のokが偽」のとき、異常として「Guide unavailable」を通知して中断する。操作データを応答から読み取ったJSONの完了結果に更新する。
    const response=await fetch('guide-data.json');if(!response.ok)throw Error('Guide unavailable');data=await response.json();
    // startの実行時、操作データのlessonsのentriesの結果の各項目について、以下を繰り返す。
    for(const [i,lesson] of data.lessons.entries()){
      // startの実行時、条件「添字が操作データのbasicCountと等しい」のとき、以下の処理に進む。
      if(i===data.basicCount){const p=document.createElement('p');p.className='divider';p.textContent='儀式のシンボル解放後';$('chapters').append(p);}
      // startの実行時、aにdocumentのcreateElementの結果（「a」）を保持する。aのhrefをhashの結果（添字）に更新する。aのdatasetのchapterを添字に更新する。
      const a=document.createElement('a');a.href=hash(i);a.dataset.chapter=i;
      // startの実行時、numberにdocumentのcreateElementの結果（「span」）を保持する。numberのclassNameを「chapter-id」に更新する。numberのtextContentを条件「添字が操作データのbasicCountより小さい」に応じてStringの結果（（添字 + 1））のpadStartの結果（2・「0」）または「別枠」に更新する。
      const number=document.createElement('span');number.className='chapter-id';number.textContent=i<data.basicCount?String(i+1).padStart(2,'0'):'別枠';
      // startの実行時、見出しにdocumentのcreateElementの結果（「span」）を保持する。見出しのtextContentをlessonのnavに更新する。aにnumber・見出しを追加する。$の結果（「chapters」）にaを追加する。
      const title=document.createElement('span');title.textContent=lesson.nav;a.append(number,title);$('chapters').append(a);
    // startの実行時で使う処理範囲をここで閉じる。
    }
    // startの実行時、renderを実行する。
    render();
  // startの実行時、$の結果（「loading」）のtextContentを「ガイドを読み込めませんでした。ページを再読み込みしてください。」に更新する。consoleのerrorを実行する。渡す値はエラー。
  }catch(error){$('loading').textContent='ガイドを読み込めませんでした。ページを再読み込みしてください。';console.error(error);}
// startの実行時で使う処理範囲をここで閉じる。
}
// ガイドの準備時、startを実行する。
start();
