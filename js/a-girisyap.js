document.getElementById('a-giris-formu').addEventListener('submit', async function (olay) {
  olay.preventDefault();
  const govde = {
    eposta: document.getElementById('a-giris-eposta').value.trim(),
    sifre: document.getElementById('a-giris-sifre').value,
  };

  const yanit = await fetch(A_API + '/giris', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(govde),
  });
  const sonuc = await yanit.json();

  if (sonuc.basarili) {
    aMesajGoster('Hoş geldiniz, ' + sonuc.kullanici.ad_soyad, false);
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    aMesajGoster(sonuc.mesaj || 'Giriş başarısız', true);
  }
});

async function aGirisSayfasiYukle() {
  const oturum = await aOturumluSayfaHazirla();
  const girisKutusu = document.getElementById('a-giris-kutusu');
  const parametreler = new URLSearchParams(window.location.search);
  const epostaParam = parametreler.get('eposta');

  if (epostaParam) {
    document.getElementById('a-giris-eposta').value = epostaParam;
  }

  if (oturum.basarili && oturum.kullanici) {
    if (girisKutusu) girisKutusu.style.display = 'none';
    if (parametreler.get('yonlendir') === 'admin' && oturum.kullanici.rol === 'admin') {
      window.location.href = 'admin.html';
    }
  } else if (girisKutusu) {
    girisKutusu.style.display = 'block';
  }
}

aGirisSayfasiYukle();
