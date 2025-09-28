-- MySQL Database Schema for ML Service
CREATE DATABASE IF NOT EXISTS ml_service_db;
USE ml_service_db;

-- User Information Table
CREATE TABLE IF NOT EXISTS user_information (
    user_id INT PRIMARY KEY,
    income_per_month DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    merchant VARCHAR(200) NOT NULL,
    purchase_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE CASCADE,
    INDEX idx_user_purchase_time (user_id, purchase_time),
    INDEX idx_purchase_time (purchase_time)
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_amount DECIMAL(10, 2) NOT NULL,
    target_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE CASCADE,
    INDEX idx_user_goals (user_id),
    UNIQUE KEY unique_user_goal (user_id)
);

-- Insert sample data
INSERT INTO user_information (user_id, income_per_month) VALUES 
(1, 6000.00),
(2, 8000.00),
(3, 4500.00)
ON DUPLICATE KEY UPDATE income_per_month = VALUES(income_per_month);

INSERT INTO purchases (user_id, amount, category, merchant, purchase_time) VALUES 
(1, 50.00, 'food', 'coffee_shop', '2024-01-01 08:30:00'),
(1, 200.00, 'electronics', 'electronics_store', '2024-01-05 14:20:00'),
(1, 100.00, 'health', 'gym', '2024-01-10 09:00:00'),
(1, 500.00, 'dining', 'restaurant', '2024-01-15 19:30:00'),
(1, 75.00, 'food', 'grocery_store', '2024-01-20 16:45:00'),
(2, 120.00, 'entertainment', 'movie_theater', '2024-01-02 20:00:00'),
(2, 300.00, 'clothing', 'fashion_store', '2024-01-08 12:15:00'),
(3, 40.00, 'food', 'fast_food', '2024-01-03 18:30:00'),
(3, 150.00, 'utilities', 'electric_company', '2024-01-12 10:00:00');

INSERT INTO goals (user_id, goal_amount, target_date) VALUES 
(1, 5000.00, '2024-12-31'),
(2, 10000.00, '2024-06-30'),
(3, 3000.00, '2024-09-15')
ON DUPLICATE KEY UPDATE 
goal_amount = VALUES(goal_amount),
target_date = VALUES(target_date);
