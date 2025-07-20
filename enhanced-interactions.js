/**
 * 增强交互效果脚本
 * 为贝壳OC智能应用中心提供更炫酷的交互体验
 */

document.addEventListener('DOMContentLoaded', function() {
    // 鼠标跟踪效果已移除
    
    // 粒子效果
    const particlesConfig = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    };
    
    // 如果particles.js已加载，则初始化粒子效果
    if (window.particlesJS) {
        particlesJS('particles-js', particlesConfig);
    }
    
    // 3D视差效果
    const heroSection = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero-btn');
    const floatingElements = document.querySelectorAll('.element');
    
    if (heroSection) {
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // 标题视差效果
            if (heroTitle) {
                heroTitle.style.transform = `translateX(${x * 20 - 10}px) translateY(${y * 20 - 10}px)`;
            }
            
            // 副标题视差效果
            if (heroSubtitle) {
                heroSubtitle.style.transform = `translateX(${x * 10 - 5}px) translateY(${y * 10 - 5}px)`;
            }
            
            // 按钮视差效果
            if (heroBtn) {
                heroBtn.style.transform = `translateX(${x * 5 - 2.5}px) translateY(${y * 5 - 2.5}px)`;
            }
            
            // 浮动元素视差效果
            floatingElements.forEach((el, index) => {
                const factor = (index + 1) * 5;
                el.style.transform = `translateX(${x * factor - factor/2}px) translateY(${y * factor - factor/2}px) rotate(${x * 10 - 5}deg)`;
            });
        });
    }
    
    // 工具卡片高级动画
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // 初始化卡片
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // 创建卡片内部元素的3D效果
        const content = card.querySelector('.tool-content');
        const header = card.querySelector('.tool-header');
        const footer = card.querySelector('.tool-footer');
        
        if (content) content.style.transform = 'translateZ(0)';
        if (header) header.style.transform = 'translateZ(0)';
        if (footer) footer.style.transform = 'translateZ(0)';
        
        // 添加鼠标移动时的3D效果
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
            
            if (content) content.style.transform = `translateZ(20px)`;
            if (header) header.style.transform = `translateZ(30px)`;
            if (footer) footer.style.transform = `translateZ(25px)`;
            
            // 添加光影效果
            const glare = this.querySelector('.card-glare') || document.createElement('div');
            if (!glare.classList.contains('card-glare')) {
                glare.classList.add('card-glare');
                this.appendChild(glare);
            }
            
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
            glare.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            
            if (content) content.style.transform = 'translateZ(0)';
            if (header) header.style.transform = 'translateZ(0)';
            if (footer) footer.style.transform = 'translateZ(0)';
            
            const glare = this.querySelector('.card-glare');
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
    
    // 滚动动画增强
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-title-wrapper, .tool-card');
        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top <= windowHeight * 0.85) {
                setTimeout(() => {
                    el.classList.add('visible');
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100); // 添加交错动画效果
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // 初始化滚动动画
    setTimeout(animateOnScroll, 500);
    
    // 添加页面进入动画
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 600);
});

// 页面加载完成后的动画
window.addEventListener('load', function() {
    // 页面加载动画
    document.body.classList.add('loaded');
    
    // 隐藏加载动画
    setTimeout(function() {
        const pageLoader = document.querySelector('.page-loader');
        if (pageLoader) {
            pageLoader.classList.add('hidden');
        }
    }, 500);
    
    // 添加工具卡片的交错动画
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + index * 200);
    });
});

// 创建动态背景波浪效果
function createWaveEffect() {
    const footer = document.querySelector('.footer');
    
    if (footer) {
        const wave = document.createElement('div');
        wave.className = 'footer-wave';
        
        const waveInner = document.createElement('div');
        waveInner.className = 'wave-inner';
        
        wave.appendChild(waveInner);
        footer.prepend(wave);
    }
}

// 初始化波浪效果
createWaveEffect();