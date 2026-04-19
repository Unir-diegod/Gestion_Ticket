USE ticketing_system;

INSERT INTO usuario (email, name, role, password_hash)
VALUES ('admin@ticketpro.com', 'Admin Inicial', 'ADMIN', 'admin123')
ON DUPLICATE KEY UPDATE email = email;
