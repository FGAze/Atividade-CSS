document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENTOS =====
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("themeToggle");
  const backToTop = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section[id]");

  // ===== ANO NO RODAPÉ =====
  document.getElementById("year").textContent = new Date().getFullYear();

  // ===== MENU MOBILE =====
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navLinks.forEach(link =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
    })
  );

  // ===== TEMA CLARO/ESCURO =====
  const applyTheme = theme => {
    document.body.classList.toggle("dark", theme === "dark");
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  };

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  // ===== EVENTOS DE ROLAGEM =====
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 50);
    backToTop.classList.toggle("show", y > 500);

    // Link ativo conforme a seção visível
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (y >= top && y < top + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===== EFEITO DE DIGITAÇÃO =====
  const words = ["Desenvolvedora Front-end", "UI Designer", "Criadora de Experiências"];
  const typed = document.getElementById("typed");
  let wordIndex = 0, charIndex = 0, deleting = false;

  const type = () => {
    const current = words[wordIndex];
    typed.textContent = current.substring(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 45);
    } else {
      deleting = !deleting;
      if (!deleting) wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, deleting ? 1600 : 300);
    }
  };
  type();

  // ===== CONTADOR ANIMADO =====
  const animateCounter = el => {
    const target = +el.dataset.target;
    const duration = 1500;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ===== REVELAR AO ROLAR =====
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("visible");

        el.querySelectorAll(".skill-fill").forEach(bar => {
          bar.style.width = bar.dataset.width + "%";
        });
        el.querySelectorAll(".stat-number").forEach(animateCounter);

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // ===== FILTRO DE PROJETOS =====
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === "todos" || card.dataset.category === filter;
        card.classList.toggle("hide", !match);
      });
    });
  });

  // ===== VALIDAÇÃO DO FORMULÁRIO =====
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  const setError = (input, message) => {
    const group = input.parentElement;
    group.querySelector(".error").textContent = message;
    group.classList.toggle("invalid", Boolean(message));
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nome = form.nome;
    const email = form.email;
    const mensagem = form.mensagem;
    let valid = true;

    if (nome.value.trim().length < 2) {
      setError(nome, "Informe seu nome.");
      valid = false;
    } else setError(nome, "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, "Informe um e-mail válido.");
      valid = false;
    } else setError(email, "");

    if (mensagem.value.trim().length < 10) {
      setError(mensagem, "A mensagem deve ter pelo menos 10 caracteres.");
      valid = false;
    } else setError(mensagem, "");

    if (valid) {
      success.classList.add("show");
      form.reset();
      setTimeout(() => success.classList.remove("show"), 4000);
    }
  });
});
