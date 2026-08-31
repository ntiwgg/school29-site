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
