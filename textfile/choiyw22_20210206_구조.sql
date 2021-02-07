/*
SQLyog Community v13.1.5  (32 bit)
MySQL - 5.1.61-log : Database - choiyw22
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`choiyw22` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `choiyw22`;

/*Table structure for table `access_list` */

DROP TABLE IF EXISTS `access_list`;

CREATE TABLE `access_list` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_ip` varchar(15) NOT NULL,
  `cre_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=3124 DEFAULT CHARSET=utf8;

/*Table structure for table `access_log` */

DROP TABLE IF EXISTS `access_log`;

CREATE TABLE `access_log` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `ymd` varchar(8) NOT NULL,
  `cnt` int(11) DEFAULT '0',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `ymd` (`ymd`)
) ENGINE=MyISAM AUTO_INCREMENT=676 DEFAULT CHARSET=utf8;

/*Table structure for table `asmonel` */

DROP TABLE IF EXISTS `asmonel`;

CREATE TABLE `asmonel` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `u_seq` int(11) NOT NULL,
  `ymd` varchar(8) NOT NULL,
  `score1` int(11) DEFAULT '0',
  `score2` int(11) DEFAULT '0',
  `scoresum` int(11) DEFAULT '0',
  `cre_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seq`),
  UNIQUE KEY `uk_asmonel` (`u_seq`,`ymd`)
) ENGINE=MyISAM AUTO_INCREMENT=221 DEFAULT CHARSET=utf8;

/*Table structure for table `ass_info` */

DROP TABLE IF EXISTS `ass_info`;

CREATE TABLE `ass_info` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `a_name` varchar(50) NOT NULL,
  `a_type` varchar(50) NOT NULL,
  `a_level` int(11) DEFAULT '5',
  `a_option1` varchar(50) NOT NULL,
  `a_option2` varchar(50) NOT NULL,
  `a_option3` varchar(50) DEFAULT NULL,
  `a_option4` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

/*Table structure for table `ass_skill` */

DROP TABLE IF EXISTS `ass_skill`;

CREATE TABLE `ass_skill` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` varchar(50) DEFAULT NULL,
  `s_name` varchar(50) NOT NULL,
  `skill_num` char(1) DEFAULT '1',
  `skill_name` varchar(50) NOT NULL,
  `skill_text` varchar(1024) NOT NULL,
  `skill_data` varchar(512) NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Table structure for table `battle_list` */

DROP TABLE IF EXISTS `battle_list`;

CREATE TABLE `battle_list` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `card_seq` int(11) NOT NULL,
  `b_name` varchar(50) NOT NULL,
  `user_uid` varchar(50) DEFAULT NULL,
  `w_seq` int(11) DEFAULT NULL,
  `w_stone1_name` varchar(50) DEFAULT NULL,
  `w_stone1_option` varchar(50) DEFAULT NULL,
  `w_stone2_name` varchar(50) DEFAULT NULL,
  `w_stone2_option` varchar(50) DEFAULT NULL,
  `w_skill1_seq` int(11) DEFAULT NULL,
  `w_skill2_seq` int(11) DEFAULT NULL,
  `d_seq` int(11) DEFAULT NULL,
  `d_stone1_name` varchar(50) DEFAULT NULL,
  `d_stone1_option` varchar(50) DEFAULT NULL,
  `d_stone2_name` varchar(50) DEFAULT NULL,
  `d_stone2_option` varchar(50) DEFAULT NULL,
  `d_skill1_seq` int(11) DEFAULT NULL,
  `d_skill2_seq` int(11) DEFAULT NULL,
  `a_seq` int(11) DEFAULT NULL,
  `a_stone1_name` varchar(50) DEFAULT NULL,
  `a_stone1_option` varchar(50) DEFAULT NULL,
  `a_stone2_name` varchar(50) DEFAULT NULL,
  `a_stone2_option` varchar(50) DEFAULT NULL,
  `a_skill1_seq` int(11) DEFAULT NULL,
  `a_skill2_seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `card_info` */

DROP TABLE IF EXISTS `card_info`;

CREATE TABLE `card_info` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `cardname` varchar(255) NOT NULL,
  `cardlevel` varchar(25) NOT NULL,
  `cardtype` varchar(25) NOT NULL,
  `cardrace` varchar(25) NOT NULL,
  `cardactpower` varchar(25) NOT NULL,
  `cardactive1` varchar(255) DEFAULT NULL,
  `cardactive1_waiting` varchar(5) DEFAULT '0',
  `cardactive2` varchar(255) DEFAULT NULL,
  `cardactive2_waiting` varchar(5) DEFAULT '0',
  `cardpassive1` varchar(255) DEFAULT NULL,
  `cardpassive2` varchar(255) DEFAULT NULL,
  `maineffect` varchar(255) DEFAULT NULL,
  `cardimage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=168 DEFAULT CHARSET=utf8;

/*Table structure for table `card_info_detail` */

DROP TABLE IF EXISTS `card_info_detail`;

CREATE TABLE `card_info_detail` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `main_seq` int(11) NOT NULL,
  `card_lv` int(11) DEFAULT '80',
  `card_star` int(11) DEFAULT '5',
  `card_health` int(11) DEFAULT '0',
  `card_attack` int(11) DEFAULT '0',
  `card_defense` int(11) DEFAULT '0',
  `card_active1_name` varchar(50) NOT NULL,
  `card_active1_text` varchar(1024) NOT NULL,
  `card_active1_data` varchar(512) DEFAULT NULL,
  `card_active1_ex_time` int(11) DEFAULT '0',
  `card_active2_name` varchar(50) NOT NULL,
  `card_active2_text` varchar(1024) NOT NULL,
  `card_active2_data` varchar(512) DEFAULT NULL,
  `card_active2_ex_time` int(11) DEFAULT '0',
  `card_passive1_name` varchar(50) NOT NULL,
  `card_passive1_text` varchar(1024) NOT NULL,
  `card_passive1_data` varchar(512) DEFAULT NULL,
  `card_passive2_name` varchar(50) NOT NULL,
  `card_passive2_text` varchar(1024) NOT NULL,
  `card_passive2_data` varchar(512) DEFAULT NULL,
  `card_info` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`seq`),
  UNIQUE KEY `UK_card_info_detail` (`main_seq`,`card_lv`,`card_star`)
) ENGINE=MyISAM AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;

/*Table structure for table `days` */

DROP TABLE IF EXISTS `days`;

CREATE TABLE `days` (
  `dd` int(11) NOT NULL,
  PRIMARY KEY (`dd`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `defense_info` */

DROP TABLE IF EXISTS `defense_info`;

CREATE TABLE `defense_info` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `d_name` varchar(50) NOT NULL,
  `d_type` varchar(50) NOT NULL,
  `d_level` int(11) DEFAULT '5',
  `d_option1` varchar(50) NOT NULL,
  `d_option2` varchar(50) NOT NULL,
  `d_option3` varchar(50) DEFAULT NULL,
  `d_option4` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

/*Table structure for table `defense_skill` */

DROP TABLE IF EXISTS `defense_skill`;

CREATE TABLE `defense_skill` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` varchar(50) DEFAULT NULL,
  `s_name` varchar(50) NOT NULL,
  `skill_num` char(1) DEFAULT '1',
  `skill_name` varchar(50) NOT NULL,
  `skill_text` varchar(1024) NOT NULL,
  `skill_data` varchar(512) NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(10) unsigned NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `user_login_info` */

DROP TABLE IF EXISTS `user_login_info`;

CREATE TABLE `user_login_info` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `seq_fk` int(11) NOT NULL,
  `user_ip` varchar(15) NOT NULL,
  `cre_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=566 DEFAULT CHARSET=utf8;

/*Table structure for table `user_table` */

DROP TABLE IF EXISTS `user_table`;

CREATE TABLE `user_table` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) NOT NULL,
  `pwd` varchar(64) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(150) DEFAULT NULL,
  `loginCode` varchar(10) DEFAULT NULL,
  `STATUS` int(11) DEFAULT '0',
  `cre_date` varchar(10) DEFAULT NULL,
  `account_cnt` int(11) DEFAULT '1',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `user_table_unique` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

/*Table structure for table `weapon_info` */

DROP TABLE IF EXISTS `weapon_info`;

CREATE TABLE `weapon_info` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `w_name` varchar(50) NOT NULL,
  `w_type` varchar(50) NOT NULL,
  `w_level` int(11) DEFAULT '5',
  `w_option1` varchar(50) NOT NULL,
  `w_option2` varchar(50) NOT NULL,
  `w_option3` varchar(50) DEFAULT NULL,
  `w_option4` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

/*Table structure for table `weapon_skill` */

DROP TABLE IF EXISTS `weapon_skill`;

CREATE TABLE `weapon_skill` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` varchar(50) DEFAULT NULL,
  `s_name` varchar(50) NOT NULL,
  `skill_num` char(1) DEFAULT '1',
  `skill_name` varchar(50) NOT NULL,
  `skill_text` varchar(1024) NOT NULL,
  `skill_data` varchar(512) NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
