-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create emission_factors table
CREATE TABLE IF NOT EXISTS emission_factors (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  unit TEXT NOT NULL,
  factor NUMERIC(10, 6) NOT NULL,
  source TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create esg_entries table
CREATE TABLE IF NOT EXISTS esg_entries (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  value NUMERIC(15, 2) NOT NULL,
  unit TEXT NOT NULL,
  emission_factor_id INTEGER REFERENCES emission_factors(id),
  calculated_emissions NUMERIC(15, 2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_esg_entries_location_id ON esg_entries(location_id);
CREATE INDEX IF NOT EXISTS idx_esg_entries_date ON esg_entries(date);
CREATE INDEX IF NOT EXISTS idx_esg_entries_type ON esg_entries(type);
CREATE INDEX IF NOT EXISTS idx_esg_entries_category ON esg_entries(category);
CREATE INDEX IF NOT EXISTS idx_esg_entries_subcategory ON esg_entries(subcategory);
CREATE INDEX IF NOT EXISTS idx_esg_entries_metadata ON esg_entries USING GIN (metadata);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emission_factors_updated_at BEFORE UPDATE ON emission_factors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_esg_entries_updated_at BEFORE UPDATE ON esg_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO locations (name, region, country) VALUES
  ('東京本社', '関東', '日本'),
  ('大阪支社', '関西', '日本'),
  ('福岡支社', '九州', '日本')
ON CONFLICT DO NOTHING;

INSERT INTO emission_factors (category, subcategory, unit, factor, source, year) VALUES
  ('エネルギー', 'electricity', 'kWh', 0.000433, '環境省', 2024),
  ('エネルギー', 'gas', 'm³', 0.00223, '環境省', 2024),
  ('エネルギー', 'fuel', 'L', 0.00232, '環境省', 2024),
  ('資源', 'water', 'm³', 0.00036, '環境省', 2024),
  ('廃棄物', 'waste', 'kg', 0.00289, '環境省', 2024)
ON CONFLICT DO NOTHING;