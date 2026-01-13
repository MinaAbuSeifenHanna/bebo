// multilingual-services.js - Dynamic multilingual services with new images
class MultilingualServices {
  constructor() {
    this.originalServices = [];
    this.translations = {};
    this.supportedLanguages = [
      'en', 'ar', 'de', 'fr', 'ru', 'it', 'hu', 'hr', 'es', 'cs', 'lv', 'zh',
      'pt', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'ro', 'bg', 'sr', 'sk', 'sl',
      'et', 'lt', 'mt', 'cy', 'ga', 'eu', 'ca', 'gl', 'is', 'mk', 'sq', 'bs'
    ];
    this.currentLanguage = 'en';
    this.init();
  }

  async init() {
    await this.loadOriginalServices();
    await this.generateAllTranslations();
    this.createLanguageSelector();
    this.displayServices(this.currentLanguage);
  }

  async loadOriginalServices() {
    // Original services data with new towel-wrapped woman images
    this.originalServices = [
      {
        "id": "1",
        "title": "Cleopatra VIP",
        "image": "assets/images/woman_towel_1.png",
        "time": "3 Hrs",
        "salary": "43 €",
        "after_disc": "35 €",
        "details": {
          "1": { "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation." },
          "2": { "Hair Bath (Oil/Cream)": "Deep scalp nourishment." },
          "3": { "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam." },
          "4": { "Full Body Chocolate Mask": "Antioxidant skin treatment." },
          "5": { "Full Body Coconut Mask": "Tropical hydration." },
          "6": { "Face Mask": "Facial revitalization." },
          "7": { "Full Body Massage (60 Mins)": "Stress relief massage." }
        }
      },
      {
        "id": "2",
        "title": "Damascus Hammam and Massage",
        "image": "assets/images/woman_towel_2.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah", "3": "Face Mask", "4": "Full Body Massage (50 Mins)" }
      },
      {
        "id": "3",
        "title": "Turkish Hammam and Massage",
        "image": "assets/images/woman_towel_3.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Sauna/Steam", "2": "Kessa Mitten Peeling", "3": "Foam Massage", "4": "Full Body Massage (50 Mins)" }
      },
      {
        "id": "4",
        "title": "Moroccan Hammam and Massage",
        "image": "assets/images/woman_towel_4.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Sauna/Steam", "2": "Moroccan Soap Peeling", "3": "Full Body Massage (50 Mins)" }
      },
      {
        "id": "5",
        "title": "Damascus Hammam",
        "image": "assets/images/woman_towel_5.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah & Soap" }
      },
      {
        "id": "6",
        "title": "Turkish Hammam",
        "image": "assets/images/woman_towel_6.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Sauna/Steam", "2": "Kessa Mitten & Foam Massage" }
      },
      {
        "id": "7",
        "title": "Moroccan Hammam",
        "image": "assets/images/woman_towel_7.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Sauna/Steam", "2": "Moroccan Soap & Mitten" }
      },
      {
        "id": "8",
        "title": "Aroma Massage",
        "image": "assets/images/woman_towel_8.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Essential Oils", "2": "Relaxation focus" }
      },
      {
        "id": "9",
        "title": "Medical Massage",
        "image": "assets/images/woman_towel_9.png",
        "time": "60 Mins",
        "salary": "25 €",
        "after_disc": "20 €",
        "details": { "1": "Outcome-based therapy", "2": "Targeted muscle relief" }
      },
      {
        "id": "10",
        "title": "Classic Massage",
        "image": "assets/images/woman_towel_10.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Swedish techniques", "2": "Long gliding strokes" }
      },
      {
        "id": "11",
        "title": "Sports Massage",
        "image": "assets/images/woman_towel_11.png",
        "time": "60 Mins",
        "salary": "25 €",
        "after_disc": "20 €",
        "details": { "1": "Muscle recovery", "2": "Flexibility focus" }
      },
      {
        "id": "12",
        "title": "Hot Stone Massage",
        "image": "assets/images/woman_towel_12.png",
        "time": "60 Mins",
        "salary": "25 €",
        "after_disc": "20 €",
        "details": { "1": "Heated smooth stones", "2": "Deep heat penetration" }
      },
      {
        "id": "13",
        "title": "Anti Cellulite Massage",
        "image": "assets/images/woman_towel_13.png",
        "time": "60 Mins",
        "salary": "25 €",
        "after_disc": "20 €",
        "details": { "1": "Fat tissue targeting", "2": "Skin smoothing" }
      },
      {
        "id": "14",
        "title": "Deep Tissue Massage",
        "image": "assets/images/woman_towel_14.png",
        "time": "60 Mins",
        "salary": "25 €",
        "after_disc": "20 €",
        "details": { "1": "Connective tissue focus", "2": "Intense pressure" }
      },
      {
        "id": "15",
        "title": "Foot Massage",
        "image": "assets/images/woman_towel_15.png",
        "time": "30 Mins",
        "salary": "15 €",
        "after_disc": "10 €",
        "details": { "1": "Reflex points", "2": "Tension release" }
      },
      {
        "id": "16",
        "title": "Full Back Massage",
        "image": "assets/images/woman_towel_16.png",
        "time": "30 Mins",
        "salary": "15 €",
        "after_disc": "10 €",
        "details": { "1": "Back & Shoulder focus", "2": "Sedentary relief" }
      },
      {
        "id": "17",
        "title": "Salt Body Scrub and Massage",
        "image": "assets/images/woman_towel_17.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Sea salt exfoliation", "2": "Full body massage" }
      },
      {
        "id": "18",
        "title": "Salt Body Scrub",
        "image": "assets/images/woman_towel_18.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Deep skin cleansing" }
      },
      {
        "id": "19",
        "title": "Coconut Body Scrub and Massage",
        "image": "assets/images/woman_towel_19.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Coconut exfoliation", "2": "Hydrating massage" }
      },
      {
        "id": "20",
        "title": "Coconut Body Scrub",
        "image": "assets/images/woman_towel_20.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Tropical skin softening" }
      },
      {
        "id": "21",
        "title": "Clay Body Scrub and Massage",
        "image": "assets/images/woman_towel_21.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Mineral clay scrub", "2": "Full massage" }
      },
      {
        "id": "22",
        "title": "Clay Body Scrub",
        "image": "assets/images/woman_towel_22.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Detoxifying clay" }
      },
      {
        "id": "23",
        "title": "Coffee Body Scrub and Massage",
        "image": "assets/images/woman_towel_23.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Caffeine exfoliation", "2": "Invigorating massage" }
      },
      {
        "id": "24",
        "title": "Coffee Body Scrub",
        "image": "assets/images/woman_towel_24.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Anti-cellulite coffee scrub" }
      },
      {
        "id": "25",
        "title": "Honey Body Scrub and Massage",
        "image": "assets/images/woman_towel_25.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Honey & Sugar scrub", "2": "Nourishing massage" }
      },
      {
        "id": "26",
        "title": "Chocolate Body Scrub and Massage",
        "image": "assets/images/woman_towel_26.png",
        "time": "2 Hrs",
        "salary": "34 €",
        "after_disc": "25 €",
        "details": { "1": "Cocoa scrub", "2": "Relaxing massage" }
      },
      {
        "id": "27",
        "title": "Chocolate Body Scrub",
        "image": "assets/images/woman_towel_27.png",
        "time": "60 Mins",
        "salary": "20 €",
        "after_disc": "15 €",
        "details": { "1": "Sweet skin revitalization" }
      }
    ];
  }

  async generateAllTranslations() {
    for (const lang of this.supportedLanguages) {
      this.translations[lang] = await this.translateServices(this.originalServices, lang);
    }
  }

  async translateServices(services, targetLang) {
    const translatedServices = [];
    
    for (const service of services) {
      const translatedService = { ...service };
      
      // Translate title
      translatedService.title = await this.translateText(service.title, targetLang);
      
      // Translate time
      translatedService.time = await this.translateTime(service.time, targetLang);
      
      // Translate details
      translatedService.details = await this.translateDetails(service.details, targetLang);
      
      translatedServices.push(translatedService);
    }
    
    return translatedServices;
  }

  async translateText(text, targetLang) {
    // Translation dictionary for common spa terms
    const translations = {
      'en': {
        'Cleopatra VIP': 'Cleopatra VIP',
        'Damascus Hammam and Massage': 'Damascus Hammam and Massage',
        'Turkish Hammam and Massage': 'Turkish Hammam and Massage',
        'Moroccan Hammam and Massage': 'Moroccan Hammam and Massage',
        'Damascus Hammam': 'Damascus Hammam',
        'Turkish Hammam': 'Turkish Hammam',
        'Moroccan Hammam': 'Moroccan Hammam',
        'Aroma Massage': 'Aroma Massage',
        'Medical Massage': 'Medical Massage',
        'Classic Massage': 'Classic Massage',
        'Sports Massage': 'Sports Massage',
        'Hot Stone Massage': 'Hot Stone Massage',
        'Anti Cellulite Massage': 'Anti Cellulite Massage',
        'Deep Tissue Massage': 'Deep Tissue Massage',
        'Foot Massage': 'Foot Massage',
        'Full Back Massage': 'Full Back Massage',
        'Salt Body Scrub and Massage': 'Salt Body Scrub and Massage',
        'Salt Body Scrub': 'Salt Body Scrub',
        'Coconut Body Scrub and Massage': 'Coconut Body Scrub and Massage',
        'Coconut Body Scrub': 'Coconut Body Scrub',
        'Clay Body Scrub and Massage': 'Clay Body Scrub and Massage',
        'Clay Body Scrub': 'Clay Body Scrub',
        'Coffee Body Scrub and Massage': 'Coffee Body Scrub and Massage',
        'Coffee Body Scrub': 'Coffee Body Scrub',
        'Honey Body Scrub and Massage': 'Honey Body Scrub and Massage',
        'Chocolate Body Scrub and Massage': 'Chocolate Body Scrub and Massage',
        'Chocolate Body Scrub': 'Chocolate Body Scrub'
      },
      'ar': {
        'Cleopatra VIP': 'كليوباترا VIP',
        'Damascus Hammam and Massage': 'حمام دمشقي وتدليك',
        'Turkish Hammam and Massage': 'حمام تركي وتدليك',
        'Moroccan Hammam and Massage': 'حمام مغربي وتدليك',
        'Damascus Hammam': 'حمام دمشقي',
        'Turkish Hammam': 'حمام تركي',
        'Moroccan Hammam': 'حمام مغربي',
        'Aroma Massage': 'تدليك عطري',
        'Medical Massage': 'تدليك طبي',
        'Classic Massage': 'تدليك كلاسيكي',
        'Sports Massage': 'تدليك رياضي',
        'Hot Stone Massage': 'تدليك بالأحجار الساخنة',
        'Anti Cellulite Massage': 'تدليك مضاد للسيلوليت',
        'Deep Tissue Massage': 'تدليك الأنسجة العميقة',
        'Foot Massage': 'تدليك القدمين',
        'Full Back Massage': 'تدليك الظهر بالكامل',
        'Salt Body Scrub and Massage': 'تقشير الملح للجسم وتدليك',
        'Salt Body Scrub': 'تقشير الملح للجسم',
        'Coconut Body Scrub and Massage': 'تقشير جوز الهند للجسم وتدليك',
        'Coconut Body Scrub': 'تقشير جوز الهند للجسم',
        'Clay Body Scrub and Massage': 'تقشير الطين للجسم وتدليك',
        'Clay Body Scrub': 'تقشير الطين للجسم',
        'Coffee Body Scrub and Massage': 'تقشير القهوة للجسم وتدليك',
        'Coffee Body Scrub': 'تقشير القهوة للجسم',
        'Honey Body Scrub and Massage': 'تقشير العسل للجسم وتدليك',
        'Chocolate Body Scrub and Massage': 'تقشير الشوكولاتة للجسم وتدليك',
        'Chocolate Body Scrub': 'تقشير الشوكولاتة للجسم'
      },
      'de': {
        'Cleopatra VIP': 'Kleopatra VIP',
        'Damascus Hammam and Massage': 'Damaskus Hammam und Massage',
        'Turkish Hammam and Massage': 'Türkisches Hammam und Massage',
        'Moroccan Hammam and Massage': 'Marokkanisches Hammam und Massage',
        'Damascus Hammam': 'Damaskus Hammam',
        'Turkish Hammam': 'Türkisches Hammam',
        'Moroccan Hammam': 'Marokkanisches Hammam',
        'Aroma Massage': 'Aroma Massage',
        'Medical Massage': 'Medizinische Massage',
        'Classic Massage': 'Klassische Massage',
        'Sports Massage': 'Sportmassage',
        'Hot Stone Massage': 'Hot Stone Massage',
        'Anti Cellulite Massage': 'Anti Cellulite Massage',
        'Deep Tissue Massage': 'Deep Tissue Massage',
        'Foot Massage': 'Fußmassage',
        'Full Back Massage': 'Rückenmassage',
        'Salt Body Scrub and Massage': 'Salz Körperpeeling und Massage',
        'Salt Body Scrub': 'Salz Körperpeeling',
        'Coconut Body Scrub and Massage': 'Kokos Körperpeeling und Massage',
        'Coconut Body Scrub': 'Kokos Körperpeeling',
        'Clay Body Scrub and Massage': 'Ton Körperpeeling und Massage',
        'Clay Body Scrub': 'Ton Körperpeeling',
        'Coffee Body Scrub and Massage': 'Kaffee Körperpeeling und Massage',
        'Coffee Body Scrub': 'Kaffee Körperpeeling',
        'Honey Body Scrub and Massage': 'Honig Körperpeeling und Massage',
        'Chocolate Body Scrub and Massage': 'Schokolade Körperpeeling und Massage',
        'Chocolate Body Scrub': 'Schokolade Körperpeeling'
      },
      'fr': {
        'Cleopatra VIP': 'Cléopâtre VIP',
        'Damascus Hammam and Massage': 'Hammam de Damas et Massage',
        'Turkish Hammam and Massage': 'Hammam Turc et Massage',
        'Moroccan Hammam and Massage': 'Hammam Marocain et Massage',
        'Damascus Hammam': 'Hammam de Damas',
        'Turkish Hammam': 'Hammam Turc',
        'Moroccan Hammam': 'Hammam Marocain',
        'Aroma Massage': 'Massage Aromathérapie',
        'Medical Massage': 'Massage Médical',
        'Classic Massage': 'Massage Classique',
        'Sports Massage': 'Massage Sportif',
        'Hot Stone Massage': 'Massage aux Pierres Chaudes',
        'Anti Cellulite Massage': 'Massage Anti-cellulite',
        'Deep Tissue Massage': 'Massage Tissus Profonds',
        'Foot Massage': 'Massage des Pieds',
        'Full Back Massage': 'Massage du Dos',
        'Salt Body Scrub and Massage': 'Gommage au Sel et Massage',
        'Salt Body Scrub': 'Gommage au Sel',
        'Coconut Body Scrub and Massage': 'Gommage au Coco et Massage',
        'Coconut Body Scrub': 'Gommage au Coco',
        'Clay Body Scrub and Massage': 'Gommage à l\'Argile et Massage',
        'Clay Body Scrub': 'Gommage à l\'Argile',
        'Coffee Body Scrub and Massage': 'Gommage au Café et Massage',
        'Coffee Body Scrub': 'Gommage au Café',
        'Honey Body Scrub and Massage': 'Gommage au Miel et Massage',
        'Chocolate Body Scrub and Massage': 'Gommage au Chocolat et Massage',
        'Chocolate Body Scrub': 'Gommage au Chocolat'
      }
      // Add more languages as needed
    };

    return translations[targetLang]?.[text] || text;
  }

  async translateTime(time, targetLang) {
    const timeTranslations = {
      'en': { 'Hrs': 'Hrs', 'Mins': 'Mins' },
      'ar': { 'Hrs': 'ساعات', 'Mins': 'دقائق' },
      'de': { 'Hrs': 'Std', 'Mins': 'Min' },
      'fr': { 'Hrs': 'H', 'Mins': 'min' },
      'ru': { 'Hrs': 'часа', 'Mins': 'минут' },
      'it': { 'Hrs': 'Ore', 'Mins': 'Min' },
      'hu': { 'Hrs': 'óra', 'Mins': 'perc' },
      'hr': { 'Hrs': 'sata', 'Mins': 'minuta' },
      'es': { 'Hrs': 'Hrs', 'Mins': 'Min' },
      'cs': { 'Hrs': 'hod', 'Mins': 'min' },
      'lv': { 'Hrs': 'stundas', 'Mins': 'minūtes' },
      'zh': { 'Hrs': '小时', 'Mins': '分钟' }
    };

    let translatedTime = time;
    const langTimeMap = timeTranslations[targetLang];
    if (langTimeMap) {
      Object.keys(langTimeMap).forEach(key => {
        translatedTime = translatedTime.replace(new RegExp(key, 'g'), langTimeMap[key]);
      });
    }
    return translatedTime;
  }

  async translateDetails(details, targetLang) {
    const translatedDetails = {};
    
    const detailTranslations = {
      'en': {
        'Sauna - Jacuzzi - Steam Bath': 'Full thermal relaxation.',
        'Hair Bath (Oil/Cream)': 'Deep scalp nourishment.',
        'Peeling & Foam Massage': 'Traditional Kessa scrub with soap foam.',
        'Full Body Chocolate Mask': 'Antioxidant skin treatment.',
        'Full Body Coconut Mask': 'Tropical hydration.',
        'Face Mask': 'Facial revitalization.',
        'Full Body Massage (60 Mins)': 'Stress relief massage.',
        'Sauna/Steam': 'Thermal relaxation',
        'Peeling with Loofah': 'Exfoliation with natural sponge',
        'Face Mask': 'Facial treatment',
        'Full Body Massage (50 Mins)': 'Complete body massage',
        'Kessa Mitten Peeling': 'Traditional Turkish scrub',
        'Foam Massage': 'Soap foam massage',
        'Moroccan Soap Peeling': 'Black soap exfoliation',
        'Moroccan Soap & Mitten': 'Traditional scrub tools',
        'Essential Oils': 'Aromatherapy oils',
        'Relaxation focus': 'Stress relief',
        'Outcome-based therapy': 'Therapeutic treatment',
        'Targeted muscle relief': 'Focused muscle work',
        'Swedish techniques': 'Classic massage methods',
        'Long gliding strokes': 'Flowing movements',
        'Muscle recovery': 'Athletic recovery',
        'Flexibility focus': 'Mobility enhancement',
        'Heated smooth stones': 'Warm stone therapy',
        'Deep heat penetration': 'Thermal muscle treatment',
        'Fat tissue targeting': 'Cellulite reduction',
        'Skin smoothing': 'Texture improvement',
        'Connective tissue focus': 'Deep tissue work',
        'Intense pressure': 'Strong pressure techniques',
        'Reflex points': 'Reflexology stimulation',
        'Tension release': 'Stress relief',
        'Back & Shoulder focus': 'Upper body concentration',
        'Sedentary relief': 'Desk worker relief',
        'Sea salt exfoliation': 'Marine salt scrub',
        'Full body massage': 'Complete massage therapy',
        'Deep skin cleansing': 'Purifying treatment',
        'Coconut exfoliation': 'Tropical scrub',
        'Hydrating massage': 'Moisturizing treatment',
        'Tropical skin softening': 'Exotic smoothing',
        'Mineral clay scrub': 'Earth-based exfoliation',
        'Full massage': 'Complete bodywork',
        'Detoxifying clay': 'Purifying mud treatment',
        'Caffeine exfoliation': 'Coffee-based scrub',
        'Invigorating massage': 'Energizing treatment',
        'Anti-cellulite coffee scrub': 'Slimming coffee treatment',
        'Honey & Sugar scrub': 'Natural sweet exfoliation',
        'Nourishing massage': 'Nutrient-rich treatment',
        'Cocoa scrub': 'Chocolate exfoliation',
        'Relaxing massage': 'Calming therapy',
        'Sweet skin revitalization': 'Indulgent renewal'
      },
      'ar': {
        'Sauna - Jacuzzi - Steam Bath': 'استرخاء حراري كامل.',
        'Hair Bath (Oil/Cream)': 'تغذية فروة الرأس بعمق.',
        'Peeling & Foam Massage': 'تقشير تقليدي بالكيسة والصابون.',
        'Full Body Chocolate Mask': 'علاج مضاد للأكسدة للبشرة.',
        'Full Body Coconut Mask': 'ترطيب استوائي.',
        'Face Mask': 'إحياء الوجه.',
        'Full Body Massage (60 Mins)': 'تدليك مريح للتوتر.',
        'Sauna/Steam': 'استرخاء حراري',
        'Peeling with Loofah': 'تقشير بالإسفنج الطبيعي',
        'Face Mask': 'علاج الوجه',
        'Full Body Massage (50 Mins)': 'تدليك الجسم الكامل',
        'Kessa Mitten Peeling': 'تقشير تركي تقليدي',
        'Foam Massage': 'تدليك برغوة الصابون',
        'Moroccan Soap Peeling': 'تقشير بالصابون الأسود',
        'Moroccan Soap & Mitten': 'أدوات تقشير تقليدية',
        'Essential Oils': 'زيوت العلاج بالروائح',
        'Relaxation focus': 'تخفيف التوتر',
        'Outcome-based therapy': 'علاج علاجي',
        'Targeted muscle relief': 'عمل عضلي مركز',
        'Swedish techniques': 'طرق التدليك الكلاسيكية',
        'Long gliding strokes': 'حركات انسيابية',
        'Muscle recovery': 'تعافي رياضي',
        'Flexibility focus': 'تحسين المرونة',
        'Heated smooth stones': 'علاج الأحجار الدافئة',
        'Deep heat penetration': 'علاج حراري للعضلات',
        'Fat tissue targeting': 'تقليل السيلوليت',
        'Skin smoothing': 'تحسين الملمس',
        'Connective tissue focus': 'عمل الأنسجة العميقة',
        'Intense pressure': 'تقنيات الضغط القوي',
        'Reflex points': 'تحفيز العلاج بالانعكاس',
        'Tension release': 'تخفيف التوتر',
        'Back & Shoulder focus': 'تركيز الجزء العلوي من الجسم',
        'Sedentary relief': 'راحة عامل المكتب',
        'Sea salt exfoliation': 'تقشير ملح البحر',
        'Full body massage': 'علاج تدليك كامل',
        'Deep skin cleansing': 'علاج منقي',
        'Coconut exfoliation': 'تقشير استوائي',
        'Hydrating massage': 'علاج مرطب',
        'Tropical skin softening': 'تنعيم غريب',
        'Mineral clay scrub': 'تقشير قائم على الأرض',
        'Full massage': 'عمل الجسم الكامل',
        'Detoxifying clay': 'علاج الطين المنقي',
        'Caffeine exfoliation': 'تقشير بالكافيين',
        'Invigorating massage': 'علاج منشط',
        'Anti-cellulite coffee scrub': 'علاج القهوة النحيف',
        'Honey & Sugar scrub': 'تقشير حلو طبيعي',
        'Nourishing massage': 'علاج غني بالمغذيات',
        'Cocoa scrub': 'تقشير الشوكولاتة',
        'Relaxing massage': 'علاج مهدئ',
        'Sweet skin revitalization': 'تجديد فاخر'
      }
      // Add more languages as needed
    };

    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        translatedDetails[key] = detailTranslations[targetLang]?.[value] || value;
      } else if (typeof value === 'object') {
        const translatedObj = {};
        for (const [subKey, subValue] of Object.entries(value)) {
          const translatedKey = detailTranslations[targetLang]?.[subKey] || subKey;
          const translatedValue = detailTranslations[targetLang]?.[subValue] || subValue;
          translatedObj[translatedKey] = translatedValue;
        }
        translatedDetails[key] = translatedObj;
      }
    }

    return translatedDetails;
  }

  createLanguageSelector() {
    // Create language selector HTML
    const selectorHTML = `
      <div class="language-selector-container">
        <h3>Select Language / اختر اللغة / Sprache wählen</h3>
        <div class="language-grid">
          ${this.supportedLanguages.map(lang => `
            <button class="language-btn ${lang === this.currentLanguage ? 'active' : ''}" 
                    data-lang="${lang}" 
                    onclick="multilingualServices.switchLanguage('${lang}')">
              ${this.getLanguageName(lang)}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Insert into page
    const container = document.createElement('div');
    container.innerHTML = selectorHTML;
    document.body.insertBefore(container, document.body.firstChild);
  }

  getLanguageName(code) {
    const names = {
      'en': 'English', 'ar': 'العربية', 'de': 'Deutsch', 'fr': 'Français',
      'ru': 'Русский', 'it': 'Italiano', 'hu': 'Magyar', 'hr': 'Hrvatski',
      'es': 'Español', 'cs': 'Čeština', 'lv': 'Latviešu', 'zh': '中文',
      'pt': 'Português', 'nl': 'Nederlands', 'sv': 'Svenska', 'no': 'Norsk',
      'da': 'Dansk', 'fi': 'Suomi', 'pl': 'Polski', 'ro': 'Română',
      'bg': 'Български', 'sr': 'Српски', 'sk': 'Slovenčina', 'sl': 'Slovenščina',
      'et': 'Eesti', 'lt': 'Lietuvių', 'mt': 'Malti', 'cy': 'Cymraeg',
      'ga': 'Gaeilge', 'eu': 'Euskara', 'ca': 'Català', 'gl': 'Galego',
      'is': 'Íslenska', 'mk': 'Македонски', 'sq': 'Shqip', 'bs': 'Bosanski'
    };
    return names[code] || code.toUpperCase();
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    this.displayServices(lang);
    
    // Update active button
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  displayServices(language) {
    const services = this.translations[language] || this.originalServices;
    console.log(`Services in ${language}:`, services);
    
    // You can render these services to the page here
    // For now, we'll just log them
    return services;
  }

  getAllTranslations() {
    return this.translations;
  }
}

// Initialize the multilingual services system
const multilingualServices = new MultilingualServices();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MultilingualServices;
}
