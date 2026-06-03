const crypto = require('crypto');
const ayarlar = require('./ayarlar');

// Hocam ek paket kullanmadan Node icindeki crypto ile sifreyi hashliyorum
function sifreHashle(duzSifre) {
  return crypto
    .createHash('sha256')
    .update(duzSifre + ayarlar.sifreTuzu)
    .digest('hex');
}

function sifreKontrol(duzSifre, kayitliHash) {
  return sifreHashle(duzSifre) === kayitliHash;
}

module.exports = { sifreHashle, sifreKontrol };
