-- =====================================================
-- SEED DATA CHO DEMO - Web Booking Tour Viet Nam
-- Database: PostgreSQL (mytour_db)
-- Chay file nay sau khi BE da khoi dong (ddl-auto=update tao bang)
-- =====================================================

-- =====================================================
-- 0. XOA TOAN BO DATA CU (theo thu tu FK)
-- =====================================================
DELETE FROM bookings;
DELETE FROM tour_departures;
DELETE FROM tour_templates;
DELETE FROM categories;
DELETE FROM drivers;
DELETE FROM users;

-- Reset sequence cho bang co auto-increment
ALTER SEQUENCE IF EXISTS bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

-- =====================================================
-- 1. CATEGORIES (5 danh muc tour)
-- =====================================================
INSERT INTO categories (id, company_id, name, image_url, created_at, updated_at) VALUES
('cat_bien',    'company_1', 'Bien Dao',      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', NOW(), NOW()),
('cat_nui',     'company_1', 'Nui Rung',      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', NOW(), NOW()),
('cat_disanvh', 'company_1', 'Di San Van Hoa', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80', NOW(), NOW()),
('cat_sinh',    'company_1', 'Sinh Thai',     'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&q=80', NOW(), NOW()),
('cat_thanh',   'company_1', 'Thanh Pho',     'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. TOUR TEMPLATES (10 tour hap dan)
-- =====================================================

-- Tour 1: Vinh Ha Long
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_01', 'company_1', 'cat_bien', 'Vinh Ha Long 3N2D - Di San The Gioi',
 'Ha Long, Quang Ninh',
 '<h2>Kham pha Vinh Ha Long - Di san thien nhien the gioi</h2>
<p>Hanh trinh 3 ngay 2 dem tren du thuyen 5 sao, kham pha hang dong ky bi, cheo kayak giua hang ngan dao da voi.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Ha Noi - Ha Long, len du thuyen, tham hang Sung Sot</li>
<li><strong>Ngay 2:</strong> Cheo kayak tai lang chai, tham dao Ti Top</li>
<li><strong>Ngay 3:</strong> Ngam binh minh, ve Ha Noi</li>
</ul>
<h3>Bao gom</h3>
<ul><li>Du thuyen 5 sao, bua an, huong dan vien</li></ul>',
 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80',
 4500000, 10, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 2: Da Nang - Hoi An
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_02', 'company_1', 'cat_thanh', 'Da Nang - Hoi An 4N3D',
 'Da Nang, Hoi An',
 '<h2>Da Nang - Hoi An: Thanh pho dang song nhat Viet Nam</h2>
<p>Trai nghiem cau Vang Ba Na Hills, pho co Hoi An lung linh den long, tam bien My Khe.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> San bay Da Nang, bien My Khe, cau Rong</li>
<li><strong>Ngay 2:</strong> Ba Na Hills - Cau Vang ca ngay</li>
<li><strong>Ngay 3:</strong> Pho co Hoi An, hoc lam den long</li>
<li><strong>Ngay 4:</strong> Ngu Hanh Son, mua sam, ve</li>
</ul>',
 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80',
 5200000, 15, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 3: Phu Quoc
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_03', 'company_1', 'cat_bien', 'Phu Quoc Paradise 4N3D',
 'Phu Quoc, Kien Giang',
 '<h2>Dao Ngoc Phu Quoc - Thien duong nhiet doi</h2>
<p>Lan ngam san ho, tham vuon tieu, nha thung, ngam hoang hon tai Sunset Town.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Bay den Phu Quoc, check-in resort, bien Sao</li>
<li><strong>Ngay 2:</strong> Tour 4 dao, lan ngam san ho</li>
<li><strong>Ngay 3:</strong> VinWonders, Safari, Sunset Town</li>
<li><strong>Ngay 4:</strong> Cho dem, mua sam, bay ve</li>
</ul>',
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80',
 6800000, 20, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 4: Sapa
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_04', 'company_1', 'cat_nui', 'Sapa - Fansipan 3N2D',
 'Sapa, Lao Cai',
 '<h2>Sapa - Noc nha Dong Duong</h2>
<p>Chinh phuc dinh Fansipan 3143m, trekking ban Cat Cat, ngam ruong bac thang tuyet dep.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Ha Noi - Sapa, ban Cat Cat, cho dem</li>
<li><strong>Ngay 2:</strong> Chinh phuc Fansipan bang cap treo</li>
<li><strong>Ngay 3:</strong> Thung lung Muong Hoa, ve Ha Noi</li>
</ul>',
 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=1200&q=80',
 3800000, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 5: Nha Trang
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_05', 'company_1', 'cat_bien', 'Nha Trang - Vinh Nha Phu 3N2D',
 'Nha Trang, Khanh Hoa',
 '<h2>Nha Trang - Thanh pho bien xinh dep</h2>
<p>Tam bien, tham Vinpearl Land, tour 4 dao, an hai san tuoi song.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Bay den Nha Trang, bien Tran Phu, thap Ponagar</li>
<li><strong>Ngay 2:</strong> Tour 4 dao, lan ngam san ho</li>
<li><strong>Ngay 3:</strong> Vinpearl Land, bay ve</li>
</ul>',
 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80',
 3500000, 10, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 6: Da Lat
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_06', 'company_1', 'cat_nui', 'Da Lat - Thanh Pho Nghin Hoa 3N2D',
 'Da Lat, Lam Dong',
 '<h2>Da Lat - Thanh pho suong mu lang man</h2>
<p>Tham vuon hoa, thac Datanla, ho Tuyen Lam, Crazy House, cho dem Da Lat.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Bay den Da Lat, ho Xuan Huong, cho dem</li>
<li><strong>Ngay 2:</strong> Thac Datanla, ho Tuyen Lam, lang Cu Lan</li>
<li><strong>Ngay 3:</strong> Vuon hoa, Crazy House, bay ve</li>
</ul>',
 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=1200&q=80',
 3200000, 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 7: Hue
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_07', 'company_1', 'cat_disanvh', 'Hue - Co Do Di San 2N1D',
 'Hue, Thua Thien Hue',
 '<h2>Hue - Co do trieu Nguyen</h2>
<p>Tham Dai Noi, lang Minh Mang, lang Khai Dinh, chua Thien Mu, song Huong.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Dai Noi Hue, chua Thien Mu, thuyen song Huong</li>
<li><strong>Ngay 2:</strong> Lang Minh Mang, lang Khai Dinh, cho Dong Ba</li>
</ul>',
 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80',
 2800000, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 8: Mekong Delta
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_08', 'company_1', 'cat_sinh', 'Mien Tay Song Nuoc 2N1D',
 'Can Tho, Ben Tre',
 '<h2>Mien Tay - Song nuoc huu tinh</h2>
<p>Cho noi Cai Rang, vuon trai cay, lam banh dan gian, hat don ca tai tu.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Sai Gon - Ben Tre, cheo xuong kenh rach, vuon dua</li>
<li><strong>Ngay 2:</strong> Cho noi Cai Rang Can Tho, ve Sai Gon</li>
</ul>',
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80',
 2200000, 10, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 9: Quy Nhon
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_09', 'company_1', 'cat_bien', 'Quy Nhon - Pho Yen 3N2D',
 'Quy Nhon, Binh Dinh',
 '<h2>Quy Nhon - Vung dat binh yen</h2>
<p>Bien Ky Co tuyet dep, Eo Gio hung vi, thap Banh It nghin nam, hai san tuoi ngon.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Bay den Quy Nhon, bien Ky Co, Eo Gio</li>
<li><strong>Ngay 2:</strong> Thap Banh It, Cu Lao Xanh, lan bien</li>
<li><strong>Ngay 3:</strong> Ghenh Rang, Thi Nai, bay ve</li>
</ul>',
 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80',
 3600000, 15, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Tour 10: Ha Giang
INSERT INTO tour_templates (id, company_id, category_id, name, destination, description_html, image_url, default_price, discount_percent, created_at, updated_at) VALUES
('tour_10', 'company_1', 'cat_nui', 'Ha Giang Loop 4N3D - Cuc Bac To Quoc',
 'Ha Giang',
 '<h2>Ha Giang - Hanh trinh huyen thoai</h2>
<p>Deo Ma Pi Leng hung vi, song Nho Que xanh ngoc, Lung Cu cot co, Dong Van pho co.</p>
<h3>Lich trinh</h3>
<ul>
<li><strong>Ngay 1:</strong> Ha Noi - Ha Giang, cong troi Quan Ba</li>
<li><strong>Ngay 2:</strong> Yen Minh - Dong Van - pho co</li>
<li><strong>Ngay 3:</strong> Lung Cu - Ma Pi Leng - song Nho Que</li>
<li><strong>Ngay 4:</strong> Du Gia - ve Ha Noi</li>
</ul>',
 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=1200&q=80',
 4200000, 10, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. TOUR DEPARTURES (Lich khoi hanh - moi tour 2 lich)
-- =====================================================
INSERT INTO tour_departures (id, template_id, company_id, start_date, end_date, original_price, discount_percent, price, total_slots, booked_slots, status, created_at, updated_at) VALUES
-- Ha Long
('dep_01a', 'tour_01', 'company_1', '2026-04-10', '2026-04-12', 4500000, 10, 4050000, 30, 5, 'Confirmed', NOW(), NOW()),
('dep_01b', 'tour_01', 'company_1', '2026-04-25', '2026-04-27', 4500000, 10, 4050000, 30, 0, 'Pending', NOW(), NOW()),
-- Da Nang - Hoi An
('dep_02a', 'tour_02', 'company_1', '2026-04-15', '2026-04-18', 5200000, 15, 4420000, 25, 8, 'Confirmed', NOW(), NOW()),
('dep_02b', 'tour_02', 'company_1', '2026-05-01', '2026-05-04', 5200000, 15, 4420000, 25, 0, 'Pending', NOW(), NOW()),
-- Phu Quoc
('dep_03a', 'tour_03', 'company_1', '2026-04-20', '2026-04-23', 6800000, 20, 5440000, 20, 12, 'Confirmed', NOW(), NOW()),
('dep_03b', 'tour_03', 'company_1', '2026-05-10', '2026-05-13', 6800000, 20, 5440000, 20, 0, 'Pending', NOW(), NOW()),
-- Sapa
('dep_04a', 'tour_04', 'company_1', '2026-04-12', '2026-04-14', 3800000, 5, 3610000, 35, 10, 'Confirmed', NOW(), NOW()),
('dep_04b', 'tour_04', 'company_1', '2026-05-05', '2026-05-07', 3800000, 5, 3610000, 35, 0, 'Pending', NOW(), NOW()),
-- Nha Trang
('dep_05a', 'tour_05', 'company_1', '2026-04-18', '2026-04-20', 3500000, 10, 3150000, 30, 6, 'Confirmed', NOW(), NOW()),
('dep_05b', 'tour_05', 'company_1', '2026-05-15', '2026-05-17', 3500000, 10, 3150000, 30, 0, 'Pending', NOW(), NOW()),
-- Da Lat
('dep_06a', 'tour_06', 'company_1', '2026-04-22', '2026-04-24', 3200000, 0, 3200000, 30, 3, 'Confirmed', NOW(), NOW()),
('dep_06b', 'tour_06', 'company_1', '2026-05-08', '2026-05-10', 3200000, 0, 3200000, 30, 0, 'Pending', NOW(), NOW()),
-- Hue
('dep_07a', 'tour_07', 'company_1', '2026-04-14', '2026-04-15', 2800000, 5, 2660000, 40, 15, 'Confirmed', NOW(), NOW()),
('dep_07b', 'tour_07', 'company_1', '2026-05-20', '2026-05-21', 2800000, 5, 2660000, 40, 0, 'Pending', NOW(), NOW()),
-- Mien Tay
('dep_08a', 'tour_08', 'company_1', '2026-04-16', '2026-04-17', 2200000, 10, 1980000, 35, 20, 'Confirmed', NOW(), NOW()),
('dep_08b', 'tour_08', 'company_1', '2026-05-12', '2026-05-13', 2200000, 10, 1980000, 35, 0, 'Pending', NOW(), NOW()),
-- Quy Nhon
('dep_09a', 'tour_09', 'company_1', '2026-04-24', '2026-04-26', 3600000, 15, 3060000, 25, 4, 'Confirmed', NOW(), NOW()),
('dep_09b', 'tour_09', 'company_1', '2026-05-18', '2026-05-20', 3600000, 15, 3060000, 25, 0, 'Pending', NOW(), NOW()),
-- Ha Giang
('dep_10a', 'tour_10', 'company_1', '2026-04-28', '2026-05-01', 4200000, 10, 3780000, 20, 7, 'Confirmed', NOW(), NOW()),
('dep_10b', 'tour_10', 'company_1', '2026-05-22', '2026-05-25', 4200000, 10, 3780000, 20, 0, 'Pending', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. DRIVERS (5 tai xe)
-- =====================================================
INSERT INTO drivers (id, company_id, name, phone, license_plate, vehicle_info, status, created_at, updated_at) VALUES
('drv_01', 'company_1', 'Nguyen Van Hung',  '0901234567', '51G12345', 'Toyota Innova 7 cho',        'available', NOW(), NOW()),
('drv_02', 'company_1', 'Tran Minh Tuan',   '0912345678', '30H56789', 'Ford Transit 16 cho',        'available', NOW(), NOW()),
('drv_03', 'company_1', 'Le Hoang Nam',     '0923456789', '51F98765', 'Hyundai Solati 16 cho',      'busy',      NOW(), NOW()),
('drv_04', 'company_1', 'Pham Thanh Son',   '0934567890', '43B11223', 'Mercedes Sprinter 16 cho',   'available', NOW(), NOW()),
('drv_05', 'company_1', 'Vo Quoc Dat',      '0945678901', '72C44556', 'Thaco 29 cho',               'available', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. USERS (1 admin + 3 user demo)
-- Password: "123456" -> BCrypt hash
-- =====================================================
INSERT INTO users (company_id, username, email, password_hash, role, phone, address, created_at, updated_at) VALUES
('company_1', 'admin',       'admin@mytour.vn',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '0338739493', 'TP Ho Chi Minh',    NOW(), NOW()),
('company_1', 'Nguyen Van A', 'nguyenvana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',  '0987654321', '123 Le Loi, Q1, HCM', NOW(), NOW()),
('company_1', 'Tran Thi B',   'tranthib@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',  '0976543210', '456 Nguyen Hue, Q1',  NOW(), NOW()),
('company_1', 'Le Van C',     'levanc@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',  '0965432109', '789 Hai Ba Trung',    NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. BOOKINGS (6 booking mau de demo cac trang thai)
-- =====================================================
INSERT INTO bookings (departure_id, user_id, driver_id, company_id, customer_name, customer_email, customer_phone, number_of_guests, total_price, booking_date, status, created_at, updated_at) VALUES
-- Booking 1: Pending (chua duyet)
('dep_01a', 2, NULL,     'company_1', 'Nguyen Van A', 'nguyenvana@gmail.com', '0987654321', 2, 8100000,  '2026-03-15', 'Pending',    NOW(), NOW()),
-- Booking 2: Confirmed (da duyet, chua gan tai xe)
('dep_02a', 3, NULL,     'company_1', 'Tran Thi B',   'tranthib@gmail.com',   '0976543210', 3, 13260000, '2026-03-16', 'Confirmed',  NOW(), NOW()),
-- Booking 3: Assigned (da gan tai xe)
('dep_03a', 4, 'drv_01', 'company_1', 'Le Van C',     'levanc@gmail.com',     '0965432109', 2, 10880000, '2026-03-17', 'Assigned',   NOW(), NOW()),
-- Booking 4: InProgress (dang chay tour)
('dep_04a', 2, 'drv_03', 'company_1', 'Nguyen Van A', 'nguyenvana@gmail.com', '0987654321', 4, 14440000, '2026-03-10', 'InProgress', NOW(), NOW()),
-- Booking 5: Completed (da hoan thanh)
('dep_07a', 3, 'drv_02', 'company_1', 'Tran Thi B',   'tranthib@gmail.com',   '0976543210', 2, 5320000,  '2026-03-01', 'Completed',  NOW(), NOW()),
-- Booking 6: Cancelled (da huy)
('dep_05a', 4, NULL,     'company_1', 'Le Van C',     'levanc@gmail.com',     '0965432109', 1, 3150000,  '2026-03-12', 'Cancelled',  NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE! Tong cong:
--   5 Categories
--  10 Tour Templates (voi hinh anh Unsplash)
--  20 Tour Departures (moi tour 2 lich)
--   5 Drivers (voi bien so xe)
--   4 Users (1 admin + 3 user, password: 123456)
--   6 Bookings (du 6 trang thai demo)
-- =====================================================
