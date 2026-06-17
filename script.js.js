/* ================================================
   DIGIUP — JavaScript Interactivity
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== MOBILE MENU =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('.mobile-menu a, .mobile-menu .btn').forEach(el => {
    el.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ===== AI CHATBOT =====
  const chatArea = document.querySelector('.ai-chat-area');
  const aiInput = document.querySelector('.ai-input');
  const aiSendBtn = document.querySelector('.ai-send-btn');
  const chips = document.querySelectorAll('.suggestion-chip');

  const aiResponses = {
    'ats template': "Here's a clean ATS-friendly template for you! It avoids tables and columns that scanners struggle with. Want me to tailor it to a specific industry?",
    'review my cv': "Upload your CV and our team will review it within 24 hours! We'll check ATS compatibility, formatting, keyword density, and overall impact.",
    'cover letter': "I can help you craft a targeted cover letter. What role and company are you applying to? I'll help you match your experience to what they're looking for.",
    'job description': "Paste the job description and I'll extract the key ATS keywords you should include in your CV to boost your match score.",
    'default': "Great question! DigiUp helps you build CVs that get past ATS filters and land on recruiters' desks. Want a template, a CV review, or help with a specific role?"
  };

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    const avatarText = sender === 'ai' ? '✦' : 'You';
    msg.innerHTML = `
      <div class="chat-avatar">${avatarText}</div>
      <div class="chat-bubble">${text}</div>
    `;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg ai typing-indicator';
    typing.innerHTML = `
      <div class="chat-avatar">✦</div>
      <div class="chat-bubble" style="display:flex;gap:4px;align-items:center;padding:12px 16px;">
        <span style="width:6px;height:6px;background:rgba(255,255,255,0.5);border-radius:50%;animation:typingDot 1s infinite 0s;display:inline-block;"></span>
        <span style="width:6px;height:6px;background:rgba(255,255,255,0.5);border-radius:50%;animation:typingDot 1s infinite 0.2s;display:inline-block;"></span>
        <span style="width:6px;height:6px;background:rgba(255,255,255,0.5);border-radius:50%;animation:typingDot 1s infinite 0.4s;display:inline-block;"></span>
      </div>
    `;
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;
    return typing;
  }

  // Add typing animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `@keyframes typingDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`;
  document.head.appendChild(style);

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    if (aiInput) aiInput.value = '';

    const typing = showTyping();
    const lowerText = text.toLowerCase();
    let response = aiResponses.default;
    for (const [key, val] of Object.entries(aiResponses)) {
      if (lowerText.includes(key)) { response = val; break; }
    }
    setTimeout(() => {
      typing.remove();
      addMessage(response, 'ai');
    }, 1200);
  }

  aiSendBtn?.addEventListener('click', () => sendMessage(aiInput.value));
  aiInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(aiInput.value);
  });
  chips.forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.textContent));
  });

  // ===== TEMPLATE TABS =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In production, this would filter templates
      // For now, just visual feedback
    });
  });

  // ===== TEMPLATE CARD CLICK =====
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      showToast('Template preview coming soon! Sign up to access all templates.');
    });
  });

  // ===== CONTACT FORM =====
  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      showToast("Message sent! We'll get back to you within 24 hours. 🎉");
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1800);
  });

  // ===== TOAST =====
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== CTA BUTTONS =====
  document.querySelectorAll('[data-action="get-started"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#templates')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-action="view-pricing"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
