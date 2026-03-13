// 隨機回憶功能
document.addEventListener('DOMContentLoaded', function() {
    const randomButton = document.getElementById('random-memory');
    
    if (randomButton) {
        randomButton.addEventListener('click', function() {
            // 模擬隨機回憶（後續會連接真實數據）
            const memories = [
                {
                    title: '春節家庭聚會',
                    description: '三代同堂，紅包交換，溫暖笑容',
                    theme: '春節傳統'
                },
                {
                    title: '兄弟保齡球時光',
                    description: '孩子們拿著紫色保齡球，快樂運動',
                    theme: '兒童運動'
                },
                {
                    title: '西市場逛街',
                    description: '熱鬧市集，家庭出遊，美食探索',
                    theme: '逛街購物'
                }
            ];
            
            const random = memories[Math.floor(Math.random() * memories.length)];
            
            alert(`🎲 隨機回憶\n\n📸 ${random.title}\n\n${random.description}\n\n🏷️ 主題：${random.theme}`);
        });
    }
    
    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 導航欄滾動效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 載入動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 觀察所有卡片元素
    document.querySelectorAll('.theme-card, .member-card, .comparison-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    console.log('🏠 家庭小確幸網站已載入');
    console.log('📸 照片數量：53 張');
    console.log('🎨 AI 藝術：準備中...');
    console.log('❤️ 用愛打造的家庭故事網站');
});

// 後續功能：連接真實照片數據
function loadRandomMemory() {
    // TODO: 從 stories.json 讀取真實數據
    fetch('stories/stories.json')
        .then(response => response.json())
        .then(data => {
            const stories = data.stories;
            const random = stories[Math.floor(Math.random() * stories.length)];
            showMemoryModal(random);
        })
        .catch(error => {
            console.error('載入故事失敗:', error);
        });
}

function showMemoryModal(memory) {
    // TODO: 實現彈窗顯示
    console.log('顯示回憶:', memory);
}
