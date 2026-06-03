# El Sanatları Atolyesi Yönetim Sistemi

Hocam, bu projede bir el sanatları atolyesi için basit ama işlev gören bir yönetim sistemi yaptım. Kullanıcı giriş, eser yönetimi ve admin paneli gibi temel özellikleri içeriyor.

## Projenin Teknik Yapısı

Hocam, bu projede şu teknolojileri kullandım:

- Backend' te Node.js + Express.js (server'ı çalıştırıp istekleri işlemek için)
- Veri Tabanı olarak MySQL (kullanıcı bilgileri ve eserleri depolamak için)

Proje başlangıcında, Express sunucusunu açıyoruz , kullanıcı isteklerini alıyoruz ve MySQL'den çektiğimiz verilerle HTML sayfalarını dinamik olarak oluşturuyoruz

## Proje Yapısı

.
├── index.html # Ana sayfa
├── giris.html # Giriş sayfası (login page)
├── kayitol.html # Kayıt sayfası
├── girisyap.html # Giriş yapıldıktan sonraki dashboard
├── eserler.html # Eserleri gösteren sayfa
├── admin.html # Admin paneli
├── iletisim.html # İletişim formu
├── style.css # CSS stilleri
├── server.js # Express sunucusu (entry point)
├── package.json # Bağımlılıklar (npm packages)
├── .gitignore # Git ignore dosyası
│
├── config/ # Yapılandırma dosyaları
│ ├── veritabani.js # MySQL bağlantısını konfigüre ettim
│ ├── oturum.js # Session yönetimi
│ ├── sifre.js # Şifre hash'leme
│ └── ayarlar.js # Genel ayarlar
│
├── js/ # Frontend JavaScript dosyaları
│ ├── a-oturum.js # Login/logout işlemleri
│ ├── a-kayitol.js # Kayıt formu validasyonu
│ ├── a-girisyap.js # Dashboard fonksiyonları
│ ├── a-eserler.js # Eserleri yönetme (CRUD)
│ ├── a-admin.js # Admin panel işlemleri
│ ├── a-iletisim.js # İletişim formu gönderimi
│ └── a-uyelik-ortak.js # Ortak fonksiyonlar
│
├── sql/ # Veritabanı şeması
│ └── sema.sql # Tabloları ve ilişkileri oluşturdum
│
└── images/ # Proje resimleri (eser görselleri vb.)

```
Projryi çalıştırmak için
# Önce npm paketlerini yükledim
npm install

# MySQL'de sema.sql dosyasını çalıştırarak tabloları oluşturdum
# Sonra config/veritabani.js dosyasında kendi MySQL bilgilerimi girdim

# Sunucuyu başlattığımda
npm start

# Tarayıcıda şu adreste açılıyor
http://localhost:3000
```

Hocam, projede şu özellikleri gerçekleştirdim:

- Kullanıcı kayıt ve giriş sistemi
- Şifreleri hash'leyerek güvenli şekilde sakladım
- El sanatı eserleri ekleme, düzenleme ve silme (CRUD işlemleri)
- Admin paneli (yöneticiler için)
- İletişim formu (ziyaretçiler yazabilsin diye)
- Session kontrolleri (giriş yapmayan kişiler sayfayı göremez)

**Öğrenci No:** 251109073
