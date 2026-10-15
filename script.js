
// 1. ضمان العودة لأعلى الصفحة فوراً عند تحميلها أو تحديثها
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    // التأكد من وضع الصفحة في الأعلى عند البداية
    window.scrollTo(0, 0);


    // 2. حركة سحب شريطة الأقسام العلوي بالماوس (Drag to Scroll)
    const slider = document.getElementById('categoriesTrack');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        

slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });


        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

    }

    // 3. نظام التبويبات للأقسام الرئيسية مع التمرير التلقائي المضبوط بدقة
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('.menu-category-section');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');


            // توسيط الزر في الكاروسيل
            button.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });

            const targetId = button.getAttribute('data-category');


            sections.forEach(section => {
                section.classList.remove('active-section');
                section.style.display = 'none';
            });

            if (targetId === 'all') {

                sections.forEach(section => {
                    section.style.display = 'block';
                    setTimeout(() => {
                        section.classList.add('active-section');
                    }, 10);
                });


                const firstSection = sections[0];
                if (firstSection) {
                    const headerOffset = 120; // مسافة كافية لكي يظهر العنوان تحت الشريط الثابت
                    const elementPosition = firstSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'auto'
                    });
                }
            } else {

                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    setTimeout(() => {
                        targetSection.classList.add('active-section');

                        
                        // حساب المسافة بدقة بحيث يكون العنوان ظاهر تماماً
                        const headerOffset = 120; 
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'auto'
                        });
                    }, 10);
                }
            }

        });
    });
});

// 4. زر الهيرو "اكتشف القائمة"
const heroScrollBtn = document.querySelector('.hero-scroll-btn');
if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = heroScrollBtn.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 120;
            const elementPosition = targetElement.getBoundingClientRect().top;

            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'auto'
            });
        }
    });
}

// 5. زر العودة للأعلى
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');

        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'auto'

        });
    });
}














const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuQDwzbTancx6C8Z0dNzdEv3J-YNsVfBTz3GBBPB2u8IXR1evxt37p-ktQPd-vaX__Lb1HVygZVKmh/pub?output=csv';

async function fetchMenuData() {
  try {

    // إضافة تجميع الوقت لمنع المتصفح من قراءة البيانات القديمة المخزنة
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
    const data = await response.text();
    
    // تقسيم الأسطر
    const rows = data.split('\n').map(row => row.trim()).filter(row => 

row.length > 0);
    const headers = rows[0].split(',').map(h => h.trim());
    
    const products = rows.slice(1).map(row => {
      // التعامل مع الفواصل داخل القيم
      const values = row.split(',').map(val => val.trim().replace(/^"|"$/g, ''));

      return {
        name: values[0],
        price: values[1],
        category: values[2],
        available: values[3]
      };
    });

    // تصفية العناصر التي قيمتها TRUE فقط (بدون التأثر بالحالة الأحرف)
    const availableProducts = products.filter(p => 

p.available && p.available.toUpperCase() === 'TRUE');
    
    console.log('المنتجات المتوفرة:', availableProducts);
    
    // الدالة المسؤولة عن بناء وتحديث الواجهة (استبدلها باسم الدالة لديك)
    renderMenu(availableProducts);

    
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
  }
}





