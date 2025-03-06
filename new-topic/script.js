document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签按钮的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 隐藏所有标签内容
            tabContents.forEach(content => content.classList.add('hidden'));
            // 显示对应的标签内容
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });
    
    // 历史评论总结部分的动画效果
    const summaryPoints = document.querySelectorAll('.summary-point');
    
    // 使用Intersection Observer API检测元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当元素进入视口时，添加动画类
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // 元素已经显示，不再需要观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 当元素10%进入视口时触发
    });
    
    // 观察所有总结点
    summaryPoints.forEach(point => {
        observer.observe(point);
    });
    
    // 添加点击效果到总结点
    summaryPoints.forEach(point => {
        point.addEventListener('click', function() {
            // 添加一个短暂的高亮效果
            this.classList.add('highlight-point');
            setTimeout(() => {
                this.classList.remove('highlight-point');
            }, 300);
        });
    });
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .highlight-point {
            background-color: rgba(77, 171, 247, 0.1);
            transition: background-color 0.3s ease;
        }
        
        /* 添加悬停效果到评论卡片 */
        .comment-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .comment-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
});