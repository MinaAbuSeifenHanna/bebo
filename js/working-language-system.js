// working-language-system.js - Complete working language switching system
// Now uses Firebase Firestore data instead of static data.js

let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Main function to update window.allServices based on current language from Firebase
function updateAllServices() {
  // Use Firebase data instead of static data
  let sourceData = window.allServices || [];

  if (!sourceData || sourceData.length === 0) {
    console.warn('⚠️ No Firebase services data available for language update');
    return;
  }

  console.log(`🌐 Updating ${sourceData.length} services to language: ${currentLanguage}`);

  // Update services with current language translations
  window.allServices = sourceData.map(service => {
    // Clone service
    const translated = { ...service };

    // Select specific language for Title (handle both string and object formats)
    if (typeof service.title === 'object' && service.title[currentLanguage]) {
      translated.title = service.title[currentLanguage];
    } else if (typeof service.title === 'object' && service.title['en']) {
      translated.title = service.title['en'];
    } else {
      translated.title = service.title || 'Service';
    }

    // Select specific language for Time (handle both string and object formats)
    if (typeof service.time === 'object' && service.time[currentLanguage]) {
      translated.time = service.time[currentLanguage];
    } else if (typeof service.time === 'object' && service.time['en']) {
      translated.time = service.time['en'];
    } else {
      translated.time = service.time || '';
    }

    // Select specific language for Details (handle nested object structure)
    if (typeof service.details === 'object' && service.details[currentLanguage]) {
      translated.details = service.details[currentLanguage];
    } else if (typeof service.details === 'object' && service.details['en']) {
      translated.details = service.details['en'];
    } else {
      translated.details = service.details || {};
    }

    return translated;
  });

  console.log(`✅ Updated ${window.allServices.length} services for language: ${currentLanguage}`);

  // Re-render services if UI is ready
  if (typeof renderAllSections === 'function') {
    renderAllSections();
  }
}

// Get UI Text (labels)
function getUIText(key) {
  const uiTranslations = {
    'en': {
      'home': 'Home',
      'salon': 'Salon',
      'gallery': 'Gallery',
      'allServices': 'All Services',
      'packages': 'Packages',
      'massages': 'Massages',
      'hammam': 'Hammam',
      'scrub': 'Body Scrubs',
      'viewDetails': 'View Details',
      'addToCart': 'Add to Cart',
      'welcome': 'Welcome to World Spa & Beauty',
      'homeDescription': 'Experience luxury spa treatments in heart of Hurghada',
      'contactInfo': 'Contact Information',
      'cart': 'Cart',
      'checkout': 'Checkout',
      'total': 'Total',
      'name': 'Name',
      'date': 'Date',
      'time': 'Time',
      'confirmBooking': 'Confirm Booking',
      'bookingSuccess': 'Booking Confirmed!',
      'successMessage': 'Thank you! Your appointment has been booked via WhatsApp.',
      'close': 'Close',
      'selectLanguage': 'Select Language'
    },
    'ar': {
      'home': 'الرئيسية',
      'salon': 'الصالون',
      'gallery': 'المعرض',
      'allServices': 'كل الخدمات',
      'packages': 'الباقات',
      'massages': 'جلسات المساج',
      'hammam': 'الحمام المغربي والتركي',
      'scrub': 'ماسكات وتقشير الجسم',
      'viewDetails': 'عرض التفاصيل',
      'addToCart': 'أضف للسلة',
      'welcome': 'مرحباً بكم في عالم السبا والجمال',
      'homeDescription': 'استمتعي بأفضل علاجات السبا الفاخرة في قلب الغردقة',
      'contactInfo': 'معلومات التواصل',
      'cart': 'السلة',
      'checkout': 'إتمام الحجز',
      'total': 'المجموع',
      'name': 'الاسم',
      'date': 'التاريخ',
      'time': 'الوقت',
      'confirmBooking': 'تأكيد الحجز',
      'bookingSuccess': 'تم تأكيد الحجز!',
      'successMessage': 'شكراً لك! تم إرسال تفاصيل حجزك عبر واتساب.',
      'close': 'إغلاق',
      'selectLanguage': 'اختر اللغة'
    },
    'de': {
      'home': 'Startseite',
      'allServices': 'Alle Dienstleistungen',
      'packages': 'Pakete',
      'massages': 'Massagen',
      'hammam': 'Hammam',
      'scrub': 'Körperpeelings',
      'viewDetails': 'Details anzeigen',
      'addToCart': 'In den Warenkorb',
      'welcome': 'Willkommen bei World Spa & Beauty',
      'homeDescription': 'Erleben Sie luxuriöse Spa-Behandlungen im Herzen von Hurghada',
      'contactInfo': 'Kontaktinformationen',
      'cart': 'Warenkorb',
      'checkout': 'Kasse',
      'total': 'Gesamt',
      'name': 'Name',
      'date': 'Datum',
      'time': 'Zeit',
      'confirmBooking': 'Buchung bestätigen',
      'bookingSuccess': 'Buchung bestätigt!',
      'successMessage': 'Danke! Ihr Termin wurde über WhatsApp gebucht.',
      'close': 'Schließen',
      'selectLanguage': 'Sprache auswählen'
    },
    'fr': {
      'home': 'Accueil',
      'allServices': 'Tous les services',
      'packages': 'Forfaits',
      'massages': 'Massages',
      'hammam': 'Hammam',
      'scrub': 'Gommages corporels',
      'viewDetails': 'Voir les détails',
      'addToCart': 'Ajouter au panier',
      'welcome': 'Bienvenue au World Spa & Beauty',
      'homeDescription': 'Découvrez des soins spa de luxe au cœur d\'Hurghada',
      'contactInfo': 'Coordonnées',
      'cart': 'Panier',
      'checkout': 'Paiement',
      'total': 'Total',
      'name': 'Nom',
      'date': 'Date',
      'time': 'Temps',
      'confirmBooking': 'Confirmer la réservation',
      'bookingSuccess': 'Réservation confirmée !',
      'successMessage': 'Merci ! Votre rendez-vous a été réservé via WhatsApp.',
      'close': 'Fermer',
      'selectLanguage': 'Choisir la langue'
    },
    'ru': {
      'home': 'Главная',
      'allServices': 'Все услуги',
      'packages': 'Пакеты',
      'massages': 'Массажи',
      'hammam': 'Хамам',
      'scrub': 'Скрабы для тела',
      'viewDetails': 'Подробнее',
      'addToCart': 'В корзину',
      'welcome': 'Добро пожаловать в World Spa & Beauty',
      'homeDescription': 'Насладитесь роскошными спа-процедурами в центре Хургады',
      'contactInfo': 'Контактная информация',
      'cart': 'Корзина',
      'checkout': 'Оформить',
      'total': 'Итого',
      'name': 'Имя',
      'date': 'Дата',
      'time': 'Время',
      'confirmBooking': 'Подтвердить бронирование',
      'bookingSuccess': 'Бронирование подтверждено!',
      'successMessage': 'Спасибо! Ваша встреча забронирована через WhatsApp.',
      'close': 'Закрыть',
      'selectLanguage': 'Выбрать язык'
    },
    'it': {
      'home': 'Home',
      'allServices': 'Tutti i servizi',
      'packages': 'Pacchetti',
      'massages': 'Massaggi',
      'hammam': 'Hammam',
      'scrub': 'Scrub corpo',
      'viewDetails': 'Vedi dettagli',
      'addToCart': 'Aggiungi al carrello',
      'welcome': 'Benvenuti al World Spa & Beauty',
      'homeDescription': 'Scopri trattamenti spa di lusso nel cuore di Hurghada',
      'contactInfo': 'Informazioni di contatto',
      'cart': 'Carrello',
      'checkout': 'Cassa',
      'total': 'Totale',
      'name': 'Nome',
      'date': 'Data',
      'time': 'Ora',
      'confirmBooking': 'Conferma prenotazione',
      'bookingSuccess': 'Prenotazione confermata!',
      'successMessage': 'Grazie! Il tuo appuntamento è stato prenotato tramite WhatsApp.',
      'close': 'Chiudi',
      'selectLanguage': 'Seleziona lingua'
    },
    'hu': {
      'scrub': 'Testradírok',
      'viewDetails': 'Részletek megtekintése',
      'addToCart': 'Kosárba tesz',
      'welcome': 'Üdvözöljük a World Spa & Beauty-ban',
      'homeDescription': 'Élje át a luxus spa kezeléseket Hurghada szívében',
      'contactInfo': 'Kapcsolat',
      'cart': 'Kosár',
      'checkout': 'Pénztár',
      'total': 'Összesen',
      'name': 'Név',
      'date': 'Dátum',
      'time': 'Idő',
      'confirmBooking': 'Foglalás megerősítése',
      'bookingSuccess': 'Foglalás megerősítve!',
      'successMessage': 'Köszönjük! Időpontját a WhatsApp-on keresztül foglaltuk le.',
      'close': 'Bezár',
      'selectLanguage': 'Válassz nyelvet'
    },
    'hr': {
      'home': 'Početna',
      'allServices': 'Sve usluge',
      'packages': 'Paketi',
      'massages': 'Masaže',
      'hammam': 'Hammam',
      'scrub': 'Piling tijela',
      'viewDetails': 'Vidi detalje',
      'addToCart': 'Dodaj u košaricu',
      'welcome': 'Dobrodošli u World Spa & Beauty',
      'homeDescription': 'Doživite luksuzne spa tretmane u srcu Hurghade',
      'contactInfo': 'Kontakt',
      'cart': 'Košarica',
      'checkout': 'Blagajna',
      'total': 'Ukupno',
      'name': 'Ime',
      'date': 'Datum',
      'time': 'Vrijeme',
      'confirmBooking': 'Potvrdi rezervaciju',
      'bookingSuccess': 'Rezervacija potvrđena!',
      'successMessage': 'Hvala! Vaš termin je rezerviran putem WhatsAppa.',
      'close': 'Zatvori',
      'selectLanguage': 'Odaberi jezik'
    },
    'es': {
      'home': 'Inicio',
      'allServices': 'Todos los servicios',
      'packages': 'Paquetes',
      'massages': 'Masajes',
      'hammam': 'Hammam',
      'scrub': 'Exfoliantes corporales',
      'viewDetails': 'Ver detalles',
      'addToCart': 'Añadir al carrito',
      'welcome': 'Bienvenido a World Spa & Beauty',
      'homeDescription': 'Experimente tratamientos de spa de lujo en el corazón de Hurghada',
      'contactInfo': 'Información de contacto',
      'cart': 'Carrito',
      'checkout': 'Pagar',
      'total': 'Total',
      'name': 'Nombre',
      'date': 'Fecha',
      'time': 'Hora',
      'confirmBooking': 'Confirmar reserva',
      'bookingSuccess': '¡Reserva confirmada!',
      'successMessage': '¡Gracias! Su cita ha sido reservada a través de WhatsApp.',
      'close': 'Cerrar',
      'selectLanguage': 'Seleccionar idioma'
    },
    'cs': {
      'home': 'Domů',
      'allServices': 'Všechny služby',
      'packages': 'Balíčky',
      'massages': 'Masáže',
      'hammam': 'Hammam',
      'scrub': 'Tělové peelingy',
      'viewDetails': 'Zobrazit podrobnosti',
      'addToCart': 'Přidat do košíku',
      'welcome': 'Vítejte ve World Spa & Beauty',
      'homeDescription': 'Zažijte luxusní lázeňské procedury v srdci Hurghady',
      'contactInfo': 'Kontaktní informace',
      'cart': 'Košík',
      'checkout': 'Pokladna',
      'total': 'Celkem',
      'name': 'Jméno',
      'date': 'Datum',
      'time': 'Čas',
      'confirmBooking': 'Potvrdit rezervaci',
      'bookingSuccess': 'Rezervace potvrzena!',
      'successMessage': 'Děkujeme! Váš termín byl rezervován přes WhatsApp.',
      'close': 'Zavřít',
      'selectLanguage': 'Vybrat jazyk'
    },
    'lv': {
      'home': 'Sākums',
      'allServices': 'Visi pakalpojumi',
      'packages': 'Pakešu piedāvājumi',
      'massages': 'Masāžas',
      'hammam': 'Hammam',
      'scrub': 'Ķermeņa skrubji',
      'viewDetails': 'Skatīt informāciju',
      'addToCart': 'Pievienot grozam',
      'welcome': 'Laipni lūdzam World Spa & Beauty',
      'homeDescription': 'Izbaudiet luksusa spa procedūras Hurgadas centrā',
      'contactInfo': 'Kontaktinformācija',
      'cart': 'Grozs',
      'checkout': 'Noformēt',
      'total': 'Kopā',
      'name': 'Vārds',
      'date': 'Datums',
      'time': 'Laiks',
      'confirmBooking': 'Apstiprināt rezervāciju',
      'bookingSuccess': 'Rezervācija apstiprināta!',
      'successMessage': 'Paldies! Jūsu tikšanās ir rezervēta caur WhatsApp.',
      'close': 'Aizvērt',
      'selectLanguage': 'Izvēlēties valodu'
    },
    'zh': {
      'home': '主页',
      'allServices': '所有服务',
      'packages': '套餐',
      'massages': '按摩',
      'hammam': '土耳其浴',
      'scrub': '身体磨砂',
      'viewDetails': '查看详情',
      'addToCart': '加入购物车',
      'welcome': '欢迎来到 World Spa & Beauty',
      'homeDescription': '在赫尔格达中心体验豪华水疗',
      'contactInfo': '联系信息',
      'cart': '购物车',
      'checkout': '结账',
      'total': '总计',
      'name': '姓名',
      'date': '日期',
      'time': '时间',
      'confirmBooking': '确认预订',
      'bookingSuccess': '预订已确认！',
      'successMessage': '谢谢！您的预约已通过 WhatsApp 预订。',
      'close': '关闭',
      'selectLanguage': '选择语言'
    }
  };

  const ui = uiTranslations[currentLanguage] || uiTranslations['en'];
  return ui[key] || uiTranslations['en'][key] || key;
}

// Switch Language
function switchLanguage(lang) {
  console.log(`Switching language to: ${lang}`);
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);

  // Update services data
  updateAllServices();

  // Update UI text
  updateAllUIText();

  // Re-render all sections
  if (typeof renderAllSections === 'function') {
    renderAllSections();
  } else if (typeof renderCategory === 'function') {
    // Fallback to current rendering logic
    renderCategory('all');
  }

  // Update dropdown button text
  updateLanguageDropdown();

  // Set HTML lang attribute
  document.documentElement.lang = lang;

  // RTL for Arabic
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
  }

  // Close dropdown if open (bootstrap handles this usually)
  return false;
}

// View Service Details
function viewDetails(serviceId) {
  // Use window.allServices which is now the source of truth
  const service = window.allServices.find(s => s.id === serviceId);

  if (!service) return;

  // Elements
  const modal = new bootstrap.Modal(document.getElementById('serviceDetailsModal'));
  const title = document.getElementById('modalServiceTitle');
  const image = document.getElementById('modalServiceImage');
  const time = document.getElementById('modalServiceTime');
  const price = document.getElementById('modalServicePrice');
  const priceOriginal = document.getElementById('modalServicePriceOriginal');
  const detailsList = document.getElementById('modalServiceDetails');
  const addToCartBtn = document.getElementById('modalAddToCartBtn');

  // Set Content
  title.textContent = service.title;
  image.src = service.image;
  image.alt = service.title;
  time.textContent = service.time;
  price.textContent = service.after_disc || service.salary;

  if (service.after_disc && service.salary !== service.after_disc) {
    priceOriginal.textContent = service.salary;
    priceOriginal.classList.remove('d-none');
  } else {
    priceOriginal.textContent = '';
    priceOriginal.classList.add('d-none');
  }

  // Clear and populate details
  detailsList.innerHTML = '';
  if (service.details) {
    Object.entries(service.details).forEach(([key, value]) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center';

      // Handle nested object structure 
      let detailText = value;
      if (typeof value === 'object') {
        const subKey = Object.keys(value)[0];
        const subVal = value[subKey];
        detailText = `${subKey}: ${subVal}`;
      }

      li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i> ${detailText}`;
      detailsList.appendChild(li);
    });
  }

  // Setup Add to Cart button
  addToCartBtn.onclick = () => {
    addToCart(service.id);
    modal.hide();
  };

  addToCartBtn.textContent = getUIText('addToCart');
  modal.show();
}

// Update all UI text elements
function updateAllUIText() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getUIText(key);
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}

// Update language dropdown button
function updateLanguageDropdown() {
  const dropdown = document.getElementById('languageDropdownBtn');
  if (dropdown) {
    dropdown.textContent = `🌍 ${getLanguageName(currentLanguage)}`;
  }
}

// Get language display name
function getLanguageName(code) {
  const names = {
    en: 'English', ar: 'العربية', de: 'Deutsch', fr: 'Français',
    ru: 'Русский', it: 'Italiano', hu: 'Magyar', hr: 'Hrvatski',
    es: 'Español', cs: 'Čeština', lv: 'Latviešu', zh: '中文'
  };
  return names[code] || code.toUpperCase();
}

// Initialize language system (called from main.js)
function initializeLanguageSystem() {
  updateAllServices();
  updateAllUIText();
  updateLanguageDropdown();

  if (currentLanguage === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
  }
}
