import { createLogin } from "./js/login/login.js";

createLogin();

// =======================
// 1. 탭 전환 및 콘텐츠 토글 코드
// =======================

// 탭 버튼 요소 선택 (HTML의 id와 일치)
const btnHome   = document.getElementById('rightTopHome');
const btnAI     = document.getElementById('rightTopAI');
const btnLink   = document.getElementById('rightTopLink');

// 탭 콘텐츠 영역 요소 선택 (HTML의 id와 일치)
// HomeContents는 홈 내에서 콘텐츠 영역, AI_Shorts, AI_link는 각각의 탭 콘텐츠 입니다.
const contentHome = document.getElementById('HomeContents');
const contentAI   = document.getElementById('AI_Shorts');
const contentLink = document.getElementById('AI_link');

// 모든 탭 버튼과 콘텐츠 영역을 초기화하는 함수
function resetTabs() {
  // 모든 탭 버튼의 active 클래스 제거
  btnHome.classList.remove('topBarActive');
  btnAI.classList.remove('topBarActive');
  btnLink.classList.remove('topBarActive');
  
  // 모든 콘텐츠 영역에 .hide 클래스를 추가하여 숨김
  contentHome.classList.add('hide');
  contentAI.classList.add('hide');
  contentLink.classList.add('hide');
}

// 'Home' 탭 클릭 시: 관련 탭 활성화 및 홈 콘텐츠 표시
btnHome.addEventListener('click', () => {
  resetTabs();
  btnHome.classList.add('topBarActive');
  contentHome.classList.remove('hide');
});

// 'AI Shorts' 탭 클릭 시: 관련 탭 활성화 및 AI Shorts 콘텐츠 표시
btnAI.addEventListener('click', () => {
  resetTabs();
  btnAI.classList.add('topBarActive');
  contentAI.classList.remove('hide');
});

// 'AI Link' 탭 클릭 시: 관련 탭 활성화 및 AI Link 콘텐츠 표시
btnLink.addEventListener('click', () => {
  resetTabs();
  btnLink.classList.add('topBarActive');
  contentLink.classList.remove('hide');
});

// =======================
// 2. iframe 클릭 시 새 탭에서 링크 열기
// =======================

// 페이지 내의 모든 iframe 요소 선택
const iframes = document.querySelectorAll('iframe');

// 각 iframe에 대해 클릭 이벤트 리스너 등록
iframes.forEach(iframe => {
  // iframe에 마우스가 올라갈 때 클릭 가능하다는 커서 표시
  iframe.style.cursor = 'pointer';
  
  // 클릭 이벤트 추가  
  iframe.addEventListener('click', (event) => {
    // 이벤트 전파를 막아 필요없는 부모 이벤트 발생을 차단 (옵션)
    event.stopPropagation();
    
    // iframe의 src 속성 값 가져오기
    const iframeSrc = iframe.getAttribute('src');
    if (iframeSrc) {
      // 새 탭에서 링크 열기
      window.open(iframeSrc, '_blank');
    }
  });
});


const profileBtn = document.getElementById('profile');
const myProfileSvg = document.getElementById('myProfile');

profileBtn.addEventListener('click', () => {
    if (myProfileSvg.classList.contains('hide')) {
        myProfileSvg.classList.remove('hide');
    } else {
        myProfileSvg.classList.add('hide');
    }
});


const colabBtn = document.getElementById('colab');
const mycolabSvg = document.getElementById('myColab');

colabBtn.addEventListener('click', () => {
    if (mycolabSvg.classList.contains('hide')) {
        mycolabSvg.classList.remove('hide');
    } else {
        mycolabSvg.classList.add('hide');
    }
});

const Make_Post = document.getElementById('Make_Post');
const postPop = document.getElementById('postPop');

Make_Post.addEventListener('click', () => {
    if (postPop.classList.contains('hide')) {
        postPop.classList.remove('hide');
    } else {
        postPop.classList.add('hide');
    }
});

postPop.addEventListener('click', ()=>{
    postPop.classList.add('hide');
})

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-bar');
  
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        alert('검색어를 입력하세요.');
        return;
      }
  
      const url = `https://glow-mambo-helps-pearl.trycloudflare.com/api/recommend?q=${encodeURIComponent(query)}`;
  
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('서버 오류');
          return response.json();
        })
        .then(data => {
          console.log('응답 결과:', data);
          displayResults(data);
        })
        .catch(err => {
          console.error('에러 발생:', err);
        });
    });
  
    function displayResults(data) {
      const container = document.getElementById('resultsContainer');
      container.innerHTML = ""; // 기존 결과 초기화
  
      // 간단한 그리드 레이아웃 스타일 설정 (추후 CSS로 조정 가능)
      container.style.display = "grid";
  
      // data.results 배열 순회
      data.results.forEach(result => {
        const tile = document.createElement('div');
        tile.classList.add('resultTile');
        // // 타일 스타일 (원하는 대로 수정 가능)
        // tile.style.border = "1px solid #ccc";
        // tile.style.padding = "1rem";
        // tile.style.borderRadius = "5px";
        // tile.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        // tile.style.backgroundColor = "#fff";
        // tile.style.cursor = "pointer"; // 클릭 가능하다는 커서
  
        // 타일 클릭 이벤트: 결과의 url로 리디렉션
        tile.addEventListener('click', () => {
          if (result.url) {
            window.location.href = result.url;
          } else {
            alert("이 결과의 상세 페이지 URL이 없습니다.");
          }
        });
  
        // title (존재하면)
        if (result.title) {
          const titleElem = document.createElement('h2');
          titleElem.innerText = result.title;
          tile.appendChild(titleElem);
        }
  
        // Area
        if (result.Area) {
          const areaElem = document.createElement('p');
          areaElem.innerHTML = `<strong>Area:</strong> ${result.Area}`;
          tile.appendChild(areaElem);
        }
  
        // Abstract
        if (result.abstract) {
          const abstractElem = document.createElement('p');
          abstractElem.innerHTML = `<strong>Abstract:</strong> ${result.abstract}`;
          tile.appendChild(abstractElem);
        }
  
        // Authors
        if (result.author && Array.isArray(result.author)) {
          const authorElem = document.createElement('p');
          authorElem.innerHTML = `<strong>Authors:</strong> ${result.author.join(', ')}`;
          tile.appendChild(authorElem);
        }
  
        // Citation (단순 개수 표시)
        if (result.citation && Array.isArray(result.citation)) {
          const citationElem = document.createElement('p');
          citationElem.innerHTML = `<strong>Citations:</strong> ${result.citation.length}`;
          tile.appendChild(citationElem);
        }
  
        // Conference
        if (result.conference) {
          const confElem = document.createElement('p');
          confElem.innerHTML = `<strong>Conference:</strong> ${result.conference}`;
          tile.appendChild(confElem);
        }
  
        container.appendChild(tile);
      });
    }
  });
  
  
  const shortsSVG = document.getElementById('shortsSVG');
  shortsSVG.addEventListener('click', () => {
    // 1. 모달(overlay) div 생성 및 스타일 적용
    const modalDiv = document.createElement('div');
    modalDiv.style.position = 'fixed';
    modalDiv.style.top = 0;
    modalDiv.style.left = 0;
    modalDiv.style.width = '100%';
    modalDiv.style.height = '100%';
    modalDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // 배경 어둡게 처리
    modalDiv.style.display = 'flex';
    modalDiv.style.alignItems = 'center';
    modalDiv.style.justifyContent = 'center';
    modalDiv.style.zIndex = '10000';
  
    // 2. video 요소 생성 및 설정
    const videoElem = document.createElement('video');
    videoElem.src = './1706_03762.mp4'; // 영상 파일 경로
    videoElem.controls = true;   // 재생 컨트롤 표시
    videoElem.autoplay = true;   // 자동 재생
    videoElem.style.maxWidth = '80%';
    videoElem.style.maxHeight = '80%';
  
    // 3. video 요소를 모달 div에 추가 후, 모달을 body에 추가
    modalDiv.appendChild(videoElem);
    document.body.appendChild(modalDiv);
  
    // 4. 모달의 배경 부분 클릭 시 모달 닫기 처리 (video 영역 클릭 시 닫히지 않도록 함)
    modalDiv.addEventListener('click', (event) => {
      if (event.target === modalDiv) {
        modalDiv.remove();
      }
    });
  });
  
