/**
 * 餐聚 SaaS 官网交互逻辑 (SPA & 高级动效版)
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  initNavbarScroll();
  initThemeToggle();
  initMobileMenu();
  initSPA();

  // 初始页面加载时执行的逻辑
  runPageSpecificLogic();
}

function runPageSpecificLogic() {
  applyGlobalConfig();
  initLucideIcons();
  initScrollReveal();
  initFormValidation();
  updateNavHighlight(window.location.pathname);
  initSmoothScroll();
}

// =========================================
// 0. 初始化 Lucide 图标
// =========================================
function initLucideIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// =========================================
// 1. 导航栏滚动过渡效果
// =========================================
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

// =========================================
// 2. 滚动出现动画 (Scroll Reveal)
// =========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

// =========================================
// 3. 主题切换逻辑
// =========================================
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
      htmlElement.setAttribute("data-theme", "dark");
      updateThemeIcon("dark");
    } else {
      updateThemeIcon("light");
    }

    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      if (currentTheme === "dark") {
        htmlElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        updateThemeIcon("light");
      } else {
        htmlElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        updateThemeIcon("dark");
      }
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;
  if (theme === "dark") {
    themeToggleBtn.innerHTML = '<i data-lucide="sun" class="icon"></i>';
  } else {
    themeToggleBtn.innerHTML = '<i data-lucide="moon" class="icon"></i>';
  }
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root: themeToggleBtn });
  }
}

// =========================================
// 4. 移动端导航菜单展开/收起
// =========================================
function initMobileMenu() {
  const mobileToggleBtn = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileToggleBtn && navMenu) {
    // 移除旧事件监听器以防重复绑定
    const newBtn = mobileToggleBtn.cloneNode(true);
    mobileToggleBtn.parentNode.replaceChild(newBtn, mobileToggleBtn);

    newBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const isExpanded = navMenu.classList.contains("active");
      newBtn.setAttribute("aria-expanded", isExpanded);

      if (isExpanded) {
        newBtn.innerHTML = '<i data-lucide="x"></i>';
      } else {
        newBtn.innerHTML = '<i data-lucide="menu"></i>';
      }
      if (typeof lucide !== "undefined") {
        lucide.createIcons({ root: newBtn });
      }
    });
  }
}

// =========================================
// 5. 表单前端验证 (合作加盟页面)
// =========================================
function initFormValidation() {
  const cooperateForm = document.getElementById("cooperate-form");

  if (cooperateForm) {
    cooperateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById("name");
      if (!nameInput.value.trim()) {
        showError(nameInput, "请输入您的姓名");
        isValid = false;
      } else {
        clearError(nameInput);
      }

      const phoneInput = document.getElementById("phone");
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        showError(phoneInput, "请输入有效的11位手机号码");
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      const emailInput = document.getElementById("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        emailInput.value.trim() &&
        !emailRegex.test(emailInput.value.trim())
      ) {
        showError(emailInput, "请输入有效的电子邮箱地址");
        isValid = false;
      } else {
        clearError(emailInput);
      }

      const typeInput = document.getElementById("type");
      if (!typeInput.value) {
        showError(typeInput, "请选择合作意向");
        isValid = false;
      } else {
        clearError(typeInput);
      }

      if (isValid) {
        const submitBtn = cooperateForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i data-lucide="loader-2" class="spin"></i> 提交中...';
        if (typeof lucide !== "undefined")
          lucide.createIcons({ root: submitBtn });
        submitBtn.disabled = true;

        setTimeout(() => {
          alert("申请提交成功！我们的招商专员将尽快与您联系。");
          cooperateForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
}

function showError(inputElement, message) {
  const formGroup = inputElement.closest(".form-group");
  if (formGroup) {
    formGroup.classList.add("error");
    const errorElement = formGroup.querySelector(".form-error");
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
}

function clearError(inputElement) {
  const formGroup = inputElement.closest(".form-group");
  if (formGroup) formGroup.classList.remove("error");
}

// =========================================
// 6. 平滑滚动到页面锚点
// =========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    // 避免重复绑定
    anchor.replaceWith(anchor.cloneNode(true));
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        closeMobileMenu();
      }
    });
  });
}

// =========================================
// 7. 导航栏当前页面高亮
// =========================================
function updateNavHighlight(path) {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    let linkPath = link.getAttribute("href").split("#")[0];
    linkPath = linkPath.replace(/^\.?\//, ''); // Remove leading ./ or /
    
    let currentPath = path.replace(/^\//, ''); // Remove leading /
    if (currentPath === '' || currentPath.endsWith('/')) {
      currentPath += 'index.html';
    }

    if (currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// =========================================
// 8. SPA 路由 (无刷新页面跳转)
// =========================================
function initSPA() {
  document.addEventListener(
    "click",
    async (e) => {
      // 1. 处理 a 标签
      const link = e.target.closest("a");
      if (link) {
        const href = link.getAttribute("href");
        if (
          href &&
          !href.startsWith("http") &&
          !href.startsWith("#") &&
          link.target !== "_blank"
        ) {
          e.preventDefault();
          closeMobileMenu();
          await navigateTo(href);
          return;
        }
      }

      // 2. 处理带有 onclick="location.href='...'" 的按钮
      const btn = e.target.closest("button");
      if (btn) {
        const onclick = btn.getAttribute("onclick");
        if (onclick && onclick.includes("location.href")) {
          const match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
          if (match && match[1]) {
            const href = match[1];
            if (!href.startsWith("http") && !href.startsWith("#")) {
              e.preventDefault();
              e.stopPropagation(); // 阻止内联 onclick 执行
              closeMobileMenu();
              await navigateTo(href);
              return;
            }
          }
        }
      }
    },
    true,
  ); // 捕获阶段

  // 处理浏览器前进后退
  window.addEventListener("popstate", async () => {
    await navigateTo(window.location.pathname + window.location.hash, false);
  });
}

function closeMobileMenu() {
  const navMenu = document.getElementById("nav-menu");
  const mobileToggleBtn = document.getElementById("mobile-toggle");
  if (navMenu && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    if (mobileToggleBtn) {
      mobileToggleBtn.innerHTML = '<i data-lucide="menu"></i>';
      mobileToggleBtn.setAttribute("aria-expanded", "false");
      if (typeof lucide !== "undefined")
        lucide.createIcons({ root: mobileToggleBtn });
    }
  }
}

async function navigateTo(url, pushState = true) {
  try {
    // 显示加载状态 (可选)
    document.body.style.opacity = "0.7";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 替换 main 内容
    const newMain = doc.querySelector("main");
    const currentMain = document.querySelector("main");
    if (newMain && currentMain) {
      currentMain.innerHTML = newMain.innerHTML;
    }

    // 更新标题
    document.title = doc.title;

    if (pushState) {
      history.pushState(null, "", url);
    }

    // 恢复透明度
    document.body.style.opacity = "1";

    // 重新初始化页面逻辑
    runPageSpecificLogic();

    // 处理 hash 滚动或回到顶部
    if (url.includes("#")) {
      const hash = url.substring(url.indexOf("#"));
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("Navigation failed:", error);
    // 降级处理：直接跳转
    window.location.href = url;
  }
}

// =========================================
// 8. 全局配置应用
// =========================================
function applyGlobalConfig() {
  if (typeof window.SiteConfig === "undefined") return;
  const config = window.SiteConfig;

  // 替换导航栏品牌名称和Logo
  const navBrands = document.querySelectorAll(".nav-brand");
  navBrands.forEach(brand => {
    brand.innerHTML = '';
    brand.style.display = 'flex';
    brand.style.alignItems = 'center';
    brand.style.gap = '0.5rem';
    
    if (config.logoUrl) {
      const img = document.createElement('img');
      img.src = config.logoUrl;
      img.alt = config.systemName + ' Logo';
      img.style.height = '32px';
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
      brand.appendChild(img);
    }
    if (config.systemName) {
      const span = document.createElement('span');
      span.textContent = config.systemName;
      brand.appendChild(span);
    }
  });

  // 替换页脚品牌名称
  const footerBrands = document.querySelectorAll(".footer-brand");
  footerBrands.forEach(brand => {
    if (config.systemName) brand.textContent = config.systemName;
  });

  // 替换页脚描述
  const footerDescs = document.querySelectorAll(".footer-desc");
  footerDescs.forEach(desc => {
    if (config.footerDesc) desc.textContent = config.footerDesc;
  });

  // 替换联系方式 (通过图标查找)
  const phoneItems = document.querySelectorAll(".footer-links li i[data-lucide='phone']");
  phoneItems.forEach(icon => {
    if (config.contactPhone) {
      const li = icon.parentElement;
      li.innerHTML = `<i data-lucide="phone" style="width: 16px; height: 16px"></i> ${config.contactPhone}`;
    }
  });

  const emailItems = document.querySelectorAll(".footer-links li i[data-lucide='mail']");
  emailItems.forEach(icon => {
    if (config.contactEmail) {
      const li = icon.parentElement;
      li.innerHTML = `<i data-lucide="mail" style="width: 16px; height: 16px"></i> ${config.contactEmail}`;
    }
  });

  const addressItems = document.querySelectorAll(".footer-links li i[data-lucide='map-pin']");
  addressItems.forEach(icon => {
    if (config.contactAddress) {
      const li = icon.parentElement;
      li.innerHTML = `<i data-lucide="map-pin" style="width: 16px; height: 16px"></i> ${config.contactAddress}`;
    }
  });

  // 替换版权信息
  const footerBottoms = document.querySelectorAll(".footer-bottom");
  footerBottoms.forEach(el => {
    if (config.copyrightYear && config.systemName) {
      el.innerHTML = `&copy; ${config.copyrightYear} ${config.systemName} 版权所有.`;
    }
  });

  // 替换页面标题 (如果包含原系统名)
  if (config.systemName) {
    document.title = document.title.replace(/餐聚 SaaS/g, config.systemName);
    
    // 替换页面中所有的 "餐聚 SaaS" 文本
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes("餐聚 SaaS")) {
        node.nodeValue = node.nodeValue.replace(/餐聚 SaaS/g, config.systemName);
      } else if (node.nodeValue.includes("餐聚SaaS")) {
        node.nodeValue = node.nodeValue.replace(/餐聚SaaS/g, config.systemName);
      }
    }

    // 替换图片 alt 属性
    const images = document.querySelectorAll("img[alt*='餐聚']");
    images.forEach(img => {
      if (img.alt.includes("餐聚 SaaS")) {
        img.alt = img.alt.replace(/餐聚 SaaS/g, config.systemName);
      } else if (img.alt.includes("餐聚SaaS")) {
        img.alt = img.alt.replace(/餐聚SaaS/g, config.systemName);
      }
    });
  }
}
