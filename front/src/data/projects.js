/**
 * Central Data Architecture for AMIN.DEV Portfolio
 * All project case studies, metadata, and visual assets are defined here.
 */

export const projects = [
  {
    id: "01",
    slug: "lumina",
    title: "LUMINA",
    subtitle: "کتابخانه آنلاین و تجربه مطالعه ادیتوریال",
    tagline: "کتابخانه‌ای برای کشف و غوطه‌وری در کتاب‌های ارزشمند",
    category: "پلتفرم دیجیتال / وب اپلیکیشن",
    year: "۲۰۲۶",
    role: "طراحی محصول و فرانت‌اند تعاملی",
    technologies: ["HTML5", "Modern CSS", "JavaScript ES6+", "GSAP Motion", "Vite"],
    liveUrl: "https://lumina-demo.amin.dev",
    githubUrl: "https://github.com/Amin-Ezz/OnlineLibrary",
    heroImage: "/images/lumina-hero.webp",
    detailImages: [
      "/images/lumina-hero.webp",
      "/images/lumina-detail-1.webp",
      "/images/lumina-detail-2.webp"
    ],
    accentColor: "#EAEAEA",
    overview: "پروژه لومینا با هدف بازتعریف تجربه مطالعه دیجیتال برای کاربران علاقه‌مند به ادبیات و طراحی ادیتوریال خلق شد. این پلتفرم فضایی آرام، بدون حاشیه و با تمرکز صددرصدی بر تایپوگرافی اصیل فارسی فراهم می‌سازد که اسکرول آن حسی شبیه لمس ورق‌های باکیفیت یک کتاب فیزیکی را تداعی می‌کند.",
    problem: "بسیاری از پلتفرم‌های کتاب دیجیتال، به دلیل بارهای تبلیغاتی زیاد، تایپوگرافی ناهمگون، کندی در بارگذاری و رابط‌های کاربری شلوغ، تمرکز خواننده را پس از چند دقیقه برهم می‌زنند. نبود یک تجربه خواندن لوکس و مینیمال برای متون فاخر فارسی، انگیزه اصلی شروع این پروژه بود.",
    solution: "با الهام از مکتب طراحی سوئیسی و استانداردهای طراحی ادیتوریال مدرن، پلتفرمی با معماری ماژولار و کنتراست بهینه پیاده‌سازی شد. استفاده از شتاب‌دهنده‌های سخت‌افزاری GPU، تعویض فصل‌ها با انیمیشن‌های نرم مایع (Liquid Transitions)، و ساختار سبک Vanilla JS تضمین کرد که وب‌سایت در نرخ فریم ۱۲۰ هرتز اجرا شود.",
    process: [
      {
        step: "۰۱",
        title: "تحقیقات کاربری و خوانش‌پذیری",
        desc: "مطالعه ارگونومی چشم و انتخاب فواصل سطر و کشیدگی مناسب در فونت وزیرمتن برای جلوگیری از خستگی چشم."
      },
      {
        step: "۰۲",
        title: "پروتوتایپ تعاملی و موشن",
        desc: "طراحی ترنزیشن‌های ورق‌خوردن صفحات با ماتریس‌های تبدیل سه‌بعدی CSS و سناریوهای حرکتی در GSAP."
      },
      {
        step: "۰۳",
        title: "معماری فرانت‌اند و کشینگ",
        desc: "طراحی کلاینت فوق‌العاده سبک با زمان بارگذاری زیر ۵۰۰ میلی‌ثانیه و بدون وابستگی به فریم‌ورک‌های حجیم."
      },
      {
        step: "۰۴",
        title: "بهینه‌سازی لایت‌هاوس و دسترس‌پذیری",
        desc: "کسب امتیاز ۱۰۰ در تمامی شاخص‌های Core Web Vitals و پشتیبانی کامل از استاندارد WCAG AAA."
      }
    ],
    metrics: [
      { value: "۹۹.۸٪", label: "رضایت در تست خوانش" },
      { value: "۰.۳۸s", label: "زمان لود کامل اولیه" },
      { value: "+۱۶۰٪", label: "افزایش ماندگاری مخاطب" },
      { value: "۱۲۰fps", label: "نرخ رندر انیمیشن‌ها" }
    ],
    nextSlug: "mod-style",
    nextTitle: "MODSTYLE",
    prevSlug: "aura-sound",
    prevTitle: "AURA SOUND"
  },
  {
    id: "02",
    slug: "mod-style",
    title: "MODSTYLE",
    subtitle: "فروشگاه آنلاین مد و لباس",
    tagline: "تجربه‌ای مدرن برای کشف، انتخاب و ساختن استایل شخصی",
    category: "پلتفرم فول‌استک فروشگاهی / مد و پوشاک",
    year: "۲۰۲۶",
    role: "Full-Stack Developer",
    technologies: ["HTML5", "Tailwind CSS", "Vanilla JavaScript (ES6+)", "Django", "Django REST Framework", "GSAP", "Lenis"],
    liveUrl: "https://modstyle.vercel.app/",
    githubUrl: "https://github.com/Amin-Ezz/OnlineShopping",
    heroImage: "/images/modstyle-hero.png",
    detailImages: [
      "/images/modstyle-hero.png",
      "/images/modstyle-discovery.png",
      "/images/modstyle-filtering.png",
      "/images/modstyle-product.png",
      "/images/modstyle-cart.png"
    ],
    accentColor: "#F2F2F0",
    overview: "ModStyle یک فروشگاه آنلاین مد و لباس است که تجربه‌ای ساده، مدرن و روان برای کشف محصولات، انتخاب استایل و خرید آنلاین ایجاد می‌کند. از کشف محصولات و دسته‌بندی‌ها تا بررسی جزئیات، مدیریت سبد خرید و تکمیل سفارش، تمام مراحل خرید در یک تجربه یکپارچه قرار گرفته‌اند.",
    problem: "در فروشگاه‌های آنلاین لباس، تعداد زیاد محصولات و دسته‌بندی‌ها می‌تواند تجربه پیدا کردن محصول مناسب را پیچیده کند. کاتالوگ‌های شلوغ، دسته‌بندی‌های ناسازگار و جریان‌های خرید پراکنده، دقیقاً جایی که کاربر باید تصمیم بگیرد بیشترین اصطکاک را ایجاد می‌کنند.",
    solution: "ModStyle فرایند کشف محصول تا خرید را در یک تجربه یکپارچه قرار می‌دهد. ساختار منظم محصولات، navigation ساده، فیلترهای کاربردی، صفحات جزئیات محصول و فرایند خرید روان باعث می‌شوند کاربر بتواند با کمترین اصطکاک از کشف محصول به خرید برسد.",
    process: [
      {
        step: "۰۱",
        title: "ساختار کاتالوگ و کشف محصول",
        desc: "طراحی دسته‌بندی‌های واضح و کالکشن‌های ادیتوریال برای تجربه‌ای بصری و متمرکز بر خود محصولات."
      },
      {
        step: "۰۲",
        title: "فیلترهای هوشمند و مقایسه",
        desc: "پیاده‌سازی فیلترهای دسته‌بندی، سایز، رنگ و قیمت برای رسیدن سریع به نتیجه درست در کاتالوگ بزرگ."
      },
      {
        step: "۰۳",
        title: "جریان خرید یکپارچه",
        desc: "اتصال صفحات جزئیات محصول، سبد خرید و Checkout در یک مسیر روان و بدون گسست."
      },
      {
        step: "۰۴",
        title: "معماری فول‌استک و مقیاس‌پذیری",
        desc: "بک‌اند ساختاریافته برای محصولات، کاربران، احراز هویت، سبد خرید و سفارش‌ها با مدل داده قابل توسعه."
      }
    ],
    metrics: [
      { value: "۲۶+", label: "محصول در کاتالوگ ساختاریافته" },
      { value: "۵", label: "دامنه API مجزا برای فروشگاه" },
      { value: "۱۰۰٪", label: "واکنش‌گرایی در تمام صفحات" },
      { value: "۱", label: "تجربه خرید یکپارچه از کشف تا پرداخت" }
    ],
    nextSlug: "project-management",
    nextTitle: "NORTHWIND",
    prevSlug: "lumina",
    prevTitle: "LUMINA"
  },
  {
    id: "03",
    slug: "project-management",
    title: "NORTHWIND",
    subtitle: "ورک‌اسپیس مدرن برای مدیریت هوشمندانه پروژه‌ها",
    tagline: "مدیریت پروژه‌ها و پیش بردن ایده‌ها در یک ورک‌اسپیس متمرکز",
    category: "وب اپلیکیشن فول‌استک / مدیریت پروژه",
    year: "۲۰۲۶",
    role: "Full-Stack Developer",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "REST API", "PostgreSQL"],
    liveUrl: "https://north-windd.vercel.app/",
    githubUrl: "https://github.com/Amin-Ezz/Project-management",
    heroImage: "/images/northwind-hero.png",
    detailImages: [
      "/images/northwind-hero.png",
      "/images/northwind-app-dashboard.webp",
      "/images/northwind-app-tasks.webp",
      "/images/northwind-app-workspace.webp",
      "/images/northwind-app-team.webp"
    ],
    accentColor: "#EBEAE8",
    overview: "NORTHWIND یک ورک‌اسپیس مشارکتی مدرن است که برای ساده‌سازی روش برنامه‌ریزی، سازمان‌دهی و مدیریت کار توسط تیم‌ها ساخته شده است. این پلتفرم پروژه‌ها، تسک‌ها، اعضای تیم، ددلاین‌ها و پیگیری پیشرفت را در یک محیط ساختاریافته و واحد گرد هم می‌آورد تا تیم‌ها بدون پیچیدگی‌های غیرضروری منظم بمانند.",
    problem: "مدیریت پروژه‌ها در ابزارهای پراکنده به سرعت پیچیده می‌شود؛ تسک‌ها گم می‌شوند، ددلاین‌ها به سختی پیگیری می‌شوند، ارتباطات تکه‌تکه می‌گردد و اعضای تیم اغلب تصویر روشنی از کار بعدی که باید انجام شود ندارند.",
    solution: "NORTHWIND کل چرخه پروژه را در یک ورک‌اسپیس واحد گرد هم می‌آورد. تیم‌ها می‌توانند پروژه بسازند، تسک‌ها را سازمان‌دهی کنند، مسئولیت‌ها را تخصیص دهند، پیشرفت را دنبال کنند و ددلاین‌ها را بدون جابه‌جایی میان ابزارهای مختلف زیر نظر بگیرند. رابط کاربری حول وضوح، سلسله‌مراتب و تعامل سریع طراحی شده است.",
    process: [
      {
        step: "۰۱",
        title: "سازمان‌دهی پروژه‌ها",
        desc: "ایجاد و مدیریت پروژه‌ها در یک ورک‌اسپیس ساختاریافته که همه جزئیات مهم را در یک جا نگه می‌دارد."
      },
      {
        step: "۰۲",
        title: "مدیریت تسک‌ها و مسئولیت‌ها",
        desc: "ایجاد تسک، تخصیص مسئول، تعیین اولویت و پیگیری پیشرفت از برنامه‌ریزی تا تکمیل."
      },
      {
        step: "۰۳",
        title: "همکاری و دید مشترک تیمی",
        desc: "هم‌راستا نگه داشتن اعضای تیم با پروژه‌های مشترک، مسئولیت‌ها و دید بلادرنگ از جریان کار."
      },
      {
        step: "۰۴",
        title: "پیگیری پیشرفت و ددلاین‌ها",
        desc: "درک سلامت پروژه از طریق نشانگرهای بصری شفاف و حفظ دائمی ددلاین‌های مهم در دید."
      }
    ],
    metrics: [
      { value: "۱۰۰٪", label: "گرد هم آمدن چرخه پروژه در یک ورک‌اسپیس" },
      { value: "۶", label: "قابلیت اصلی برای مدیریت کامل کارها" },
      { value: "۴", label: "سطح ساختاریافته: پروژه، تسک، تیم، پیشرفت" },
      { value: "۰", label: "نیاز به جابه‌جایی میان ابزارهای جدا" }
    ],
    nextSlug: "trip-os",
    nextTitle: "TRIP OS",
    prevSlug: "lumina",
    prevTitle: "LUMINA"
  },
  {
    id: "04",
    slug: "trip-os",
    title: "TRIP OS",
    subtitle: "سیستم مدیریت و برنامه‌ریزی سفر",
    tagline: "A modern travel planning platform — destinations, itineraries, and activities in one organized workspace",
    category: "وب اپلیکیشن فول‌استک / برنامه‌ریزی سفر",
    year: "۲۰۲۶",
    role: "Full-Stack Developer",
    technologies: ["HTML5", "Tailwind CSS", "JavaScript", "REST API", "PostgreSQL"],
    liveUrl: "https://trip-os-fawn.vercel.app/",
    githubUrl: "https://github.com/Amin-Ezz/trip_os",
    heroImage: "/images/tripos-hero.png",
    detailImages: [
      "/images/tripos-hero.png",
      "/images/tripos-dashboard.png",
      "/images/tripos-itinerary.png",
      "/images/tripos-destinations.png",
      "/images/tripos-workspace.png"
    ],
    accentColor: "#EDEDEC",
    overview: "TRIP OS is a travel planning platform built to simplify the entire journey planning process. Instead of managing destinations, schedules, activities, bookings, and trip details across multiple tools, travelers can organize everything inside one centralized workspace — a modern travel planning platform designed to turn complex trip planning into a clear, organized, and seamless experience.",
    problem: "Planning a trip often means dealing with scattered information across notes, maps, booking platforms, messages, and spreadsheets. As a trip becomes more complex, keeping destinations, activities, schedules, and important details organized becomes increasingly difficult. The challenge was to create a single environment that could turn this fragmented process into a clear and manageable travel workflow.",
    solution: "TRIP OS brings the entire travel planning workflow into one structured workspace. Users can organize destinations, build itineraries, manage activities, keep important trip information accessible, and maintain a clear overview of their journey. The experience focuses on reducing planning friction while giving travelers a simple and structured way to control every part of their trip.",
    process: [
      {
        step: "۰۱",
        title: "Smart Trip Organization",
        desc: "Keep destinations, activities, schedules, and important travel information organized inside a single workspace."
      },
      {
        step: "۰۲",
        title: "Itinerary Management",
        desc: "Build structured itineraries that make each day of a trip easy to understand and manage."
      },
      {
        step: "۰۳",
        title: "Destination & Activity Planning",
        desc: "Organize multiple destinations and plan activities while keeping them connected to the right destination and time."
      },
      {
        step: "۰۴",
        title: "Clear Travel Overview",
        desc: "A complete overview of the journey through a structured interface designed for fast understanding and easy navigation."
      }
    ],
    metrics: [
      { value: "۱۰۰٪", label: "گرد هم آمدن کل چرخه سفر در یک ورک‌اسپیس" },
      { value: "۶", label: "قابلیت اصلی برای مدیریت کامل سفر" },
      { value: "۴", label: "سطح ساختاریافته: سفر، مقصد، برنامه، فعالیت" },
      { value: "۰", label: "نیاز به جابه‌جایی میان ابزارهای جدا" }
    ],
    nextSlug: "lumina",
    nextTitle: "LUMINA",
    prevSlug: "project-management",
    prevTitle: "NORTHWIND"
  }
];

export const personalInfo = {
  name: "امین اسماعیل زاده",
  brandName: "AMIN.EZ",
  title: "Senior Creative Frontend Developer & Interaction Designer",
  headline: "تجربه‌های دیجیتال می‌سازم.",
  subGreeting: "سلام، من امین هستم.",
  intro: "طراحی و توسعه وب‌سایت‌های مدرن، سریع و تعاملی با تمرکز بر تجربه کاربری، تایپوگرافی دقیق و جزئیات حرکت.",
  availability: "موجود برای پروژه‌های منتخب و همکاری بین‌المللی",
  stats: [
    { value: "۳+", number: 3, suffix: "+", label: "سال تجربه حرفه‌ای" },
    { value: "۲۰+", number: 20, suffix: "+", label: "پروژه تکمیل شده" },
    { value: "۱۰+", number: 10, suffix: "+", label: "تکنولوژی مدرن" },
    { value: "۱۰۰٪", number: 100, suffix: "٪", label: "رضایت کارفرمایان" }
  ],
  skills: [
    {
      category: "FRONTEND",
      number: "01",
      desc: "معماری رابط‌های کاربری مدرن، مقیاس‌پذیر و واکنش‌گرا با تمرکز بر پرفورمنس و استانداردها",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "ES6+",
        "Tailwind CSS",
        "Vite",
        "Responsive Design"
      ]
    },
    {
      category: "BACKEND",
      number: "02",
      desc: "طراحی و پیاده‌سازی سرویس‌های سرور، پایگاه‌های داده و APIهای امن و سریع",
      items: [
        "Python",
        "Django",
        "Django REST Framework",
        "REST API",
        "JWT Authentication",
        "PostgreSQL",
        "Database Design"
      ]
    },
    {
      category: "CREATIVE WEB",
      number: "03",
      desc: "ساخت تجربه‌های تعاملی، تایم‌لاین‌های سینمایی، فیزیک مایع و موشن دیزاین پیشرفته",
      items: [
        "GSAP",
        "ScrollTrigger",
        "Lenis",
        "Web Animation",
        "Interactive UI",
        "Motion Design",
        "Responsive Interaction",
        "UI Implementation"
      ]
    },
    {
      category: "TOOLS & AI",
      number: "04",
      desc: "ابزارهای مدرن مهندسی نرم‌افزار، استقرار ابری و توسعه هدایت‌شده با هوش مصنوعی",
      items: [
        "Git",
        "GitHub",
        "Vercel",
        "Neon",
        "AI-Assisted Development",
        "Prompt Engineering",
        "AI Coding",
        "AI Workflow"
      ]
    }
  ],
  about: {
    storyParagraphs: [
      "من یک توسعه‌دهنده خلاق فرانت‌اند و طراح تعاملی هستم که در مرز باریک میان کدنویسی مهندسی دقیق و هنر بصری زندگی می‌کنم. معتقدم وب‌سایت‌ها نباید صفحاتی مرده و ایستا باشند؛ بلکه هر کلیک، اسکرول و اشاره ماوس باید حسی زنده، فیزیکی و باوقار را به مخاطب هدیه دهد.",
      "رویکرد من به پروژه‌ها بر پایه سه اصل استوار است: تایپوگرافی دقیق و احترام به خط فارسی، پرفورمنس حداکثری بدون لود بی‌دلیل اسکریپت‌های سنگین، و موشن هدفمندی که نه برای خودنمایی، بلکه برای هدایت ذهن و ایجاد لذت کاربری طراحی شده است."
    ],
    principles: [
      { title: "حرکت با هدف", desc: "هر انیمیشن دلیلی دارد و بازخوردی فیزیکی از رفتار کاربر است." },
      { title: "احترام به تایپوگرافی فارسی", desc: "فونت‌ها بر اساس هندسه و کشش متون زبان فارسی چیدمان می‌شوند." },
      { title: "عملکرد بالاتر از همه چیز", desc: "سرعت لود، نرخ ۶۰/۱۲۰ فریم و پایداری در تمام شرایط حفظ می‌شود." }
    ]
  },
  contact: {
    email: "amin.esmaeilzadehh@gmail.com",
    telegram: "https://t.me/AminOmade",
    github: "https://github.com/Amin-Ezz",
    linkedin: "https://www.linkedin.com/in/amin-esmaeil-zadeh-a99503431",
    twitter: "https://x.com/amin_dev",
    location: "تهران، ایران (همکاری بین‌المللی ریموت)"
  }
};
