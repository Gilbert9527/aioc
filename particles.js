// 粒子效果
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // 创建粒子
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    // 添加鼠标移动效果
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particlesContainer.getBoundingClientRect();
            const x = mouseX - rect.left;
            const y = mouseY - rect.top;
            
            if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                const particleX = parseInt(particle.style.left);
                const particleY = parseInt(particle.style.top);
                
                const dx = x - particleX;
                const dy = y - particleY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const tx = particleX - Math.cos(angle) * 20;
                    const ty = particleY - Math.sin(angle) * 20;
                    
                    particle.style.transform = `translate(${tx - particleX}px, ${ty - particleY}px)`;
                } else {
                    particle.style.transform = 'translate(0, 0)';
                }
            }
        });
    });
});

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // 随机大小
    const size = Math.random() * 5 + 1;
    
    // 随机透明度
    const opacity = Math.random() * 0.5 + 0.1;
    
    // 随机动画延迟
    const delay = Math.random() * 5;
    
    // 设置样式
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    return particle;
}