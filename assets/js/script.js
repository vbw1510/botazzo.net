const especialidades = [
  'Desenvolvedor Fullstack',
  'Técnico em Informática',
  'Especialista em Automação com IA',
  'Criador de Sistemas Para Empresas',
  'Criador de Sites Modernos',
  'Manutenção de Computadores, Notebooks e Celulares'

];


const typewriterEl = document.getElementById('typewriter');
let fraseIndex = 0;
let charIndex = 0;
let apagando = false;

function typewriterLoop() {
  const fraseAtual = especialidades[fraseIndex];
  let velocidade = apagando ? 40 : 80;

  if (!apagando) {
    charIndex++;
    typewriterEl.textContent = fraseAtual.substring(0, charIndex);
    if (charIndex === fraseAtual.length) {
      apagando = true;
      velocidade = 1800; // pausa antes de apagar
    }
  } else {
    charIndex--;
    typewriterEl.textContent = fraseAtual.substring(0, charIndex);
    if (charIndex === 0) {
      apagando = false;
      fraseIndex = (fraseIndex + 1) % especialidades.length;
      velocidade = 400; // pausa antes de digitar a próxima
    }
  }

  setTimeout(typewriterLoop, velocidade);
}

typewriterLoop();
const WHATSAPP_NUMBER = "5513999999999"; // TROQUE pelo seu número: DDI + DDD + número, sem espaços.

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const progress = document.querySelector(".scroll-progress");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  });

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open);
    });
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }

  const message = encodeURIComponent(
    "Olá! Vi o site da Botazzo.Net e gostaria de solicitar um orçamento."
  );
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll("[data-demo]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      alert("Adicione aqui o link do projeto publicado.");
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());
});