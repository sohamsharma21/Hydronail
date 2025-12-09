import { z } from 'zod';

// Water sensor data validation schema
export const sensorDataSchema = z.object({
  ph: z.number().min(0, 'pH must be at least 0').max(14, 'pH cannot exceed 14'),
  turbidity: z.number().min(0, 'Turbidity must be at least 0').max(1000, 'Turbidity cannot exceed 1000 NTU'),
  temperature: z.number().min(-20, 'Temperature must be at least -20°C').max(100, 'Temperature cannot exceed 100°C'),
  dissolved_oxygen: z.number().min(0, 'DO must be at least 0').max(20, 'DO cannot exceed 20 mg/L'),
  tds: z.number().min(0, 'TDS must be at least 0').max(50000, 'TDS cannot exceed 50000 ppm'),
  conductivity: z.number().min(0, 'Conductivity must be at least 0').max(10000, 'Conductivity cannot exceed 10000 µS/cm'),
  chlorine: z.number().min(0, 'Chlorine must be at least 0').max(20, 'Chlorine cannot exceed 20 mg/L'),
  hardness: z.number().min(0, 'Hardness must be at least 0').max(5000, 'Hardness cannot exceed 5000 mg/L'),
});

export type SensorData = z.infer<typeof sensorDataSchema>;

// Validate sensor data before sending to API
export const validateSensorData = (data: Partial<SensorData>): { success: boolean; error?: string; data?: SensorData } => {
  const result = sensorDataSchema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      success: false,
      error: firstError?.message || 'Invalid sensor data',
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
};

// Machine control action validation
export const machineControlSchema = z.object({
  machineId: z.string().min(1, 'Machine ID is required').max(50, 'Machine ID is too long'),
  action: z.enum(['start', 'stop', 'set_speed', 'set_mode'], {
    errorMap: () => ({ message: 'Invalid action. Must be start, stop, set_speed, or set_mode' }),
  }),
  value: z.number().optional(),
});

export type MachineControlAction = z.infer<typeof machineControlSchema>;

// Alert recipient validation
export const alertRecipientSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  alert_types: z.array(z.enum(['critical', 'warning', 'info'])).min(1, 'At least one alert type is required'),
});

export type AlertRecipient = z.infer<typeof alertRecipientSchema>;
