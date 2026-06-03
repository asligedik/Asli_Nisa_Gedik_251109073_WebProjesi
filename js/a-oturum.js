const A_API = '/api/251109073';

async function aOturumKontrol() {
  const yanit = await fetch(A_API + '/oturum', { credentials: 'same-origin' });
  return yanit.json();
}

async function aCikisYap() {
  const yanit = await fetch(A_API + '/cikis', {
    method: 'POST',
    credentials: 'same-origin',
  });
  return yanit.json();
}

function aUstButonGuncelle(buton, oturum) {
  if (!buton) return;

  if (oturum.basarili && oturum.kullanici) {
    buton.href = '#';
    buton.classList.add('a-cikis-modu');
    buton.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Çıkış Yap';
    buton.onclick = async function (olay) {
      olay.preventDefault();
      await aCikisYap();
      alert('Çıkış yaptınız ve ana sayfaya yönlendiriliyorsunuz.');
      window.location.href = 'index.html';
    };
  } else {
    buton.href = 'kayitol.html';
    buton.classList.remove('a-cikis-modu');
    buton.innerHTML = '<i class="fa-solid fa-user-plus"></i> Kayıt Ol';
    buton.onclick = null;
  }
}

// Eserlerimiz gibi korumali sayfalara tiklamada API ile oturum kontrolu
function aKorumaliBaglantilariBagla() {
  document.querySelectorAll('.a-korumali-baglanti').forEach(function (link) {
    const hedef = link.getAttribute('data-hedef') || link.getAttribute('href');

    link.addEventListener('click', async function (olay) {
      olay.preventDefault();
      const oturum = await aOturumKontrol();

      if (oturum.basarili && oturum.kullanici) {
        window.location.href = hedef;
      } else {
        alert('Eserlerimiz sayfasını görüntülemek için giriş yapmanız gerekmektedir.');
      }
    });
  });
}
