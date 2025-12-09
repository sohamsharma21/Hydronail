-- Create water_readings table
CREATE TABLE IF NOT EXISTS public.water_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ph DECIMAL(4,2) NOT NULL,
  turbidity DECIMAL(6,2) NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  dissolved_oxygen DECIMAL(5,2) NOT NULL,
  tds DECIMAL(7,2) NOT NULL,
  conductivity DECIMAL(7,2) NOT NULL,
  chlorine DECIMAL(5,2) NOT NULL,
  hardness DECIMAL(6,2) NOT NULL,
  quality_score DECIMAL(5,2),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  sensor_name TEXT,
  threshold_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  is_read BOOLEAN DEFAULT false,
  acknowledged_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create equipment_status table
CREATE TABLE IF NOT EXISTS public.equipment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name TEXT NOT NULL,
  health_score DECIMAL(5,2) NOT NULL,
  vibration DECIMAL(6,2),
  temperature DECIMAL(5,2),
  pressure DECIMAL(6,2),
  current DECIMAL(6,2),
  runtime_hours INTEGER DEFAULT 0,
  last_maintenance TIMESTAMPTZ,
  next_maintenance TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'critical', 'offline')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  file_url TEXT,
  generated_by TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  file_size INTEGER,
  status TEXT NOT NULL CHECK (status IN ('ready', 'processing', 'failed'))
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  plant_name TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  theme TEXT DEFAULT 'light',
  email_alerts BOOLEAN DEFAULT true,
  sms_alerts BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.water_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to water_readings" ON public.water_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert to water_readings" ON public.water_readings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert to alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to alerts" ON public.alerts FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to equipment_status" ON public.equipment_status FOR SELECT USING (true);
CREATE POLICY "Allow public insert to equipment_status" ON public.equipment_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert to reports" ON public.reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to user_settings" ON public.user_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert to user_settings" ON public.user_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to user_settings" ON public.user_settings FOR UPDATE USING (true);

-- Enable realtime for water_readings
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_readings;

-- Create indexes for better performance
CREATE INDEX idx_water_readings_created_at ON public.water_readings(created_at DESC);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);

-- Insert sample equipment status
INSERT INTO public.equipment_status (equipment_name, health_score, runtime_hours, last_maintenance, next_maintenance, status)
VALUES 
  ('Primary Pump A', 97.44, 1247, now() - interval '30 days', now() + interval '7 days', 'healthy'),
  ('Filter Unit B', 95.20, 890, now() - interval '15 days', now() + interval '15 days', 'healthy'),
  ('Chemical Dosing System', 98.10, 1100, now() - interval '20 days', now() + interval '10 days', 'healthy');