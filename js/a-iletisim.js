// Hocam, iletisim formunun post isteklerini yonetmek icin bu scripti yazdim.
// A_API degiskeni ustteki a-oturum.js dosyasindan otomatik olarak geliyor.

function aMesajGoster(metin, hataMi) {
  const kutusu = document.getElementById('a-durum-mesaji');
  if (!kutusu) return;
  kutusu.textContent = metin;
  kutusu.className = 'a-durum-mesaji' + (hataMi ? ' a-durum-hata' : ' a-durum-ok');
  kutusu.style.display = 'block';
  // Hocam, durum mesajinin ekranda guzelce gorulmesi icin sayfayi mesaja dogru kaydiriyorum.
  kutusu.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('a-iletisim-formu').addEventListener('submit', async function (olay) {
  olay.preventDefault();

  // Form elemanlarinin degerlerini aliyoruz
  const ad_soyad = document.getElementById('a-iletisim-ad').value.trim();
  const eposta = document.getElementById('a-iletisim-eposta').value.trim();
  const konu = document.getElementById('a-iletisim-konu').value;
  
  // Radio buton degerini secili olan elemandan aliyoruz
  const seciliRadio = document.querySelector('input[name="a-iletisim-turu"]:checked');
  const iletisim_turu = seciliRadio ? seciliRadio.value : 'E-posta';
  
  const mesaj = document.getElementById('a-iletisim-mesaj').value.trim();

  // API'ye gonderecegimiz JSON verisi
  const govde = {
    ad_soyad: ad_soyad,
    eposta: eposta,
    konu: konu,
    iletisim_turu: iletisim_turu,
    mesaj: mesaj
  };

  try {
    const yanit = await fetch(A_API + '/mesajlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(govde)
    });

    const sonuc = await yanit.json();

    if (sonuc.basarili) {
      aMesajGoster('Harika! Mesajınız başarıyla atölyemize iletildi. En kısa sürede geri dönüş yapacağız.', false);
      document.getElementById('a-iletisim-formu').reset();
    } else {
      aMesajGoster(sonuc.mesaj || 'Mesaj iletilemedi, lütfen bilgilerinizi kontrol edin.', true);
    }
  } catch (hata) {
    aMesajGoster('Hata - Sunucuyla bağlantı kurulamadı: ' + hata.message, true);
  }
});
