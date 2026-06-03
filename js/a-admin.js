function aAdminMesaj(metin, hataMi) {
  const kutusu = document.getElementById('a-durum-mesaji');
  if (!kutusu) return;
  kutusu.textContent = metin;
  kutusu.className = 'a-durum-mesaji' + (hataMi ? ' a-durum-hata' : ' a-durum-ok');
  kutusu.style.display = 'block';
}

let aDuzenlenenEserId = null;

async function aAdminSayfaKontrol() {
  const oturum = await aOturumKontrol();
  const yetkisiz = document.getElementById('a-admin-yetkisiz');
  const icerik = document.getElementById('a-admin-icerik');

  if (!oturum.basarili || oturum.kullanici.rol !== 'admin') {
    if (yetkisiz) yetkisiz.style.display = 'block';
    if (icerik) icerik.style.display = 'none';
    return false;
  }

  if (yetkisiz) yetkisiz.style.display = 'none';
  if (icerik) icerik.style.display = 'block';
  return true;
}

async function aAtolyeSecenekleriYukle() {
  const select = document.getElementById('a-eser-atolye');
  const yanit = await fetch(A_API + '/atolyeler', { credentials: 'same-origin' });
  const veri = await yanit.json();
  if (!veri.basarili) return;

  select.innerHTML = '<option value="">Atölye seçin</option>';
  veri.veri.forEach(function (atolye) {
    const secenek = document.createElement('option');
    secenek.value = atolye.id;
    secenek.textContent = atolye.ad;
    select.appendChild(secenek);
  });
}

async function aAdminEserleriYukle() {
  const tablo = document.getElementById('a-admin-eser-tablosu');
  const yanit = await fetch(A_API + '/eserler', { credentials: 'same-origin' });
  const veri = await yanit.json();

  if (!veri.basarili) {
    aAdminMesaj('Eser listesi alınamadı.', true);
    return;
  }

  tablo.innerHTML = '';

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
      parseFloat(eser.fiyat).toFixed(2) +
      '</td><td>' +
      eser.stok +
      '</td><td>' +
      '<button type="button" class="a-duzenle-butonu" data-id="' +
      eser.id +
      '">Güncelle</button> ' +
      '<button type="button" class="a-sil-butonu" data-id="' +
      eser.id +
      '">Sil</button>' +
      '</td>';
    tablo.appendChild(satir);
  });

  document.querySelectorAll('.a-duzenle-butonu').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const eserId = btn.getAttribute('data-id');
      const yanit = await fetch(A_API + '/eserler/' + eserId, { credentials: 'same-origin' });
      const veri = await yanit.json();
      if (!veri.basarili) {
        aAdminMesaj('Eser bilgisi alınamadı.', true);
        return;
      }

      const eser = veri.veri;
      aDuzenlenenEserId = eser.id;
      document.getElementById('a-eser-id').value = eser.id;
      document.getElementById('a-eser-ad').value = eser.ad;
      document.getElementById('a-eser-aciklama').value = eser.aciklama || '';
      document.getElementById('a-eser-fiyat').value = eser.fiyat;
      document.getElementById('a-eser-stok').value = eser.stok;
      document.getElementById('a-eser-atolye').value = eser.atolye_id;
      document.getElementById('a-eser-form-baslik').textContent = 'Eser Güncelle (ID: ' + eser.id + ')';
      document.getElementById('a-eser-kaydet-butonu').textContent = 'Güncelle';
      document.getElementById('a-eser-iptal-butonu').style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('#a-admin-eser-tablosu .a-sil-butonu').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const eserId = btn.getAttribute('data-id');
      if (!confirm('ID ' + eserId + ' numaralı eseri silmek istediğinize emin misiniz?')) return;

      const sil = await fetch(A_API + '/eserler/' + eserId, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const sonuc = await sil.json();

      if (sonuc.basarili) {
        aAdminMesaj('Eser silindi. (ID: ' + eserId + ')', false);
        if (aDuzenlenenEserId === eserId) aEserFormuSifirla();
        await aAdminEserleriYukle();
      } else {
        aAdminMesaj(sonuc.mesaj || 'Silme başarısız', true);
      }
    });
  });
}

function aEserFormuSifirla() {
  aDuzenlenenEserId = null;
  document.getElementById('a-eser-formu').reset();
  document.getElementById('a-eser-id').value = '';
  document.getElementById('a-eser-form-baslik').textContent = 'Yeni Eser Ekle';
  document.getElementById('a-eser-kaydet-butonu').textContent = 'Eser Ekle';
  document.getElementById('a-eser-iptal-butonu').style.display = 'none';
}

async function aAdminKullanicilarYukle() {
  const tablo = document.getElementById('a-admin-kullanici-tablosu');
  const yanit = await fetch(A_API + '/kullanicilar', { credentials: 'same-origin' });
  const veri = await yanit.json();

  if (!veri.basarili) {
    aAdminMesaj('Kullanıcı listesi alınamadı.', true);
    return;
  }

  tablo.innerHTML = '';

  veri.veri.forEach(function (kullanici) {
    const satir = document.createElement('tr');
    const tarih = new Date(kullanici.kayit_tarihi).toLocaleDateString('tr-TR');
    satir.innerHTML =
      '<td>' +
      kullanici.id +
      '</td><td>' +
      kullanici.ad_soyad +
      '</td><td>' +
      kullanici.eposta +
      '</td><td>' +
      (kullanici.rol === 'admin' ? '<strong>Admin</strong>' : 'Üye') +
      '</td><td>' +
      tarih +
      '</td><td>' +
      '<button type="button" class="a-sil-butonu" data-id="' +
      kullanici.id +
      '">Sil</button>' +
      '</td>';
    tablo.appendChild(satir);
  });

  document.querySelectorAll('#a-admin-kullanici-tablosu .a-sil-butonu').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const kullaniciId = btn.getAttribute('data-id');
      if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

      const sil = await fetch(A_API + '/kullanicilar/' + kullaniciId, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const sonuc = await sil.json();

      if (sonuc.basarili) {
        aAdminMesaj('Kullanıcı silindi. (ID: ' + kullaniciId + ')', false);
        await aAdminKullanicilarYukle();
      } else {
        aAdminMesaj(sonuc.mesaj || 'Silme başarısız', true);
      }
    });
  });
}

document.getElementById('a-eser-iptal-butonu').addEventListener('click', aEserFormuSifirla);

document.getElementById('a-eser-formu').addEventListener('submit', async function (olay) {
  olay.preventDefault();

  const govde = {
    ad: document.getElementById('a-eser-ad').value.trim(),
    aciklama: document.getElementById('a-eser-aciklama').value.trim(),
    fiyat: parseFloat(document.getElementById('a-eser-fiyat').value),
    stok: parseInt(document.getElementById('a-eser-stok').value, 10),
    atolye_id: parseInt(document.getElementById('a-eser-atolye').value, 10),
  };

  let url = A_API + '/eserler';
  let yontem = 'POST';

  if (aDuzenlenenEserId) {
    url = A_API + '/eserler/' + aDuzenlenenEserId;
    yontem = 'PUT';
  }

  const yanit = await fetch(url, {
    method: yontem,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(govde),
  });
  const sonuc = await yanit.json();

  if (sonuc.basarili) {
    if (aDuzenlenenEserId) {
      aAdminMesaj('Eser güncellendi. (ID: ' + aDuzenlenenEserId + ')', false);
    } else {
      aAdminMesaj('Yeni eser eklendi. (ID: ' + sonuc.id + ')', false);
    }
    aEserFormuSifirla();
    await aAdminEserleriYukle();
  } else {
    aAdminMesaj(sonuc.mesaj || 'İşlem başarısız', true);
  }
});

async function aAdminBaslat() {
  const yetkili = await aAdminSayfaKontrol();
  if (!yetkili) return;

  await aAtolyeSecenekleriYukle();
  await aAdminEserleriYukle();
  await aAdminKullanicilarYukle();
}

document.addEventListener('DOMContentLoaded', aAdminBaslat);
