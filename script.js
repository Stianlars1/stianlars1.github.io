// GitHub API configuration
const GITHUB_USERNAME = 'stianlars1';
const GITHUB_API_BASE = 'https://api.github.com';

// DOM elements
const elements = {
    publicRepos: document.getElementById('public-repos'),
    followers: document.getElementById('followers'),
    following: document.getElementById('following'),
    userBio: document.getElementById('user-bio'),
    aboutText: document.getElementById('about-text'),
    reposContainer: document.getElementById('repos-container'),
    profileImg: document.getElementById('profile-img')
};

// Loading state
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

// Fetch user data from GitHub API
async function fetchUserData() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        const userData = await response.json();
        
        // Update stats
        elements.publicRepos.textContent = userData.public_repos || 0;
        elements.followers.textContent = userData.followers || 0;
        elements.following.textContent = userData.following || 0;
        
        // Update bio if available
        if (userData.bio) {
            elements.userBio.textContent = userData.bio;
            elements.aboutText.textContent = userData.bio;
        }
        
        // Update profile image
        if (userData.avatar_url) {
            elements.profileImg.src = userData.avatar_url;
        }
        
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback values
        elements.publicRepos.textContent = '0';
        elements.followers.textContent = '0';
        elements.following.textContent = '0';
    }
}

// Fetch repositories
async function fetchRepositories() {
    try {
        showLoading(elements.reposContainer);
        
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        elements.reposContainer.innerHTML = '';
        
        if (repos.length === 0) {
            elements.reposContainer.innerHTML = '<p>No public repositories found.</p>';
            return;
        }
        
        repos.forEach(repo => {
            const repoCard = createRepositoryCard(repo);
            elements.reposContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        elements.reposContainer.innerHTML = '<p>Error loading repositories.</p>';
    }
}

// Create repository card
function createRepositoryCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const description = repo.description || 'No description available.';
    const language = repo.language || 'Unknown';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    
    card.innerHTML = `
        <h3 class="project-title">
            <a href="${repo.html_url}" target="_blank" class="project-link">${repo.name}</a>
        </h3>
        <p class="project-description">${description}</p>
        <div class="project-language">${language}</div>
        <div class="project-stats">
            <span><i class="fas fa-star"></i> ${stars}</span>
            <span><i class="fas fa-code-branch"></i> ${forks}</span>
            <span><i class="fas fa-eye"></i> ${repo.watchers_count || 0}</span>
        </div>
    `;
    
    return card;
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
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
}

// Add intersection observer for animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Add typing effect for the title
function addTypingEffect() {
    const titleElement = elements.userBio;
    const originalText = titleElement.textContent;
    const typingSpeed = 100;
    
    titleElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            titleElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Add particle effect to background
function addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.1
        };
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }
    
    animateParticles();
    
    window.addEventListener('resize', resizeCanvas);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading for stats
    showLoading(elements.publicRepos);
    showLoading(elements.followers);
    showLoading(elements.following);
    
    // Fetch data
    await fetchUserData();
    await fetchRepositories();
    
    // Add effects and animations
    addSmoothScrolling();
    addScrollAnimations();
    addTypingEffect();
    addParticleEffect();
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Add interactive effects
function addInteractiveEffects() {
    // Add hover effect to skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    document.querySelectorAll('.social-link, .contact-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
