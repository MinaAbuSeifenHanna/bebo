// working-language-system.js - Complete working language switching system
// Now uses Firebase Firestore data instead of static data.js

let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Main function to update window.allServices based on current language from Firebase
// Main function to update window.allServices based on current language from Firebase
function updateAllServices() {
  // Use raw data as source to prevent translation pollution
  let sourceData = window.rawServices && window.rawServices.length > 0
    ? window.rawServices
    : (window.allServices || []);

  if (!sourceData || sourceData.length === 0) {
    console.warn('⚠️ No services data available for language update');
    return;
  }

  console.log(`🌐 Updating ${sourceData.length} services to language: ${currentLanguage}`);

  // Update services with current language translations
  const updatedServices = sourceData.map(service => {
    // Clone service
    const translated = { ...service };

    // Get translations for current language, fallback to English
    const translation = (service.translations && service.translations[currentLanguage])
      ? service.translations[currentLanguage]
      : (service.translations && service.translations['en'] ? service.translations['en'] : {});

    // Update Title
    if (translation.title) {
      translated.title = translation.title;
    }

    // Update Details
    if (translation.details) {
      translated.details = translation.details;
    }

    return translated;
  });

  // Force Numerical Sort (1-27)
  updatedServices.sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));

  window.allServices = updatedServices;

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
      'openHours': 'We open all week from 10:00 AM to 11:00 PM',
      'recommendedServices': 'Recommended Services',
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
      'selectLanguage': 'Select Language',
      'backToServices': 'Back to Services',
      'completeBooking': 'Complete Your Booking',
      'phone': 'Phone Number',
      'preferredTime': 'Preferred Time',
      'askTransport': 'Ask for transportation rate?',
      'residencePlace': 'Residence Place',
      'roomNumber': 'Room Number',
      'specialNotes': 'Any special notes?',
      'proceedBooking': 'Proceed to Booking',
      'yourSelection': 'Your Selection',
      'bookingTotal': 'Booking Total',
      'bookNow': 'Book Now',
      'duration': 'Duration',
      'price': 'Price'
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
      'bookNow': 'احجز الآن',
      'welcome': 'مرحباً بكم في عالم السبا والجمال',
      'homeDescription': 'استمتعي بأفضل علاجات السبا الفاخرة في قلب الغردقة',
      'openHours': 'نعمل طوال أيام الأسبوع من 10:00 صباحاً حتى 11:00 مساءً',
      'recommendedServices': 'خدمات مختارة',
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
      'selectLanguage': 'اختر اللغة',
      'backToServices': 'العودة للخدمات',
      'completeBooking': 'إكمال الحجز',
      'phone': 'رقم الهاتف',
      'preferredTime': 'وقت الموعد المفضل',
      'askTransport': 'هل تود طلب توصيل؟',
      'residencePlace': 'مكان الإقامة (فندق / منطقة)',
      'roomNumber': 'رقم الغرفة',
      'specialNotes': 'ملاحظات خاصة؟',
      'proceedBooking': 'متابعة الحجز',
      'yourSelection': 'اختياراتك',
      'bookingTotal': 'إجمالي الحجز',
      'duration': 'المدة',
      'price': 'السعر'
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
    },
    'tr': {
      'home': 'Ana Sayfa',
      'allServices': 'Tüm Hizmetler',
      'packages': 'Paketler',
      'massages': 'Masajlar',
      'hammam': 'Hamam',
      'scrub': 'Vücut Peelingi',
      'viewDetails': 'Detayları Gör',
      'addToCart': 'Sepete Ekle',
      'welcome': 'World Spa & Beauty\'ye Hoşgeldiniz',
      'homeDescription': 'Hurghada\'nın kalbinde lüks spa deneyimi',
      'contactInfo': 'İletişim Bilgileri',
      'cart': 'Sepet',
      'checkout': 'Ödeme',
      'total': 'Toplam',
      'name': 'İsim',
      'date': 'Tarih',
      'time': 'Saat',
      'confirmBooking': 'Rezervasyonu Onayla',
      'bookingSuccess': 'Rezervasyon Onaylandı!',
      'successMessage': 'Teşekkürler! Randevunuz WhatsApp üzerinden alındı.',
      'close': 'Kapat',
      'selectLanguage': 'Dil Seçin'
    },
    'pl': {
      'home': 'Strona główna',
      'allServices': 'Wszystkie usługi',
      'packages': 'Pakiety',
      'massages': 'Masaże',
      'hammam': 'Hammam',
      'scrub': 'Peeling ciała',
      'viewDetails': 'Zobacz szczegóły',
      'addToCart': 'Dodaj do koszyka',
      'welcome': 'Witamy w World Spa & Beauty',
      'homeDescription': 'Poczuj luksusowe zabiegi spa w sercu Hurghady',
      'contactInfo': 'Informacje kontaktowe',
      'cart': 'Koszyk',
      'checkout': 'Kasa',
      'total': 'Suma',
      'name': 'Imię',
      'date': 'Data',
      'time': 'Godzina',
      'confirmBooking': 'Potwierdź rezerwację',
      'bookingSuccess': 'Rezerwacja potwierdzona!',
      'successMessage': 'Dziękujemy! Twoja wizyta została zarezerwowana przez WhatsApp.',
      'close': 'Zamknij',
      'selectLanguage': 'Wybierz język'
    },
    'et': {
      'home': 'Avaleht',
      'allServices': 'Kõik teenused',
      'packages': 'Paketid',
      'massages': 'Massaažid',
      'hammam': 'Hammam',
      'scrub': 'Kehakoorijad',
      'viewDetails': 'Vaata lähemalt',
      'addToCart': 'Lisa ostukorvi',
      'welcome': 'Tere tulemast World Spa & Beauty-sse',
      'homeDescription': 'Kogege luksuslikke spaateenuseid Hurghada südames',
      'contactInfo': 'Kontaktinfo',
      'cart': 'Ostukorv',
      'checkout': 'Maksma',
      'total': 'Kokku',
      'name': 'Nimi',
      'date': 'Kuupäev',
      'time': 'Aeg',
      'confirmBooking': 'Kinnita broneering',
      'bookingSuccess': 'Broneering kinnitatud!',
      'successMessage': 'Aitäh! Teie aeg on broneeritud WhatsAppi kaudu.',
      'close': 'Sulge',
      'selectLanguage': 'Vali keel'
    },
    'sr': {
      'home': 'Početna',
      'allServices': 'Sve usluge',
      'packages': 'Paketi',
      'massages': 'Masaže',
      'hammam': 'Hamam',
      'scrub': 'Piling tela',
      'viewDetails': 'Pogledaj detalje',
      'addToCart': 'Dodaj u korpu',
      'welcome': 'Dobrodošli u World Spa & Beauty',
      'homeDescription': 'Doživite luksuzne spa tretmane u srcu Hurgade',
      'contactInfo': 'Kontakt informacije',
      'cart': 'Korpa',
      'checkout': 'Kasa',
      'total': 'Ukupno',
      'name': 'Ime',
      'date': 'Datum',
      'time': 'Vreme',
      'confirmBooking': 'Potvrdi rezervaciju',
      'bookingSuccess': 'Rezervacija potvrđena!',
      'successMessage': 'Hvala! Vaš termin je rezervisan putem WhatsApp-a.',
      'close': 'Zatvori',
      'selectLanguage': 'Izaberi jezik'
    },
    'tr': {
      'home': 'Ana Sayfa',
      'allServices': 'Tüm Hizmetler',
      'packages': 'Paketler',
      'massages': 'Masajlar',
      'hammam': 'Hamam',
      'scrub': 'Vücut Peelingi',
      'viewDetails': 'Detayları Gör',
      'addToCart': 'Sepete Ekle',
      'welcome': 'World Spa & Beauty\'ye Hoşgeldiniz',
      'homeDescription': 'Hurghada\'nın kalbinde lüks spa deneyimi',
      'contactInfo': 'İletişim Bilgileri',
      'cart': 'Sepet',
      'checkout': 'Ödeme',
      'total': 'Toplam',
      'name': 'İsim',
      'date': 'Tarih',
      'time': 'Saat',
      'confirmBooking': 'Rezervasyonu Onayla',
      'bookingSuccess': 'Rezervasyon Onaylandı!',
      'successMessage': 'Teşekkürler! Randevunuz WhatsApp üzerinden alındı.',
      'close': 'Kapat',
      'selectLanguage': 'Dil Seçin'
    },
    'pl': {
      'home': 'Strona główna',
      'allServices': 'Wszystkie usługi',
      'packages': 'Pakiety',
      'massages': 'Masaże',
      'hammam': 'Hammam',
      'scrub': 'Peeling ciała',
      'viewDetails': 'Zobacz szczegóły',
      'addToCart': 'Dodaj do koszyka',
      'welcome': 'Witamy w World Spa & Beauty',
      'homeDescription': 'Poczuj luksusowe zabiegi spa w sercu Hurghady',
      'contactInfo': 'Informacje kontaktowe',
      'cart': 'Koszyk',
      'checkout': 'Kasa',
      'total': 'Suma',
      'name': 'Imię',
      'date': 'Data',
      'time': 'Godzina',
      'confirmBooking': 'Potwierdź rezerwację',
      'bookingSuccess': 'Rezerwacja potwierdzona!',
      'successMessage': 'Dziękujemy! Twoja wizyta została zarezerwowana przez WhatsApp.',
      'close': 'Zamknij',
      'selectLanguage': 'Wybierz język'
    },
    'et': {
      'home': 'Avaleht',
      'allServices': 'Kõik teenused',
      'packages': 'Paketid',
      'massages': 'Massaažid',
      'hammam': 'Hammam',
      'scrub': 'Kehakoorijad',
      'viewDetails': 'Vaata lähemalt',
      'addToCart': 'Lisa ostukorvi',
      'welcome': 'Tere tulemast World Spa & Beauty-sse',
      'homeDescription': 'Kogege luksuslikke spaateenuseid Hurghada südames',
      'contactInfo': 'Kontaktinfo',
      'cart': 'Ostukorv',
      'checkout': 'Maksma',
      'total': 'Kokku',
      'name': 'Nimi',
      'date': 'Kuupäev',
      'time': 'Aeg',
      'confirmBooking': 'Kinnita broneering',
      'bookingSuccess': 'Broneering kinnitatud!',
      'successMessage': 'Aitäh! Teie aeg on broneeritud WhatsAppi kaudu.',
      'close': 'Sulge',
      'selectLanguage': 'Vali keel'
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

  // Price Logic (New Schema)
  const priceInfo = service.price_info || {};
  const currency = priceInfo.currency || '€';
  const salary = priceInfo.salary;
  const afterDisc = priceInfo.after_disc;

  // If after_disc exists, show it as main price. If salary differs, show salary as original.
  // If no after_disc, use salary.
  const mainPrice = afterDisc !== undefined ? afterDisc : salary;

  price.textContent = `${currency}${mainPrice}`;

  if (salary !== undefined && afterDisc !== undefined && salary > afterDisc) {
    priceOriginal.textContent = `${currency}${salary}`;
    priceOriginal.classList.remove('d-none');
  } else {
    priceOriginal.textContent = '';
    priceOriginal.classList.add('d-none');
  }

  // Clear and populate details
  // Service.details should be the object { "1": "...", "2": "..." } already selected by updateAllServices
  detailsList.innerHTML = '';
  if (service.details && typeof service.details === 'object') {
    Object.values(service.details).forEach(value => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center';

      // Value is expected to be a string
      li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i> ${value}`;
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
    es: 'Español', cs: 'Čeština', lv: 'Latviešu', zh: '中文',
    tr: 'Türkçe', pl: 'Polski', et: 'Eesti', sr: 'Srpski'
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
