from django.db import models


class ContactMessage(models.Model):
    """Stores contact inquiries submitted from the website."""
    name = models.CharField(max_length=120, verbose_name="نام و نام خانوادگی")
    email = models.EmailField(verbose_name="ایمیل")
    subject = models.CharField(max_length=200, blank=True, verbose_name="موضوع / نوع همکاری")
    message = models.TextField(verbose_name="متن پیام")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ارسال")
    is_read = models.BooleanField(default=False, verbose_name="خوانده شده؟")

    class Meta:
        verbose_name = "پیام ارتباطی"
        verbose_name_plural = "پیام‌های ارتباطی"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class Project(models.Model):
    """Case study portfolio projects."""
    slug = models.SlugField(max_length=100, unique=True, verbose_name="شناسه یکتا (Slug)")
    title = models.CharField(max_length=150, verbose_name="عنوان پروژه")
    subtitle = models.CharField(max_length=250, blank=True, verbose_name="زیرعنوان")
    tagline = models.CharField(max_length=255, blank=True, verbose_name="شعار پروژه")
    category = models.CharField(max_length=150, verbose_name="دسته‌بندی")
    year = models.CharField(max_length=20, default="۲۰۲۶", verbose_name="سال انجام")
    role = models.CharField(max_length=200, verbose_name="نقش")
    technologies = models.JSONField(default=list, blank=True, verbose_name="فناوری‌ها")
    live_url = models.URLField(blank=True, verbose_name="لینک نسخه زنده")
    github_url = models.URLField(blank=True, verbose_name="لینک مخزن گیت‌هاب")
    hero_image = models.CharField(max_length=255, verbose_name="تصویر شاخص")
    detail_images = models.JSONField(default=list, blank=True, verbose_name="تصاویر بخش‌های جزئیات")
    accent_color = models.CharField(max_length=30, default="#EAEAEA", verbose_name="رنگ تم")
    overview = models.TextField(verbose_name="توضیحات کلی")
    problem = models.TextField(blank=True, verbose_name="چالش و مسئله")
    solution = models.TextField(blank=True, verbose_name="راهکار فنی")
    process = models.JSONField(default=list, blank=True, verbose_name="مراحل انجام کار")
    metrics = models.JSONField(default=list, blank=True, verbose_name="دستاوردهای کلیدی")
    next_slug = models.CharField(max_length=100, blank=True, verbose_name="اسلاگ پروژه بعدی")
    next_title = models.CharField(max_length=100, blank=True, verbose_name="عنوان پروژه بعدی")
    prev_slug = models.CharField(max_length=100, blank=True, verbose_name="اسلاگ پروژه قبلی")
    prev_title = models.CharField(max_length=100, blank=True, verbose_name="عنوان پروژه قبلی")
    order = models.IntegerField(default=0, verbose_name="ترتیب نمایش")
    is_active = models.BooleanField(default=True, verbose_name="فعال؟")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "پروژه"
        verbose_name_plural = "پروژه‌ها"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class Skill(models.Model):
    """Interactive skills and proficiency levels."""
    CATEGORY_CHOICES = [
        ('frontend', 'فرانت‌اند'),
        ('motion', 'انیمیشن و تعامل ۳بعدی'),
        ('backend', 'بک‌اند و معماری'),
        ('tools', 'ابزارها و بهینه‌سازی'),
    ]
    name = models.CharField(max_length=100, verbose_name="نام مهارت")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='frontend', verbose_name="دسته‌بندی")
    proficiency = models.IntegerField(default=90, verbose_name="درصد تسلط (۰ تا ۱۰۰)")
    order = models.IntegerField(default=0, verbose_name="ترتیب")

    class Meta:
        verbose_name = "مهارت"
        verbose_name_plural = "مهارت‌ها"
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class ProfileInfo(models.Model):
    """Personal profile & developer portfolio information."""
    full_name = models.CharField(max_length=120, default="امین اسماعیل زاده", verbose_name="نام و نام خانوادگی")
    role_title = models.CharField(max_length=200, default="توسعه‌دهنده خلاق فرانت‌اند و طراح اینتراکشن", verbose_name="عنوان شغلی")
    bio = models.TextField(blank=True, verbose_name="بیوگرافی")
    email = models.EmailField(default="amin.esmaeilzadehh@gmail.com", verbose_name="ایمیل مستقیم")
    phone = models.CharField(max_length=30, default="09011312210", verbose_name="شماره تماس")
    location = models.CharField(max_length=120, default="گرگان، ایران / ریموت بین‌المللی", verbose_name="موقعیت")
    telegram_url = models.URLField(default="https://t.me/AminOmade", verbose_name="آدرس تلگرام")
    github_url = models.URLField(default="https://github.com/Amin-Ezz", verbose_name="آدرس گیت‌هاب")
    linkedin_url = models.URLField(default="https://www.linkedin.com/in/amin-esmaeil-zadeh-a99503431", verbose_name="آدرس لینکدین")
    resume_url = models.CharField(max_length=255, default="/Amin_Esmaeilzadeh_Resume.pdf", verbose_name="لینک فایل رزومه")

    class Meta:
        verbose_name = "اطلاعات پروفایل"
        verbose_name_plural = "اطلاعات پروفایل"

    def __str__(self):
        return self.full_name
