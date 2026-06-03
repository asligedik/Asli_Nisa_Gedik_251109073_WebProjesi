document.getElementById('a-kayit-formu').addEventListener('submit', async function (olay) {
  olay.preventDefault();
  const govde = {
    ad_soyad: document.getElementById('a-kayit-ad').value.trim(),
    eposta: document.getElementById('a-kayit-eposta').value.trim(),
    sifre: document.getElementById('a-kayit-sifre').value,
  };

  const yanit = await fetch(A_API + '/kayit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(govde),
  });
  const sonuc = await yanit.json();

  if (sonuc.basarili) {
    aMesajGoster('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.', false);
    setTimeout(function () {
      window.location.href = 'girisyap.html?eposta=' + encodeURIComponent(govde.eposta);
    }, 1500);
  } else {
    aMesajGoster(sonuc.mesaj || 'Kayıt başarısız', true);
  }
});

async function aKayitSayfasiYukle() {
  const oturum = await aOturumluSayfaHazirla();
  const kayitKutusu = document.getElementById('a-kayit-kutusu');

  if (oturum.basarili && oturum.kullanici) {
    if (kayitKutusu) kayitKutusu.style.display = 'none';
    aMesajGoster('Hoş geldiniz, ' + oturum.kullanici.ad_soyad + '. Atölyelerimizi görüntüleyebilirsiniz.', false);
  } else if (kayitKutusu) {
    kayitKutusu.style.display = 'block';
  }
}

aKayitSayfasiYukle();
