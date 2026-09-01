/* СОШ № 29 — минимальный интерактив: меню-шторка, подменю, версия для слабовидящих.
   Без зависимостей. В Astro переносится в отдельный модуль. */
(function () {
  "use strict";

  var body = document.body;
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }
    // При закрытии возвращаем фокус на бургер, если он был внутри шторки
    if (!open && nav && nav.contains(document.activeElement) && burger) {
      burger.focus();
    }
  }

  if (burger && nav) {
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
    // Фокус-ловушка шторки: пока меню открыто, Tab/Shift+Tab не уводят
    // фокус за пределы меню. Работает только в мобильном режиме,
    // где виден бургер (на десктопе он скрыт через display: none).
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
