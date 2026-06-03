const crypto = require('crypto');
const ayarlar = require('./ayarlar');

const oturumDeposu = new Map();
const CEREZ_ADI = 'a_oturum_kimligi';

function cerezOku(istek, ad) {
  const satir = istek.headers.cookie;
  if (!satir) return null;
  const parcalar = satir.split(';');
  for (let i = 0; i < parcalar.length; i++) {
    const parca = parcalar[i].trim();
    const esit = parca.indexOf('=');
    if (esit === -1) continue;
    const anahtar = parca.substring(0, esit);
    const deger = parca.substring(esit + 1);
    if (anahtar === ad) return decodeURIComponent(deger);
  }
  return null;
}

// express-session yerine kendi oturum mantigim - sadece express ve mysql kalsin diye
function oturumMiddleware(istek, yanit, sonraki) {
  const kimlik = cerezOku(istek, CEREZ_ADI);
  istek.session = { kullanici: null };

  if (kimlik && oturumDeposu.has(kimlik)) {
    istek.session = oturumDeposu.get(kimlik);
    istek.oturumKimligi = kimlik;
  }

  istek.oturumAc = function (kullanici) {
    const yeniKimlik = crypto.randomBytes(24).toString('hex');
    istek.session = { kullanici };
    oturumDeposu.set(yeniKimlik, istek.session);
    yanit.setHeader(
      'Set-Cookie',
      `${CEREZ_ADI}=${encodeURIComponent(yeniKimlik)}; Path=/; HttpOnly; Max-Age=7200`
    );
    istek.oturumKimligi = yeniKimlik;
  };

  istek.oturumKapat = function () {
    if (istek.oturumKimligi) {
      oturumDeposu.delete(istek.oturumKimligi);
    }
    yanit.setHeader(
      'Set-Cookie',
      `${CEREZ_ADI}=; Path=/; HttpOnly; Max-Age=0`
    );
    istek.session = { kullanici: null };
  };

  sonraki();
}

module.exports = oturumMiddleware;
