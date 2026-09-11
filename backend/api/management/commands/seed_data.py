from django.core.management.base import BaseCommand
from api.models import Project, Skill, ProfileInfo


class Command(BaseCommand):
    help = "بذرپاشی خودکار اطلاعات اولیه پروژه‌ها، مهارت‌ها و پروفایل امین اسماعیل‌زاده در دیتابیس"

    def handle(self, *args, **options):
        self.stdout.write("Seeding portfolio data...")

        # 1. Profile
        ProfileInfo.objects.update_or_create(
            id=1,
            defaults={
                'full_name': "امین اسماعیل زاده",
                'role_title': "توسعه‌دهنده خلاق فرانت‌اند و طراح اینتراکشن — AMIN.EZ",
                'bio': "توسعه‌دهنده سنیور کریتیو فرانت‌اند، طراح موشن و رابط‌های کاربری ادیتوریال ۳بعدی با بیش از ۴ سال تجربه تخصصی در طراحی تعاملی و پرفورمنس بالا.",
                'email': "amin.esmaeilzadehh@gmail.com",
                'phone': "09011312210",
                'location': "گرگان، ایران / ریموت بین‌المللی",
                'telegram_url': "https://t.me/AminOmade",
                'github_url': "https://github.com/Amin-Ezz",
                'linkedin_url': "https://www.linkedin.com/in/amin-esmaeil-zadeh-a99503431",
                'resume_url': "/Amin_Esmaeilzadeh_Resume.pdf"
            }
        )

        # 2. Projects
        projects_data = [
            {
                "slug": "lumina",
                "title": "LUMINA",
                "subtitle": "کتابخانه آنلاین و تجربه مطالعه ادیتوریال",
                "tagline": "کتابخانه‌ای برای کشف و غوطه‌وری در کتاب‌های ارزشمند",
                "category": "پلتفرم دیجیتال / وب اپلیکیشن",
                "year": "۲۰۲۶",
                "role": "طراحی محصول و فرانت‌اند تعاملی",
                "technologies": ["HTML5", "Modern CSS", "JavaScript ES6+", "GSAP Motion", "Vite", "Django REST"],
                "live_url": "https://luumina.vercel.app",
                "github_url": "https://github.com/Amin-Ezz/OnlineLibrary",
                "hero_image": "/images/lumina-hero.webp",
                "detail_images": [
                    "/images/lumina-hero.webp",
                    "/images/lumina-discovery.jpg",
                    "/images/lumina-details.jpg"
                ],
                "accent_color": "#EAEAEA",
                "overview": "پروژه لومینا با هدف بازتعریف تجربه مطالعه دیجیتال برای کاربران علاقه‌مند به ادبیات و طراحی ادیتوریال خلق شد. این پلتفرم فضایی آرام، بدون حاشیه و با تمرکز صددرصدی بر تایپوگرافی اصیل فارسی فراهم می‌سازد که اسکرول آن حسی شبیه لمس ورق‌های باکیفیت یک کتاب فیزیکی را تداعی می‌کند.",
                "problem": "بسیاری از پلتفرم‌های کتاب دیجیتال، به دلیل بارهای تبلیغاتی زیاد، تایپوگرافی ناهمگون، کندی در بارگذاری و رابط‌های کاربری شلوغ، تمرکز خواننده را پس از چند دقیقه برهم می‌زنند. نبود یک تجربه خواندن لوکس و مینیمال برای متون فاخر فارسی، انگیزه اصلی شروع این پروژه بود.",
                "solution": "با الهام از مکتب طراحی سوئیسی و استانداردهای طراحی ادیتوریال مدرن، پلتفرمی با معماری ماژولار و کنتراست بهینه پیاده‌سازی شد. استفاده از شتاب‌دهنده‌های سخت‌افزاری GPU، تعویض فصل‌ها با انیمیشن‌های نرم مایع (Liquid Transitions)، و ساختار سبک Vanilla JS تضمین کرد که وب‌سایت در نرخ فریم ۱۲۰ هرتز اجرا شود.",
                "metrics": [
                    {"value": "۹۹.۸٪", "label": "رضایت در تست خوانش"},
                    {"value": "۰.۳۸s", "label": "زمان لود کامل اولیه"},
                    {"value": "+۱۶۰٪", "label": "افزایش ماندگاری مخاطب"},
                    {"value": "۱۲۰fps", "label": "نرخ رندر انیمیشن‌ها"}
                ],
                "next_slug": "mod-style",
                "next_title": "MODSTYLE",
                "prev_slug": "trip-os",
                "prev_title": "TRIP OS",
                "order": 1
            },
            {
                "slug": "mod-style",
                "title": "MODSTYLE",
                "subtitle": "فروشگاه آنلاین مد و لباس با تجربه خرید تعاملی",
                "tagline": "تجربه‌ای مدرن برای کشف، انتخاب و ساختن استایل شخصی",
                "category": "تجارت الکترونیک / تعامل مد",
                "year": "۲۰۲۶",
                "role": "طراح UI/UX و مهندس ارشد فرانت‌اند",
                "technologies": ["Vanilla JavaScript", "CSS Grid/Flexbox", "GSAP ScrollTrigger", "Web Audio API", "Vite"],
                "live_url": "https://modstyle-demo.amin.dev",
                "github_url": "https://github.com/Amin-Ezz/ModStyle",
                "hero_image": "/images/modstyle-hero.png",
                "detail_images": [
                    "/images/modstyle-hero.png",
                    "/images/modstyle-discovery.png",
                    "/images/modstyle-filtering.png",
                    "/images/modstyle-product.png",
                    "/images/modstyle-cart.png"
                ],
                "accent_color": "#D4AF37",
                "overview": "پلتفرم فروشگاهی مدرن برای برندهای فشن لوکس که خرید آنلاین پوشاک را به یک تجربه حسی و تعاملی مانند ورق زدن ژورنال‌های معتبر مد بدل می‌کند.",
                "problem": "فروشگاه‌های آنلاین سنتی با الگوهای تکراری و گرید‌های خسته‌کننده، حس اصالت و جذابیت بصری استایل‌های مدرن را به مخاطب منتقل نمی‌کنند.",
                "solution": "طراحی سیستم گرید پویا، تعویض سریع زوایای لباس، فیلترهای آنی بدون وقفه و انیمیشن‌های روان افزودن به سبد خرید با نرخ تبدیل بالا.",
                "metrics": [
                    {"value": "۲.۴x", "label": "افزایش نرخ تعامل کاربر"},
                    {"value": "۰.۴۵s", "label": "پاسخ‌دهی فیلترهای کاتالوگ"},
                    {"value": "+۱۸۰٪", "label": "افزایش میانگین زمان حضور"},
                    {"value": "۶۰fps", "label": "پایداری انیمیشن سبد خرید"}
                ],
                "next_slug": "project-management",
                "next_title": "NORTHWIND",
                "prev_slug": "lumina",
                "prev_title": "LUMINA",
                "order": 2
            },
            {
                "slug": "project-management",
                "title": "NORTHWIND",
                "subtitle": "ورک‌اسپیس مدرن مدیریت پروژه برای تیم‌های محصول",
                "tagline": "سیستم جامع ردیابی وظایف، پیشرفت تیمی و برنامه‌ریزی هوشمند",
                "category": "نرم‌افزار سازمانی / B2B SaaS",
                "year": "۲۰۲۶",
                "role": "معمار فرانت‌اند و طراح اینتراکشن",
                "technologies": ["HTML5 Canvas", "Modern CSS", "Modular JavaScript", "Real-time State", "Vite"],
                "live_url": "https://northwind-demo.amin.dev",
                "github_url": "https://github.com/Amin-Ezz/ProjectManagement",
                "hero_image": "/images/northwind-hero.png",
                "detail_images": [
                    "/images/northwind-hero.png",
                    "/images/northwind-app-dashboard.webp",
                    "/images/northwind-app-tasks.webp",
                    "/images/northwind-app-workspace.webp",
                    "/images/northwind-app-team.webp"
                ],
                "accent_color": "#6366F1",
                "overview": "نرم‌افزار مدیریت وظایف و مایلستون‌های پروژه که تعادل دقیقی میان سادگی کاربری و ابزارهای تحلیلی قدرتمند ایجاد می‌کند.",
                "problem": "ابزارهای موجود یا بیش از حد ساده و ناکارآمدند یا بیش از اندازه پیچیده با بار شناختی زیاد که کارایی تیم را کاهش می‌دهند.",
                "solution": "طراحی داشبوردهای مبتنی بر داده با رندر آنی وضعیت تسک‌ها، درگ اند دراپ روان، چارت‌های تحلیلی و دسترسی سریع با کلیدهای میانبر.",
                "metrics": [
                    {"value": "۴۰٪", "label": "کاهش زمان مدیریت وظایف"},
                    {"value": "۰.۳۰s", "label": "لود کامل داشبورد تیم"},
                    {"value": "+۸۵٪", "label": "دقت در برآورد زمان پایان"},
                    {"value": "۱۰۰٪", "label": "دسترس‌پذیری کیبورد"}
                ],
                "next_slug": "trip-os",
                "next_title": "TRIP OS",
                "prev_slug": "mod-style",
                "prev_title": "MODSTYLE",
                "order": 3
            },
            {
                "slug": "trip-os",
                "title": "TRIP OS",
                "subtitle": "سیستم مدیریت و برنامه‌ریزی سفر با معماری فول‌استک",
                "tagline": "ورک‌اسپیسی یکپارچه برای ساختن خاطرات سفرهای فراموش‌نشدنی",
                "category": "اپلیکیشن سفر و لایف‌استایل",
                "year": "۲۰۲۶",
                "role": "طراح سیستم و توسعه‌دهنده فول‌استک",
                "technologies": ["Interactive Maps", "Modern Vanilla JS", "Tailored CSS", "GSAP Timeline", "Vite"],
                "live_url": "https://tripos-demo.amin.dev",
                "github_url": "https://github.com/Amin-Ezz/TripOS",
                "hero_image": "/images/tripos-hero.png",
                "detail_images": [
                    "/images/tripos-hero.png",
                    "/images/tripos-dashboard.png",
                    "/images/tripos-itinerary.png",
                    "/images/tripos-destinations.png",
                    "/images/tripos-workspace.png"
                ],
                "accent_color": "#10B981",
                "overview": "پلتفرم همه‌کاره برای برنامه‌ریزی روزانه، مدیریت هزینه‌ها، ذخیره مقاصد دیدنی و هماهنگی همسفران با رابط کاربری لوکس و مینیمال.",
                "problem": "پراکندگی اطلاعات سفر میان پیام‌رسان‌ها، اکسل، نقشه‌ها و اپ‌های متفرقه که منجر به سردرگمی و اتلاف وقت مسافران می‌شود.",
                "solution": "تمرکز تمام اجزای سفر شامل زمان‌بندی روزبه‌روز، نقشه‌های پویا، بودجه‌بندی و چک‌لیست تجهیزات در یک فضای کاری مدرن و بدون حاشیه.",
                "metrics": [
                    {"value": "۳.۵x", "label": "صرفه‌جویی در زمان برنامه‌ریزی"},
                    {"value": "۰.۳۵s", "label": "لود نقشه‌ها و دیتای سفر"},
                    {"value": "+۲۲۰٪", "label": "افزایش رضایت کاربران در سفر"},
                    {"value": "۱۲۰fps", "label": "روانی اسکرول تایم‌لاین"}
                ],
                "next_slug": "lumina",
                "next_title": "LUMINA",
                "prev_slug": "project-management",
                "prev_title": "NORTHWIND",
                "order": 4
            }
        ]

        for p in projects_data:
            Project.objects.update_or_create(
                slug=p["slug"],
                defaults=p
            )

        # 3. Skills
        skills_data = [
            # Frontend
            ("HTML5 & Semantic Markup", "frontend", 98, 1),
            ("CSS3, SCSS & CSS Architecture", "frontend", 95, 2),
            ("Modern JavaScript (ES6+ / Async)", "frontend", 94, 3),
            ("Vite, Rollup & Build Tools", "frontend", 90, 4),
            ("Responsive & Mobile-First Design", "frontend", 96, 5),
            # Motion & 3D
            ("GSAP, ScrollTrigger & Timeline", "motion", 95, 6),
            ("Three.js & WebGL 3D Canvas", "motion", 88, 7),
            ("Lenis Smooth Scroll Engine", "motion", 92, 8),
            ("Glassmorphism & Shader Effects", "motion", 90, 9),
            # Backend & Architecture
            ("Python & Django Framework", "backend", 90, 10),
            ("Django REST Framework (DRF)", "backend", 92, 11),
            ("RESTful API Design & Best Practices", "backend", 92, 12),
            ("PostgreSQL / SQLite Database Design", "backend", 88, 13),
            # Tools
            ("Git & GitHub Version Control", "tools", 94, 14),
            ("Performance & Lighthouse Optimization", "tools", 96, 15),
            ("UI/UX Prototyping (Figma)", "tools", 90, 16),
        ]

        for name, category, proficiency, order in skills_data:
            Skill.objects.update_or_create(
                name=name,
                defaults={
                    "category": category,
                    "proficiency": proficiency,
                    "order": order
                }
            )

        self.stdout.write(self.style.SUCCESS("[OK] Portfolio data successfully seeded into database."))
