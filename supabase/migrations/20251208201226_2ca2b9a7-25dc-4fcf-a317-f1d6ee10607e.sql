-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create alert_recipients table for managing email recipients
CREATE TABLE public.alert_recipients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    alert_types TEXT[] DEFAULT ARRAY['critical', 'warning', 'info']::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alert_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth yet)
CREATE POLICY "Allow public read access to alert_recipients"
ON public.alert_recipients
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to alert_recipients"
ON public.alert_recipients
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to alert_recipients"
ON public.alert_recipients
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete to alert_recipients"
ON public.alert_recipients
FOR DELETE
USING (true);

-- Create email_logs table to track sent emails
CREATE TABLE public.email_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to email_logs"
ON public.email_logs
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to email_logs"
ON public.email_logs
FOR INSERT
WITH CHECK (true);

-- Create trigger to update updated_at
CREATE TRIGGER update_alert_recipients_updated_at
BEFORE UPDATE ON public.alert_recipients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();