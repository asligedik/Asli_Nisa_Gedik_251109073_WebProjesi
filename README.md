# El Sanatları Atolyesi Yönetim Sistemi

Hocam, bu projede bir el sanatları atolyesi için basit ama işlev gören bir yönetim sistemi yaptım. Kullanıcı giriş, eser yönetimi ve admin paneli gibi temel özellikleri içeriyor.

## Projenin Teknik Yapısı

Hocam, bu projede şu teknolojileri kullandım:

- Backend' te Node.js + Express.js (server'ı çalıştırıp istekleri işlemek için)
- Veri Tabanı olarak MySQL (kullanıcı bilgileri ve eserleri depolamak için)

Proje başlangıcında, Express sunucusunu açıyoruz , kullanıcı isteklerini alıyoruz ve MySQL'den çektiğimiz verilerle HTML sayfalarını dinamik olarak oluşturuyoruz
Projeyi çalıştırmak için

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
```
