const fs = require('fs');

// --- Source Data (Mocking what was in data.js and multilingual-services.js) ---

const originalServices = [
    { "id": "1", "title": "Cleopatra VIP", "image": "assets/images/1.png", "time": "3 Hrs", "salary": "43 €", "after_disc": "35 €", "details": { "1": { "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation." }, "2": { "Hair Bath (Oil/Cream)": "Deep scalp nourishment." }, "3": { "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam." }, "4": { "Full Body Chocolate Mask": "Antioxidant skin treatment." }, "5": { "Full Body Coconut Mask": "Tropical hydration." }, "6": { "Face Mask": "Facial revitalization." }, "7": { "Full Body Massage (60 Mins)": "Stress relief massage." } } },
    { "id": "2", "title": "Damascus Hammam and Massage", "image": "assets/images/2.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah", "3": "Face Mask", "4": "Full Body Massage (50 Mins)" } },
    { "id": "3", "title": "Turkish Hammam and Massage", "image": "assets/images/3.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Kessa Mitten Peeling", "3": "Foam Massage", "4": "Full Body Massage (50 Mins)" } },
    { "id": "4", "title": "Moroccan Hammam and Massage", "image": "assets/images/4.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Moroccan Soap Peeling", "3": "Full Body Massage (50 Mins)" } },
    { "id": "5", "title": "Damascus Hammam", "image": "assets/images/5.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah & Soap" } },
    { "id": "6", "title": "Turkish Hammam", "image": "assets/images/6.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Kessa Mitten & Foam Massage" } },
    { "id": "7", "title": "Moroccan Hammam", "image": "assets/images/7.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Moroccan Soap & Mitten" } },
    { "id": "8", "title": "Aroma Massage", "image": "assets/images/8.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Essential Oils", "2": "Relaxation focus" } },
    { "id": "9", "title": "Medical Massage", "image": "assets/images/9.png", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Outcome-based therapy", "2": "Targeted muscle relief" } },
    { "id": "10", "title": "Classic Massage", "image": "assets/images/10.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Swedish techniques", "2": "Long gliding strokes" } },
    { "id": "11", "title": "Sports Massage", "image": "assets/images/11.png", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Muscle recovery", "2": "Flexibility focus" } },
    { "id": "12", "title": "Hot Stone Massage", "image": "assets/images/12.png", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Heated smooth stones", "2": "Deep heat penetration" } },
    { "id": "13", "title": "Anti Cellulite Massage", "image": "assets/images/13.png", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Fat tissue targeting", "2": "Skin smoothing" } },
    { "id": "14", "title": "Deep Tissue Massage", "image": "assets/images/14.png", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Connective tissue focus", "2": "Intense pressure" } },
    { "id": "15", "title": "Foot Massage", "image": "assets/images/15.png", "time": "30 Mins", "salary": "15 €", "after_disc": "10 €", "details": { "1": "Reflex points", "2": "Tension release" } },
    { "id": "16", "title": "Full Back Massage", "image": "assets/images/16.png", "time": "30 Mins", "salary": "15 €", "after_disc": "10 €", "details": { "1": "Back & Shoulder focus", "2": "Sedentary relief" } },
    { "id": "17", "title": "Salt Body Scrub and Massage", "image": "assets/images/17.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sea salt exfoliation", "2": "Full body massage" } },
    { "id": "18", "title": "Salt Body Scrub", "image": "assets/images/18.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Deep skin cleansing" } },
    { "id": "19", "title": "Coconut Body Scrub and Massage", "image": "assets/images/19.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Coconut exfoliation", "2": "Hydrating massage" } },
    { "id": "20", "title": "Coconut Body Scrub", "image": "assets/images/20.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Tropical skin softening" } },
    { "id": "21", "title": "Clay Body Scrub and Massage", "image": "assets/images/21.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Mineral clay scrub", "2": "Full massage" } },
    { "id": "22", "title": "Clay Body Scrub", "image": "assets/images/22.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Detoxifying clay" } },
    { "id": "23", "title": "Coffee Body Scrub and Massage", "image": "assets/images/23.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Caffeine exfoliation", "2": "Invigorating massage" } },
    { "id": "24", "title": "Coffee Body Scrub", "image": "assets/images/24.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Anti-cellulite coffee scrub" } },
    { "id": "25", "title": "Honey Body Scrub and Massage", "image": "assets/images/25.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Honey & Sugar scrub", "2": "Nourishing massage" } },
    { "id": "26", "title": "Chocolate Body Scrub and Massage", "image": "assets/images/26.png", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Cocoa scrub", "2": "Relaxing massage" } },
    { "id": "27", "title": "Chocolate Body Scrub", "image": "assets/images/27.png", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sweet skin revitalization" } }
];

const titleTranslations = {
    'ar': { 'Cleopatra VIP': 'كليوباترا VIP', 'Damascus Hammam and Massage': 'حمام دمشقي وتدليك', 'Turkish Hammam and Massage': 'حمام تركي وتدليك', 'Moroccan Hammam and Massage': 'حمام مغربي وتدليك', 'Damascus Hammam': 'حمام دمشقي', 'Turkish Hammam': 'حمام تركي', 'Moroccan Hammam': 'حمام مغربي', 'Aroma Massage': 'تدليك عطري', 'Medical Massage': 'تدليك طبي', 'Classic Massage': 'تدليك كلاسيكي', 'Sports Massage': 'تدليك رياضي', 'Hot Stone Massage': 'تدليك بالأحجار الساخنة', 'Anti Cellulite Massage': 'تدليك مضاد للسيلوليت', 'Deep Tissue Massage': 'تدليك الأنسجة العميقة', 'Foot Massage': 'تدليك القدمين', 'Full Back Massage': 'تدليك الظهر بالكامل', 'Salt Body Scrub and Massage': 'تقشير الملح للجسم وتدليك', 'Salt Body Scrub': 'تقشير الملح للجسم', 'Coconut Body Scrub and Massage': 'تقشير جوز الهند للجسم وتدليك', 'Coconut Body Scrub': 'تقشير جوز الهند للجسم', 'Clay Body Scrub and Massage': 'تقشير الطين للجسم وتدليك', 'Clay Body Scrub': 'تقشير الطين للجسم', 'Coffee Body Scrub and Massage': 'تقشير القهوة للجسم وتدليك', 'Coffee Body Scrub': 'تقشير القهوة للجسم', 'Honey Body Scrub and Massage': 'تقشير العسل للجسم وتدليك', 'Chocolate Body Scrub and Massage': 'تقشير الشوكولاتة للجسم وتدليك', 'Chocolate Body Scrub': 'تقشير الشوكولاتة للجسم' },
    'de': { 'Cleopatra VIP': 'Kleopatra VIP', 'Damascus Hammam and Massage': 'Damaskus Hammam und Massage', 'Turkish Hammam and Massage': 'Türkisches Hammam und Massage', 'Moroccan Hammam and Massage': 'Marokkanisches Hammam und Massage', 'Damascus Hammam': 'Damaskus Hammam', 'Turkish Hammam': 'Türkisches Hammam', 'Moroccan Hammam': 'Marokkanisches Hammam', 'Aroma Massage': 'Aroma Massage', 'Medical Massage': 'Medizinische Massage', 'Classic Massage': 'Klassische Massage', 'Sports Massage': 'Sportmassage', 'Hot Stone Massage': 'Hot Stone Massage', 'Anti Cellulite Massage': 'Anti Cellulite Massage', 'Deep Tissue Massage': 'Deep Tissue Massage', 'Foot Massage': 'Fußmassage', 'Full Back Massage': 'Rückenmassage', 'Salt Body Scrub and Massage': 'Salz Körperpeeling und Massage', 'Salt Body Scrub': 'Salz Körperpeeling', 'Coconut Body Scrub and Massage': 'Kokos Körperpeeling und Massage', 'Coconut Body Scrub': 'Kokos Körperpeeling', 'Clay Body Scrub and Massage': 'Ton Körperpeeling und Massage', 'Clay Body Scrub': 'Ton Körperpeeling', 'Coffee Body Scrub and Massage': 'Kaffee Körperpeeling und Massage', 'Coffee Body Scrub': 'Kaffee Körperpeeling', 'Honey Body Scrub and Massage': 'Honig Körperpeeling und Massage', 'Chocolate Body Scrub and Massage': 'Schokolade Körperpeeling und Massage', 'Chocolate Body Scrub': 'Schokolade Körperpeeling' },
    'fr': { 'Cleopatra VIP': 'Cléopâtre VIP', 'Damascus Hammam and Massage': 'Hammam de Damas et Massage', 'Turkish Hammam and Massage': 'Hammam Turc et Massage', 'Moroccan Hammam and Massage': 'Hammam Marocain et Massage', 'Damascus Hammam': 'Hammam de Damas', 'Turkish Hammam': 'Hammam Turc', 'Moroccan Hammam': 'Hammam Marocain', 'Aroma Massage': 'Massage Aromathérapie', 'Medical Massage': 'Massage Médical', 'Classic Massage': 'Massage Classique', 'Sports Massage': 'Massage Sportif', 'Hot Stone Massage': 'Massage aux Pierres Chaudes', 'Anti Cellulite Massage': 'Massage Anti-cellulite', 'Deep Tissue Massage': 'Massage Tissus Profonds', 'Foot Massage': 'Massage des Pieds', 'Full Back Massage': 'Massage du Dos', 'Salt Body Scrub and Massage': 'Gommage au Sel et Massage', 'Salt Body Scrub': 'Gommage au Sel', 'Coconut Body Scrub and Massage': 'Gommage au Coco et Massage', 'Coconut Body Scrub': 'Gommage au Coco', 'Clay Body Scrub and Massage': 'Gommage à l\'Argile et Massage', 'Clay Body Scrub': 'Gommage à l\'Argile', 'Coffee Body Scrub and Massage': 'Gommage au Café et Massage', 'Coffee Body Scrub': 'Gommage au Café', 'Honey Body Scrub and Massage': 'Gommage au Miel et Massage', 'Chocolate Body Scrub and Massage': 'Gommage au Chocolat et Massage', 'Chocolate Body Scrub': 'Gommage au Chocolat' }
};

const detailTranslations = {
    'ar': { 'Sauna - Jacuzzi - Steam Bath': 'استرخاء حراري كامل.', 'Hair Bath (Oil/Cream)': 'تغذية فروة الرأس بعمق.', 'Peeling & Foam Massage': 'تقشير تقليدي بالكيسة والصابون.', 'Full Body Chocolate Mask': 'علاج مضاد للأكسدة للبشرة.', 'Full Body Coconut Mask': 'ترطيب استوائي.', 'Face Mask': 'إحياء الوجه.', 'Full Body Massage (60 Mins)': 'تدليك مريح للتوتر.', 'Sauna/Steam': 'استرخاء حراري', 'Peeling with Loofah': 'تقشير بالإسفنج الطبيعي', 'Full Body Massage (50 Mins)': 'تدليك الجسم الكامل', 'Kessa Mitten Peeling': 'تقشير تركي تقليدي', 'Foam Massage': 'تدليك برغوة الصابون', 'Moroccan Soap Peeling': 'تقشير بالصابون الأسود', 'Moroccan Soap & Mitten': 'أدوات تقشير تقليدية', 'Essential Oils': 'زيوت العلاج بالروائح', 'Relaxation focus': 'تخفيف التوتر', 'Outcome-based therapy': 'علاج علاجي', 'Targeted muscle relief': 'عمل عضلي مركز', 'Swedish techniques': 'طرق التدليك الكلاسيكية', 'Long gliding strokes': 'حركات انسيابية', 'Muscle recovery': 'تعافي رياضي', 'Flexibility focus': 'تحسين المرونة', 'Heated smooth stones': 'علاج الأحجار الدافئة', 'Deep heat penetration': 'علاج حراري للعضلات', 'Fat tissue targeting': 'تقليل السيلوليت', 'Skin smoothing': 'تحسين الملمس', 'Connective tissue focus': 'عمل الأنسجة العميقة', 'Intense pressure': 'تقنيات الضغط القوي', 'Reflex points': 'تحفيز العلاج بالانعكاس', 'Tension release': 'تخفيف التوتر', 'Back & Shoulder focus': 'تركيز الجزء العلوي من الجسم', 'Sedentary relief': 'راحة عامل المكتب', 'Sea salt exfoliation': 'تقشير ملح البحر', 'Full body massage': 'علاج تدليك كامل', 'Deep skin cleansing': 'علاج منقي', 'Coconut exfoliation': 'تقشير استوائي', 'Hydrating massage': 'علاج مرطب', 'Tropical skin softening': 'تنعيم غريب', 'Mineral clay scrub': 'تقشير قائم على الأرض', 'Full massage': 'عمل الجسم الكامل', 'Detoxifying clay': 'علاج الطين المنقي', 'Caffeine exfoliation': 'تقشير بالكافيين', 'Invigorating massage': 'علاج منشط', 'Anti-cellulite coffee scrub': 'علاج القهوة النحيف', 'Honey & Sugar scrub': 'تقشير حلو طبيعي', 'Nourishing massage': 'علاج غني بالمغذيات', 'Cocoa scrub': 'تقشير الشوكولاتة', 'Relaxing massage': 'علاج مهدئ', 'Sweet skin revitalization': 'تجديد فاخر', 'Deep scalp nourishment.': 'تغذية فروة الرأس بعمق.' }
};

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

const supportedLanguages = ['en', 'ar', 'de', 'fr', 'ru', 'it', 'hu', 'hr', 'es', 'cs', 'lv', 'zh'];

// --- Helper Functions ---

function translateTime(time, lang) {
    const dict = timeTranslations[lang] || timeTranslations['en'];
    let translated = time;
    Object.keys(dict).forEach(key => {
        translated = translated.replace(new RegExp(key, 'g'), dict[key]);
    });
    return translated;
}

function translateDetails(details, lang) {
    const dict = detailTranslations[lang] || {}; // Fallback to empty if not found, handling happens below
    const newDetails = {};

    Object.entries(details).forEach(([key, value]) => {
        if (typeof value === 'object') {
            // Deep copy object details
            const newDeep = {};
            Object.entries(value).forEach(([subKey, subVal]) => {
                // Try to translate key and value
                const tKey = dict[subKey] || subKey;
                const tVal = dict[subVal] || subVal;
                // If we are in 'en' or missing translation, it stays English.
                // BUT for de/fr etc, we don't have dictionary. So it stays English (Placeholder)
                newDeep[tKey] = tVal;
            });
            newDetails[key] = newDeep;
        } else {
            newDetails[key] = dict[value] || value;
        }
    });
    return newDetails;
}

// --- Transformations ---

const transformedServices = originalServices.map(service => {
    const finalService = {
        id: service.id,
        image: service.image,
        salary: service.salary,
        after_disc: service.after_disc,
        title: {},
        time: {},
        details: {}
    };

    supportedLanguages.forEach(lang => {
        // 1. Title
        if (lang === 'en') {
            finalService.title[lang] = service.title;
        } else {
            // Lookup in titleTranslations
            const titleDict = titleTranslations[lang];
            finalService.title[lang] = (titleDict && titleDict[service.title]) ? titleDict[service.title] : service.title;
        }

        // 2. Time
        finalService.time[lang] = translateTime(service.time, lang);

        // 3. Details
        // Use helper which knows about 'ar' dictionary. Others default to English.
        // For ID 1, we could potentially inject valid translations if we had them manually, but for now 
        // dictionary approach is safer for consistency unless we parse services-translations.json individually.
        finalService.details[lang] = translateDetails(service.details, lang);
    });

    return finalService;
});

// --- Output ---
// Output formatted JS file content
const fileContent = `// data.js - Deeply Translated Services Data
// Structure: title: { en: "...", ar: "...", ... }

const servicesData = ${JSON.stringify(transformedServices, null, 2)};

// Export as window global for pure JS usage (no module system)
window.servicesData = servicesData;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = servicesData;
}
`;

fs.writeFileSync('js/data.js', fileContent, 'utf8');
console.log('Successfully wrote to js/data.js');
