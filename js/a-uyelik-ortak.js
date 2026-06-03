function aMesajGoster(metin, hataMi) {
  const kutusu = document.getElementById('a-durum-mesaji');
  if (!kutusu) return;
  kutusu.textContent = metin;
  kutusu.className = 'a-durum-mesaji' + (hataMi ? ' a-durum-hata' : ' a-durum-ok');
  kutusu.style.display = 'block';
}

async function aAtolyeleriYukle() {
  const kilitli = document.getElementById('a-atolyeler-kilitli');
  const icerik = document.getElementById('a-atolyeler-icerik');
  const liste = document.getElementById('a-atolyeler-liste');
  if (!kilitli || !icerik || !liste) return;

  try {
    const yanit = await fetch(A_API + '/atolyeler', { credentials: 'same-origin' });
    const veri = await yanit.json();

    if (!veri.basarili) {
      kilitli.style.display = 'block';
      icerik.style.display = 'none';
      return;
    }

    kilitli.style.display = 'none';
    icerik.style.display = 'block';
    liste.innerHTML = '';

    veri.veri.forEach(function (atolye) {
      const kart = document.createElement('article');
      kart.className = 'a-kart';
      kart.innerHTML =
        '<h3><i class="fa-solid fa-palette"></i> ' +
        atolye.ad +
        '</h3><p><strong>Eğitmen:</strong> ' +
        atolye.egitmen +
        '</p><p>' +
        (atolye.aciklama || '') +
        '</p><p><em>Kapasite: ' +
        atolye.kapasite +
        ' kişi</em></p>';
      liste.appendChild(kart);
    });
  } catch (hata) {
    aMesajGoster('Atölyeler yüklenemedi: ' + hata.message, true);
  }
}

async function aOturumluSayfaHazirla() {
  const oturum = await aOturumKontrol();
  const ustButon = document.getElementById('a-ust-buton');
  aUstButonGuncelle(ustButon, oturum);

  if (oturum.basarili && oturum.kullanici) {
    await aAtolyeleriYukle();
  } else {
    const kilitli = document.getElementById('a-atolyeler-kilitli');
    const icerik = document.getElementById('a-atolyeler-icerik');
    if (kilitli) kilitli.style.display = 'block';
    if (icerik) icerik.style.display = 'none';
  }

  return oturum;
}
