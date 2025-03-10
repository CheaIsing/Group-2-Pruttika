-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 15, 2025 at 08:56 PM
-- Server version: 5.7.43-log
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pruttika`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_agenda`
--

CREATE TABLE `tbl_agenda` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_agenda`
--

INSERT INTO `tbl_agenda` (`id`, `event_id`, `title`, `description`, `start_time`, `end_time`, `created_at`, `updated_at`) VALUES
(1, 8, 'Keynote Speech', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(2, 8, 'Keynote Speech 1', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(4, 9, 'Keynote Speech 1', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(5, 10, 'Keynote Speech', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(6, 10, 'Keynote Speech 1', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(7, 11, 'Keynote Speech', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:03:17', '2025-01-31 02:03:17'),
(8, 11, 'Keynote Speech 1', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:03:17', '2025-01-31 02:03:17'),
(9, 12, 'Keynote Speech', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:03:52', '2025-01-31 02:03:52'),
(10, 12, 'Keynote Speech 1', 'A speech by the keynote speaker.', '00:20:25', '00:20:25', '2025-01-31 02:03:52', '2025-01-31 02:03:52'),
(11, 13, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-01-31 02:09:54', '2025-02-02 20:16:04'),
(12, 13, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-01-31 02:09:54', '2025-02-02 20:16:04'),
(13, 15, 'Keynote Speech', 'A speech by the keynote speaker.', '10:10:00', '12:10:00', '2025-01-31 02:14:28', '2025-01-31 02:14:28'),
(14, 15, 'Keynote Speech 1', 'A speech by the keynote speaker.', '12:20:00', '12:30:00', '2025-01-31 02:14:28', '2025-01-31 02:14:28'),
(15, 18, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(16, 18, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:50:00', '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(17, 19, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(18, 19, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:50:00', '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(19, 20, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(20, 20, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(21, 21, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(22, 21, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(23, 22, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-04 02:09:15', '2025-02-04 02:09:15'),
(24, 22, 'agenda 1.2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-02-04 02:09:15', '2025-02-04 02:28:04'),
(25, 23, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(26, 23, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(27, 24, 'agenda1', 'hello this is agenda 1', '12:40:00', '19:50:00', '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(28, 24, 'agenda 2', 'hello this is agenda 2', '19:40:00', '20:11:00', '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(30, 27, 'dhsksdhkds', 'dshsdjhds', '09:02:00', '09:02:00', '2025-02-13 02:59:48', '2025-02-13 02:59:48'),
(31, 27, 'dsdjkhd', 'dsjdshjdsk', '09:01:00', '09:01:00', '2025-02-13 02:59:48', '2025-02-13 02:59:48');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'entertainment', '2025-01-30 02:55:50', '2025-01-30 02:55:50'),
(2, 'music', '2025-01-30 02:55:50', '2025-01-30 02:55:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_event`
--

CREATE TABLE `tbl_event` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `eng_name` varchar(255) DEFAULT NULL,
  `kh_name` varchar(255) DEFAULT NULL,
  `short_description` varchar(255) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `thumbnail` varchar(500) NOT NULL,
  `started_date` date NOT NULL,
  `ended_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `event_type` tinyint(1) NOT NULL COMMENT ' 1 for online, 2 for offline',
  `creator_id` bigint(20) UNSIGNED NOT NULL,
  `qr_img` varchar(1000) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1' COMMENT ' 1 for private, 2 for public',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_event`
--

INSERT INTO `tbl_event` (`id`, `eng_name`, `kh_name`, `short_description`, `description`, `thumbnail`, `started_date`, `ended_date`, `start_time`, `end_time`, `location`, `event_type`, `creator_id`, `qr_img`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'event3', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-05', '2024-04-05', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-30 02:54:54', '2025-02-02 22:39:23'),
(2, 'event3', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-05', '2024-04-05', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-30 02:55:59', '2025-02-02 22:41:59'),
(3, 'event4', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-05', '2024-04-05', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-30 02:56:36', '2025-01-30 02:56:36'),
(4, 'event4', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-05', '2024-04-05', '12:12:00', '13:12:00', NULL, 2, 1, NULL, 1, '2025-01-30 03:49:25', '2025-01-30 03:49:25'),
(5, 'event4', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-30 20:40:12', '2025-01-30 20:40:12'),
(6, 'event4', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-30 20:40:55', '2025-01-30 20:40:55'),
(7, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-31 01:56:55', '2025-01-31 01:56:55'),
(8, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(9, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(10, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, '1738633191452coin.png', 1, '2025-01-31 02:00:28', '2025-02-04 01:39:51'),
(11, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, 'http://example.com/path/to/organizer-qr-code.png', 1, '2025-01-31 02:03:17', '2025-01-31 02:03:17'),
(12, 'event tesing', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-31 02:03:52', '2025-01-31 02:03:52'),
(13, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-31 02:09:54', '2025-01-31 02:09:54'),
(14, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-31 02:10:35', '2025-01-31 02:10:35'),
(15, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-31 02:14:28', '2025-01-31 02:14:28'),
(16, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-01-31 02:38:02', '2025-01-31 02:38:02'),
(17, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-02-02 17:21:18', '2025-02-02 17:21:18'),
(18, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(19, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(20, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(21, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 1, NULL, 1, '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(22, 'event tesing1', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 2, NULL, 1, '2025-02-04 02:09:15', '2025-02-04 02:10:56'),
(23, 'event tesing user 2', NULL, 'bye', 'hello', '1738640132933images.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 2, NULL, 1, '2025-02-04 02:11:46', '2025-02-04 03:35:32'),
(24, 'event tesing user 2', NULL, 'bye', 'hello', 'default-events-img.jpg', '2024-04-04', '2024-04-04', '12:12:00', '13:12:00', NULL, 1, 2, NULL, 1, '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(25, 'hfsjgdjksb', NULL, 'jkhkjh', '<p>jhjkhjk</p>', 'default-events-img.jpg', '2025-02-11', '2025-02-12', '10:00:00', '18:00:00', 'sdckjnjkxb', 2, 4, NULL, 2, '2025-02-13 02:53:16', '2025-02-13 02:53:16'),
(27, 'hfsjgdjksb', NULL, 'Test God', '<p>jdhdsj</p>', '1739415589878tech.jpg', '2025-02-11', '2025-02-12', '10:00:00', '18:00:00', 'sdckjnjkxb', 2, 4, '1739415589895tech.jpg', 2, '2025-02-13 02:59:48', '2025-02-13 02:59:49'),
(28, 'hfsjgdjksb', NULL, 'wsjwhjked', '<p>shdjkdhjks</p>', '1739495654546them.jpg', '2025-02-11', '2025-02-12', '10:00:00', '18:00:00', 'sdckjnjkxb', 2, 4, NULL, 1, '2025-02-14 01:14:14', '2025-02-14 01:14:14'),
(29, 'hfsjgdjksb', NULL, 'jhj', '<p>hjkh</p>', '1739500675155swimm.jpg', '2025-02-11', '2025-02-12', '10:00:00', '18:00:00', 'sdckjnjkxb', 2, 4, '1739500670216tech.jpg', 1, '2025-02-14 02:37:49', '2025-02-14 02:37:55'),
(30, 'hfsjgdjksb', NULL, 'asdj', '<p>jhasjk</p>', '1739500935833swimm.jpg', '2025-02-11', '2025-02-12', '10:00:00', '18:00:00', NULL, 1, 4, NULL, 2, '2025-02-14 02:42:10', '2025-02-14 02:42:15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_event_category`
--

CREATE TABLE `tbl_event_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_event_category`
--

INSERT INTO `tbl_event_category` (`id`, `event_id`, `category_id`, `created_at`, `updated_at`) VALUES
(2, 2, 1, '2025-01-30 02:55:59', '2025-01-30 02:55:59'),
(3, 2, 2, '2025-01-30 02:55:59', '2025-01-30 02:55:59'),
(4, 3, 1, '2025-01-30 02:56:36', '2025-01-30 02:56:36'),
(5, 3, 2, '2025-01-30 02:56:37', '2025-01-30 02:56:37'),
(6, 4, 1, '2025-01-30 03:49:25', '2025-01-30 03:49:25'),
(7, 4, 2, '2025-01-30 03:49:25', '2025-01-30 03:49:25'),
(8, 7, 1, '2025-01-31 01:56:55', '2025-01-31 01:56:55'),
(9, 7, 2, '2025-01-31 01:56:55', '2025-01-31 01:56:55'),
(10, 8, 1, '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(11, 8, 2, '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(12, 9, 1, '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(13, 9, 2, '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(14, 10, 1, '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(15, 10, 2, '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(16, 11, 1, '2025-01-31 02:03:17', '2025-01-31 02:03:17'),
(17, 11, 2, '2025-01-31 02:03:17', '2025-01-31 02:03:17'),
(18, 12, 1, '2025-01-31 02:03:52', '2025-01-31 02:03:52'),
(19, 12, 2, '2025-01-31 02:03:52', '2025-01-31 02:03:52'),
(22, 14, 1, '2025-01-31 02:10:35', '2025-01-31 02:10:35'),
(23, 14, 2, '2025-01-31 02:10:35', '2025-01-31 02:10:35'),
(24, 15, 1, '2025-01-31 02:14:28', '2025-01-31 02:14:28'),
(25, 15, 2, '2025-01-31 02:14:28', '2025-01-31 02:14:28'),
(26, 16, 1, '2025-01-31 02:38:02', '2025-01-31 02:38:02'),
(27, 16, 2, '2025-01-31 02:38:02', '2025-01-31 02:38:02'),
(28, 17, 1, '2025-02-02 17:21:18', '2025-02-02 17:21:18'),
(29, 17, 2, '2025-02-02 17:21:18', '2025-02-02 17:21:18'),
(30, 18, 1, '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(31, 18, 2, '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(32, 19, 1, '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(33, 19, 2, '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(34, 20, 1, '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(35, 20, 2, '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(36, 21, 1, '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(37, 21, 2, '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(54, 13, 1, '2025-02-04 01:46:02', '2025-02-04 01:46:02'),
(55, 13, 2, '2025-02-04 01:46:02', '2025-02-04 01:46:02'),
(58, 23, 1, '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(59, 23, 2, '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(60, 24, 1, '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(61, 24, 2, '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(70, 22, 1, '2025-02-04 02:35:15', '2025-02-04 02:35:15'),
(71, 22, 2, '2025-02-04 02:35:15', '2025-02-04 02:35:15'),
(74, 27, 2, '2025-02-13 02:59:48', '2025-02-13 02:59:48'),
(75, 27, 1, '2025-02-13 02:59:48', '2025-02-13 02:59:48'),
(76, 28, 2, '2025-02-14 01:14:14', '2025-02-14 01:14:14'),
(77, 29, 2, '2025-02-14 02:37:49', '2025-02-14 02:37:49'),
(78, 30, 2, '2025-02-14 02:42:10', '2025-02-14 02:42:10');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_follower`
--

CREATE TABLE `tbl_follower` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `follower_id` bigint(20) UNSIGNED NOT NULL,
  `followee_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notification`
--

CREATE TABLE `tbl_notification` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 for true, 2 for false',
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_organizer`
--

CREATE TABLE `tbl_organizer` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `organization_name` varchar(50) NOT NULL,
  `bio` varchar(100) DEFAULT NULL,
  `business_email` varchar(255) NOT NULL,
  `business_phone` varchar(10) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `linkin` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 for Active, 2 for Inactive',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_organizer`
--

INSERT INTO `tbl_organizer` (`id`, `user_id`, `organization_name`, `bio`, `business_email`, `business_phone`, `location`, `facebook`, `telegram`, `tiktok`, `linkin`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'phak jane', 'hello me', 'janephak@gmail.com', '011111111', 'PP', '', '', NULL, NULL, 1, '2025-01-30 02:27:45', '2025-01-30 02:27:45'),
(2, 2, 'testing Jane', 'hello', 'jane@gmail.com', '012222222', 'KK', 'jane', '', NULL, NULL, 1, '2025-02-04 02:09:11', '2025-02-04 02:09:11'),
(3, 4, 'test1', 'Welcome', 'test1@email.com', '0234567890', 'Phnom Penh', 'test', '+855234567890', 'test001', 'test001', 1, '2025-02-13 02:48:04', '2025-02-13 02:48:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_organizer_req`
--

CREATE TABLE `tbl_organizer_req` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `organization_name` varchar(50) NOT NULL,
  `bio` varchar(100) DEFAULT NULL,
  `business_email` varchar(255) NOT NULL,
  `business_phone` varchar(10) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `linkin` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 for Pending, 2 for Approved, 3 for Rejected',
  `rejection_reason` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_organizer_req`
--

INSERT INTO `tbl_organizer_req` (`id`, `user_id`, `organization_name`, `bio`, `business_email`, `business_phone`, `location`, `facebook`, `telegram`, `tiktok`, `linkin`, `status`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 4, 'test1', 'Welcome', 'test1@email.com', '0234567890', 'Phnom Penh', 'test', '+855234567890', 'test001', 'test001', 2, NULL, '2025-02-10 01:33:06', '2025-02-13 02:48:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` bigint(20) NOT NULL,
  `expiration_time` datetime NOT NULL,
  `otp_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ticket`
--

CREATE TABLE `tbl_ticket` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_event_id` bigint(20) UNSIGNED NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '1 for issue, 2 for used',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ticketevent_type`
--

CREATE TABLE `tbl_ticketevent_type` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `type_name` varchar(25) NOT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `ticket_opacity` tinyint(6) UNSIGNED DEFAULT NULL,
  `ticket_bought` tinyint(6) UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_ticketevent_type`
--

INSERT INTO `tbl_ticketevent_type` (`id`, `event_id`, `type_name`, `price`, `ticket_opacity`, `ticket_bought`, `created_at`, `updated_at`) VALUES
(1, 4, 'VIP', 100.00, 50, 0, '2025-01-30 05:24:05', '2025-01-30 05:24:05'),
(2, 4, 'Normal', 50.00, 40, 0, '2025-01-30 05:24:05', '2025-01-30 05:24:05'),
(3, 3, 'VIP', 50.50, 30, 0, '2025-01-30 09:10:11', '2025-01-30 09:10:11'),
(4, 7, 'VIP', 100.00, NULL, 0, '2025-01-31 01:56:55', '2025-01-31 01:56:55'),
(5, 7, 'Normal', 50.00, NULL, 0, '2025-01-31 01:56:55', '2025-01-31 01:56:55'),
(6, 8, 'VIP', 100.00, NULL, 0, '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(7, 8, 'Normal', 50.00, NULL, 0, '2025-01-31 01:57:58', '2025-01-31 01:57:58'),
(8, 9, 'VIP', 100.00, NULL, 0, '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(9, 9, 'Normal', 50.00, NULL, 0, '2025-01-31 01:58:27', '2025-01-31 01:58:27'),
(10, 10, 'VIP', 100.00, 50, 0, '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(11, 10, 'Normal', 50.00, 40, 0, '2025-01-31 02:00:28', '2025-01-31 02:00:28'),
(12, 18, 'VIP', 20.50, NULL, 0, '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(13, 18, 'Normal', 10.00, NULL, 0, '2025-02-02 17:31:40', '2025-02-02 17:31:40'),
(14, 19, 'VIP', 20.50, 50, 0, '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(15, 19, 'Normal', 10.00, 40, 0, '2025-02-02 17:32:38', '2025-02-02 17:32:38'),
(16, 20, 'VIP', 20.50, 50, 0, '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(17, 20, 'Normal', 10.00, 40, 0, '2025-02-02 17:35:17', '2025-02-02 17:35:17'),
(18, 21, 'VIP', 20.50, 50, 0, '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(19, 21, 'Normal', 10.00, 40, 0, '2025-02-02 17:39:35', '2025-02-02 17:39:35'),
(20, 13, 'VIP', 20.50, 50, 0, '2025-02-02 19:31:04', '2025-02-02 20:13:42'),
(21, 13, 'Normal', 10.00, 40, 0, '2025-02-02 19:32:16', '2025-02-02 19:32:16'),
(22, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:14:48', '2025-02-02 20:14:48'),
(23, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:16:04', '2025-02-02 20:16:04'),
(24, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:18:34', '2025-02-02 20:18:34'),
(26, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:20:17', '2025-02-02 20:20:17'),
(27, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:21:26', '2025-02-02 20:21:26'),
(28, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:24:25', '2025-02-02 20:24:25'),
(29, 13, 'Normal', 10.00, 40, 0, '2025-02-02 20:27:00', '2025-02-02 20:27:00'),
(31, 13, 'Normal', 10.00, 40, 0, '2025-02-04 01:46:02', '2025-02-04 01:46:02'),
(32, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:09:15', '2025-02-04 02:35:15'),
(33, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:09:15', '2025-02-04 02:09:15'),
(34, 23, 'VIP', 20.50, 50, 0, '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(35, 23, 'Normal', 10.00, 40, 0, '2025-02-04 02:11:46', '2025-02-04 02:11:46'),
(36, 24, 'VIP', 20.50, 50, 0, '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(37, 24, 'Normal', 10.00, 40, 0, '2025-02-04 02:18:06', '2025-02-04 02:18:06'),
(38, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:21:48', '2025-02-04 02:21:48'),
(39, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:22:27', '2025-02-04 02:22:27'),
(40, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:24:22', '2025-02-04 02:24:22'),
(41, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:25:27', '2025-02-04 02:25:27'),
(42, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:25:58', '2025-02-04 02:25:58'),
(43, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:27:30', '2025-02-04 02:27:30'),
(44, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:28:04', '2025-02-04 02:28:04'),
(45, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:34:20', '2025-02-04 02:34:20'),
(46, 22, 'Normal', 10.00, 40, 0, '2025-02-04 02:35:15', '2025-02-04 02:35:15'),
(48, 27, 'Vip', 100.00, 100, 0, '2025-02-13 02:59:48', '2025-02-13 02:59:48'),
(49, 27, 'Normal', 10.00, 100, 0, '2025-02-13 02:59:48', '2025-02-13 02:59:48'),
(50, 28, 'General Admission', 0.00, 255, 0, '2025-02-14 01:14:14', '2025-02-14 01:14:14'),
(51, 29, 'General Admission', 10.00, 100, 0, '2025-02-14 02:37:49', '2025-02-14 02:37:49');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction`
--

CREATE TABLE `tbl_transaction` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `buyer_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_event_id` bigint(20) UNSIGNED NOT NULL,
  `ticket_qty` tinyint(2) NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `transaction_img` varchar(500) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 for Pending, 2 for Approved, 3 for Rejected',
  `rejection_reason` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `kh_name` varchar(50) DEFAULT NULL,
  `eng_name` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `avatar` varchar(1000) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL COMMENT '1 for Male, 2 for Female',
  `address` varchar(255) DEFAULT NULL,
  `role` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1 for Guest, 2 for Organizer, 3 for Admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1' COMMENT ' 1 for active, 2 for inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `kh_name`, `eng_name`, `email`, `password`, `phone`, `avatar`, `dob`, `gender`, `address`, `role`, `created_at`, `updated_at`, `status`) VALUES
(1, NULL, 'Phak123', 'phak@gmail.com', '$2b$10$zUXnC.oqb3HHgeVTl9fs6OyqDI9pyD8bIhoRBhwinNN3Jb/7y3W8S', NULL, NULL, NULL, NULL, NULL, 1, '2025-01-30 01:26:35', '2025-01-30 01:26:35', 1),
(2, NULL, 'jane', 'jane123@gmail.com', '$2b$10$U/MOFKlUyBTHyhwYZ02/Cuou8lR18/EfhkGpjMJjO5y13oUDgprpq', NULL, NULL, NULL, NULL, NULL, 1, '2025-01-30 05:08:23', '2025-01-30 05:08:23', 1),
(3, NULL, 'Thean', 'sokrithean098@gmail.com', '$2b$10$VXkvFvv9EHHQUBRmndla6.4vL5K7Tk/EX7mqFyTRKGoT7HfgllaQC', NULL, NULL, NULL, NULL, NULL, 1, '2025-02-04 06:34:34', '2025-02-04 06:34:34', 1),
(4, NULL, 'Ising', 'ising@gmail.com', '$2b$10$V/u7QaJ37HOLKb6cFS3I7uG5XZw2xW2smFUlC2X5hVhti9COIbVBK', NULL, NULL, NULL, NULL, NULL, 2, '2025-02-10 01:24:10', '2025-02-13 02:48:04', 1),
(5, '', 'admin', 'admin@gmail.com', '$2b$10$xEzIV0nqLQC5QglEkrROd./DrIgewdIzx8St5cGtwjk3Lga3oaIY6', '09676088', NULL, '2003-12-06', 1, 'Phnom Penh', 3, '2025-02-13 02:43:13', '2025-02-13 02:44:43', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_wishlist`
--

CREATE TABLE `tbl_wishlist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_agenda`
--
ALTER TABLE `tbl_agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_agenda_event_id_fk` (`event_id`);

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_event`
--
ALTER TABLE `tbl_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_event_creator_id_fk` (`creator_id`);

--
-- Indexes for table `tbl_event_category`
--
ALTER TABLE `tbl_event_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_event_category_ev_id_fk` (`event_id`),
  ADD KEY `tbl_event_category_ca_id_fk` (`category_id`);

--
-- Indexes for table `tbl_follower`
--
ALTER TABLE `tbl_follower`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follower_followee` (`follower_id`,`followee_id`),
  ADD KEY `tbl_follower_followee_id_fk` (`followee_id`);

--
-- Indexes for table `tbl_notification`
--
ALTER TABLE `tbl_notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_notification_event_id_fk` (`event_id`),
  ADD KEY `tbl_notification_receiver_id_fk` (`receiver_id`),
  ADD KEY `tbl_notification_sender_id_fk` (`sender_id`);

--
-- Indexes for table `tbl_organizer`
--
ALTER TABLE `tbl_organizer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_organizer_user_id_fk` (`user_id`);

--
-- Indexes for table `tbl_organizer_req`
--
ALTER TABLE `tbl_organizer_req`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `business_email` (`business_email`),
  ADD UNIQUE KEY `business_phone` (`business_phone`),
  ADD KEY `tbl_organizer_req_user_id_fk` (`user_id`);

--
-- Indexes for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_ticket`
--
ALTER TABLE `tbl_ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qr_code` (`qr_code`),
  ADD KEY `tbl_ticket_transaction_id_fk` (`transaction_id`),
  ADD KEY `tbl_ticket_ticket_event_id_fk` (`ticket_event_id`);

--
-- Indexes for table `tbl_ticketevent_type`
--
ALTER TABLE `tbl_ticketevent_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_ticketevent_type_event_id_fk` (`event_id`);

--
-- Indexes for table `tbl_transaction`
--
ALTER TABLE `tbl_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_transaction_buyer_id_fk` (`buyer_id`),
  ADD KEY `tbl_transaction_ticket_event_id_fk` (`ticket_event_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `tbl_wishlist`
--
ALTER TABLE `tbl_wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbl_wishlist_user_id_fk` (`user_id`),
  ADD KEY `tbl_wishlist_event_id_fk` (`event_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_agenda`
--
ALTER TABLE `tbl_agenda`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_event`
--
ALTER TABLE `tbl_event`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `tbl_event_category`
--
ALTER TABLE `tbl_event_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `tbl_follower`
--
ALTER TABLE `tbl_follower`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_notification`
--
ALTER TABLE `tbl_notification`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_organizer`
--
ALTER TABLE `tbl_organizer`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



-- UPDATE DATABASE - CREATE Tbl_organizer (DATE: 01/30/2025)
DROP Table tbl_organizer;

CREATE TABLE `tbl_organizer` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `organization_name` varchar(50) NOT NULL,
  `bio` varchar(100) DEFAULT NULL,
  `business_email` varchar(255) NOT NULL,
  `business_phone` varchar(10) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) NOT NULL,
  `telegram` varchar(255) NOT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `linkin` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 for Active, 2 for Inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `tbl_organizer`
  ADD CONSTRAINT `tbl_organizer_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_users` 
  CHANGE `STATUS` `status` tinyint(1) DEFAULT 1 COMMENT ' 1 for active, 2 for inactive';


-- UPDATE DATABASE (02/12/2025) - alter tbl_transaction & tbl_notification
ALTER TABLE tbl_transaction MODIFY `ticket_event_id` bigint UNSIGNED NULL;

ALTER TABLE tbl_transaction ADD COLUMN event_id bigint unsigned NOT null;

ALTER TABLE `tbl_transaction`
  ADD CONSTRAINT `tbl_transaction_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
  
ALTER TABLE `tbl_notification` ADD COLUMN organizer_req_id bigint(20) UNSIGNED NULL;

ALTER TABLE `tbl_notification` ADD COLUMN ticket_req_id bigint(20) UNSIGNED NULL;

ALTER TABLE `tbl_notification` ADD COLUMN type tinyint UNSIGNED COMMENT '1 for Approved, 2 for Rejected, 3 for Remind';

ALTER TABLE `tbl_notification`
  ADD CONSTRAINT `tbl_notification_org_req_id_fk` FOREIGN KEY (`organizer_req_id`) REFERENCES `tbl_organizer_req` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
  
ALTER TABLE `tbl_notification`
  ADD CONSTRAINT `tbl_notification_ticket_req_id_fk` FOREIGN KEY (`ticket_req_id`) REFERENCES `tbl_transaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_notification` MODIFY `is_read` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 for false, 2 for true';


-- UPDATE DATABASE (02/17/25)- alter tbl_notification
CREATE TABLE tbl_notification_type (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    kh_title VARCHAR(255),
    eng_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- drop Table
DROP TABLE tbl_notification;

CREATE TABLE `tbl_notification` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `eng_message` varchar(255) DEFAULT NULL,
  `kh_message` varchar(255) DEFAULT NULL,
  `type_id` bigint,
  `is_read` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 for false, 2 for true',
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `organizer_req_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ticket_req_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
)

ALTER TABLE `tbl_notification`
  ADD CONSTRAINT `tbl_notification_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_notification_receiver_id_fk` FOREIGN KEY (`receiver_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_notification_sender_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_notification_type_id_fk` FOREIGN KEY (`type_id`) REFERENCES `tbl_notification_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_notification_org_req_id_fk` FOREIGN KEY (`organizer_req_id`) REFERENCES `tbl_organizer_req` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_notification_ticket_req_id_fk` FOREIGN KEY (`ticket_req_id`) REFERENCES `tbl_transaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_event` ADD COLUMN join_link varchar(500) NULL;

ALTER TABLE tbl_organizer_req DROP INDEX business_email;
ALTER TABLE tbl_organizer_req DROP INDEX business_phone;


-- Update 05-03-2025
ALTER TABLE tbl_ticket ADD COLUMN `qr_code_img` text NOT NULL;
ALTER TABLE tbl_ticket DROP COLUMN qr_code;

ALTER TABLE tbl_event MODIFY `description` text NOT NULL;

-- Update 10-03-2025
ALTER TABLE tbl_ticket MODIFY COLUMN `qr_code_img` text NULL;
ALTER TABLE tbl_ticket add COLUMN qr_code varchar(255);
ALTER TABLE `tbl_ticket`
  ADD UNIQUE KEY `qr_code` (`qr_code`);
