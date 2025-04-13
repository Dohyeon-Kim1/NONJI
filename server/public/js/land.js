// document.addEventListener("DOMContentLoaded", () => {
//     // 네비게이션 버튼 클릭 시 콘텐츠 영역 전환
//     const navMap = {
//       "nav-home": "content-home",
//       "nav-shorts": "content-shorts",
//       "nav-link": "content-link"
//     };
  
//     document.querySelectorAll(".nav-btn").forEach(btn => {
//       btn.addEventListener("click", () => {
//         // 모든 콘텐츠 페이지 숨김
//         document.querySelectorAll(".content-page").forEach(page => {
//           page.style.display = "none";
//         });
//         // 해당 버튼에 대응하는 콘텐츠 보이기
//         const targetId = navMap[btn.id];
//         if (targetId) {
//           document.getElementById(targetId).style.display = "block";
//         }
//       });
//     });
  
//     // 검색 기능 처리 (버튼 클릭 및 엔터키)
//     const searchBar = document.querySelector(".search-bar");
//     const searchBtn = document.querySelector(".search-btn");
  
//     searchBtn.addEventListener("click", () => {
//       const query = searchBar.value.trim();
//       if (query !== "") {
//         console.log("Search query:", query);
//         // 예시: 서버에 쿼리 전송 (실제 API 구현에 맞춰 수정)
//         fetch(`/api/search?q=${encodeURIComponent(query)}`)
//           .then(response => response.json())
//           .then(data => console.log("Search result:", data))
//           .catch(err => console.error(err));
//       }
//     });
  
//     searchBar.addEventListener("keypress", (e) => {
//       if (e.key === "Enter") searchBtn.click();
//     });
  
//     // 로그아웃 처리
//     const logoutBtn = document.querySelector(".logout-btn");
//     logoutBtn.addEventListener("click", () => {
//       localStorage.removeItem("user");
//       window.location.href = "/login.html";
//     });
  
//     // 프로필 및 사용자 정보 업데이트 (localStorage의 "user" 데이터 활용)
//     const userDataStr = localStorage.getItem("user");
//     if (userDataStr) {
//       const userData = JSON.parse(userDataStr);
//       document.querySelector(".user-name").textContent = userData.userName;
//       document.querySelector(".user-intro").textContent = userData.userIntro;
//       document.querySelector(".user-email").textContent = `Email: ${userData.userEmail}`;
  
//       const hashtagsContainer = document.querySelector(".hashtags");
//       hashtagsContainer.innerHTML = "";
//       if (userData.hashTags && Array.isArray(userData.hashTags)) {
//         userData.hashTags.forEach(tag => {
//           const span = document.createElement("span");
//           span.className = "hashtag";
//           span.textContent = `#${tag}`;
//           hashtagsContainer.appendChild(span);
//         });
//       }
//     }
//   });
  