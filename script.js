/*
  SecureFix, London — landing page behavior
  1. CTA click tracking via dataLayer (phone_click / directions_click)
  2. Optional direct Google Ads conversions (only if configured in index.html)
  3. Lazy-loading the Google Maps embed
  No third-party scripts are loaded by this file.
*/
(function () {
  'use strict';

  var dataLayer = (window.dataLayer = window.dataLayer || []);
  var config = window.CELLHUB_TRACKING || {};
  var debug = /[?&]debug_tracking=1\b/.test(window.location.search);

  var EVENTS = {
    phone: 'phone_click',
    directions: 'directions_click'
  };

  // Guard against duplicate events from double taps / repeated clicks.
  var DEDUPE_MS = 1000;
  var lastFired = typeof WeakMap === 'function' ? new WeakMap() : null;

  function isDuplicate(el) {
    if (!lastFired) return false;
    var now = Date.now();
    var prev = lastFired.get(el) || 0;
    lastFired.set(el, now);
    return now - prev < DEDUPE_MS;
  }

  function sendAdsConversion(eventName) {
    var sendTo = config.adsConversions && config.adsConversions[eventName];
    if (sendTo && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: sendTo });
    }
  }

  function track(el) {
    var type = el.getAttribute('data-cta');
    var eventName = EVENTS[type];
    if (!eventName || isDuplicate(el)) return;

    // A phone click is a click intent, not a connected call.
    // A directions click is a click intent, not a verified store visit.
    var payload = {
      event: eventName,
      cta_type: type,
      cta_location: el.getAttribute('data-cta-location') || 'unknown',
      link_url: el.getAttribute('href')
    };
    if (type === 'phone') payload.phone_number = '+442033367147';

    dataLayer.push(payload);
    sendAdsConversion(eventName);
    if (debug && window.console) console.log('[tracking]', payload);
  }

  // Single delegated listener (capture phase) — fires once per click and never
  // blocks the default tel: / Google Maps navigation.
  document.addEventListener(
    'click',
    function (e) {
      var target = e.target;
      var el = target && target.closest ? target.closest('a[data-cta]') : null;
      if (el) track(el);
    },
    true
  );

  // Lazy-load the map iframe only when it approaches the viewport.
  var mapFrame = document.querySelector('.map iframe[data-src]');
  if (mapFrame) {
    var loadMap = function () {
      if (!mapFrame.getAttribute('src')) {
        mapFrame.setAttribute('src', mapFrame.getAttribute('data-src'));
      }
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            loadMap();
            io.disconnect();
          }
        },
        { rootMargin: '300px 0px' }
      );
      io.observe(mapFrame);
    } else {
      window.addEventListener('load', loadMap);
    }
  }

  /* ---------- Bilingual Support (English / Russian) ---------- */
  var TRANSLATIONS = {
    en: {
      page_title: 'Phone and Computer in City Road, London | SecureFix, London',
      meta_desc: 'Visit SecureFix, London for phone screen fixes, battery replacements, and other device services. Call today or get directions to our Richmond Ave location.',
      og_title: 'Phone and Computer in City Road, London | SecureFix, London',
      og_desc: 'Screen fixes, battery replacements, and charging port fixes at our Richmond Ave store in Houston.',
      skip_link: 'Skip to content',

      // Header
      lang_aria: 'Language selection',
      lang_btn_en: 'Switch to English',
      lang_btn_ru: 'Switch to Russian',

      // Hero
      hero_title: 'Phone and Computer in City Road, London',
      hero_kicker: 'Cracked Screen? Battery Issue? Charging Problem?',
      hero_desc: 'Visit SecureFix, London for convenient phone services, clear upfront estimates, and quality replacement parts.',
      trust_aria: 'Why customers visit Cell Hub',
      trust_1: 'Many Common Fixes in About 15&nbsp;Minutes<sup>*</sup>',
      trust_2: 'Upfront Estimates',
      trust_3: 'Limited Warranty Available',
      btn_call: 'Call Now',
      btn_dir: 'Get Directions',
      call_aria: 'Call Now: 020 3336 7147',
      dir_aria: 'Get Directions to SecureFix, London on Google Maps (opens in a new tab)',
      hero_footnote: '<sup>*</sup>Actual turnaround depends on the device, the service needed, and parts availability. Some jobs take longer.',
      hero_img_alt: 'Technician replacing a cracked smartphone screen on a fix mat',

      // Services
      services_eyebrow: 'Services',
      services_title: 'What Can We Fix for You?',
      services_sub: 'Local phone and device services in London.',
      svc_1_title: 'Screen Fix',
      svc_1_desc: 'Cracked or damaged screen? Ask us about screen replacement options.',
      svc_2_title: 'Battery Replacement',
      svc_2_desc: 'Having trouble with battery life? Contact us about replacement options.',
      svc_3_title: 'Charging Port Fix',
      svc_3_desc: 'Phone not charging properly? Visit us for an inspection.',
      svc_4_title: 'iPhone Fix',
      svc_4_desc: 'Screen, battery, camera, and charging-related hardware services.',
      svc_5_title: 'Samsung & Android Fix',
      svc_5_desc: 'Hardware services for Samsung, Google Pixel, and other popular Android devices.',
      svc_6_title: 'Tablet & Device Fix',
      svc_6_desc: 'Service options for tablets and other supported devices.',

      // Why Cell Hub
      why_eyebrow: 'Why SecureFix, London',
      why_title: 'Why Choose SecureFix?',
      benefit_1_title: 'Quick Service',
      benefit_1_desc: 'Many common fixes can be completed in about 15 minutes, depending on the device and required work.',
      benefit_2_title: 'Upfront Pricing',
      benefit_2_desc: 'Receive an estimate before work begins.',
      benefit_3_title: 'Quality Replacement Parts',
      benefit_3_desc: 'Replacement parts are selected for quality and suitability, with information provided about the parts used.',
      benefit_4_title: 'Limited Warranty',
      benefit_4_desc: 'Eligible services are covered by Cell Hub\'s published <a class="text-link" href="https://cellhubhouston.com/policies/warranty" target="_blank" rel="noopener">limited warranty terms</a>.',

      // Free Quote Form
      quote_eyebrow: '<svg class="icon" aria-hidden="true"><use href="#i-tag"/></svg> Fast &amp; Free Estimate',
      quote_title: 'Tell Us About Your Device',
      floating_estimate: 'Get an Estimate',
      quote_desc: 'Tell us what\'s happening with your phone or tablet. Our Houston team will review your details and send you a fast estimate with no obligation.',
      perk_1_title: 'Fast Response',
      perk_1_desc: 'Usually within 15–30 minutes during store hours.',
      perk_2_title: 'Transparent Estimates',
      perk_2_desc: 'No hidden charges or surprise diagnostic fees.',
      perk_3_title: 'Need Urgent Help?',
      perk_3_desc: 'Call directly at <a class="text-link text-link--strong" href="tel:+442033367147">020 3336 7147</a> for instant answers.',
      label_name: 'Full Name <span class="required">*</span>',
      ph_name: 'Enter your full name',
      label_phone: 'Phone Number <span class="required">*</span>',
      ph_phone: '020 3336 7147',
      label_device: 'Device Model <span class="required">*</span>',
      ph_device: 'e.g. iPhone 15 Pro, S24',
      label_service: 'Service Needed',
      opt_screen: 'Screen Fix / Replacement',
      opt_battery: 'Battery Replacement',
      opt_port: 'Charging Port Fix',
      opt_water: 'Water Damage Diagnostic',
      opt_back: 'Back Glass Replacement',
      opt_other: 'Camera, Speaker or Other',
      label_details: 'Issue Details (Optional)',
      ph_details: 'Tell us more about the symptoms or what happened...',
      btn_submit_quote: 'Request an Estimate',
      status_sending: 'Sending Request...',
      status_success: 'Thank you! Your quote request has been received. Our Richmond Ave team will contact you shortly at your phone number.',
      status_error_validation: 'Please enter your name, a valid phone number, and your device model.',
      status_error_server: 'Could not send request right now. Please call us directly at <a class="text-link text-link--strong" href="tel:+442033367147">020 3336 7147</a>.',

      form_kicker: 'REPAIR ESTIMATE',
      form_title: 'Request a quote',
      form_required: 'Fields marked * are required.',
      form_device_group: '01 / Device information',
      form_contact_group: '02 / Contact information',
      form_privacy: 'We use your contact details to respond to this request. <a href="https://securefix.uk/terms" target="_blank" rel="noopener">Privacy policy</a>.',

      // Reviews
      reviews_eyebrow: 'Reviews',
      reviews_title: 'What Our Customers Say',
      stars_aria: 'Rated 5 out of 5 stars',
      review_1_text: '“My laptop had been shutting itself off whenever I plugged it in, which was doing my head in because I use it for work. I took it to SecureFix not really expecting them to look at it the same day. They did, and the bloke at the counter told me the charger port was loose and quoted me before he opened it up. Took a bit longer than he first said, maybe an extra hour, but I waited. It\'s been a week and it hasn\'t cut out once.”',
      review_2_text: '“I dropped my phone on the pavement and the whole top corner of the screen went black. I\'d already been to one place that wanted me to leave it for three days, so I was a bit wary walking into SecureFix. They had the part in and said they could do it while I waited, which I didn\'t totally believe until they handed it back. Touch is fine. The new glass sits a fraction higher than the old one if you look closely, but I don\'t notice it in my pocket.”',
      review_3_text: '“The computer in the spare room just stopped turning on. No lights, nothing, and I assumed the power supply was gone. SecureFix opened it up and it was a stuck fan plus a loose cable, which felt almost too simple, but they showed me. Cost less than I thought it would. Still a bit loud when it first boots, though it settles after a minute.”',
      google_review: 'Google review',

      // Location
      loc_eyebrow: 'Location',
      loc_title: 'Visit SecureFix in London',
      loc_sub: 'Stop by our 218 City Road, London location for phone and device services.',
      loc_addr_heading: 'Address',
      loc_phone_heading: 'Phone',
      loc_hours_heading: 'Business Hours',
      hours_mon_fri: 'Monday to Friday',
      hours_sat: 'Saturday',
      hours_sun: 'Sunday',
      map_title: 'Map showing SecureFix at City Road, London',

      // Final CTA
      final_title: 'Need Your Phone Fixed?',
      final_sub: 'Call SecureFix, London or visit our store on Richmond Avenue.',

      // Footer
      footer_privacy: 'Privacy Policy',
      footer_terms: 'Fix Terms',
      footer_legal: 'SecureFix, London is an independent phone and device service shop and is not affiliated with Apple, Samsung, or Google. Device brand names are used only to describe the devices we service.',
      footer_copy: 'Copyright &copy; 2026 SecureFix, London'
    },
    ru: {
      page_title: 'Телефон и компьютер на City Road, London | SecureFix, London',
      meta_desc: 'SecureFix, London: замена экрана, замена аккумулятора и другие услуги для телефонов. Позвоните сегодня или постройте маршрут до нашего магазина на Richmond Ave.',
      og_title: 'Телефон и компьютер на City Road, London | SecureFix, London',
      og_desc: 'Замена экрана, аккумуляторов и разъёмов зарядки в нашем магазине на Richmond Ave в Хьюстоне.',
      skip_link: 'Перейти к содержанию',

      // Header
      lang_aria: 'Выбор языка',
      lang_btn_en: 'Переключить на английский',
      lang_btn_ru: 'Переключить на русский',

      // Hero
      hero_title: 'Телефон и компьютер на City Road, London',
      hero_kicker: 'Разбит экран? Проблема с аккумулятором? Не заряжается?',
      hero_desc: 'SecureFix, London — удобный ремонт телефонов, понятная смета заранее и качественные запчасти.',
      trust_aria: 'Почему клиенты выбирают Cell Hub',
      trust_1: 'Многие типовые ремонты примерно за 15&nbsp;минут<sup>*</sup>',
      trust_2: 'Смета заранее',
      trust_3: 'Доступна ограниченная гарантия',
      btn_call: 'Позвонить',
      btn_dir: 'Маршрут',
      call_aria: 'Позвонить: 020 3336 7147',
      dir_aria: 'Маршрут до SecureFix, London в Google Картах (откроется в новой вкладке)',
      hero_footnote: '<sup>*</sup>Срок зависит от устройства, нужной услуги и наличия запчастей. Некоторые работы занимают больше времени.',
      hero_img_alt: 'Мастер меняет разбитый экран смартфона на рабочем коврике',

      // Services
      services_eyebrow: 'Услуги',
      services_title: 'Что мы можем починить?',
      services_sub: 'Местный ремонт телефонов и устройств в Лондоне.',
      svc_1_title: 'Замена экрана',
      svc_1_desc: 'Треснул или повреждён экран? Узнайте о вариантах замены.',
      svc_2_title: 'Замена аккумулятора',
      svc_2_desc: 'Аккумулятор быстро садится? Свяжитесь с нами, чтобы узнать о замене.',
      svc_3_title: 'Ремонт разъёма зарядки',
      svc_3_desc: 'Телефон плохо заряжается? Приходите на диагностику.',
      svc_4_title: 'Ремонт iPhone',
      svc_4_desc: 'Экран, аккумулятор, камера и аппаратные работы, связанные с зарядкой.',
      svc_5_title: 'Ремонт Samsung и Android',
      svc_5_desc: 'Аппаратный ремонт Samsung, Google Pixel и других популярных устройств Android.',
      svc_6_title: 'Ремонт планшетов и других устройств',
      svc_6_desc: 'Варианты обслуживания планшетов и других поддерживаемых устройств.',

      // Why Cell Hub
      why_eyebrow: 'Почему SecureFix, London',
      why_title: 'Почему выбирают SecureFix?',
      benefit_1_title: 'Быстрый ремонт',
      benefit_1_desc: 'Многие типовые работы можно выполнить примерно за 15 минут — в зависимости от устройства и объёма работ.',
      benefit_2_title: 'Цена заранее',
      benefit_2_desc: 'Вы получаете смету до начала работ.',
      benefit_3_title: 'Качественные запчасти',
      benefit_3_desc: 'Запчасти подбираются по качеству и совместимости, и мы рассказываем, какие детали используются.',
      benefit_4_title: 'Ограниченная гарантия',
      benefit_4_desc: 'Подходящие услуги покрываются опубликованными <a class="text-link" href="https://cellhubhouston.com/policies/warranty" target="_blank" rel="noopener">условиями ограниченной гарантии</a> Cell Hub.',

      // Free Quote Form
      quote_eyebrow: '<svg class="icon" aria-hidden="true"><use href="#i-tag"/></svg> Быстрая и бесплатная смета',
      quote_title: 'Расскажите о вашем устройстве',
      floating_estimate: 'Получить смету',
      quote_desc: 'Расскажите, что случилось с телефоном или планшетом. Наша команда в Хьюстоне проверит данные и быстро пришлёт смету без обязательств.',
      perk_1_title: 'Быстрый ответ',
      perk_1_desc: 'Обычно в течение 15–30 минут в часы работы.',
      perk_2_title: 'Прозрачная смета',
      perk_2_desc: 'Без скрытых платежей и неожиданной платы за диагностику.',
      perk_3_title: 'Нужна срочная помощь?',
      perk_3_desc: 'Позвоните напрямую по номеру <a class="text-link text-link--strong" href="tel:+442033367147">020 3336 7147</a>, чтобы получить ответ сразу.',
      label_name: 'Полное имя <span class="required">*</span>',
      ph_name: 'Введите полное имя',
      label_phone: 'Номер телефона <span class="required">*</span>',
      ph_phone: '020 3336 7147',
      label_device: 'Модель устройства <span class="required">*</span>',
      ph_device: 'например, iPhone 15 Pro, S24',
      label_service: 'Нужная услуга',
      opt_screen: 'Замена / ремонт экрана',
      opt_battery: 'Замена аккумулятора',
      opt_port: 'Ремонт разъёма зарядки',
      opt_water: 'Диагностика после попадания воды',
      opt_back: 'Замена заднего стекла',
      opt_other: 'Камера, динамик или другое',
      label_details: 'Описание проблемы (необязательно)',
      ph_details: 'Расскажите подробнее о симптомах или о том, что произошло...',
      btn_submit_quote: 'Запросить смету',
      status_sending: 'Отправляем запрос...',
      status_success: 'Спасибо! Запрос на смету получен. Команда Richmond Ave скоро свяжется с вами по указанному номеру.',
      status_error_validation: 'Укажите имя, действительный номер телефона и модель устройства.',
      status_error_server: 'Сейчас не удалось отправить запрос. Позвоните нам напрямую по номеру <a class="text-link text-link--strong" href="tel:+442033367147">020 3336 7147</a>.',

      form_kicker: 'СМЕТА НА РЕМОНТ',
      form_title: 'Запросить смету',
      form_required: 'Поля, отмеченные *, обязательны.',
      form_device_group: '01 / Данные об устройстве',
      form_contact_group: '02 / Контактные данные',
      form_privacy: 'Мы используем ваши контактные данные, чтобы ответить на этот запрос. <a href="https://securefix.uk/terms" target="_blank" rel="noopener">Политика конфиденциальности</a>.',

      // Reviews
      reviews_eyebrow: 'Отзывы',
      reviews_title: 'Что говорят наши клиенты',
      stars_aria: 'Оценка 5 из 5 звёзд',
      review_1_text: '«Ноутбук сам выключался, стоило воткнуть зарядку, и из-за работы это уже достало. Отнёс в SecureFix и особо не рассчитывал, что посмотрят в тот же день. Посмотрели: парень за стойкой сказал, что разъём зарядки болтается, и назвал цену ещё до того, как вскрыл. Вышло где-то на час дольше, чем он сначала сказал, но я подождал. Уже неделя прошла — ни разу не отрубился.»',
      review_2_text: '«Уронил телефон на тротуар, и весь верхний угол экрана стал чёрным. В одном месте уже просили оставить на три дня, так что в SecureFix я заходил с опаской. Запчасть была, сказали, что сделают, пока жду, — я не очень в это поверил, пока телефон не отдали. Сенсор нормальный. Новое стекло чуть выступает, если присмотреться, но в кармане я этого не замечаю.»',
      review_3_text: '«Компьютер в запасной комнате просто перестал включаться — ни лампочек, ничего, и я уже думал, что блок питания умер. В SecureFix его вскрыли, и это оказался заклинивший вентилятор плюс отошедший кабель. Почти слишком просто, но мне показали, и вышло дешевле, чем я ожидал. При включении всё ещё немного шумит, хотя через минуту стихает.»',
      google_review: 'Отзыв в Google',

      // Location
      loc_eyebrow: 'Адрес',
      loc_title: 'Посетите SecureFix в Лондоне',
      loc_sub: 'Загляните в наш магазин по адресу 218 City Road, London за ремонтом телефонов и устройств.',
      loc_addr_heading: 'Адрес',
      loc_phone_heading: 'Телефон',
      loc_hours_heading: 'Часы работы',
      hours_mon_fri: 'Понедельник–пятница',
      hours_sat: 'Суббота',
      hours_sun: 'Воскресенье',
      map_title: 'Карта: SecureFix, City Road, London',

      // Final CTA
      final_title: 'Нужно починить телефон?',
      final_sub: 'Позвоните в SecureFix, London или приходите в магазин на Richmond Avenue.',

      // Footer
      footer_privacy: 'Политика конфиденциальности',
      footer_terms: 'Условия ремонта',
      footer_legal: 'SecureFix, London — независимая мастерская по ремонту телефонов и устройств и не связана с Apple, Samsung или Google. Названия брендов используются только для описания устройств, которые мы обслуживаем.',
      footer_copy: 'Copyright &copy; 2026 SecureFix, London'
    }
  };

  function setLanguage(lang, updateUrl) {
    var selectedLang = lang === 'ru' ? 'ru' : 'en';
    var t = TRANSLATIONS[selectedLang];

    document.documentElement.lang = selectedLang;

    // Update text / html content
    var i18nElements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nElements.length; i++) {
      var el = i18nElements[i];
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    }

    // Update attributes
    var attrElements = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrElements.length; j++) {
      var aEl = attrElements[j];
      var spec = aEl.getAttribute('data-i18n-attr');
      var pairs = spec.split(';');
      for (var k = 0; k < pairs.length; k++) {
        var pair = pairs[k].split(':');
        if (pair.length === 2) {
          var attrName = pair[0].trim();
          var attrKey = pair[1].trim();
          if (t[attrKey] !== undefined) {
            aEl.setAttribute(attrName, t[attrKey]);
          }
        }
      }
    }

    // Update page title and meta tags
    if (t.page_title) document.title = t.page_title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t.meta_desc) metaDesc.setAttribute('content', t.meta_desc);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && t.og_title) ogTitle.setAttribute('content', t.og_title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && t.og_desc) ogDesc.setAttribute('content', t.og_desc);

    // Update switcher buttons UI
    var switchBtns = document.querySelectorAll('.lang-switch__btn');
    for (var s = 0; s < switchBtns.length; s++) {
      var sBtn = switchBtns[s];
      var btnLang = sBtn.getAttribute('data-lang-btn');
      var isActive = (btnLang === selectedLang);
      sBtn.classList.toggle('is-active', isActive);
      sBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    // Save preference
    try {
      localStorage.setItem('cellhub_lang', selectedLang);
    } catch (e) {}

    // Optionally update URL search param if user triggered it
    if (updateUrl && window.history && window.history.replaceState) {
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('lang', selectedLang);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

    // Push tracking event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'language_change',
        language: selectedLang
      });
    }
  }

  function getInitialLanguage() {
    try {
      var params = new URLSearchParams(window.location.search);
      var urlLang = params.get('lang');
      if (urlLang === 'ru' || urlLang === 'en') return urlLang;
      if (window.location.hash === '#ru') return 'ru';
      if (window.location.hash === '#en') return 'en';
      var stored = localStorage.getItem('cellhub_lang');
      if (stored === 'ru' || stored === 'en') return stored;
    } catch (e) {}
    return 'en';
  }

  // Hook up language toggle click handler
  var languageButtons = document.querySelectorAll('[data-lang-btn]');
  for (var b = 0; b < languageButtons.length; b++) {
    languageButtons[b].addEventListener('click', function () {
      setLanguage(this.getAttribute('data-lang-btn'), true);
    });
  }

  // Apply initial language if Russian or a stored preference
  var initialLang = getInitialLanguage();
  if (initialLang === 'ru') {
    setLanguage('ru', false);
  } else {
    setLanguage('en', false);
  }

  // Keep the floating shortcut out of the way while the form is on screen.
  var estimateShortcut = document.querySelector('.estimate-fab');
  var estimateCard = document.querySelector('.quote-card');
  if (estimateShortcut && estimateCard && 'IntersectionObserver' in window) {
    var estimateObserver = new IntersectionObserver(function (entries) {
      estimateShortcut.hidden = entries[0].isIntersecting;
    });
    estimateObserver.observe(estimateCard);
  }

  /* ---------- Free Quote Form Submission ---------- */
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var currentLang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
      var t = TRANSLATIONS[currentLang];

      var submitBtn = document.getElementById('quote-submit-btn');
      var statusEl = document.getElementById('quote-status');
      var btnTextEl = submitBtn ? submitBtn.querySelector('.btn__text') : null;

      var nameInput = document.getElementById('q-name');
      var phoneInput = document.getElementById('q-phone');
      var deviceInput = document.getElementById('q-device');
      var serviceSelect = document.getElementById('q-service');
      var detailsInput = document.getElementById('q-details');

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var phoneVal = phoneInput ? phoneInput.value.trim() : '';
      var deviceVal = deviceInput ? deviceInput.value.trim() : '';
      var serviceVal = serviceSelect ? serviceSelect.value : '';
      var detailsVal = detailsInput ? detailsInput.value.trim() : '';

      // Validation
      var phoneDigits = phoneVal.replace(/\D/g, '');
      if (!nameVal || !deviceVal || phoneDigits.length < 7) {
        if (statusEl) {
          statusEl.className = 'form-status is-error';
          statusEl.innerHTML = t.status_error_validation;
          statusEl.style.display = 'block';
        }
        if (!nameVal && nameInput) nameInput.focus();
        else if (phoneDigits.length < 7 && phoneInput) phoneInput.focus();
        else if (!deviceVal && deviceInput) deviceInput.focus();
        return;
      }

      // Set Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }
      if (btnTextEl) btnTextEl.textContent = t.status_sending;
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';
      }

      var hpInput = document.getElementById('q-site');
      var hpVal = hpInput ? hpInput.value.trim() : '';
      if (hpVal) {
        if (statusEl) {
          statusEl.className = 'form-status is-success';
          statusEl.innerHTML = t.status_success;
          statusEl.style.display = 'block';
        }
        quoteForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
        if (btnTextEl) btnTextEl.textContent = t.btn_submit_quote;
        return;
      }

      var payload = {
        _subject: 'SecureFix booking',
        _captcha: 'false'
      };
      var formData = new FormData(quoteForm);
      formData.forEach(function (value, key) {
        if (key === '_hp_site' || key.charAt(0) === '_') return;
        payload[key] = typeof value === 'string' ? value : String(value);
      });
      payload._subject = 'SecureFix booking';
      payload._captcha = 'false';

      fetch('https://formsubmit.co/ajax/repair@securefix.uk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        var data = result.data || {};
        var accepted = result.ok && String(data.success) === 'true';
        if (!accepted) {
          if (statusEl) {
            statusEl.className = 'form-status is-error';
            statusEl.innerHTML = t.status_error_server;
            statusEl.style.display = 'block';
          }
          if (window.console) console.warn('[Quote Request Failed]', data);
          return;
        }
        if (statusEl) {
          statusEl.className = 'form-status is-success';
          statusEl.innerHTML = t.status_success;
          statusEl.style.display = 'block';
        }
        quoteForm.reset();

        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'quote_form_submit',
            device_model: deviceVal,
            service_type: serviceVal
          });
        }
      })
      .catch(function (err) {
        if (statusEl) {
          statusEl.className = 'form-status is-error';
          statusEl.innerHTML = t.status_error_server;
          statusEl.style.display = 'block';
        }
        if (window.console) console.warn('[Quote Request Failed]', err);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
        if (btnTextEl) btnTextEl.textContent = t.btn_submit_quote;
      });
    });
  }
})();

