// admin-dashboard.js - Updated for New Firebase Structure (price_info & translations)

document.addEventListener('DOMContentLoaded', function () {
    const script = document.createElement('script');
    script.src = '../js/firebase-config.js';
    script.onload = function () {
        initializeDashboard();
    };
    document.head.appendChild(script);
});

function initializeDashboard() {
    if (!window.firebaseApp) {
        console.error('Firebase not initialized.');
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    let services = [];
    let currentEditId = null;
    let deleteServiceId = null;

    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login-new.html';
        } else {
            document.getElementById('userEmail').textContent = user.email;
            loadServices();
        }
    });

    function loadServices() {
        showLoading(true);
        db.collection('services').orderBy('id', 'asc').onSnapshot((snapshot) => {
            services = [];
            snapshot.forEach((doc) => {
                services.push({ firestoreId: doc.id, ...doc.data() });
            });
            updateStats();
            renderServices(services);
            showLoading(false);
        });
    }

    function updateStats() {
        document.getElementById('totalServices').textContent = services.length;
        const categories = [...new Set(services.map(s => s.category).filter(Boolean))];
        document.getElementById('totalCategories').textContent = categories.length;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
    }

    // --- تحديث طريقة العرض في الجدول لتناسب الهيكل الجديد ---
    function renderServices(servicesToRender = services) {
        const tbody = document.getElementById('servicesTableBody');
        const emptyState = document.getElementById('emptyState');

        if (servicesToRender.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = servicesToRender.map(service => {
            // سحب البيانات من الهيكل الجديد
            const title = service.translations?.en?.title || service.title || 'No Title';
            const price = service.price_info || {};
            const time = service.time || 'N/A';

            return `
                <tr class="fade-in border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${service.id}</td>
                    <td class="px-6 py-4">
                        <img src="${service.image || '../assets/images/backimage.webp'}" 
                             class="h-12 w-12 rounded shadow-sm object-cover border"
                             onerror="this.src='../assets/images/backimage.webp'">
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${title}</td>
                    <td class="px-6 py-4 text-xs">
                        <span class="px-2 py-1 rounded-full ${getCategoryColor(service.category)}">
                            ${service.category || 'N/A'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <span class="text-gray-400 line-through text-xs">${price.currency || '€'}${price.salary || 0}</span><br>
                        <span class="text-green-600 font-bold">${price.currency || '€'}${price.after_disc || 0}</span>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-500">${time}</td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button onclick="editService('${service.firestoreId}')" class="text-indigo-600 hover:text-indigo-900"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteService('${service.firestoreId}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // --- تحديث دالة التعديل لتعبئة الحقول من الهيكل الجديد ---
    window.editService = function (firestoreId) {
        const service = services.find(s => s.firestoreId === firestoreId);
        if (!service) return;

        currentEditId = firestoreId;
        document.getElementById('modalTitle').textContent = 'Edit Service';

        // الحقول الأساسية
        document.getElementById('serviceId').value = service.id || '';
        document.getElementById('serviceCategory').value = service.category || '';
        document.getElementById('serviceImage').value = service.image || '';

        // حقول السعر (price_info)
        document.getElementById('serviceSalary').value = service.price_info?.salary || '';
        document.getElementById('serviceAfterDisc').value = service.price_info?.after_disc || '';

        // اللغات (Translations)
        // ملاحظة: لو عندك فورم فيه حقول en, ar, ru.. تأكد أن الـ IDs مطابقة
        document.getElementById('titleEn').value = service.translations?.en?.title || '';
        document.getElementById('titleAr').value = service.translations?.ar?.title || '';

        // التفاصيل (Details) - بنعرضها كـ JSON عشان الأدمن يقدر يعدل الخطوات
        if (service.translations?.en?.details) {
            document.getElementById('detailsEn').value = JSON.stringify(service.translations.en.details, null, 2);
        }
        if (service.translations?.ar?.details) {
            document.getElementById('detailsAr').value = JSON.stringify(service.translations.ar.details, null, 2);
        }

        document.getElementById('serviceModal').classList.remove('hidden');
    };

    // --- تحديث الحفظ (Submit) ليرفع الداتا بالهيكل الجديد ---
    document.getElementById('serviceForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        let detailsEn, detailsAr;
        try {
            detailsEn = JSON.parse(document.getElementById('detailsEn').value || '{}');
            detailsAr = JSON.parse(document.getElementById('detailsAr').value || '{}');
        } catch (err) {
            alert('Error in Details JSON format!');
            return;
        }

        // بناء الكائن بالهيكل الجديد تماماً
        const formData = {
            id: document.getElementById('serviceId').value,
            category: document.getElementById('serviceCategory').value,
            image: document.getElementById('serviceImage').value,
            time: document.getElementById('timeEn')?.value || "60 Mins", // حسب المتاح عندك
            price_info: {
                salary: Number(document.getElementById('serviceSalary').value),
                after_disc: Number(document.getElementById('serviceAfterDisc').value),
                currency: "€"
            },
            translations: {
                en: {
                    title: document.getElementById('titleEn').value,
                    details: detailsEn
                },
                ar: {
                    title: document.getElementById('titleAr').value,
                    details: detailsAr
                }
                // يمكنك إضافة باقي اللغات هنا بنفس النمط
            }
        };

        try {
            if (currentEditId) {
                await db.collection('services').doc(currentEditId).update(formData);
            } else {
                await db.collection('services').add(formData);
            }
            closeModal();
            alert('Saved successfully!');
        } catch (error) {
            alert('Error saving: ' + error.message);
        }
    });

    // دالة الألوان للـ Category
    function getCategoryColor(cat) {
        const map = {
            'packages': 'bg-purple-100 text-purple-700',
            'massages': 'bg-blue-100 text-blue-700',
            'hammam': 'bg-teal-100 text-teal-700',
            'scrubs': 'bg-orange-100 text-orange-700'
        };
        return map[cat] || 'bg-gray-100 text-gray-600';
    }

    // باقي الدوال المساعدة (Close, Delete, etc.) تبقي كما هي
    window.closeModal = () => {
        document.getElementById('serviceModal').classList.add('hidden');
        document.getElementById('serviceForm').reset();
        currentEditId = null;
    };

    window.deleteService = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            db.collection('services').doc(id).delete();
        }
    };

    function showLoading(show) {
        const loader = document.getElementById('loadingState');
        if (loader) show ? loader.classList.remove('hidden') : loader.classList.add('hidden');
    }
}