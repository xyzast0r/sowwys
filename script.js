// ===== Floating Hearts =====
function createFloatingHearts() {
  const container = document.getElementById("heartsContainer");
  const heartCount = 30;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        `;

    // Random positioning and timing
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 8 + "s";
    heart.style.animationDuration = 6 + Math.random() * 4 + "s";

    // Random sizes
    const scale = 0.5 + Math.random() * 1;
    heart.querySelector("svg").style.width = 20 * scale + "px";
    heart.querySelector("svg").style.height = 20 * scale + "px";

    // Random opacity
    heart.style.opacity = 0.3 + Math.random() * 0.4;

    container.appendChild(heart);
  }
}

// ===== Particle Effect =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particleCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 100;

    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(232, 180, 184, ${particle.opacity})`;
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((particle, i) => {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[j].x - particle.x;
        const dy = this.particles[j].y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(232, 180, 184, ${
            0.1 * (1 - distance / 100)
          })`;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Handle staggered animations for reason cards
        if (entry.target.classList.contains("reason-card")) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + "ms";
        }
      }
    });
  }, observerOptions);

  // Observe letter text
  document
    .querySelectorAll(".letter-text")
    .forEach((el) => observer.observe(el));

  // Observe reason cards
  document
    .querySelectorAll(".reason-card")
    .forEach((el) => observer.observe(el));

  // Observe promise items
  document.querySelectorAll(".promise-item").forEach((el, index) => {
    el.style.transitionDelay = index * 200 + "ms";
    observer.observe(el);
  });
}

// ===== Parallax Effect =====
function initParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    // Parallax for intro section
    const intro = document.querySelector(".intro-section");
    if (intro) {
      intro.style.transform = `translateY(${scrolled * 0.3}px)`;
      intro.style.opacity = 1 - scrolled / 800;
    }
  });
}

// ===== Cursor Glow Effect =====
function initCursorGlow() {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(232, 180, 184, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ===== Contact Button Effect =====
function initContactButton() {
  const btn = document.getElementById("contactBtn");

  btn.addEventListener("click", () => {
    // Create explosion of hearts
    createHeartExplosion(btn);

    // Show a sweet message (faster response)
    setTimeout(() => {
      showModal();
    }, 300);
  });
}

function createHeartExplosion(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: #e8b4b8;">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        `;
    heart.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 1000;
            animation: explode 1s ease-out forwards;
        `;

    const angle = (i / 20) * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    heart.style.setProperty("--tx", tx + "px");
    heart.style.setProperty("--ty", ty + "px");

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }

  // Add explosion animation
  if (!document.getElementById("explosionStyle")) {
    const style = document.createElement("style");
    style.id = "explosionStyle";
    style.textContent = `
            @keyframes explode {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

function showModal() {
  const modal = document.createElement("div");
  modal.className = "sweet-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-heart">
                <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </div>
            <h3>Makasihh Sunnyyy Yeyy!</h3>
            <p>Makasihh udah maafin uwaa, uwa selalu mencoba jadi yang terbaik, pengertian, perhatian sama sunny. Kesini yaaa kalau sunny udah redaa, udah ga marah lagi sama uwaa.</p>
            <p class="modal-signature">I'll be waiting for you, always.</p>
            <div class="contact-buttons">
                <a href="https://wa.me/6281264963323" target="_blank" class="contact-link whatsapp-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                </a>
                <a href="https://discord.gg/jHWneunX" target="_blank" class="contact-link discord-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                    </svg>
                    Discord
                </a>
            </div>
            <button class="modal-close">Close</button>
        </div>
    `;

  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.5s ease;
        backdrop-filter: blur(10px);
    `;

  const style = document.createElement("style");
  style.textContent = `
        .modal-content {
            background: linear-gradient(145deg, rgba(45, 31, 61, 0.95), rgba(26, 26, 46, 0.95));
            border: 1px solid rgba(232, 180, 184, 0.3);
            border-radius: 30px;
            padding: 50px;
            text-align: center;
            max-width: 450px;
            transform: scale(0.8);
            transition: transform 0.5s ease;
        }
        .sweet-modal.show .modal-content {
            transform: scale(1);
        }
        .modal-heart {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            animation: heartPulse 1.5s ease-in-out infinite;
        }
        .modal-heart svg {
            width: 100%;
            height: 100%;
            fill: #e8b4b8;
            filter: drop-shadow(0 0 20px rgba(232, 180, 184, 0.6));
        }
        .modal-content h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            color: #e8b4b8;
            margin-bottom: 20px;
        }
        .modal-content p {
            color: #b8b8c8;
            line-height: 1.8;
            margin-bottom: 15px;
        }
        .modal-signature {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            color: #e8b4b8 !important;
            font-size: 1.2rem;
        }
        .modal-close {
            margin-top: 30px;
            padding: 15px 40px;
            background: transparent;
            border: 2px solid #e8b4b8;
            color: #e8b4b8;
            font-family: 'Quicksand', sans-serif;
            font-size: 1rem;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .modal-close:hover {
            background: #e8b4b8;
            color: #1a1a2e;
        }
        .contact-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 25px;
            flex-wrap: wrap;
        }
        .contact-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 25px;
            border-radius: 30px;
            text-decoration: none;
            font-family: 'Quicksand', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .contact-link svg {
            width: 20px;
            height: 20px;
        }
        .whatsapp-btn {
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
        }
        .whatsapp-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
        }
        .discord-btn {
            background: linear-gradient(135deg, #7289DA, #5865F2);
            color: white;
            box-shadow: 0 5px 20px rgba(114, 137, 218, 0.3);
        }
        .discord-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(114, 137, 218, 0.5);
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  // Trigger animation
  requestAnimationFrame(() => {
    modal.style.opacity = "1";
    modal.classList.add("show");
  });

  // Close modal
  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.opacity = "0";
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 500);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.opacity = "0";
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 500);
    }
  });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== Typing Effect for Title =====
function initTypingEffect() {
  const subtitle = document.querySelector(".subtitle");
  const text = subtitle.textContent;
  subtitle.textContent = "";
  subtitle.style.opacity = "1";

  let index = 0;
  setTimeout(() => {
    const type = () => {
      if (index < text.length) {
        subtitle.textContent += text[index];
        index++;
        setTimeout(type, 100);
      }
    };
    type();
  }, 2000);
}

// ===== Initialize Everything =====
document.addEventListener("DOMContentLoaded", () => {
  createFloatingHearts();
  new ParticleSystem();
  initScrollAnimations();
  initParallax();
  initCursorGlow();
  initContactButton();
  initSmoothScroll();
  // initTypingEffect(); // Commented out to use CSS animation instead

  // Add loaded class to body for initial animations
  document.body.classList.add("loaded");
  
  // Initialize music toggle
  initMusicToggle();
});

// ===== Music Toggle =====
function initMusicToggle() {
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  
  if (musicToggle && bgMusic) {
    bgMusic.volume = 0.5; // Set volume to 50%
    
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add("playing");
      } else {
        bgMusic.pause();
        musicToggle.classList.remove("playing");
      }
    });
  }
}

// ===== Intro Overlay =====
function initIntroOverlay() {
  const introOverlay = document.getElementById("introOverlay");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  
  if (introOverlay) {
    introOverlay.addEventListener("click", () => {
      // Hide the overlay
      introOverlay.classList.add("hidden");
      
      // Enable scrolling
      document.body.classList.remove("no-scroll");
      
      // Play the music automatically
      if (bgMusic) {
        bgMusic.play();
        if (musicToggle) {
          musicToggle.classList.add("playing");
        }
      }
    });
  }
}

// Initialize intro overlay on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initIntroOverlay();
});

// ===== Handle page visibility =====
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.title = "Please come back... I miss you";
  } else {
    document.title = "I'm Sorry";
  }
});
