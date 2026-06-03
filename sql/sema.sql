-- 251109073 - El Sanatlari Atolyesi veritabani semasi
CREATE DATABASE IF NOT EXISTS `251109073_el_sanatlari`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

USE `251109073_el_sanatlari`;

-- Kullanicilar tablosu (uye ve admin)
CREATE TABLE IF NOT EXISTS `251109073_kullanicilar` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ad_soyad` VARCHAR(120) NOT NULL,
  `eposta` VARCHAR(150) NOT NULL UNIQUE,
  `sifre` VARCHAR(255) NOT NULL,
  `rol` ENUM('uye', 'admin') NOT NULL DEFAULT 'uye',
  `kayit_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atolye bilgileri
CREATE TABLE IF NOT EXISTS `251109073_atolyeler` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ad` VARCHAR(100) NOT NULL,
  `aciklama` TEXT,
  `egitmen` VARCHAR(120) NOT NULL,
  `kapasite` INT NOT NULL DEFAULT 15
);

-- Eserler urunler - atolye ile iliski (JOIN icin foreign key)
CREATE TABLE IF NOT EXISTS `251109073_eserler` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ad` VARCHAR(120) NOT NULL,
  `aciklama` TEXT,
  `fiyat` DECIMAL(10, 2) NOT NULL,
  `stok` INT NOT NULL DEFAULT 0,
  `atolye_id` INT NOT NULL,
  FOREIGN KEY (`atolye_id`) REFERENCES `251109073_atolyeler`(`id`) ON DELETE CASCADE
);

-- Iletisim formundan gelen mesajlar
CREATE TABLE IF NOT EXISTS `251109073_mesajlar` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ad_soyad` VARCHAR(120) NOT NULL,
  `eposta` VARCHAR(150) NOT NULL,
  `konu` VARCHAR(80) NOT NULL,
  `iletisim_turu` VARCHAR(40) NOT NULL,
  `mesaj` TEXT NOT NULL,
  `gonderim_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin kullanicisi server.js acilirken otomatik eklenir (sifre: admin123)

INSERT INTO `251109073_atolyeler` (`ad`, `aciklama`, `egitmen`, `kapasite`) VALUES
('Seramik Atolyesi', 'Cömlek ve seramik boyama calismalari', 'Ayse Yilmaz', 12),
('Dokuma ve Tekstil', 'El tezgahinda dokuma ve nakıs', 'Mehmet Kaya', 10),
('Cam ve Mozaik', 'Vitray ve mozaik sanati', 'Zeynep Demir', 8);

INSERT INTO `251109073_eserler` (`ad`, `aciklama`, `fiyat`, `stok`, `atolye_id`) VALUES
('El Yapimi Cömlek', 'Geleneksel tornada seramik', 450.00, 5, 1),
('Dokuma Kilim', 'Yün iplik ile el dokumasi', 1200.00, 3, 2),
('Mozaik Tepsi', 'Renkli cam parcalari ile', 680.00, 7, 3),
('Seramik Kupa Seti', '4 parca boyali kupa', 320.00, 10, 1),
('Nakisli Yastik', 'El isi nakis desenli', 275.00, 6, 2);
