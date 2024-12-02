/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

/*!40103 SET TIME_ZONE='+00:00' */;
USE `asterisk`;
CREATE TABLE `rest_pjsip_trunks_custom_flags` (
  `provider_id` bigint(20) NOT NULL,
  `keyword` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `value` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`provider_id`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
