const express = require('express');
const path = require('path');
const a_veritabanii = require('./config/veritabani');
const ayarlar = require('./config/ayarlar');
const { sifreHashle, sifreKontrol } = require('./config/sifre');
const oturumMiddleware = require('./config/oturum');

const uygulama = express();

uygulama.use(express.json());
uygulama.use(express.urlencoded({ extended: true }));
uygulama.use(oturumMiddleware);

// Hocam, burada bir admin kontrol middleware'i yazdım ki yetkisi olmayan kişiler değerli atölye yönetim panelimize erişemesin.
function aAdminGerekli(istek, yanit, sonraki) {
  if (istek.session.kullanici && istek.session.kullanici.rol === 'admin') {
    return sonraki();
  }
  return yanit.status(401).json({ basarili: false, mesaj: 'Admin girisi gerekli' });
}

function aGirisGerekli(istek, yanit, sonraki) {
  if (istek.session.kullanici) {
    return sonraki();
  }
  return yanit.status(401).json({ basarili: false, mesaj: 'Bu alan icin giris yapmalisiniz' });
}

const API = '/api/251109073';

// REST GET - eserleri listele (sadece giris yapan uyeler)
uygulama.get(`${API}/eserler`, aGirisGerekli, async (istek, yanit) => {
  try {
    // Hocam, eserleri listelerken atölye adlarını da getirebilmek için veritabanında iki tabloyu INNER JOIN ile bağladım, böylece tek sorgu yetti.
    const [satirlar] = await a_veritabanii.query(
      `SELECT e.id, e.ad, e.aciklama, e.fiyat, e.stok, e.atolye_id, a.ad AS atolye_adi
       FROM 251109073_eserler e
       INNER JOIN 251109073_atolyeler a ON e.atolye_id = a.id
       ORDER BY e.id`
    );
    yanit.json({ basarili: true, veri: satirlar });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST POST - yeni eser ekle (sadece admin)
uygulama.post(`${API}/eserler`, aAdminGerekli, async (istek, yanit) => {
  const { ad, aciklama, fiyat, stok, atolye_id } = istek.body;
  if (!ad || !fiyat || stok === undefined || !atolye_id) {
    return yanit.status(400).json({ basarili: false, mesaj: 'Tum zorunlu alanlari doldurun' });
  }
  try {
    // Hocam, yeni eser eklerken SQL Injection zafiyetini engellemek için parametreli sorgu (prepared statement) ve soru işaretleri (?) kullandım.
    const [sonuc] = await a_veritabanii.query(
      'INSERT INTO 251109073_eserler (ad, aciklama, fiyat, stok, atolye_id) VALUES (?, ?, ?, ?, ?)',
      [ad, aciklama || '', fiyat, stok, atolye_id]
    );
    yanit.status(201).json({ basarili: true, id: sonuc.insertId });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST GET - tek eser id ile getir
uygulama.get(`${API}/eserler/:id`, aGirisGerekli, async (istek, yanit) => {
  try {
    const eserId = parseInt(istek.params.id, 10);
    const [satirlar] = await a_veritabanii.query(
      `SELECT e.id, e.ad, e.aciklama, e.fiyat, e.stok, e.atolye_id, a.ad AS atolye_adi
       FROM 251109073_eserler e
       INNER JOIN 251109073_atolyeler a ON e.atolye_id = a.id
       WHERE e.id = ?`,
      [eserId]
    );
    if (satirlar.length === 0) {
      return yanit.status(404).json({ basarili: false, mesaj: 'Eser bulunamadi' });
    }
    yanit.json({ basarili: true, veri: satirlar[0] });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST PUT - eser id uzerinden guncelle (sadece admin)
uygulama.put(`${API}/eserler/:id`, aAdminGerekli, async (istek, yanit) => {
  const { ad, aciklama, fiyat, stok, atolye_id } = istek.body;
  // Hocam, güncelleme işlemi yaparken parametreden gelen ID değerini parseInt ile güvenli bir tam sayıya dönüştürüp öyle sorguya sokuyorum.
  const eserId = parseInt(istek.params.id, 10);
  if (!ad || !fiyat || stok === undefined || !atolye_id) {
    return yanit.status(400).json({ basarili: false, mesaj: 'Tum zorunlu alanlari doldurun' });
  }
  try {
    const [sonuc] = await a_veritabanii.query(
      'UPDATE 251109073_eserler SET ad=?, aciklama=?, fiyat=?, stok=?, atolye_id=? WHERE id=?',
      [ad, aciklama || '', fiyat, stok, atolye_id, eserId]
    );
    if (sonuc.affectedRows === 0) {
      return yanit.status(404).json({ basarili: false, mesaj: 'Eser bulunamadi (id: ' + eserId + ')' });
    }
    yanit.json({ basarili: true, id: eserId });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST DELETE - eser id uzerinden sil (sadece admin)
uygulama.delete(`${API}/eserler/:id`, aAdminGerekli, async (istek, yanit) => {
  try {
    const eserId = parseInt(istek.params.id, 10);
    // Hocam, DELETE isteğinde eğer sorgu başarılı olup da affectedRows 0 dönerse, eserin zaten olmadığını kontrol ediyorum.
    const [sonuc] = await a_veritabanii.query('DELETE FROM 251109073_eserler WHERE id=?', [eserId]);
    if (sonuc.affectedRows === 0) {
      return yanit.status(404).json({ basarili: false, mesaj: 'Eser bulunamadi (id: ' + eserId + ')' });
    }
    yanit.json({ basarili: true, id: eserId });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Atolyeler sadece giris yapan uyelere acik
uygulama.get(`${API}/atolyeler`, aGirisGerekli, async (istek, yanit) => {
  try {
    const [satirlar] = await a_veritabanii.query(
      'SELECT id, ad, aciklama, egitmen, kapasite FROM 251109073_atolyeler ORDER BY ad'
    );
    yanit.json({ basarili: true, veri: satirlar });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Kullanici listeleme (admin)
uygulama.get(`${API}/kullanicilar`, aAdminGerekli, async (istek, yanit) => {
  try {
    const [satirlar] = await a_veritabanii.query(
      'SELECT id, ad_soyad, eposta, rol, kayit_tarihi FROM 251109073_kullanicilar ORDER BY id'
    );
    yanit.json({ basarili: true, veri: satirlar });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Admin yeni kullanici ekler
uygulama.post(`${API}/kullanicilar`, aAdminGerekli, async (istek, yanit) => {
  const { ad_soyad, eposta, sifre, rol } = istek.body;
  if (!ad_soyad || !eposta || !sifre) {
    return yanit.status(400).json({ basarili: false, mesaj: 'Tum alanlari doldurun' });
  }
  try {
    const hash = sifreHashle(sifre);
    const kullaniciRol = rol === 'admin' ? 'admin' : 'uye';
    const [sonuc] = await a_veritabanii.query(
      'INSERT INTO 251109073_kullanicilar (ad_soyad, eposta, sifre, rol) VALUES (?, ?, ?, ?)',
      [ad_soyad, eposta, hash, kullaniciRol]
    );
    yanit.status(201).json({ basarili: true, id: sonuc.insertId });
  } catch (hata) {
    if (hata.code === 'ER_DUP_ENTRY') {
      return yanit.status(400).json({ basarili: false, mesaj: 'Bu eposta zaten kayitli' });
    }
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Kullanici silme (admin)
uygulama.delete(`${API}/kullanicilar/:id`, aAdminGerekli, async (istek, yanit) => {
  try {
    const silinecekId = parseInt(istek.params.id, 10);
    if (istek.session.kullanici.id === silinecekId) {
      return yanit.status(400).json({ basarili: false, mesaj: 'Kendi hesabinizi silemezsiniz' });
    }
    await a_veritabanii.query('DELETE FROM 251109073_kullanicilar WHERE id=?', [silinecekId]);
    yanit.json({ basarili: true });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Kayit - sifreyi veritabanina hashli yaziyorum
uygulama.post(`${API}/kayit`, async (istek, yanit) => {
  const { ad_soyad, eposta, sifre } = istek.body;
  if (!ad_soyad || !eposta || !sifre) {
    return yanit.status(400).json({ basarili: false, mesaj: 'Tum alanlari doldurun' });
  }
  try {
    // Hocam, güvenlik kuralları gereği kullanıcı şifresini veritabanına asla düz yazı (plain-text) olarak yazmıyoruz, hashleyip öyle saklıyoruz.
    const hash = sifreHashle(sifre);
    await a_veritabanii.query(
      'INSERT INTO 251109073_kullanicilar (ad_soyad, eposta, sifre, rol) VALUES (?, ?, ?, ?)',
      [ad_soyad, eposta, hash, 'uye']
    );
    yanit.status(201).json({ basarili: true, mesaj: 'Kayit tamamlandi' });
  } catch (hata) {
    if (hata.code === 'ER_DUP_ENTRY') {
      return yanit.status(400).json({ basarili: false, mesaj: 'Bu eposta zaten kayitli' });
    }
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Giris - oturum acip kullaniciyi cookie ile hatirliyoruz
uygulama.post(`${API}/giris`, async (istek, yanit) => {
  const { eposta, sifre } = istek.body;
  try {
    const [kullanicilar] = await a_veritabanii.query(
      'SELECT id, ad_soyad, eposta, sifre, rol FROM 251109073_kullanicilar WHERE eposta = ?',
      [eposta]
    );
    if (kullanicilar.length === 0) {
      return yanit.status(401).json({ basarili: false, mesaj: 'Eposta veya sifre hatali' });
    }
    const k = kullanicilar[0];
    if (!sifreKontrol(sifre, k.sifre)) {
      return yanit.status(401).json({ basarili: false, mesaj: 'Eposta veya sifre hatali' });
    }
    // Hocam, giriş yapan kullanıcının bilgilerini express oturumunda saklıyoruz ki sayfalar arasında gezerken onu tanıyabilelim (oturum yönetimi).
    istek.oturumAc({ id: k.id, ad_soyad: k.ad_soyad, eposta: k.eposta, rol: k.rol });
    yanit.json({ basarili: true, kullanici: istek.session.kullanici });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

uygulama.post(`${API}/cikis`, (istek, yanit) => {
  istek.oturumKapat();
  yanit.json({ basarili: true });
});

uygulama.get(`${API}/oturum`, (istek, yanit) => {
  if (istek.session.kullanici) {
    return yanit.json({ basarili: true, kullanici: istek.session.kullanici });
  }
  yanit.json({ basarili: false });
});

// REST GET - iletisim mesajlarini listele (sadece admin)
uygulama.get(`${API}/mesajlar`, aAdminGerekli, async (istek, yanit) => {
  try {
    const [satirlar] = await a_veritabanii.query(
      `SELECT id, ad_soyad, eposta, konu, iletisim_turu, mesaj, gonderim_tarihi
       FROM 251109073_mesajlar
       ORDER BY gonderim_tarihi DESC`
    );
    yanit.json({ basarili: true, veri: satirlar });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST POST - yeni mesaj kaydet (iletisim formu)
uygulama.post(`${API}/mesajlar`, async (istek, yanit) => {
  const { ad_soyad, eposta, konu, iletisim_turu, mesaj } = istek.body;
  try {
    await a_veritabanii.query(
      'INSERT INTO 251109073_mesajlar (ad_soyad, eposta, konu, iletisim_turu, mesaj) VALUES (?, ?, ?, ?, ?)',
      [ad_soyad, eposta, konu, iletisim_turu, mesaj]
    );
    yanit.status(201).json({ basarili: true, mesaj: 'Mesajiniz alindi' });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// REST DELETE - mesaj sil (sadece admin)
uygulama.delete(`${API}/mesajlar/:id`, aAdminGerekli, async (istek, yanit) => {
  try {
    const silinecekId = parseInt(istek.params.id, 10);
    await a_veritabanii.query('DELETE FROM 251109073_mesajlar WHERE id=?', [silinecekId]);
    yanit.json({ basarili: true });
  } catch (hata) {
    yanit.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// Admin sayfasi - sadece admin rolune izin ver
uygulama.get('/admin.html', (istek, yanit) => {
  // Hocam, giriş yapmamış veya rolü admin olmayan kişilerin doğrudan admin.html yazarak girmesini engelliyor, onları giriş sayfasına yönlendiriyorum.
  if (!istek.session.kullanici || istek.session.kullanici.rol !== 'admin') {
    return yanit.redirect('/girisyap.html?yonlendir=admin');
  }
  yanit.sendFile(path.join(__dirname, 'admin.html'));
});

uygulama.use(express.static(__dirname));

async function varsayilanAdminOlustur() {
  try {
    // 1. Genel Admin Hesabı
    const [satirlar] = await a_veritabanii.query(
      "SELECT id FROM 251109073_kullanicilar WHERE eposta = 'admin@atolye.com' LIMIT 1"
    );
    if (satirlar.length === 0) {
      await a_veritabanii.query(
        'INSERT INTO 251109073_kullanicilar (ad_soyad, eposta, sifre, rol) VALUES (?, ?, ?, ?)',
        ['Atolye Yoneticisi', 'admin@atolye.com', sifreHashle('admin123'), 'admin']
      );
      console.log('Varsayilan admin hazir: admin@atolye.com / admin123 (tarayicidan giris yapin)');
    }

    // 2. Ozel Admin Hesabi (Asli Gedik)
    const [satirlarOzel] = await a_veritabanii.query(
      "SELECT id FROM 251109073_kullanicilar WHERE eposta = 'asli@atolye.com' LIMIT 1"
    );
    if (satirlarOzel.length === 0) {
      await a_veritabanii.query(
        'INSERT INTO 251109073_kullanicilar (ad_soyad, eposta, sifre, rol) VALUES (?, ?, ?, ?)',
        ['Aslı Gedik', 'asli@atolye.com', sifreHashle('asli123'), 'admin']
      );
      console.log('Ozel admin hazir: asli@atolye.com / asli123 (tarayicidan giris yapin)');
    }
  } catch (hata) {
    console.error('HATA - MySQL baglantisi kurulamadi:', hata.message);
    console.error('Cozum: MySQL calissin, sql/sema.sql import edilsin, config/ayarlar.js sifresi kontrol edilsin.');
  }
}

varsayilanAdminOlustur();

uygulama.listen(ayarlar.port, () => {
  console.log('El Sanatlari Atolyesi http://localhost:3001');
});
