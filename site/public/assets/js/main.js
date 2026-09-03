/* СОШ № 29 — минимальный интерактив: меню-шторка (inert-фон, фокус-ловушка,
   кнопка «Закрыть»), подменю, версия для слабовидящих.
   Без зависимостей. В Astro переносится в отдельный модуль. */
(function () {
  "use strict";

  var body = document.body;
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");
  var desktopMQ = window.matchMedia("(min-width: 1081px)");
  var lastFocus = null;

  /* Фон шторки (шапка кроме меню, контент, госссылки, футер) становится
     инертным: фокус и клики не уходят за пределы открытого меню. */
  function setInert(on) {
    var parts = body.querySelectorAll(
      "header .header-top, header .header-main, main, .gov-links, footer"
    );
    parts.forEach(function (el) {
      try { el.inert = on; } catch (e) { el.setAttribute("aria-hidden", on ? "true" : "false"); }
    });
  }

  /* Фокус на первый интерактивный элемент шторки (кнопка «Закрыть»).
     Сразу после открытия шторка ещё в начале transition (visibility: hidden),
     поэтому при неудаче пробуем ещё раз через пару кадров. */
  function focusFirst() {
    var first = nav && nav.querySelector("a, button");
    if (!first) return;
    first.focus();
    if (!nav.contains(document.activeElement)) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!body.classList.contains("menu-open")) return;
          first.focus();
        });
      });
    }
  }

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }
    if (open) {
      lastFocus = document.activeElement; // сюда вернём фокус при закрытии
      focusFirst();
      setInert(true);
    } else {
      setInert(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }

  if (burger && nav) {
    // Видимая кнопка «Закрыть» в шапке шторки (на десктопе скрыта через CSS)
    var head = document.createElement("div");
    head.className = "menu-head";
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "menu-close";
    closeBtn.setAttribute("aria-label", "Закрыть меню");
    closeBtn.innerHTML = "Закрыть <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>";
    head.appendChild(closeBtn);
    nav.insertBefore(head, nav.firstChild);
    closeBtn.addEventListener("click", function () { setMenu(false); });

    burger.addEventListener("click", function () {
      setMenu(!body.classList.contains("menu-open"));
    });
    // закрыть шторку после перехода по ссылке
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    // Escape закрывает меню
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    // При растягивании окна до десктопа шторка закрывается
    window.addEventListener("resize", function () {
      if (desktopMQ.matches) setMenu(false);
    });
    // Фокус-ловушка шторки: пока меню открыто, Tab/Shift+Tab не уводят
    // фокус за пределы меню. Работает в мобильном режиме, где виден бургер
    // (на десктопе он скрыт через display: none).
    var FOCUSABLE_SELECTOR =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !body.classList.contains("menu-open")) return;
      if (getComputedStyle(burger).display === "none") return;
      var focusable = nav.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (nav.contains(document.activeElement)) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else {
        // фокус вне шторки (например, остался на бургере) — заводим внутрь
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    });
  }

  // Подменю (мобильная версия): клик по родительскому пункту раскрывает список
  document.querySelectorAll(".nav-toggle").forEach(function (t) {
    t.addEventListener("click", function () {
      var item = t.closest(".nav-item");
      var open = item.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Ссылки-заглушки (разделы ещё не свёрстаны) — не даём прыгать к началу страницы
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  // Версия для слабовидящих
  var eye = document.querySelector(".eye-btn");
  if (eye) {
    eye.addEventListener("click", function () {
      document.documentElement.classList.toggle("eye-friendly");
    });
  }
})();
