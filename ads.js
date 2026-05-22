// ملف ads.js - الهيكلة المستقلة لإدارة الإعلانات
const adsManager = {
    // التحقق واش اللاعب ديجا شرا إزالة الإعلانات
    isPremium: localStorage.getItem('adsRemoved') === 'true',

    init: function() {
        if (this.isPremium) {
            this.removeAdsUI();
            console.log('✅ اللاعب لديه نسخة بدون إعلانات');
        } else {
            this.loadAds();
        }
        this.setupButtons();
    },

    loadAds: function() {
        // 🚧 هنا سيتم وضع كود شبكة الإعلانات (AdMob) لاحقاً بعد التحويل
        console.log('📢 جاري تحميل الإعلانات...');
    },

    removeAdsUI: function() {
        // إخفاء زر "إزالة الإعلانات" من شاشة الإعدادات حيت اللاعب ديجا شراه
        const removeBtn = document.getElementById('remove-ads-btn');
        if (removeBtn) {
            removeBtn.style.display = 'none';
        }
    },

    purchaseRemoveAds: function() {
        // محاكاة عملية الشراء (مستقبلاً ستربط مع نظام الدفع ديال جوجل)
        localStorage.setItem('adsRemoved', 'true');
        this.isPremium = true;
        this.removeAdsUI();
        alert('🎉 تم إزالة الإعلانات بنجاح! شكراً لدعمك.');
        // هنا غنزيدو كود إخفاء البانر ديال الإعلانات مستقبلاً
    },

    setupButtons: function() {
        const removeBtn = document.getElementById('remove-ads-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.purchaseRemoveAds();
            });
        }
    }
};

// تشغيل نظام الإعلانات بمجرد ما تحمل الصفحة
window.addEventListener('load', () => {
    adsManager.init();
});
