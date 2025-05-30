-- 🧑 Owners (właściciele)
CREATE TABLE owners (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🐶 Dogs (psy)
CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  birth_year INTEGER,
  chip_number TEXT UNIQUE,
  kennel_name TEXT -- nazwa hodowli (optional)
);

-- 📅 Litters (mioty)
CREATE TABLE litters (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  description TEXT -- optional
);

-- 🦠 Past illnesses (przebyte choroby)
CREATE TABLE illnesses (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  notes TEXT
);

-- 💉 Vaccinations (szczepienia)
CREATE TABLE vaccinations (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  mandatory BOOLEAN DEFAULT FALSE
);

-- 💊 Prescribed medications (przepisane leki)
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  medication_name TEXT,
  dosage TEXT,
  date_prescribed DATE,
  notes TEXT
);

-- 💊 Meds given in clinic (otrzymane leki w gabinecie)
CREATE TABLE administered_medications (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  medication_name TEXT,
  dosage TEXT,
  date_administered DATE
);

-- 🖼️ X-ray/Ultrasound images (RTG/USG)
CREATE TABLE imaging (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('RTG', 'USG')),
  image_url TEXT,
  date DATE,
  description TEXT
);

-- 🧪 Test results (badania)
CREATE TABLE lab_tests (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  test_name TEXT,
  result TEXT,
  date DATE,
  document_url TEXT
);

-- 📋 Special notes (zalecenia specjalne)
CREATE TABLE special_notes (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  date_added DATE DEFAULT CURRENT_DATE
);

-- 📆 Visit calendar (wizyty)
CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER REFERENCES dogs(id) ON DELETE CASCADE,
  doctor_name TEXT,
  visit_date TIMESTAMP NOT NULL,
  reason TEXT,
  notes TEXT
);
