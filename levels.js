// --- ملف levels.js المطور والمصلح بالكامل (40 مستوى بالأسماء) ---

const levels = [
    {
        name: "01. التدريب الأساسي",
        platforms: [{x:0,y:400,w:300,h :140}, {x:400,y: 400,w:560,h :140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) {}
    },
    {
        name: "02. السقف الشائك المخفي",
        platforms: [{x:0,y:400,w:200,h:140}, {x:700,y:400,w:260,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:250,y:-100,w:400,h:50}],
        invisibleBridge: {x:200, y:400, w:500, h:140},
        trap: function(p) { if(p.x > 150 && p.isJumping) this.spikes[0].y = 350; }
    },
    {
        name: "03. البوابة الكاذبة",
        platforms: [{x:0,y:400,w:960,h:140}],
        fakePortal: {x:450,y:340,w:40,h:60},
        portal: {x:850,y:340,w:40,h:60, visible: false},
        spikes: [],
        trap: function(p) { 
            if(p.x+p.w > this.fakePortal.x && p.x < this.fakePortal.x+this.fakePortal.w && p.y+p.h > this.fakePortal.y) die(); 
            if(p.x > 500) this.portal.visible = true; 
        }
    },
    {
        name: "04. المنصة المنهارة والنجاة الهوائية",
        platforms: [{x:0,y:400,w:250,h:140}, {x:350,y:400,w:150,h:140, fall:true}, {x:600,y:400,w:360,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        invisibleBridge: {x:350, y:300, w:150, h:20},
        trap: function(p) { if(p.x > 280 && this.platforms[1].fall) this.platforms[1].y += 10; }
    },
    {
        // المستوى 5 (فخ البوابة العائدة)
        platforms: [
            { x: 0, y: 400, w: 150, h: 140 }, // منصة البداية (حيث ستعود البوابة)
            { x: 250, y: 320, w: 80, h: 20 }, // سلم 1
            { x: 500, y: 240, w: 80, h: 20 }, // سلم 2
            { x: 750, y: 160, w: 80, h: 20 }  // منصة القفزة الأخيرة
        ],
        hiddenBlocks: [
            // منصات خفية في الأسفل تنقذه من الموت ليعود طريق العذاب
            { x: 750, y: 400, w: 200, h: 20, visible: false }, 
            { x: 450, y: 400, w: 100, h: 20, visible: false }, 
            { x: 200, y: 400, w: 100, h: 20, visible: false }  
        ],
        spikes: [],
        portal: { x: 900, y: 100, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            // الخدعة السحرية: بمجرد أن يقفز في الهواء (يتجاوز النقطة 820)
            if (player.x > 820 && this.portal.x === 900) {
                // البوابة تختفي فوراً وتعود فوق منصة البداية!
                this.portal.x = 50;
                this.portal.y = 340;
            }
        }
    },
    {
        name: "06. المسامير المندفعة للخلف",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:900,y:360,w:40,h:40, isMoving: true}],
        trap: function(p) { if(p.x > 250 && this.spikes[0].isMoving) this.spikes[0].x -= 7; }
    },
    {
        // المستوى 7 (فخ الجدار الزاحف)
        platforms: [
            { x: 0, y: 400, w: 300, h: 140 },   // منصة البداية
            { x: 450, y: 400, w: 510, h: 140 }, // منصة البوابة (بينهما حفرة الموت)
            { x: 750, y: 400, w: 40, h: 0 }     // الجدار المخفي الذي سيخرج من الأرض (رقمه 2)
        ],
        hiddenBlocks: [],
        spikes: [],
        portal: { x: 880, y: 340, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            let wall = this.platforms[2];
            
            // 1. بمجرد أن يقترب من البوابة (يتجاوز 600)، يتم تفعيل الفخ
            if (player.x > 600 && !wall.triggered) {
                wall.triggered = true;
            }
            
            if (wall.triggered) {
                // 2. الجدار يخرج من الأرض بسرعة كبيرة
                if (wall.y > 250 && wall.x === 750) {
                    wall.y -= 15;
                    wall.h += 15;
                } 
                // 3. يبدأ الجدار بالزحف نحو اليسار ليدفع اللاعب للحفرة
                else if (wall.x > 300 && wall.y <= 250) {
                    wall.x -= 4.5; // سرعة الدفع (يجب أن يركض اللاعب لينجو)
                } 
                // 4. بمجرد وصوله للحفرة، يسقط فيها ويختفي
                else if (wall.x <= 300) {
                    wall.y += 15;
                }
                
                // --- نظام تصادم أفقي مصغر (لتفعيل الدفع) ---
                // إذا لمس الجدار اللاعب، سيقوم بدفعه للخلف رغماً عنه!
                if (player.x + player.w > wall.x && player.x < wall.x + wall.w && player.y + player.h > wall.y) {
                    player.x = wall.x - player.w; // إجبار اللاعب على التراجع
                }
            }
        }
    },
    {
        name: "08. البوابة الخجولة (دورة الشاشة - فكرة إبراهيم)",
        platforms: [{x:0,y:400,w:960,h:140}], // أرضية متصلة لتركض بحرية
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) { 
            // 1. حركة البوابة: تهرب إن طاردتها، وتأتي إليك إن ابتعدت عنها
            if (keys.right) this.portal.x += 6.5; // أسرع من اللاعب
            if (keys.left) this.portal.x -= 6.5;  // تلحق بك بسرعة

            // 2. دوران البوابة (تدخل من جهة وتخرج من الأخرى)
            if (this.portal.x > 960) this.portal.x = -40;
            if (this.portal.x < -40) this.portal.x = 960;

            // 3. دوران اللاعب (كما طلبت: "وهو أيضا")
            if (p.x > 960) p.x = -24;
            if (p.x < -24) p.x = 960;
        }
    },
    {
        name: "09. قفزة الثقة بالهاوية",
        platforms: [{x:0,y:400,w:200,h:140}, {x:400,y:400,w:560,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:250,y:500,w:100,h:40}],
        invisibleBridge: {x:200, y:450, w:200, h:20},
        trap: function(p) { if(p.x > 180 && p.isJumping) this.spikes[0].y = 300; }
    },
    {
        name: "10. أشواك الوهم والفجوة الغادرة",
        platforms: [
            {x:0,y:400,w:150,h:140}, 
            {x:450,y:400,w:300,h:140}, // أرضية آمنة بعد الأشواك
            {x:750,y:400,w:100,h:140, fall:true}, // الفجوة التي تنهار فجأة
            {x:850,y:400,w:110,h:140}  // أرضية البوابة
        ],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        fakeSpikes: [{x:150,y:360,w:300,h:40}], // الأشواك الوهمية
        invisibleBridge: {x:150, y:400, w:300, h:140}, // جسر العبور الآمن
        trap: function(p) {
            // بمجرد أن يقترب من البوابة، تنهار الأرضية التي أمامه مباشرة!
            if (p.x > 700 && this.platforms[2].fall) {
                this.platforms[2].y += 15;
            }
        }
    },
    {
        name: "11. الهروب للخلف",
        platforms: [{x:-100,y:400,w:1060,h:140}],
        fakePortal: {x:850,y:340,w:40,h:60},
        portal: {x:-50,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) { if(p.x+p.w > this.fakePortal.x && p.x < this.fakePortal.x+this.fakePortal.w && p.y+p.h > this.fakePortal.y) die(); }
    },
    {
        // المستوى 12 (المزيج المرعب: السقف الهابط والأشواك المنبثقة معاً)
        platforms: [
            { x: 0, y: 400, w: 960, h: 140 }, // الأرضية الثابتة
            { x: 0, y: -150, w: 840, h: 200 } // السقف الذي يهبط (يترك مساحة أمان فقط عند البوابة في النهاية)
        ],
        hiddenBlocks: [],
        spikes: [
            // أشواك نائمة داخل الأرض (h=0) تخرج فجأة لتعطيل اللاعب وتأخيره عن السقف
            { x: 320, y: 400, w: 20, h: 0, triggered: false },
            { x: 580, y: 400, w: 20, h: 0, triggered: false }
        ],
        portal: { x: 880, y: 340, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            let ceiling = this.platforms[1]; // تحديد السقف
            
            // 1. بمجرد أن يتحرك اللاعب ويغادر البداية (x > 60)، يبدأ السقف بالهبوط فوراً
            if (player.x > 60 && ceiling.y < 160) {
                ceiling.y += 1.4; // سرعة هبوط السقف (زد الرقم لزيادة الصعوبة وجعل السباق أسرع)
            }
            
            // نظام الاصطدام والسحق: إذا لمس السقف الهابط رأس اللاعب
            if (player.x + player.w > ceiling.x && player.x < ceiling.x + ceiling.w && player.y < ceiling.y + ceiling.h) {
                player.y = 1000; // سحق اللاعب وإعادة المستوى
            }
            
            // 2. فخ الأشواك السفلية: تنبثق للأعلى عند اقتراب اللاعب لتبطئ سرعته
            this.spikes.forEach(s => {
                if (player.x > s.x - 120 && player.x < s.x + 40) {
                    s.triggered = true;
                }
                
                // خروج الشوكة من الأرض بسرعة
                if (s.triggered && s.y > 380) {
                    s.y -= 5; 
                    s.h += 5; 
                }
            });
        }
    },

    {
        name: "13. قاذف الترامبولين الهائل",
        platforms: [{x:0,y:400,w:200,h:140}, {x:350,y:400,w:150,h:140}, {x:750,y:400,w:210,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) { if(p.x > 350 && p.x < 500 && p.y > 360 && p.vy > 0) player.vy = -18; }
    },
    {
        name: "14. الزر الأحمر الخادع",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:400,y:380,w:40,h:20, isButton: true}],
        trap: function(p) { if(p.x+p.w > this.spikes[0].x && p.x < this.spikes[0].x+this.spikes[0].w && p.y+p.h > this.spikes[0].y) { this.spikes.push({x:0,y:0,w:960,h:500}); } }
    },
    {
        name: "15. جاذبية المشتري والسهم السام",
        platforms: [{x:0,y:400,w:200,h:140}, {x:400,y:400,w:560,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x: 960, y: 360, w: 40, h: 40}], // السهم السام ينطلق من خارج الشاشة
        trap: function(p) {
            // بمجرد أن تتقدم قليلاً، ينطلق السهم السام من اليمين لليسار بسرعة!
            if (p.x > 50) {
                this.spikes[0].x -= 8;
            }
        }
    },
    {
        // المستوى 16 (فخ الجدار المنقسم والهروب العكسي)
        platforms: [
            { x: 0, y: 400, w: 750, h: 140 },  // الأرضية الآمنة (اليسرى)
            { x: 750, y: 400, w: 210, h: 140 } // أرضية الفخ (اليمنى التي ستنهار)
        ],
        hiddenBlocks: [],
        spikes: [
            // جدار الأشواك العملاق الملاحق (مقسم لجزأين يتحركان كجسم واحد)
            // الجزء العلوي (مقلوب للأسفل)
            { x: -100, y: 0, w: 80, h: 250, inverted: true },
            // الجزء السفلي (عادي للأعلى)
            { x: -100, y: 250, w: 80, h: 150 }
        ],
        portal: { x: 880, y: 340, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            let trapGround = this.platforms[1];
            let topSpike = this.spikes[0];
            let botSpike = this.spikes[1];
            
            // 1. الأشواك تطارد اللاعب بمجرد أن يتحرك
            if (player.x > 50 && !this.trapTriggered) {
                topSpike.x += 2.8; // سرعة المطاردة
                botSpike.x += 2.8;
            }
            
            // 2. تفعيل الخدعة السينمائية عند الوصول للبوابة
            if (player.x > 750 && !this.trapTriggered) {
                this.trapTriggered = true;
                this.portal.x = 20; // البوابة تهرب للبداية!
            }
            
            // 3. تنفيذ الانهيار والانقسام
            if (this.trapTriggered) {
                // الأرضية اليمنى تنهار وتسقط في الهاوية
                if (trapGround.y < 800) trapGround.y += 8;
                
                // جدار الأشواك يبطئ قليلاً لتتمكن من القفز من خلاله
                topSpike.x += 1;
                botSpike.x += 1;
                
                // الجزء العلوي ينكمش للأعلى
                if (topSpike.h > 120) {
                    topSpike.h -= 5;
                }
                // الجزء السفلي ينزل للأسفل لفتح فجوة النجاة في المنتصف
                if (botSpike.y < 320) {
                    botSpike.y += 5;
                    botSpike.h -= 5; 
                }
            }
        }
    },
    {
        name: "17. المنصة المنشطرة (محرك القفز الموضعي)",
        platforms: [
            {x:0,y:400,w:200,h:140}, 
            {x:300,y:400,w:75,h:140}, // النصف الأيسر من القطعة
            {x:375,y:400,w:75,h:140}, // النصف الأيمن من القطعة
            {x:700,y:400,w:260,h:140} // منصة البوابة
        ],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:200,y:500,w:500,h:40}], // مسامير في القاع للتهديد
        trap: function(p) {
            if(typeof this.split === 'undefined') this.split = false;
            
            // 1. بمجرد أن تصل للمنصة، تنشطر لنصفين
            if (p.x > 280 && p.x < 460) {
                this.split = true;
            }
            
            if (this.split) {
                // النصف الأيسر يرجع للخلف، والنصف الأيمن يتقدم قليلاً لتكوين فجوة
                if (this.platforms[1].x > 220) this.platforms[1].x -= 2;
                if (this.platforms[2].x < 440) this.platforms[2].x += 2;
                
                // 2. الخدعة العبقرية: القفز في المكان يحرك النصف الأيمن لليمين كالقارب!
                // الشرط: اللاعب يقفز (isJumping) + لا يضغط يمين أو يسار + موقعه فوق النصف الأيمن
                if (p.isJumping && !keys.left && !keys.right && p.x > this.platforms[2].x - 24 && p.x < this.platforms[2].x + this.platforms[2].w) {
                    if (this.platforms[2].x < 630) {
                        this.platforms[2].x += 4.5; // تحريك المنصة لليمين
                        p.x += 4.5; // نقل اللاعب مع المنصة في الهواء لكي لا تسقط من تحته (فيزياء القصور الذاتي)
                    }
                }
            }
        }
    },
    {
        name: "18. ثغرة النجاة الارتدادية",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:0,y:-300,w:300,h:300}, {x:340,y:-300,w:620,h:300}],
        trap: function(p) { 
            if(typeof this.timer === 'undefined') this.timer = 0;
            if(p.x > 50 && this.timer === 0) { 
                this.spikes[0].y += 5; this.spikes[1].y += 5; 
                if(this.spikes[0].y >= 100) this.timer = 1; 
            }
            if(this.timer > 0) { 
                this.timer++; 
                if(this.timer > 50) { this.spikes[0].y -= 4; this.spikes[1].y -= 4; } 
            }
        }
    },
    {
        name: "19. البوابة المتهورة والفخ الصغير الأخير",
        platforms: [{x:0, y:400, w:960, h:140}],
        portal: {x:850, y:340, w:40, h:60},
        spikes: [{x:120, y:500, w:20, h:40}], // فخ صغير مخفي تحت الأرض أمام البوابة
        trap: function(p) { 
            // 1. تذهب لليمين، فتهرب البوابة إلى أقصى اليسار
            if(p.x > 600 && this.portal.x === 850) { 
                this.portal.x = 50; 
            }
            
            // 2. وأنت راجع، بمجرد أن تقترب من البوابة (المسافة أقل من 250)، يخرج الفخ فجأة!
            if(this.portal.x === 50 && p.x < 250) {
                if(this.spikes[0].y > 360) {
                    this.spikes[0].y -= 15; // يخرج بسرعة كبيرة من تحت الأرض
                }
            }
        }
    },
    {
        // name: 20 (فخ حافة الهاوية المخفية وقفزة الثقة)
        platforms: [
            { x: 0, y: 400, w: 960, h: 140 }, // الأرضية السفلية الوهمية أو الأساس
            { x: 100, y: 300, w: 80, h: 100 }  // المربع الأسود الذي يقفز منه في البداية
        ],
        
        // 💡 السحر هنا: الجسر المخفي ينتهي بالضبط قبل البوابة بمسافة قفزة (العرض 450 فقط)
        invisibleBridge: { x: 180, y: 300, w: 450, h: 20 }, 
        
        hiddenBlocks: [],
        spikes: [
            // بساط الأشواك الممتد في الأسفل
            { x: 180, y: 380, w: 780, h: 20 } 
        ],
        portal: { x: 800, y: 260, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            // لا نحتاج لكود إضافي هنا، الفيزياء ستتكفل بإسقاطه إذا مشى ولم يقفز في الوقت المناسب!
        }
    },
    {
        name: "21. أمطار السهام المتتابعة (سباق الزمن المطور)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:880,y:340,w:40,h:60},
        spikes: [
            {x:200,y:-150,w:30,h:100}, 
            {x:320,y:-150,w:30,h:100}, 
            {x:440,y:-150,w:30,h:100}, 
            {x:560,y:-150,w:30,h:100}, 
            {x:680,y:-150,w:30,h:100}, 
            {x:800,y:-150,w:30,h:100}
        ],
        trap: function(p) {
            // تم إلغاء العداد الزمني، السهام تسقط فوراً خلفك بمجرد تجاوز موقعها (وليس قبلك!)
            if (p.x > 180) this.spikes[0].y += 22;
            if (p.x > 300) this.spikes[1].y += 22;
            if (p.x > 420) this.spikes[2].y += 22;
            if (p.x > 540) this.spikes[3].y += 22;
            if (p.x > 660) this.spikes[4].y += 22;
            if (p.x > 780) this.spikes[5].y += 22;
        }
    },
    {
        name: "22. هاوية باك مان (اسقط لتظهر في السماء)",
        platforms: [{x:0,y:400,w:200,h:140}, {x:400,y:400,w:100,h:140}],
        portal: {x:430,y:100,w:40,h:60},
        spikes: [],
        trap: function(p) { if(p.y > 520) { p.y = -50; p.x = 420; p.vy = 0; } }
    },
    {
        name: "23. منصات النجاة الطائرة المعلقة",
        platforms: [{x:0,y:400,w:150,h:140}, {x:150,y:400,w:550,h:140, fall:true}, {x:220,y:280,w:50,h:20}, {x:420,y:200,w:50,h:20}, {x:620,y:280,w:50,h:20}, {x:700,y:400,w:260,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) { if(p.x > 140 && this.platforms[1].fall) this.platforms[1].y += 12; }
    },
    {
        name: "24. جدران الإغلاق الجانبية المزدوجة",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:460,y:340,w:40,h:60},
        spikes: [{x:-100,y:0,w:100,h:540}, {x:960,y:0,w:100,h:540}],
        trap: function(p) { this.spikes[0].x += 2; this.spikes[1].x -= 2; }
    },
    {
        name: "25. الجليد المنزلق التلقائي (فخ الأشواك المفاجئة الملتصقة)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        // تم التعديل: الأشواك الثلاثة الجديدة تبدأ مباشرة من نهاية الشوك الأول (440) لتكون ملتصقة تماماً!
        spikes: [
            {x:400, y:360, w:40, h:40}, 
            {x:440, y:1000, w:40, h:40}, 
            {x:480, y:1000, w:40, h:40}, 
            {x:520, y:1000, w:40, h:40}
        ],
        trap: function(p) { 
            // 1. حركة الانزلاق التلقائي على الجليد
            if(!keys.left && !keys.right && p.vy === 0) p.x += 4; 

            // 2. الحيلة: بمجرد أن تقفز وتتجاوز النقطة (x > 380)
            if(p.x > 380) {
                this.spikes[0].y = 1000; // الشوك الأول يختفي فوراً تحت الأرض
                this.spikes[1].y = 360;  // جدار الأشواك الثلاثة يخرج فجأة أمامك مباشرة!
                this.spikes[2].y = 360;
                this.spikes[3].y = 360;
            }
        }
    },
    {
        name: "26. أمطار المسامير اللانهائية (فكرة إبراهيم المطورة)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:880,y:340,w:40,h:60},
        // توزيع السهام في مجموعات مع ترك ممرات أمان فارغة تماماً للمرور (فراغات ثابتة)
        spikes: [
            {x:120, y:-100, w:25, h:70}, {x:160, y:-180, w:25, h:70}, {x:200, y:-260, w:25, h:70},
            // --- ممر النجاة الأول فارغ هنا (بين إحداثي 225 و 295) ---
            {x:300, y:-120, w:25, h:70}, {x:340, y:-200, w:25, h:70}, {x:380, y:-280, w:25, h:70}, {x:420, y:-360, w:25, h:70},
            // --- ممر النجاة الثاني فارغ هنا (بين إحداثي 445 و 515) ---
            {x:520, y:-140, w:25, h:70}, {x:560, y:-220, w:25, h:70}, {x:600, y:-300, w:25, h:70}, {x:640, y:-380, w:25, h:70},
            // --- ممر النجاة الثالث فارغ هنا (بين إحداثي 665 و 735) ---
            {x:740, y:-160, w:25, h:70}, {x:780, y:-240, w:25, h:70}, {x:820, y:-320, w:25, h:70}
        ],
        trap: function(p) {
            // تبدأ العاصفة بمجرد أن يخطو اللاعب للأمام
            if(p.x > 60) {
                this.spikes.forEach((s, index) => {
                    s.y += 7.5; // سرعة سقوط السهام لأسفل
                    
                    // الخدعة البرمجية: إذا وصل السهم للأرض، يعود للسماء فوراً بارتفاع متتابع لضمان الاستمرارية
                    if (s.y > 400) {
                        s.y = -80 - (index % 4) * 60; // تفاوت التوقيت والارتفاع لمنع السقوط الجماعي الموحد
                    }
                });
            }
        }
    },
    {
        // name: 27 (فخ البوابات المخادعة - إصلاح ثغرة الفوز)
        platforms: [
            { x: 0, y: 400, w: 960, h: 140 } // الأرضية
        ],
        hiddenBlocks: [],
        spikes: [],
        
        fakePortal: { x: 250, y: 340, w: 40, h: 50 },  // 1. حمراء 
        fakePortal2: { x: 450, y: 340, w: 40, h: 50 }, // 2. حمراء 
        fakePortal3: { x: 650, y: 340, w: 40, h: 50 }, // 3. حمراء (طوق النجاة)
        portal: { x: 850, y: 340, w: 40, h: 50, visible: true }, // 4. بنفسجية 
        
        trap: function(player) {
            // 1. البوابتان 1 و 2 تقتلان بمجرد اللمس
            if ((player.x + player.w >= 250 && player.x <= 290 && player.y >= 300) || 
                (player.x + player.w >= 450 && player.x <= 490 && player.y >= 300)) {
                player.y = 1000; 
            }
            
            // 2. إصلاح البوابة 4: قتله في النقطة 780 لكي لا تلمس مقدمة رأسه البوابة أبداً!
            if (player.x > 780) {
                player.y = 1000; 
            }
            
            // 3. البوابة 3: إذا لمس الحمراء الثالثة، تنقذه ويفوز
            if (player.x + player.w >= 650 && player.x < 700 && player.y >= 300) {
                this.portal.x = 650; // جلب البوابة الحقيقية لمكانه
                this.fakePortal3.y = 1000; // إخفاء الحمراء
            }
        }
    },
    {
        // name: 28 (المنصات المتحركة الضيقة - اختبار التوقيت)
        platforms: [
            { x: 0, y: 400, w: 200, h: 140 },   // منصة البداية (ثابتة وأصغر قليلاً)
            { x: 300, y: 400, w: 70, h: 140 },  // المنصة المتحركة 1 (ضيقة جداً 70px)
            { x: 550, y: 400, w: 70, h: 140 },  // المنصة المتحركة 2 (ضيقة جداً 70px)
            { x: 800, y: 400, w: 160, h: 140 }  // منصة البوابة (ثابتة)
        ],
        hiddenBlocks: [],
        spikes: [
            // بساط أشواك مميت في الأسفل، إذا أخطأ القفزة يسقط عليه
            { x: 0, y: 520, w: 960, h: 20 }
        ],
        portal: { x: 880, y: 340, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            let p1 = this.platforms[1]; // تحديد المنصة الأولى
            let p2 = this.platforms[2]; // تحديد المنصة الثانية
            
            // 1. إعطاء المنصات اتجاه حركة في أول فريم فقط
            if (!this.initialized) {
                p1.dir = 1;  // تبدأ بالتحرك لليمين
                p2.dir = -1; // تبدأ بالتحرك لليسار (عكس بعضهما)
                p1.startX = p1.x; // حفظ نقطة البداية
                p2.startX = p2.x;
                this.initialized = true;
            }
            
            // 2. تحريك المنصات بسرعات مختلفة لكسر إيقاع اللاعب
            p1.x += 2 * p1.dir;
            p2.x += 3.5 * p2.dir; // هذه المنصة أسرع بكثير!
            
            // 3. عكس الاتجاه إذا ابتعدت المنصة عن مكانها (مسافة الاهتزاز)
            if (p1.x > p1.startX + 80 || p1.x < p1.startX - 80) p1.dir *= -1;
            if (p2.x > p2.startX + 100 || p2.x < p2.startX - 100) p2.dir *= -1;
        }
    },
    {
        name: "29. ممر المقاصل المغلقة (تطوير إبراهيم)",
        platforms: [
            {x:0, y:400, w:960, h:140}, 
            {x:150, y:0, w:650, h:300} // السقف العلوي
        ],
        portal: {x:880, y:340, w:40, h:60},
        // تم زيادة العدد إلى 5 مربعات متتالية تفصل بينها مسافات متساوية
        spikes: [
            {x:230, y:310, w:40, h:60}, 
            {x:340, y:310, w:40, h:60}, 
            {x:450, y:310, w:40, h:60}, 
            {x:560, y:310, w:40, h:60},
            {x:670, y:310, w:40, h:60}
        ],
        trap: function(p) {
            if(typeof this.time === 'undefined') this.time = 0;
            this.time++;

            // ضبط الحسابات لتضرب الأرض (340) وترتفع للسقف بالتناوب لترك سبيل للمرور
            this.spikes[0].y = 310 + Math.sin(this.time * 0.06) * 30;
            this.spikes[1].y = 310 + Math.sin(this.time * 0.08 + 1.5) * 30;
            this.spikes[2].y = 310 + Math.sin(this.time * 0.05 + 3.0) * 30; 
            this.spikes[3].y = 310 + Math.sin(this.time * 0.09 + 4.5) * 30;
            this.spikes[4].y = 310 + Math.sin(this.time * 0.07 + 0.8) * 30;
        }
    },
    {
        name: "30. الفخ النهائي (الصبر هو مفتاح الفوز اللانهائي)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:900,y:340,w:40,h:60, visible: false},
        spikes: [{x:0,y:-100,w:960,h:50}],
        trap: function(p) { 
            if(typeof this.timer === 'undefined') this.timer = 0; 
            if(keys.left || keys.right || keys.jump) { this.timer = 0; this.spikes[0].y += 15; } 
            else { this.timer++; } 
            if(this.timer > 150) { this.portal.visible = true; this.portal.x = p.x; } 
        }
    },
    {
        name: "31. الفرحة الكاذبة (البوابة الغادرة)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:50,y:340,w:40,h:60, visible: false},
        fakePortal: {x:850,y:340,w:40,h:60},
        spikes: [{x:850,y:500,w:40,h:60}],
        trap: function(p) {
            if(p.x > 700) {
                this.fakePortal.y = -100; 
                this.spikes[0].y = 360; 
                this.portal.visible = true; 
            }
        }
    },
    {
        name: "32. ساندويتش الموت (فخ مزدوج التوقيت)",
        // تم الإصلاح: تمت إضافة منصة في المنتصف (x:350) لتتمكن من القفز إليها!
        platforms: [{x:0,y:400,w:200,h:140}, {x:350,y:400,w:200,h:140}, {x:700,y:400,w:260,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:200,y:-300,w:500,h:300}, {x:200,y:540,w:500,h:140}], 
        trap: function(p) {
            if(typeof this.timer === 'undefined') this.timer = 0;
            if(p.x > 150) this.timer++;
            // 1. السقف ينزل بسرعة لسد الفجوة أمامك
            if(this.timer > 0 && this.timer < 60) this.spikes[0].y += 8; 
            // 2. السقف يرتفع ببطء لفتح الطريق
            if(this.timer > 100 && this.spikes[0].y > -100) this.spikes[0].y -= 6; 
            // 3. المسامير الأرضية ترتفع لتبتلع المنصة الوسطى (يجب أن تهرب!)
            if(this.timer > 120) this.spikes[1].y -= 5; 
        }
    },
    {
        name: "33. الجري على الجليد مع الجاذبية الخبيثة",
        platforms: [{x:0,y:400,w:150,h:140}, {x:150,y:400,w:650,h:140}, {x:800,y:400,w:160,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:400,y:360,w:40,h:40}, {x:600,y:360,w:40,h:40}],
        trap: function(p) {
            // انزلاق جليدي
            if(p.x > 140 && p.x < 800 && !keys.left && !keys.right && p.vy === 0) p.x += 6; 
            // تم تخفيف الجاذبية الخبيثة من 1.5 إلى 0.6 لتصبح قفزة صعبة ولكن ممكنة!
            if(p.isJumping && p.x > 200 && p.x < 700) player.vy += 0.6; 
        }
    },
    {
        name: "34. الزر الملعون (فخ متسلسل)",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:850,y:340,w:40,h:60, visible: false},
        spikes: [{x:450,y:380,w:40,h:20, isButton:true}, {x:0,y:-100,w:960,h:50}], 
        trap: function(p) {
            // يجب أن تلمس الزر لتظهر البوابة
            if(p.x+p.w > this.spikes[0].x && p.x < this.spikes[0].x+this.spikes[0].w && p.y+p.h > this.spikes[0].y) {
                this.portal.visible = true;
                this.pressed = true;
            }
            // تم تقليل سرعة سقوط السقف ليكون الهروب ممكناً رياضياً وفيزيائياً 100%
            if(this.pressed) this.spikes[1].y += 4.5; 
        }
    },
    {
        name: "35. البوابة النطاطة والمسمار السري",
        platforms: [{x:0,y:400,w:960,h:140}],
        portal: {x:800,y:340,w:40,h:60},
        spikes: [],
        trap: function(p) {
            if(typeof this.jumps === 'undefined') this.jumps = 0;
            if(Math.abs(p.x - this.portal.x) < 50 && this.jumps === 0) { this.portal.x = 100; this.jumps++; }
            else if(Math.abs(p.x - this.portal.x) < 50 && this.jumps === 1) { this.portal.x = 450; this.jumps++; }
            else if(Math.abs(p.x - this.portal.x) < 50 && this.jumps === 2) { 
                this.portal.y = -100; 
                this.spikes.push({x:430, y:360, w:80, h:40}); 
                this.portal.x = 850; this.portal.y = 340; 
                this.jumps++; 
            }
        }
    },
    {
        name: "36. جسر الهلاك (سقوط استباقي)",
        platforms: [{x:0,y:400,w:100,h:140}, {x:100,y:400,w:100,h:140, fall:true}, {x:200,y:400,w:100,h:140, fall:true}, {x:300,y:400,w:100,h:140, fall:true}, {x:400,y:400,w:100,h:140, fall:true}, {x:500,y:400,w:100,h:140, fall:true}, {x:600,y:400,w:100,h:140, fall:true}, {x:700,y:400,w:260,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:-100,y:0,w:100,h:540}], 
        trap: function(p) {
            this.spikes[0].x += 3.8; 
            for(let i=1; i<=6; i++) {
                if(p.x > this.platforms[i].x - 20) this.platforms[i].y += 6; 
            }
        }
    },
    {
        name: "37. فخ الاستدراج (من تصميم إبراهيم!)",
        platforms: [{x:0,y:400,w:300,h:140}, {x:400,y:400,w:560,h:140}],
        portal: {x:850,y:340,w:40,h:60},
        spikes: [{x:300,y:380,w:100,h:40}], // الفخ الأول الذي يسد الطريق
        trap: function(p) {
            if(typeof this.triggered === 'undefined') this.triggered = false;
            
            // 1. الخدعة الأولى: المسامير الأولى تطير عند الاقتراب أو القفز
            if(p.x > 250 && !this.triggered) {
                this.triggered = true;
            }
            if(this.triggered && this.spikes[0].y > -100) {
                this.spikes[0].y -= 15;
            }
            
            // 2. الخدعة الثانية (التي طلبتها): البوابة تهرب ويخرج فخ مكانها!
            if(p.x > 750 && this.portal.x === 850) {
                this.portal.x = 50; // البوابة ترجع لبداية المستوى
                // إضافة المسمار القاتل مكان البوابة القديمة فوراً
                this.spikes.push({x: 850, y: 360, w: 40, h: 40}); 
            }
        }
    },
        {
        // name: 38 (فخ انهيار الجسر التدريجي - النسخة الموزونة والممكنة)
        platforms: [
            { x: 0, y: 400, w: 150, h: 140 },   // 0. منصة البداية (منطقة الأمان)
            { x: 150, y: 400, w: 160, h: 140 }, // 1. القطعة الأولى
            { x: 310, y: 400, w: 160, h: 140 }, // 2. القطعة الثانية
            { x: 470, y: 400, w: 160, h: 140 }, // 3. القطعة الثالثة
            { x: 630, y: 400, w: 160, h: 140 }, // 4. القطعة الرابعة
            { x: 790, y: 400, w: 170, h: 140 }  // 5. القطعة الأخيرة (منطقة الفخ)
        ],
        hiddenBlocks: [],
        spikes: [
            { x: 0, y: 600, w: 960, h: 20 } // بساط الشوك السفلي
        ],
        portal: { x: 250, y: 340, w: 40, h: 50, visible: true },
        
        trap: function(player) {
            // 1. البوابة تهرب من اللاعب كلما اقترب منها
            if (player.x > 50 && this.portal.x < 850 && !this.trapTriggered) {
                this.portal.x = player.x + 150; 
            }
            
            // 2. تفعيل الفخ عند الوصول للقطعة الأخيرة
            if (player.x > 750 && !this.trapTriggered) {
                this.trapTriggered = true;
                this.portal.y = -100; // إخفاء البوابة الهاربة
                this.portal.x = 20;   // إظهار البوابة الحقيقية عند البداية
                this.portal.y = 340;
                this.collapseTimer = 0; 
            }
            
            // 3. خوارزمية الانهيار التدريجي الموزونة (تأثير ممتع وممكن)
            if (this.trapTriggered) {
                this.collapseTimer += 1; 
                
                // السر هنا: سرعة هبوط بطيئة جداً تعطي فرصة للنجاة والقفز العكسي
                let fallSpeed = 1.2; 
                
                // القطعة 5 تسقط فوراً
                if (this.collapseTimer > 0 && this.platforms[5].y < 700) this.platforms[5].y += fallSpeed;
                
                // القطعة 4 تسقط بعد 25 فريم (زيادة المهلة الزمنية)
                if (this.collapseTimer > 25 && this.platforms[4].y < 700) this.platforms[4].y += fallSpeed;
                
                // القطعة 3 تسقط بعد 50 فريم
                if (this.collapseTimer > 50 && this.platforms[3].y < 700) this.platforms[3].y += fallSpeed;
                
                // القطعة 2 تسقط بعد 75 فريم
                if (this.collapseTimer > 75 && this.platforms[2].y < 700) this.platforms[2].y += fallSpeed;
                
                // القطعة 1 تسقط بعد 100 فريم (وقت كافٍ جداً للوصول لمنطقة الأمان)
                if (this.collapseTimer > 100 && this.platforms[1].y < 700) this.platforms[1].y += fallSpeed;
                
                // تثبيت مستوى الشوك في الأسفل ليعطي عمقاً بصرياً دون قتل تلقائي مفاجئ
                this.spikes[0].y = 540;
            }
        }
    },
    {
        name: "39. درج الأشباح المتلاشي (من تصميم إبراهيم!)",
        platforms: [
            {x:0,y:400,w:100,h:140}, // منصة البداية
            {x:800,y:100,w:160,h:440}, // منصة النهاية
            {x:200,y:-1000,w:60,h:20}, // الدرجة 1 (مخفية في السماء)
            {x:350,y:-1000,w:60,h:20}, // الدرجة 2
            {x:500,y:-1000,w:60,h:20}, // الدرجة 3
            {x:650,y:-1000,w:60,h:20}  // الدرجة 4
        ],
        portal: {x:850,y:40,w:40,h:60},
        spikes: [{x:100,y:500,w:700,h:40}], // مسامير القاع
        trap: function(p) {
            if(typeof this.stepTimers === 'undefined') this.stepTimers = [0,0,0,0];
            let targets = [320, 240, 160, 80]; // الارتفاعات الحقيقية للدرج

            for(let i=0; i<4; i++) {
                let plat = this.platforms[i+2];
                
                // الخدعة 1: الدرجة تظهر فجأة كالسحر عندما تقترب منها في الهواء!
                if (plat.y === -1000 && p.x > plat.x - 130) {
                    plat.y = targets[i];
                }
                
                // الخدعة 2: بمجرد أن تدوس عليها قدمك، يبدأ عداد الانهيار
                if (plat.y >= targets[i] && plat.y < 900) {
                    // التحقق من أنك تقف فوقها فعلاً
                    if (p.x + p.w > plat.x && p.x < plat.x + plat.w && Math.abs((p.y + p.h) - plat.y) < 3) {
                         this.stepTimers[i] = 1;
                    }
                    // الدرجة تنهار وتسقط بك في المسامير إذا لم تقفز بسرعة!
                    if (this.stepTimers[i] > 0) {
                         this.stepTimers[i]++;
                         if (this.stepTimers[i] > 10) plat.y += 12; 
                    }
                }
            }
        }
    },
    {
        name: "40. الهاوية الخادعة (البوابة في الجحيم)",
        platforms: [{x:0,y:400,w:300,h:140}, {x:400,y:400,w:560,h:140}],
        fakePortal: {x:850,y:340,w:40,h:60},
        portal: {x:100,y:500,w:40,h:60, visible:true},
        spikes: [{x:400,y:-100,w:560,h:50}], 
        trap: function(p) {
            if(p.x > 350) this.spikes[0].y += 15; 
            if(p.x+p.w > this.fakePortal.x && p.x < this.fakePortal.x+this.fakePortal.w && p.y+p.h > this.fakePortal.y) die();
            if(p.x > 200) this.platforms[0].y += 6; 
        }
    }
];
