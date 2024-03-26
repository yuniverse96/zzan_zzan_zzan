// 해당 페이지의 HTML이 로드되면 실행
document.addEventListener("DOMContentLoaded", function() {
    // 이미지가 로딩 중인지 아닌지를 확인하는 플래그
    var isLoading = false;
 
    // 이미지를 로드하는 함수
    var loadImage = function(imageElement) {
        // 이미지가 이미 로드되었는지 확인
        if (!imageElement.classList.contains("loaded")) {
            // 데이터 속성에 저장된 실제 이미지 URL을 img 요소의 src 속성에 설정
            imageElement.src = imageElement.dataset.src;
 
            // 이미지 URL이 로드되었으므로 더 이상 필요하지 않은 data-src 속성을 삭제
            imageElement.removeAttribute("data-src");
 
            // 이미지가 srcset 속성을 가지고 있다면
            if (imageElement.dataset.srcset) {
                // 데이터 속성에 저장된 실제 이미지 URL을 img 요소의 srcset 속성에 설정
                imageElement.srcset = imageElement.dataset.srcset;
 
                // 이미지 URL이 로드되었으므로 더 이상 필요하지 않은 data-srcset 속성을 삭제
                imageElement.removeAttribute("data-srcset");
            }
 
            // 이미지가 로드되었다는 것을 표시하기 위해 loaded 클래스 추가
            imageElement.classList.add("loaded");
        }
    };
 
    // 이미지를 로드하기 전에 준비하는 함수
    var prepareImage = function(imageElement) {
        // img 요소의 src 속성을 data-src 속성으로 복사
        imageElement.dataset.src = imageElement.src;
 
        // img 요소가 srcset 속성을 가지고 있다면
        if (imageElement.srcset) {
            // img 요소의 srcset 속성을 data-srcset 속성으로 복사
            imageElement.dataset.srcset = imageElement.srcset;
 
            // 더 이상 필요하지 않은 srcset 속성을 삭제
            imageElement.removeAttribute("srcset");
        }
 
        // 임시 이미지 URL로 img 요소의 src 속성을 설정
        imageElement.src = "https://stat.tiara.tistory.com/track";
    };
 
    // 브라우저가 Intersection Observer API를 지원하는 경우
    if ("IntersectionObserver" in window) {
        // 이미지가 화면에 들어올 때 로드하는 Intersection Observer를 생성
        var observer = new IntersectionObserver(function(entries, observerInstance) {
            entries.forEach(function(entry) {
                // 이미지가 화면에 들어오지 않았다면 무시
                if (!entry.isIntersecting) {
                    return;
                }
 
                var imageElement = entry.target;
 
                // 이미지 로드
                loadImage(imageElement);
 
                // 이미지 로드가 완료되었으므로 해당 이미지의 관찰을 중지
                observerInstance.unobserve(imageElement);
            });
        }, {
            root: null,
            rootMargin: "200px"
        });
 
        // ".imageblock img" 및 ".imagegridblock img" 셀렉터에 해당하는 모든 이미지 요소들에 대해
        document.querySelectorAll(".imageblock img,.imagegridblock img").forEach(function(imageElement) {
            // 이미지 로드 전처리
            prepareImage(imageElement);
 
            // 이미지 관찰 시작
            observer.observe(imageElement);
 
            // 이미지가 관찰 중임을 나타내는 클래스 추가
            imageElement.classList.add("observing");
        });
    } else {
        // Intersection Observer API가 지원되지 않는 경우, 스크롤 이벤트를 사용해 이미지 로드
        var checkVisibilityAndLoad = function() {
            // 현재 스크롤 위치 가져오기
            var scrollPosition = window.scrollY;
 
            // ".imageblock img" 및 ".imagegridblock img" 셀렉터에 해당하는 모든 이미지 요소들에 대해
            document.querySelectorAll(".imageblock img,.imagegridblock img").forEach(function(imageElement) {
                // 이미지가 이미 로드되었다면 무시
                if (imageElement.classList.contains("loaded")) {
                    return;
                }
 
                // 이미지의 부모 요소가 페이지 상단으로부터 얼마나 떨어져 있는지 계산
                var parentTopPosition = imageElement.parentNode.offsetTop;
 
                // 이미지가 현재 보이는 영역에 있는지 확인하고, 만약 그렇다면 이미지 로드
                if (parentTopPosition + imageElement.offsetHeight > scrollPosition && scrollPosition + window.innerHeight > parentTopPosition) {
                    loadImage(imageElement);
                }
            });
        };
 
        // ".imageblock img" 및 ".imagegridblock img" 셀렉터에 해당하는 모든 이미지 요소들에 대해
        document.querySelectorAll(".imageblock img,.imagegridblock img").forEach(function(imageElement) {
            // 이미지 로드 전처리
            prepareImage(imageElement);
 
            // 스크롤 이벤트가 발생할 때 이미지가 보이는지 확인하고 보이는 이미지 로드
            window.addEventListener("scroll", function() {
                if (!isLoading) {
                    window.requestAnimationFrame(function() {
                        checkVisibilityAndLoad();
                        isLoading = false;
                    });
 
                    isLoading = true;
                }
            }, {
                passive: true
            });
        });
    }
});