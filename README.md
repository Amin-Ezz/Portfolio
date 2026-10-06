# وب‌سایت پورتفولیو اختصاصی امین اسماعیل‌زاده (Full-Stack Architecture)

این مخزن شامل معماری کامل دو لایه‌ای **Frontend** و **Backend (Django)** برای پورتفولیو شخصی و کیس‌استادی‌های مهندسی امین اسماعیل‌زاده است.

---

## ۱. ساختار پوشه‌بندی پروژه

```text
Portfolio1_copy - Copy/
├── front/                        # تمامی فایل‌ها و ماژول‌های فرانت‌اند
│   ├── index.html                # صفحه اصلی پورتفولیو با هدر سه‌بعدی و فرم تماس
│   ├── projects/                 # صفحات کیس‌استادی ادیتوریال
│   │   ├── lumina.html
│   │   ├── mod-style.html
│   │   ├── project-management.html
│   │   └── trip-os.html
│   ├── src/
│   │   ├── css/                  # استایل‌های مدرن و افکت‌های شیشه‌ای (Liquid Glass)
│   │   ├── js/                   # ماژول‌های اسکریپت (main, transitions, api, ...)
│   │   └── data/                 # داده‌های پشتیبان پروژه‌ها
│   ├── public/                   # ویدیوهای پس‌زمینه، رزومه، تصاویر و آیکون‌ها
│   ├── images/                   # تصاویر شاخص
│   ├── vite.config.js            # کانفیگ Vite به همراه Reverse Proxy برای /api
│   └── package.json
│
├── backend/                      # بک‌اند جنگو (Django 5 + Django REST Framework)
│   ├── manage.py
│   ├── requirements.txt
│   ├── portfolio_backend/        # تنظیمات و URLهای ریشه جنگو (settings.py, urls.py)
│   ├── api/                      # اپلیکیشن اختصاصی API پورتفولیو
│   │   ├── models.py             # مدل‌های دیتابیس (ContactMessage, Project, Skill, ProfileInfo)
│   │   ├── serializers.py        # اعتبارسنجی و تبدیل داده‌ها
│   │   ├── views.py              # اندپوینت‌های RESTful
│   │   ├── urls.py
│   │   ├── admin.py              # پنل مدیریت جنگو با فیلترها و سرچ فارسی
│   │   ├── tests.py              # تست‌های واحد جامع
│   │   └── management/commands/seed_data.py # بذرپاشی اطلاعات اولیه پروژه‌ها
│   └── db.sqlite3                # دیتابیس آماده با تمام اطلاعات پروژه‌ها
│
└── Portfolio1/                   # پوشه اولیه پروژه حفظ شده جهت عدم حذف هیچ‌گونه فایل (Backup)
```

---

## ۲. دامنه و معماری استقرار سرور (Production Deployment)

دامنه رسمی پورتفولیو: **`https://aminez.ir`** (و `www.aminez.ir`)

### معماری نهایی در سرور (VPS / Linux Ubuntu):
```text
Client Browser (https://aminez.ir)
       │
       ▼
  Nginx (Reverse Proxy + SSL Let's Encrypt + Caching)
   ├── / (HTML/JS/CSS) ──────► front/dist/ (Static Files)
   ├── /static/ & /media/ ───► backend/staticfiles/ & media/
   └── /api/ & /admin/ ──────► Gunicorn (127.0.0.1:8000)
                                      │
                                      ▼
                                Django 5 REST Backend
```

### مراحل استقرار روی سرور (Ubuntu / Debian):

#### ۱. کلون پروژه و تنظیمات محیطی:
```bash
git clone <repository_url> /var/www/portfolio
cd /var/www/portfolio/backend
cp .env.example .env
# ویرایش فایل .env و قرار دادن DJANGO_DEBUG=False و کلید امنیتی:
nano .env
```

#### ۲. اجرای اسکریپت استقرار خودکار:
```bash
chmod +x /var/www/portfolio/deploy.sh
/var/www/portfolio/deploy.sh
```

#### ۳. تنظیم سرویس Gunicorn:
```bash
sudo cp /var/www/portfolio/deployment/systemd/aminez.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start aminez.service
sudo systemctl enable aminez.service
```

#### ۴. تنظیم وب‌سرور Nginx و گواهی SSL:
```bash
sudo cp /var/www/portfolio/deployment/nginx/aminez.ir.conf /etc/nginx/sites-available/aminez.ir
sudo ln -s /etc/nginx/sites-available/aminez.ir /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# دریافت رایگان گواهی SSL از طریق Certbot:
sudo certbot --nginx -d aminez.ir -d www.aminez.ir
```

---

## ۳. نحوه اجرای پروژه در حالت توسعه لوکال (اختیاری)

در صورت تمایل به توسعه لوکال:
```bash
# ترمینال ۱ (بک‌اند):
cd backend
python manage.py runserver

# ترمینال ۲ (فرانت‌اند):
cd front
npm run dev
# دسترسی فرانت‌اند در: http://localhost:3000
```
> [!NOTE]
> همچنین در حالت لوکال، اگر فقط `python manage.py runserver` را اجرا کنید، به صورت خودکار نسخه بیلد شده سایت در `http://127.0.0.1:8000` نیز در دسترس است.

---

## ۳. اندپوینت‌های REST API

| متد | مسیر | توضیحات |
| :--- | :--- | :--- |
| `GET` | `/api/health/` | وضعیت سلامت سرور بک‌اند |
| `POST` | `/api/contact/` | ثبت پیام فرم تماس تعاملی در دیتابیس با اعتبارسنجی کامل |
| `GET` | `/api/projects/` | دریافت لیست پروژه‌های پورتفولیو |
| `GET` | `/api/projects/<slug>/` | دریافت اطلاعات تکمیلی و متریک‌های هر پروژه |
| `GET` | `/api/skills/` | لیست مهارت‌ها و درصد تسلط |
| `GET` | `/api/profile/` | اطلاعات پروفایل، بیوگرافی و راه‌های ارتباطی |

---

## ۴. ویژگی‌های اتصال فرانت‌اند و بک‌اند

1. **فرم تماس تعاملی شیشه‌ای (`front/index.html`)**:
   - کاربران می‌توانند پیام و درخواست همکاری خود را مستقیماً از سایت ارسال کنند.
   - فرم دارای اعتبارسنجی کلاینت و سرور است.
   - وضعیت دکمه به هنگام ارسال تغییر کرده و انیمیشن لودینگ و پیام موفقیت‌آمیز شیک نمایش داده می‌شود.
   - پیام در جدول `ContactMessage` در دیتابیس ذخیره شده و در پنل ادمین جنگو قابل مدیریت و پاسخگویی است.

2. **ماژول اتصال API (`front/src/js/api.js`)**:
   - توابع استاندارد جاوااسکریپت بدون نیاز به کتابخانه‌های سنگین خارجی.
   - عملکرد منعطف و تاب‌آور (Fault-Tolerant): در صورت خاموش بودن بک‌اند، سایت بدون کوچکترین کندی یا کرش با داده‌های کش‌شده محلی لود می‌شود.

3. **تست‌های واحد (`backend/api/tests.py`)**:
   - اجرای `python manage.py test api` تضمین‌کننده صحت ۱۰۰٪ اندپوینت‌ها و فرآیند ذخیره‌سازی داده‌هاست.
