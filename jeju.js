let currentPage = 0;
const totalPages = 5; // 표지(앞/뒤) + 2페이지(앞/뒤) + 마지막페이지 = 5페이지
let isAnimating = false; // 애니메이션 중복 방지

// DOM 요소들
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');

// 페이지 인디케이터 업데이트
function updatePageIndicator() {
    pageIndicator.textContent = `페이지 ${currentPage + 1} / ${totalPages}`;
}

// 버튼 상태 업데이트
function updateButtons() {
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

// 다음 페이지로
function nextPage() {
    if (currentPage < totalPages - 1 && !isAnimating) {
        isAnimating = true;
        
        if (currentPage % 2 === 0) {
            // 앞면에서 뒷면으로 (페이지 뒤집기)
            const pageElement = document.getElementById(`page-${Math.floor(currentPage / 2)}`);
            pageElement.classList.add('flipped');
        }
        
        currentPage++;
        updatePageIndicator();
        updateButtons();
        
        // 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
            isAnimating = false;
        }, 1200);
    }
}

// 이전 페이지로
function prevPage() {
    if (currentPage > 0 && !isAnimating) {
        isAnimating = true;
        
        currentPage--;
        
        if (currentPage % 2 === 0) {
            // 뒷면에서 앞면으로 (페이지 뒤집기 해제)
            const pageElement = document.getElementById(`page-${Math.floor(currentPage / 2)}`);
            pageElement.classList.remove('flipped');
        }
        
        updatePageIndicator();
        updateButtons();
        
        // 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
            isAnimating = false;
        }, 1200);
    }
}

// 버튼 이벤트 리스너
prevBtn.addEventListener('click', prevPage);
nextBtn.addEventListener('click', nextPage);

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
    }
});

// 스크롤 이벤트 (개선된 버전)
let scrollTimer = null;
let lastScrollTime = 0;

function handleScroll(e) {
    e.preventDefault();
    
    const currentTime = Date.now();
    
    // 스크롤 이벤트 쓰로틀링 (500ms)
    if (currentTime - lastScrollTime < 500) {
        return;
    }
    
    // 기존 타이머 클리어
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    // 새 타이머 설정
    scrollTimer = setTimeout(() => {
        const delta = e.deltaY || e.detail || e.wheelDelta;
        
        if (delta > 0) {
            // 아래로 스크롤 = 다음 페이지
            nextPage();
        } else if (delta < 0) {
            // 위로 스크롤 = 이전 페이지
            prevPage();
        }
        
        lastScrollTime = currentTime;
    }, 50);
}

// 스크롤 이벤트 등록 (여러 브라우저 지원)
document.addEventListener('wheel', handleScroll, { passive: false });
document.addEventListener('DOMMouseScroll', handleScroll, { passive: false }); // Firefox

// 터치 이벤트 (모바일)
let startY = 0;
let startX = 0;

document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const endY = e.changedTouches[0].clientY;
    const endX = e.changedTouches[0].clientX;
    const diffY = startY - endY;
    const diffX = Math.abs(startX - endX);
    
    // 세로 스와이프가 가로 스와이프보다 클 때만 페이지 넘김
    if (Math.abs(diffY) > 50 && Math.abs(diffY) > diffX) {
        if (diffY > 0) {
            // 위로 스와이프 = 다음 페이지
            nextPage();
        } else {
            // 아래로 스와이프 = 이전 페이지
            prevPage();
        }
    }
}, { passive: true });

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', function() {
    updatePageIndicator();
    updateButtons();
    
    // 스크롤 힌트 3초 후 자동 숨김
    setTimeout(() => {
        const scrollHint = document.querySelector('.scroll-hint');
        if (scrollHint) {
            scrollHint.style.opacity = '0';
            scrollHint.style.transition = 'opacity 1s ease-out';
        }
    }, 3000);
});

// 창 크기 변경 시 레이아웃 조정
window.addEventListener('resize', function() {
    // 리사이즈 시 필요한 로직이 있다면 여기에 추가
    console.log('Window resized');
});