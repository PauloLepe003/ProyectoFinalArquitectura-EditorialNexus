-- Datos de demostracion locales. Reejecutable: preserva registros existentes.
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Author; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Author" (id, name, biography, active) VALUES ('85192c81-f95d-4168-9d0e-d3b857c5c862', 'Antoine de Saint-Exupéry', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('f6d8a5f8-8f00-4001-8a0e-4da6fa4a909c', 'Miguel Ángel Asturias', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('cab7b848-4003-4b4f-bd4b-f56a8d3db923', 'Virginia Woolf', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('ea674b1f-6134-46e0-a2db-2096f0158142', 'Miguel de Cervantes', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('740a46c7-2240-43ad-b688-ed090b2e07b4', 'Jane Austen', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('8b60e10a-cd4c-40ab-aaa3-ad2f9882b02e', 'Franz Kafka', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('0c6a32fe-2144-4f41-88c5-d5ccc1f20b86', 'Rubén Darío', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('8ccc4109-7672-43fd-8d6f-43db53ed4693', 'Charles Darwin', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('33955431-d4d9-423e-ba4a-3557e8dbbab0', 'Lewis Carroll', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('5b2c636e-fd3d-4602-bc0a-a2777da148a0', 'Gustavo Adolfo Bécquer', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('63b2931a-e86e-431c-9377-c5e79c622a0a', 'Homero', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('996780f6-956a-4294-81e1-50957ac8289d', 'Tradición k’iche’', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('4cc59b2d-b2d6-4df3-b768-296b3ebaf707', 'Louisa May Alcott', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Author" (id, name, biography, active) VALUES ('a27aa43f-6a8a-4c16-92e1-b2b6b6112bdd', 'Marco Aurelio', 'Autor incluido en el catálogo académico de Editorial Nexus.', true) ON CONFLICT DO NOTHING;


--
-- Data for Name: Format; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Format" (id, name) VALUES ('2a4a5b36-f1b6-4af7-adf7-b73134afe9d7', 'Tapa blanda') ON CONFLICT DO NOTHING;
INSERT INTO public."Format" (id, name) VALUES ('d1b17d50-c96b-4c4f-9d2a-4fbba0235ecb', 'Tapa dura') ON CONFLICT DO NOTHING;
INSERT INTO public."Format" (id, name) VALUES ('fd231f0a-d48b-4a7a-9ce3-4b04485ad88a', 'E-book') ON CONFLICT DO NOTHING;


--
-- Data for Name: Publisher; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Publisher" (id, name) VALUES ('1866d4e4-d407-4f06-9aad-10209bd05d4b', 'Nexus Clásicos') ON CONFLICT DO NOTHING;
INSERT INTO public."Publisher" (id, name) VALUES ('957f68a5-a77f-4d02-8be1-357367433ab9', 'Horizonte Editorial') ON CONFLICT DO NOTHING;
INSERT INTO public."Publisher" (id, name) VALUES ('18420397-d2fd-45ce-92e9-2da1cab322f6', 'Colección Ceiba') ON CONFLICT DO NOTHING;


--
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('c5aa4a65-96d6-409a-b749-bdceacd6d827', 'El principito', '9789993900001', 'Un pequeño viajero recorre planetas y descubre la amistad, la responsabilidad y lo esencial de la vida. Una fábula para lectores de todas las edades.', 2024, 100.00, '/covers/book-1.svg', true, true, '2026-11-09 14:09:54.92', '1866d4e4-d407-4f06-9aad-10209bd05d4b', '2a4a5b36-f1b6-4af7-adf7-b73134afe9d7') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('ceb90ccd-4e80-4bf1-afbe-bdfab09f5a84', 'El señor Presidente', '9789993900002', 'Una mirada poderosa a la vida bajo una dictadura latinoamericana. Lenguaje poético y denuncia social convergen en esta obra de la literatura guatemalteca.', 2025, 84.00, '/covers/book-2.svg', true, true, '2026-11-09 14:09:54.929', '957f68a5-a77f-4d02-8be1-357367433ab9', 'd1b17d50-c96b-4c4f-9d2a-4fbba0235ecb') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('1892dc0f-a845-48e5-a355-4eac25c85789', 'Una habitación propia', '9789993900003', 'Un ensayo sobre la independencia, la creación literaria y los espacios necesarios para que una voz encuentre su lugar en el mundo.', 2026, 93.00, '/covers/book-3.svg', true, true, '2026-11-09 14:09:54.933', '18420397-d2fd-45ce-92e9-2da1cab322f6', 'fd231f0a-d48b-4a7a-9ce3-4b04485ad88a') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('9eb55032-6408-4853-9100-b05373198823', 'Don Quijote de la Mancha', '9789993900004', 'El ingenioso hidalgo y Sancho Panza emprenden aventuras que entrelazan imaginación, humor y una profunda reflexión sobre la condición humana.', 2024, 102.00, '/covers/book-4.svg', true, false, '2026-11-09 14:09:54.936', '1866d4e4-d407-4f06-9aad-10209bd05d4b', '2a4a5b36-f1b6-4af7-adf7-b73134afe9d7') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('0b7361c8-d35e-479f-b83e-7ea57f59eb37', 'Orgullo y prejuicio', '9789993900005', 'Elizabeth Bennet enfrenta las expectativas sociales de su época con inteligencia y espíritu independiente en esta novela sobre afectos y primeras impresiones.', 2025, 111.00, '/covers/book-5.svg', true, false, '2026-11-09 14:09:54.939', '957f68a5-a77f-4d02-8be1-357367433ab9', 'd1b17d50-c96b-4c4f-9d2a-4fbba0235ecb') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('1664bf65-b2ec-41b0-9e24-14141b61a619', 'La metamorfosis', '9789993900006', 'La transformación de Gregor Samsa abre una inquietante reflexión sobre la identidad, el trabajo y los vínculos familiares.', 2026, 120.00, '/covers/book-6.svg', true, false, '2026-11-09 14:09:54.943', '18420397-d2fd-45ce-92e9-2da1cab322f6', 'fd231f0a-d48b-4a7a-9ce3-4b04485ad88a') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('a509483e-8d47-4cae-ba8c-c82d79a3e843', 'Azul', '9789993900007', 'Cuentos y poemas que abrieron nuevos caminos para la lengua española. Una invitación a descubrir el ritmo y las imágenes del modernismo.', 2024, 129.00, '/covers/book-7.svg', true, false, '2026-11-09 14:09:54.948', '1866d4e4-d407-4f06-9aad-10209bd05d4b', '2a4a5b36-f1b6-4af7-adf7-b73134afe9d7') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('38adb330-3064-4c89-91f4-ad11bbfe6e60', 'Leyendas de Guatemala', '9789993900008', 'Relatos que reúnen memoria, mito y paisaje guatemalteco en una prosa de gran riqueza sensorial.', 2025, 138.00, '/covers/book-8.svg', true, false, '2026-11-09 14:09:54.951', '957f68a5-a77f-4d02-8be1-357367433ab9', 'd1b17d50-c96b-4c4f-9d2a-4fbba0235ecb') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('8efaf761-f7dd-41d3-bb25-e4325d8e11f3', 'El origen de las especies', '9789993900009', 'Una obra central para comprender la historia del pensamiento científico y el desarrollo de la teoría de la evolución.', 2026, 147.00, '/covers/book-9.svg', true, false, '2026-11-09 14:09:54.954', '18420397-d2fd-45ce-92e9-2da1cab322f6', 'fd231f0a-d48b-4a7a-9ce3-4b04485ad88a') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('118a120d-666f-4074-8c47-f353c482580e', 'Alicia en el país de las maravillas', '9789993900010', 'Alicia sigue a un conejo y llega a un universo de acertijos, encuentros inesperados y posibilidades extraordinarias.', 2024, 156.00, '/covers/book-10.svg', true, false, '2026-11-09 14:09:54.957', '1866d4e4-d407-4f06-9aad-10209bd05d4b', '2a4a5b36-f1b6-4af7-adf7-b73134afe9d7') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('b5709613-2f42-4214-9aa3-e8e27f36903f', 'Rimas y leyendas', '9789993900011', 'Una selección de poesía y relatos románticos donde la emoción, el misterio y la imaginación dialogan con el lector.', 2025, 165.00, '/covers/book-11.svg', true, false, '2026-11-09 14:09:54.962', '957f68a5-a77f-4d02-8be1-357367433ab9', 'd1b17d50-c96b-4c4f-9d2a-4fbba0235ecb') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('d909232f-9a3d-40a8-a4c1-6afa2a4d7817', 'La Odisea', '9789993900012', 'El largo regreso de Odiseo a Ítaca narra pruebas, encuentros y decisiones que han inspirado generaciones de lectores.', 2026, 174.00, '/covers/book-12.svg', true, false, '2026-11-09 14:09:54.965', '18420397-d2fd-45ce-92e9-2da1cab322f6', 'fd231f0a-d48b-4a7a-9ce3-4b04485ad88a') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('a0bd2ede-517c-4cb6-9468-cb0ed24fea06', 'Popol Vuh', '9789993900013', 'Relatos de origen, memoria y sabiduría de la tradición k’iche’. Edición de lectura con notas introductorias para acercarse a su universo narrativo.', 2024, 183.00, '/covers/book-13.svg', true, false, '2026-11-09 14:09:54.968', '1866d4e4-d407-4f06-9aad-10209bd05d4b', '2a4a5b36-f1b6-4af7-adf7-b73134afe9d7') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('ccb49c63-c999-470c-8cab-ed9d90eefaf9', 'Mujercitas', '9789993900014', 'Cuatro hermanas construyen su propio camino entre sueños, responsabilidades y los afectos de una familia que aprende a crecer.', 2025, 192.00, '/covers/book-14.svg', true, false, '2026-11-09 14:09:54.971', '957f68a5-a77f-4d02-8be1-357367433ab9', 'd1b17d50-c96b-4c4f-9d2a-4fbba0235ecb') ON CONFLICT DO NOTHING;
INSERT INTO public."Book" (id, title, isbn, synopsis, year, price, cover, active, featured, "createdAt", "publisherId", "formatId") VALUES ('f2c8fe28-8dc9-47ad-aaad-a1468a86d749', 'Meditaciones', '9789993900015', 'Reflexiones sobre la vida cotidiana, el deber y la serenidad. Una aproximación al pensamiento estoico desde la experiencia personal.', 2026, 201.00, '/covers/book-15.svg', true, false, '2026-11-09 14:09:54.974', '18420397-d2fd-45ce-92e9-2da1cab322f6', 'fd231f0a-d48b-4a7a-9ce3-4b04485ad88a') ON CONFLICT DO NOTHING;


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" (id, email, name, "passwordHash", role, active, "createdAt") VALUES ('e3b59134-8e5a-4faf-8a23-9bccdfd17b2d', 'admin@nexus.local', 'Administración Nexus', '$2b$12$7byGFztW8ab5/xcI53ZCH.bHgKQGEHFyiTAUpg85HqAgerEsxlAS2', 'ADMIN', true, '2026-11-09 14:09:54.886') ON CONFLICT DO NOTHING;
INSERT INTO public."User" (id, email, name, "passwordHash", role, active, "createdAt") VALUES ('ca10940e-7d3b-46c4-8cac-9d0e93264bef', 'asesor@nexus.local', 'María Asesora', '$2b$12$7byGFztW8ab5/xcI53ZCH.bHgKQGEHFyiTAUpg85HqAgerEsxlAS2', 'ADVISOR', true, '2026-11-09 14:09:54.892') ON CONFLICT DO NOTHING;
INSERT INTO public."User" (id, email, name, "passwordHash", role, active, "createdAt") VALUES ('da5cd099-9daa-4aca-9ae2-d5f242c18b0c', 'minorista@nexus.local', 'Carlos Lector', '$2b$12$7byGFztW8ab5/xcI53ZCH.bHgKQGEHFyiTAUpg85HqAgerEsxlAS2', 'RETAIL', true, '2026-11-09 14:09:54.895') ON CONFLICT DO NOTHING;
INSERT INTO public."User" (id, email, name, "passwordHash", role, active, "createdAt") VALUES ('ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'institucion@nexus.local', 'Ana Biblioteca', '$2b$12$7byGFztW8ab5/xcI53ZCH.bHgKQGEHFyiTAUpg85HqAgerEsxlAS2', 'INSTITUTION', true, '2026-11-09 14:09:54.896') ON CONFLICT DO NOTHING;
INSERT INTO public."User" (id, email, name, "passwordHash", role, active, "createdAt") VALUES ('8af9e2c2-2279-48e5-b033-c5bf213d1cdb', 'pendiente@nexus.local', 'Luis Colegio', '$2b$12$7byGFztW8ab5/xcI53ZCH.bHgKQGEHFyiTAUpg85HqAgerEsxlAS2', 'INSTITUTION', true, '2026-11-09 14:09:54.899') ON CONFLICT DO NOTHING;


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Category" (id, name, description, active) VALUES ('1197e1e0-d974-4c70-85c3-4a3db33aceba', 'Literatura', 'Selección editorial de literatura', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Category" (id, name, description, active) VALUES ('d0c33633-7543-48cf-b730-fe27fb3650dd', 'Narrativa latinoamericana', 'Selección editorial de narrativa latinoamericana', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Category" (id, name, description, active) VALUES ('440b1836-a74a-4e97-a76b-57295a383010', 'Poesía', 'Selección editorial de poesía', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Category" (id, name, description, active) VALUES ('88ea38f5-4e9d-40a4-afd5-a597eaf9712d', 'Ciencia y pensamiento', 'Selección editorial de ciencia y pensamiento', true) ON CONFLICT DO NOTHING;
INSERT INTO public."Category" (id, name, description, active) VALUES ('0c801939-649b-4b6b-bc8f-8e1f9d02aa26', 'Infantil y juvenil', 'Selección editorial de infantil y juvenil', true) ON CONFLICT DO NOTHING;


--
-- Data for Name: Institution; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Institution" (id, "userId", name, "taxId", status) VALUES ('bd74bc2e-1411-4ef7-b74f-5876fc391a1e', 'ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'Biblioteca Horizonte', '1234567-8', 'APPROVED') ON CONFLICT DO NOTHING;
INSERT INTO public."Institution" (id, "userId", name, "taxId", status) VALUES ('a7d32a16-506c-42cb-97f5-b3aefa4c2c96', '8af9e2c2-2279-48e5-b033-c5bf213d1cdb', 'Colegio Amanecer', '9876543-2', 'PENDING') ON CONFLICT DO NOTHING;


--
-- Data for Name: Inventory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Inventory" ("bookId", stock) VALUES ('ceb90ccd-4e80-4bf1-afbe-bdfab09f5a84', 155) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('1892dc0f-a845-48e5-a355-4eac25c85789', 160) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('9eb55032-6408-4853-9100-b05373198823', 165) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('0b7361c8-d35e-479f-b83e-7ea57f59eb37', 170) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('1664bf65-b2ec-41b0-9e24-14141b61a619', 175) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('a509483e-8d47-4cae-ba8c-c82d79a3e843', 180) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('38adb330-3064-4c89-91f4-ad11bbfe6e60', 185) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('8efaf761-f7dd-41d3-bb25-e4325d8e11f3', 190) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('118a120d-666f-4074-8c47-f353c482580e', 195) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('b5709613-2f42-4214-9aa3-e8e27f36903f', 200) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('d909232f-9a3d-40a8-a4c1-6afa2a4d7817', 205) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('a0bd2ede-517c-4cb6-9468-cb0ed24fea06', 210) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('ccb49c63-c999-470c-8cab-ed9d90eefaf9', 215) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('f2c8fe28-8dc9-47ad-aaad-a1468a86d749', 8) ON CONFLICT DO NOTHING;
INSERT INTO public."Inventory" ("bookId", stock) VALUES ('c5aa4a65-96d6-409a-b749-bdceacd6d827', 148) ON CONFLICT DO NOTHING;


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Order" (id, number, "userId", status, breakdown, "createdAt") VALUES ('00000000-0000-4000-8000-000000000001', 1, 'da5cd099-9daa-4aca-9ae2-d5f242c18b0c', 'PENDING', '{"tax": "24.00", "base": "200.00", "total": "224.00", "units": 2, "taxRate": "0.12", "discounted": "200.00", "volumeRate": "0", "afterVolume": "200.00", "volumeDiscount": "0.00", "institutionRate": "0", "institutionDiscount": "0.00"}', '2026-11-09 14:09:54.985') ON CONFLICT DO NOTHING;


--
-- Data for Name: OrderHistory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."OrderHistory" (id, "orderId", status, "actorId", "createdAt") VALUES ('396c7b3a-fd64-49e5-baad-d4e6578d13da', '00000000-0000-4000-8000-000000000001', 'PENDING', 'da5cd099-9daa-4aca-9ae2-d5f242c18b0c', '2026-11-09 14:09:54.985') ON CONFLICT DO NOTHING;


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."OrderItem" (id, "orderId", "bookId", title, quantity, "unitPrice") VALUES ('0326e35c-9326-47ab-a38e-20d4fe9453dd', '00000000-0000-4000-8000-000000000001', 'c5aa4a65-96d6-409a-b749-bdceacd6d827', 'El principito', 2, 100.00) ON CONFLICT DO NOTHING;


--
-- Data for Name: SpecialRequest; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."SpecialRequest" (id, "userId", title, quantity, "coverFinish", paper, "requiredDate", notes, status, "createdAt") VALUES ('00000000-0000-4000-8000-000000000002', 'ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'El principito · Edición para biblioteca', 25, 'Tapa dura, laminado mate', 'Bond 80 g', '2027-01-08 14:09:54.99', 'Incluir identificación de la biblioteca.', 'QUOTED', '2026-11-09 14:09:54.994') ON CONFLICT DO NOTHING;
INSERT INTO public."SpecialRequest" (id, "userId", title, quantity, "coverFinish", paper, "requiredDate", notes, status, "createdAt") VALUES ('00000000-0000-4000-8000-000000000003', 'ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'Antología de literatura guatemalteca', 300, 'Tapa blanda ilustrada', 'Ahuesado 90 g', '2027-02-07 14:09:54.999', 'Impresión bajo demanda para programa de lectura.', 'PENDING', '2026-11-09 14:09:55.001') ON CONFLICT DO NOTHING;


--
-- Data for Name: Quote; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Quote" (id, number, "requestId", description, quantity, "unitPrice", breakdown, "clientSnapshot", "validUntil", "createdAt") VALUES ('cc04416c-3521-4a51-9e1d-d30b95e2765b', 1, '00000000-0000-4000-8000-000000000002', 'Edición institucional de El principito, tapa dura y papel bond.', 25, 100.00, '{"tax": "248.40", "base": "2500.00", "total": "2318.40", "units": 25, "taxRate": "0.12", "discounted": "2070.00", "volumeRate": "0.10", "afterVolume": "2250.00", "volumeDiscount": "250.00", "institutionRate": "0.08", "institutionDiscount": "180.00"}', '{"name": "Ana Biblioteca", "email": "institucion@nexus.local", "taxId": "1234567-8", "institution": "Biblioteca Horizonte"}', '2026-12-09 14:09:54.99', '2026-11-09 14:09:54.994') ON CONFLICT DO NOTHING;


--
-- Data for Name: RequestHistory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."RequestHistory" (id, "requestId", "actorId", action, details, "createdAt") VALUES ('20660dd3-9e41-4f8a-a880-ddc6a89ba07a', '00000000-0000-4000-8000-000000000002', 'ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'CREATED', 'Solicitud de demostración.', '2026-11-09 14:09:54.994') ON CONFLICT DO NOTHING;
INSERT INTO public."RequestHistory" (id, "requestId", "actorId", action, details, "createdAt") VALUES ('30ea12a3-8be9-4709-9748-4c9992d3724a', '00000000-0000-4000-8000-000000000002', 'ca10940e-7d3b-46c4-8cac-9d0e93264bef', 'QUOTED', 'Cotización de demostración emitida.', '2026-11-09 14:09:54.994') ON CONFLICT DO NOTHING;
INSERT INTO public."RequestHistory" (id, "requestId", "actorId", action, details, "createdAt") VALUES ('d2b0d9a1-b2af-4974-a467-c23fcbadf4cc', '00000000-0000-4000-8000-000000000003', 'ed83c3b1-cee2-4bee-bd6a-136608a5c300', 'CREATED', 'Solicitud de demostración.', '2026-11-09 14:09:55.001') ON CONFLICT DO NOTHING;


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Setting" (key, value) VALUES ('taxRate', '0.12') ON CONFLICT DO NOTHING;


--
-- Data for Name: _AuthorToBook; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('85192c81-f95d-4168-9d0e-d3b857c5c862', 'c5aa4a65-96d6-409a-b749-bdceacd6d827') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('f6d8a5f8-8f00-4001-8a0e-4da6fa4a909c', 'ceb90ccd-4e80-4bf1-afbe-bdfab09f5a84') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('cab7b848-4003-4b4f-bd4b-f56a8d3db923', '1892dc0f-a845-48e5-a355-4eac25c85789') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('ea674b1f-6134-46e0-a2db-2096f0158142', '9eb55032-6408-4853-9100-b05373198823') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('740a46c7-2240-43ad-b688-ed090b2e07b4', '0b7361c8-d35e-479f-b83e-7ea57f59eb37') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('8b60e10a-cd4c-40ab-aaa3-ad2f9882b02e', '1664bf65-b2ec-41b0-9e24-14141b61a619') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('0c6a32fe-2144-4f41-88c5-d5ccc1f20b86', 'a509483e-8d47-4cae-ba8c-c82d79a3e843') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('f6d8a5f8-8f00-4001-8a0e-4da6fa4a909c', '38adb330-3064-4c89-91f4-ad11bbfe6e60') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('8ccc4109-7672-43fd-8d6f-43db53ed4693', '8efaf761-f7dd-41d3-bb25-e4325d8e11f3') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('33955431-d4d9-423e-ba4a-3557e8dbbab0', '118a120d-666f-4074-8c47-f353c482580e') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('5b2c636e-fd3d-4602-bc0a-a2777da148a0', 'b5709613-2f42-4214-9aa3-e8e27f36903f') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('63b2931a-e86e-431c-9377-c5e79c622a0a', 'd909232f-9a3d-40a8-a4c1-6afa2a4d7817') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('996780f6-956a-4294-81e1-50957ac8289d', 'a0bd2ede-517c-4cb6-9468-cb0ed24fea06') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('4cc59b2d-b2d6-4df3-b768-296b3ebaf707', 'ccb49c63-c999-470c-8cab-ed9d90eefaf9') ON CONFLICT DO NOTHING;
INSERT INTO public."_AuthorToBook" ("A", "B") VALUES ('a27aa43f-6a8a-4c16-92e1-b2b6b6112bdd', 'f2c8fe28-8dc9-47ad-aaad-a1468a86d749') ON CONFLICT DO NOTHING;


--
-- Data for Name: _BookToCategory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('c5aa4a65-96d6-409a-b749-bdceacd6d827', '0c801939-649b-4b6b-bc8f-8e1f9d02aa26') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('ceb90ccd-4e80-4bf1-afbe-bdfab09f5a84', 'd0c33633-7543-48cf-b730-fe27fb3650dd') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('1892dc0f-a845-48e5-a355-4eac25c85789', '88ea38f5-4e9d-40a4-afd5-a597eaf9712d') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('9eb55032-6408-4853-9100-b05373198823', '1197e1e0-d974-4c70-85c3-4a3db33aceba') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('0b7361c8-d35e-479f-b83e-7ea57f59eb37', '1197e1e0-d974-4c70-85c3-4a3db33aceba') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('1664bf65-b2ec-41b0-9e24-14141b61a619', '1197e1e0-d974-4c70-85c3-4a3db33aceba') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('a509483e-8d47-4cae-ba8c-c82d79a3e843', '440b1836-a74a-4e97-a76b-57295a383010') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('38adb330-3064-4c89-91f4-ad11bbfe6e60', 'd0c33633-7543-48cf-b730-fe27fb3650dd') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('8efaf761-f7dd-41d3-bb25-e4325d8e11f3', '88ea38f5-4e9d-40a4-afd5-a597eaf9712d') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('118a120d-666f-4074-8c47-f353c482580e', '0c801939-649b-4b6b-bc8f-8e1f9d02aa26') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('b5709613-2f42-4214-9aa3-e8e27f36903f', '440b1836-a74a-4e97-a76b-57295a383010') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('d909232f-9a3d-40a8-a4c1-6afa2a4d7817', '1197e1e0-d974-4c70-85c3-4a3db33aceba') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('a0bd2ede-517c-4cb6-9468-cb0ed24fea06', 'd0c33633-7543-48cf-b730-fe27fb3650dd') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('ccb49c63-c999-470c-8cab-ed9d90eefaf9', '0c801939-649b-4b6b-bc8f-8e1f9d02aa26') ON CONFLICT DO NOTHING;
INSERT INTO public."_BookToCategory" ("A", "B") VALUES ('f2c8fe28-8dc9-47ad-aaad-a1468a86d749', '88ea38f5-4e9d-40a4-afd5-a597eaf9712d') ON CONFLICT DO NOTHING;


--
-- Name: Order_number_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Order_number_seq"', GREATEST((SELECT COALESCE(MAX(number),1) FROM public."Order"),1), true);


--
-- Name: Quote_number_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Quote_number_seq"', GREATEST((SELECT COALESCE(MAX(number),1) FROM public."Quote"),1), true);


--
-- PostgreSQL database dump complete
--


