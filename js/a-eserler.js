function aMesajGoster(metin, hataMi) {
  const kutusu = document.getElementById('a-durum-mesaji');
  if (!kutusu) return;
  kutusu.textContent = metin;
  kutusu.className = 'a-durum-mesaji' + (hataMi ? ' a-durum-hata' : ' a-durum-ok');
  kutusu.style.display = 'block';
}

async function aEserleriYukle() {
  const kilitli = document.getElementById('a-eserler-kilitli');
  const icerik = document.getElementById('a-eserler-icerik');
  const tablo = document.getElementById('a-eserler-tablosu');
  const kartlar = document.getElementById('a-eserler-kartlar');

  try {
    const yanit = await fetch(A_API + '/eserler', { credentials: 'same-origin' });
    const veri = await yanit.json();

    if (!veri.basarili) {
      if (kilitli) kilitli.style.display = 'block';
      if (icerik) icerik.style.display = 'none';
      return;
    }

    if (kilitli) kilitli.style.display = 'none';
    if (icerik) icerik.style.display = 'block';

    tablo.innerHTML = '';
    kartlar.innerHTML = '';

    veri.veri.forEach(function (eser) {
      const satir = document.createElement('tr');
      satir.innerHTML =
        '<td>' +
        eser.id +
        '</td><td>' +
        eser.ad +
        '</td><td>' +
        eser.atolye_adi +
        '</td><td>' +
        (eser.aciklama || '-') +
        '</td><td>' +
        parseFloat(eser.fiyat).toFixed(2) +
        '</td><td>' +
        eser.stok +
        '</td>';
      tablo.appendChild(satir);

      const kart = document.createElement('article');
      kart.className = 'a-kart';
      kart.innerHTML =
        '<h3><i class="fa-solid fa-hand-sparkles"></i> ' +
        eser.ad +
        '</h3><p><strong>Atölye:</strong> ' +
        eser.atolye_adi +
        '</p><p>' +
        (eser.aciklama || '') +
        '</p><p><strong>' +
        parseFloat(eser.fiyat).toFixed(2) +
        ' ₺</strong> — Stok: ' +
        eser.stok +
        '</p>';
      kartlar.appendChild(kart);
    });
  } catch (hata) {
    aMesajGoster('Eserler yüklenemedi: ' + hata.message, true);
  }
}

async function aEserlerSayfasiYukle() {
  const oturum = await aOturumKontrol();
  aUstButonGuncelle(document.getElementById('a-ust-buton'), oturum);
  aKorumaliBaglantilariBagla();

  if (oturum.basarili && oturum.kullanici) {
    await aEserleriYukle();
  } else {
    document.getElementById('a-eserler-kilitli').style.display = 'block';
    document.getElementById('a-eserler-icerik').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', aEserlerSayfasiYukle);
