// migrate-to-firestore.js - Script to migrate services data to Firestore
// Run this script once to populate your Firestore database

// Import Firebase functions (same as firebase-config.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC_JeNjLiTvVrIL-9XERpGigWmaYbnZB0",
  authDomain: "world-spa-c1e6e.firebaseapp.com",
  projectId: "world-spa-c1e6e",
  storageBucket: "world-spa-c1e6e.firebasestorage.app",
  messagingSenderId: "939154414480",
  appId: "1:939154414480:web:268a7add29eaa8b8ee3115",
  measurementId: "G-QV6W5DFCP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Services data from your existing data.js file
const servicesData = [
  {
    "id": "1",
    "image": "assets/images/1.webp",
    "salary": "43 €",
    "after_disc": "35 €",
    "title": {
      "en": "Cleopatra VIP",
      "ar": "كليوباترا VIP",
      "de": "Kleopatra VIP",
      "fr": "Cléopâtre VIP",
      "ru": "Cleopatra VIP",
      "it": "Cleopatra VIP",
      "hu": "Cleopatra VIP",
      "hr": "Cleopatra VIP",
      "es": "Cleopatra VIP",
      "cs": "Cleopatra VIP",
      "lv": "Cleopatra VIP",
      "zh": "Cleopatra VIP"
    },
    "time": {
      "en": "3 Hrs",
      "ar": "3 ساعات",
      "de": "3 Std",
      "fr": "3 H",
      "ru": "3 часа",
      "it": "3 Ore",
      "hu": "3 óra",
      "hr": "3 sata",
      "es": "3 Hrs",
      "cs": "3 hod",
      "lv": "3 stundas",
      "zh": "3 小时"
    },
    "details": {
      "en": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "ar": {
        "1": {
          "استرخاء حراري كامل.": "Full thermal relaxation."
        },
        "2": {
          "تغذية فروة الرأس بعمق.": "تغذية فروة الرأس بعمق."
        },
        "3": {
          "تقشير تقليدي بالكيسة والصابون.": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "علاج مضاد للأكسدة للبشرة.": "Antioxidant skin treatment."
        },
        "5": {
          "ترطيب استوائي.": "Tropical hydration."
        },
        "6": {
          "إحياء الوجه.": "Facial revitalization."
        },
        "7": {
          "تدليك مريح للتوتر.": "Stress relief massage."
        }
      },
      "de": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "fr": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "ru": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "it": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "hu": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "hr": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "es": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "cs": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "lv": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      },
      "zh": {
        "1": {
          "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation."
        },
        "2": {
          "Hair Bath (Oil/Cream)": "Deep scalp nourishment."
        },
        "3": {
          "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam."
        },
        "4": {
          "Full Body Chocolate Mask": "Antioxidant skin treatment."
        },
        "5": {
          "Full Body Coconut Mask": "Tropical hydration."
        },
        "6": {
          "Face Mask": "Facial revitalization."
        },
        "7": {
          "Full Body Massage (60 Mins)": "Stress relief massage."
        }
      }
    },
    "category": "packages"
  }
  // Note: Add all 27 services here - this is just the first one as an example
];

// Migration function
async function migrateServicesToFirestore() {
  console.log('🔥 Starting migration to Firestore...');

  try {
    const servicesCollection = collection(db, 'services');

    for (const service of servicesData) {
      const serviceDoc = doc(servicesCollection, service.id);
      await setDoc(serviceDoc, service);
      console.log(`✅ Migrated service: ${service.title.en} (ID: ${service.id})`);
    }

    console.log('🎉 All services migrated successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

// Run migration
migrateServicesToFirestore();
