// Contact Form Demo Alert
document.getElementById('contactForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        subject:this.querySelector('[name="subject"]').value,
        message: this.querySelector('[name="message"]').value
    };
     alert(`Message sent successfully!\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`);

    // Reset form after submit
    this.reset();

    //⚡ If you connect backend later:
    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => console.log('Server response:', data));

});

// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Smooth Scroll for Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar Transparent on Top, Solid on Scroll
const navbar = document.querySelector('.navbar');
if(navbar) navbar.classList.add('transparent');

window.addEventListener('scroll', () => {
    if(window.scrollY > 50){
        navbar.classList.remove('transparent');
        navbar.classList.add('solid');
    } else {
        navbar.classList.remove('solid');
        navbar.classList.add('transparent');
    }
});

// Optional animated line effect
const line = document.querySelector('.animated-line');
if(line){
    line.innerHTML = line.textContent.split(' ').map(word => `<span>${word} </span>`).join('');
}

// Rotating Text Animation
class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        let i = this.loopNum % this.toRotate.length;
        let fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.querySelector('.wrap').innerHTML = this.txt;

        let delta = 200 - Math.random() * 100;
        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}

// Initialize TxtRotate for chandru
window.addEventListener('load', () => {
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
});


document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flip');
  });
});

function generarRayo() {
  const svg = document.getElementById("svgContainer");
  const ancho = window.innerWidth;
  const altura = window.innerHeight;
  const xInicio = Math.random() * ancho;
  let yActual = 0;
  let zigzag = `M${xInicio},${yActual}`;
  let grosor = Math.random() * 3 + 1;
  let color = Math.random() > 0.5 ? "white" : "yellow";

  for (let i = 0; i < Math.random() * 3 + 5; i++) {
    let xOffset = (Math.random() - 0.5) * 100;
    let yOffset = Math.random() * 100 + 50;
    yActual += yOffset;
    zigzag += ` L${xInicio + xOffset},${yActual}`;

    if (Math.random() > 0.7) {
      let branchX = xInicio + xOffset + (Math.random() - 0.5) * 50;
      let branchY = yActual + Math.random() * 30;
      zigzag += ` M${xInicio + xOffset},${yActual} L${branchX},${branchY}`;
    }
  }

  const linea = document.createElementNS("http://www.w3.org/2000/svg", "path");
  linea.setAttribute("d", zigzag);
  linea.setAttribute("class", "rayo");
  linea.setAttribute("stroke", color);
  linea.setAttribute("stroke-width", grosor);
  svg.appendChild(linea);

  document.body.style.animation = "flash 0.9s";
  setTimeout(() => {
    document.body.style.animation = "";
    linea.remove();
  }, 700);
}

setInterval(generarRayo, Math.random() * 1500 + 500);

const svg = document.getElementById("svgContainer");

function generateLightningPath(x, y, width, height) {
    let points = [`${x},${y}`];
    let segments = 5 + Math.floor(Math.random() * 5);
    for (let i = 1; i <= segments; i++) {
        let px = x + (width / segments) * i;
        let py = y + Math.random() * height - height / 2;
        points.push(`${px},${py}`);
    }
    points.push(`${x + width},${y}`);
    return points.join(" ");
}

function createLightning() {
    svg.innerHTML = '';
    const cards = document.querySelectorAll(".contact-card");

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const width = rect.width * (Math.random() * 0.5 + 0.5);
        const height = rect.height * 0.3;

        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", generateLightningPath(startX, startY, width, height));
        polyline.setAttribute("stroke", "#fff");
        polyline.setAttribute("stroke-width", "2");
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke-linecap", "round");
        polyline.setAttribute("stroke-linejoin", "round");
        polyline.style.opacity = 0;

        svg.appendChild(polyline);

        setTimeout(() => {
            polyline.style.transition = "opacity 0.1s";
            polyline.style.opacity = 1;
            setTimeout(() => polyline.style.opacity = 0, 150);
        }, Math.random() * 2000);
    });
}

setInterval(createLightning, 2000);

// Slide Data
const SLIDES = [
  {
    title: "Facial Recognition Attendance System",
    icon: "🚀",
    desc: `Developed a web-based attendance monitoring system powered by YOLOv8 and OpenCV, capable of detecting and recognizing faces in real time. Designed to solve challenges such as poor lighting, scattered images, and similarity in facial features (e.g., twins).

Tech Stack:

Backend & AI: Python(Restful API), OpenCV, YOLOv8, Google Colab (for model training),Deep Learning

Frontend & Web UI: Flask, HTML, CSS,javascript

Database: MySQL (for storing attendance records)`,
links: {
  left: "https://github.com/chandru-mck-2002", // Profile
  right: "https://github.com/chandru-mck-2002/face-recognition-attendance_using_ML" // Repo
}
  },
  {
    title: "System Monitoring Utility App",
    icon: "🌌",
    desc: `System Monitoring Utility Developed a desktop utility application in Python to monitor system performance and improve overall system health. The app provides real-time monitoring, temporary & cached file cleanup, and automated email notifications to keep users informed about their system status — all through a simple, interactive Tkinter-based interface.
    Tech Stack:

Frontend/UI: Python Tkinter (custom UI with icons)

Backend: Python (psutil, os, shutil, smtplib for alerts)

Database: MySQL (for storing logs and system status history)`,
 links: {
      left: "https://github.com/chandru-mck-2002/Tkinter_system_monitor",
      right: "https://github.com/chandru-mck-2002/Tkinter_system_monitor"
    }

  },
  {
    title: "Student & Employee Management System with JWT Authentication",
    icon: "🛸",
    desc: `A secure RESTful API built with Flask to manage students and employees. JWT (JSON Web Tokens) is used for user authentication and authorization, ensuring only registered users can perform CRUD operations.`,
     links: {
      left: "https://github.com/chandru-mck-2002/Database-Management-For-Student",
      right: "https://github.com/chandru-mck-2002/Database-Management-For-Student"
    }
  },
  {
    title: "Mobile ↔ PC FTP File Transfer App",
    icon: "⭐",
  "desc": "Developed a cross-platform file transfer system that enables users to upload, download, and manage files between a mobile device and a PC over a local network using the FTP protocol. The project demonstrates network programming, client-server architecture, and mobile app integration. Future enhancements include integrating a VPN feature for secure remote access.",
   links: {
      left: "https://github.com/your-username",
      right: "https://github.com/your-username/attendance-system"
    }
  },
  { title: "AI Voice Assistant Bot (In-Progress)", icon: "🔭", desc: "Currently developing an AI-powered voice assistant capable of recognizing and responding to both English and Tamil in the same audio input. The system uses Faster Whisper for speech-to-text and LLaMA 3.2 for response generation. Core functionalities implemented include real-time speech recognition and basic AI response generation.",
     links: {
      left: "https://github.com/your-username",
      right: "https://github.com/your-username/attendance-system"
    }
   },
  { title: "Portfolio Website", icon: "🌠", desc: "Developed a personal portfolio website to showcase my projects, skills, and experience. The website features dynamic content integration using FastAPI and MySQL, and implements CI/CD pipelines for automated deployment and updates.", links: {
      left: "https://github.com/your-username",
      right: "https://github.com/your-username/attendance-system"
    } }
];

// Utility: Easing Functions
const EASING = {
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  cubic: (t) => --t * t * t + 1,
  elastic: (t) =>
    Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * 2 * Math.PI) / 0.3) + 1
};

// StellarNavigator Class
class StellarNavigator {
  constructor(slides, carouselEl, dotNavEl, controls) {
    this.slides = slides;
    this.carouselEl = carouselEl;
    this.dotNavEl = dotNavEl;
    this.controls = controls;
    this.slideCount = slides.length;
    this.activeIdx = 0;
    this.radius = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--carousel-radius"
      )
    );
    this.angleStep = 360 / this.slideCount;
    this.animating = false;
    this.speed = "normal";
    this.autoplay = false;
    this.shuffle = false;
    this.timer = null;
    this.init();
  }
  init() {
    this.renderSlides();
    this.renderDots();
    this.attachEvents();
    this.update();
  }
renderSlides() {
  this.carouselEl.innerHTML = "";
  this.slideEls = [];

  for (let i = 0; i < this.slideCount; i++) {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.setAttribute("tabindex", "0");
    slide.setAttribute("role", "group");
    slide.setAttribute(
      "aria-label",
      `${this.slides[i].title}: ${this.slides[i].desc}`
    );

    slide.innerHTML = `
      <span class="slide-title">${this.slides[i].title}</span>
      <span class="slide-desc">${this.slides[i].desc}</span>
    `;

    // 🔑 Handle double click to open link
    slide.addEventListener("dblclick", (event) => {
      const rect = slide.getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;

      const side = event.clientX < midpoint ? "left" : "right";
      const target = this.slides[i].links?.[side];

      if (target) window.open(target, "_blank");
    });

    this.carouselEl.appendChild(slide);
    this.slideEls.push(slide);
  }
}

  renderDots() {
    this.dotNavEl.innerHTML = "";
    this.dotEls = [];
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute(
        "aria-label",
        `Go to slide ${i + 1}: ${this.slides[i].title}`
      );
      dot.setAttribute("tabindex", "0");
      dot.addEventListener("click", () => this.goTo(i));
      this.dotNavEl.appendChild(dot);
      this.dotEls.push(dot);
    }
  }
  attachEvents() {
    this.controls.prev.addEventListener("click", () => this.prev());
    this.controls.next.addEventListener("click", () => this.next());
    document.addEventListener("keydown", (e) => this.handleKey(e));
    this.carouselEl.addEventListener("wheel", (e) => this.handleWheel(e));
    this.carouselEl.addEventListener(
      "touchstart",
      (e) => this.handleTouchStart(e),
      { passive: true }
    );
    this.carouselEl.addEventListener(
      "touchmove",
      (e) => this.handleTouchMove(e),
      { passive: true }
    );
    this.carouselEl.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    this.carouselEl.addEventListener("mousedown", (e) =>
      this.handleMouseDown(e)
    );
    window.addEventListener("resize", () => this.update());
  }
  update() {
    this.angleStep = 360 / this.slideCount;
    this.radius = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--carousel-radius"
      )
    );
    for (let i = 0; i < this.slideCount; i++) {
      const angle = ((i - this.activeIdx) * this.angleStep * Math.PI) / 180;
      const x = Math.sin(angle) * this.radius;
      const z = Math.cos(angle) * this.radius;
      this.slideEls[i].style.transform = `
            translateX(${x}px)
            translateZ(${z}px)
            rotateY(${(i - this.activeIdx) * this.angleStep}deg)
          `;
      this.slideEls[i].classList.toggle("active", i === this.activeIdx);
      this.slideEls[i].setAttribute("aria-hidden", i !== this.activeIdx);
    }
    for (let i = 0; i < this.dotEls.length; i++) {
      this.dotEls[i].classList.toggle("active", i === this.activeIdx);
    }
  }
  goTo(idx) {
    if (this.animating || idx === this.activeIdx) return;
    this.activeIdx = idx;
    this.update();
    AudioManager.playNav();
  }
  next() {
    this.goTo((this.activeIdx + 1) % this.slideCount);
  }
  prev() {
    this.goTo((this.activeIdx - 1 + this.slideCount) % this.slideCount);
  }
  handleKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowRight":
        this.next();
        break;
      case "ArrowLeft":
        this.prev();
        break;
      case "Home":
        this.goTo(0);
        break;
      case "End":
        this.goTo(this.slideCount - 1);
        break;
      case " ":
        this.toggleAutoplay();
        break;
    }
  }
  handleWheel(e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      if (e.deltaY > 0) this.next();
      else this.prev();
    }
  }
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchMoved = false;
  }
  handleTouchMove(e) {
    this.touchMoved = true;
    this.touchEndX = e.touches[0].clientX;
    this.touchEndY = e.touches[0].clientY;
  }
  handleTouchEnd(e) {
    if (!this.touchMoved) return;
    const dx = this.touchEndX - this.touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) this.prev();
      else this.next();
    }
  }
  handleMouseDown(e) {
    if (e.button !== 0) return;
    this.dragStartX = e.clientX;
    this.dragging = true;
    document.addEventListener(
      "mousemove",
      (this.handleMouseMoveBound = this.handleMouseMove.bind(this))
    );
    document.addEventListener(
      "mouseup",
      (this.handleMouseUpBound = this.handleMouseUp.bind(this))
    );
  }
  handleMouseMove(e) {
    if (!this.dragging) return;
    const dx = e.clientX - this.dragStartX;
    if (Math.abs(dx) > 32) {
      if (dx > 0) this.prev();
      else this.next();
      this.dragging = false;
    }
  }
  handleMouseUp(e) {
    this.dragging = false;
    document.removeEventListener("mousemove", this.handleMouseMoveBound);
    document.removeEventListener("mouseup", this.handleMouseUpBound);
  }
  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    if (this.autoplay) {
      this.timer = setInterval(() => this.next(), this.getSpeed());
    } else {
      clearInterval(this.timer);
    }
  }
  getSpeed() {
    switch (this.speed) {
      case "slow":
        return 3200;
      case "fast":
        return 1200;
      default:
        return 2000;
    }
  }
  setSpeed(speed) {
    this.speed = speed;
    if (this.autoplay) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.next(), this.getSpeed());
    }
  }
  shuffleSlides() {
    this.slides = this.slides.sort(() => Math.random() - 0.5);
    this.renderSlides();
    this.renderDots();
    this.update();
  }
  reset() {
    this.activeIdx = 0;
    this.update();
  }
}

// EffectsManager Class
class EffectsManager {
  static initStarfield(canvas, layers = 3) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let l = 0; l < layers; l++) {
        for (let i = 0; i < 80 + l * 40; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: l + 1,
            r: Math.random() * (1.2 + l * 0.6),
            alpha: 0.5 + Math.random() * 0.5
          });
        }
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = s.z === 1 ? "#fff" : s.z === 2 ? "#ffd700" : "#6c3fd1";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8 * s.z;
        ctx.fill();
        ctx.restore();
      }
    }
    function animate() {
      draw();
      requestAnimationFrame(animate);
    }
    window.addEventListener("resize", resize);
    resize();
    animate();
  }
  static initParticles(canvas, count = 48) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          r: 2 + Math.random() * 3,
          color: `rgba(108,63,209,${0.5 + Math.random() * 0.5})`
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
    }
    function animate() {
      draw();
      requestAnimationFrame(animate);
    }
    window.addEventListener("resize", resize);
    resize();
    animate();
  }
  static initCursor(cursorEl) {
    document.addEventListener("mousemove", (e) => {
      cursorEl.style.transform = `translate(${e.clientX - 16}px,${
        e.clientY - 16
      }px) scale(1)`;
      cursorEl.style.opacity = "0.8";
    });
    document.addEventListener("mousedown", () => {
      cursorEl.style.transform += " scale(0.7)";
      cursorEl.style.opacity = "0.5";
    });
    document.addEventListener("mouseup", () => {
      cursorEl.style.transform = cursorEl.style.transform.replace(
        " scale(0.7)",
        " scale(1)"
      );
      cursorEl.style.opacity = "0.8";
    });
  }
  static parallax(container) {
    container.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 32;
      const y = (e.clientY / window.innerHeight - 0.5) * 32;
      container.style.transform = `translate(${x}px,${y}px)`;
    });
    container.addEventListener("mouseleave", () => {
      container.style.transform = "";
    });
  }
}

// AudioManager Class
class AudioManager {
  static init() {
    this.ambient = document.getElementById("ambient-audio");
    this.nav = document.getElementById("nav-sound");
    this.muted = false;
    this.volume = 0.7;
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;

    // Setup Web Audio API
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
      this.createAmbientSound();
    } catch (error) {
      console.warn("Audio not supported:", error);
    }
  }

  static createAmbientSound() {
    if (!this.audioContext) return;

    // Create ambient space sound
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    const ambientGain = this.audioContext.createGain();

    oscillator1.type = "sine";
    oscillator1.frequency.setValueAtTime(40, this.audioContext.currentTime);
    oscillator2.type = "sine";
    oscillator2.frequency.setValueAtTime(80.1, this.audioContext.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

    ambientGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(this.gainNode);

    oscillator1.start();
    oscillator2.start();
  }

  static playNav() {
    if (!this.audioContext || this.muted) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      this.audioContext.currentTime + 0.2
    );

    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.2
    );

    oscillator.connect(gain);
    gain.connect(this.gainNode);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  static setVolume(vol) {
    this.volume = vol;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(vol, this.audioContext.currentTime);
    }
  }

  static mute(mute) {
    this.muted = mute;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        mute ? 0 : this.volume,
        this.audioContext.currentTime
      );
    }
  }
}

// PerformanceMonitor Class
class PerformanceMonitor {
  constructor(el) {
    this.el = el;
    this.fps = 0;
    this.mem = 0;
    this.last = performance.now();
    this.frames = 0;
    this.init();
  }
  init() {
    this.update();
    this.track();
  }
  update() {
    this.el.textContent = `FPS: ${this.fps} | Memory: ${this.mem} MB`;
  }
  track() {
    const loop = () => {
      this.frames++;
      const now = performance.now();
      if (now - this.last >= 1000) {
        this.fps = this.frames;
        this.frames = 0;
        this.last = now;
        if (performance.memory) {
          this.mem = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
        } else {
          this.mem = "N/A";
        }
        this.update();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }
}

// Loading Screen Logic
function hideLoading() {
  document.getElementById("loading-screen").style.opacity = "0";
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
  }, 700);
}
function showLoadingProgress(percent) {
  document.getElementById("loading-bar").style.width = percent + "%";
  document.getElementById(
    "loading-text"
  ).textContent = `Loading assets... ${percent}%`;
}

// Theme Switcher
function switchTheme() {
  const targetDiv = document.getElementById("carousel-section");
  const dark = document.body.classList.toggle("dark-theme");

  if (dark) {
    targetDiv.style.background = "linear-gradient(135deg,#1a1a2f 0%,#3f2fd1 100%)";
    document.getElementById("theme-switcher").textContent = "☀️";
  } else {
    targetDiv.style.background = "var(--gradient)";
    document.getElementById("theme-switcher").textContent = "🌙";
  }
}



document.getElementById("theme-switcher").addEventListener("click", switchTheme);

// Main Initialization
window.addEventListener("DOMContentLoaded", () => {
  // Loading Progress Simulation
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      hideLoading();
      setTimeout(initApp, 400);
    }
    showLoadingProgress(Math.floor(progress));
  }, 180);

  function initApp() {
    // Effects
    EffectsManager.initStarfield(document.getElementById("starfield"), 3);
    EffectsManager.initParticles(document.getElementById("particles"), 48);
    EffectsManager.initCursor(document.getElementById("custom-cursor"));
    EffectsManager.parallax(document.getElementById("carousel-container"));

    // Audio
    AudioManager.init();

    // Carousel
    const carouselEl = document.getElementById("stellar-carousel");
    const dotNavEl = document.getElementById("dot-nav");
    const controls = {
      prev: document.getElementById("prev-btn"),
      next: document.getElementById("next-btn")
    };
    const navigator = new StellarNavigator(
      SLIDES,
      carouselEl,
      dotNavEl,
      controls
    );

    // Smart Controls
    document
      .getElementById("autoplay-btn")
      .addEventListener("click", () => navigator.toggleAutoplay());
    document
      .getElementById("shuffle-btn")
      .addEventListener("click", () => navigator.shuffleSlides());
    document
      .getElementById("reset-btn")
      .addEventListener("click", () => navigator.reset());
    document
      .getElementById("speed-select")
      .addEventListener("change", (e) => navigator.setSpeed(e.target.value));
    document
      .getElementById("theme-switcher")
      .addEventListener("click", switchTheme);

    // Audio Controls
    document.getElementById("mute-btn").addEventListener("click", () => {
      AudioManager.mute(!AudioManager.muted);
      document.getElementById("mute-btn").textContent = AudioManager.muted
        ? "🔇"
        : "🔊";
    });
    document.getElementById("volume-slider").addEventListener("input", (e) => {
      AudioManager.setVolume(e.target.value);
    });

    // Performance Monitor
    new PerformanceMonitor(document.getElementById("perf-monitor"));

    // Accessibility: Focus management
    carouselEl.addEventListener("focus", () => {
      navigator.slideEls[navigator.activeIdx].focus();
    });

    // Reduced Motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("reduced-motion");
    }
  }
});


//contact info functionality

document.getElementById("emailCard").addEventListener("click",function(){
    window.location.href="mailto:chandru2002mck@gmail.com";
})

document.getElementById("location-card").addEventListener("click", function() {
    // Replace with your location coordinates or address
    window.open("https://www.google.com/maps/place/11%C2%B056'30.7%22N+79%C2%B046'35.4%22E/@11.940386,79.7770414,17.75z/data=!4m4!3m3!8m2!3d11.941858!4d79.776512?entry=ttu&g_ep=EgoyMDI1MDkyMy4wIKXMDSoASAFQAw%3D%3D", "_blank");
});


/* ====== for painting background ====== */

var scenes = document.getElementsByClassName("scene"); 
var overflow = document.getElementById("overflow");

for (var i=0; i<scenes.length; i++) {
    scenes[i].addEventListener('mouseenter', paintingBg, false);
    scenes[i].addEventListener('mouseleave', removeClass, false);
}

function paintingBg(e) {
    e.stopPropagation();
    
    var paintArray = document.getElementsByClassName("paint");
    if(paintArray.length > 6) {
        paintArray[0].remove();
    }
    
    var paint = document.createElement("div");
    paint.setAttribute("class", "paint");
    overflow.appendChild(paint);

    var socialName = document.getElementById("socialName");
    socialName.textContent = e.target.dataset.social;
    socialName.classList.toggle("active");
    
    var socialIcon= e.target.firstElementChild.firstElementChild;
    var computedStyle = window.getComputedStyle(socialIcon);
    var color = computedStyle.getPropertyValue('background-color');
    
    paint.style.left = e.pageX + 'px';      
    paint.style.top = e.pageY - 50 + 'px';  
    
    if (computedStyle.getPropertyValue('background-image') === "none") {
        paint.style.backgroundImage = "none"; 
        paint.style.backgroundColor = color;
    } else paint.style.backgroundImage = computedStyle.getPropertyValue('background-image');
    
    paint.classList.add("hover");    
}


function removeClass () {
    document.getElementById("socialName").classList.toggle("active");
}



