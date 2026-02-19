const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface WorkingHours {
  [key: string]: {
    ouverture: string | null;
    fermeture: string | null;
    ferme: boolean;
  };
}

export interface AvailableSlot {
  date: string;
  pack: string;
  slots: string[];
}

export interface AppointmentData {
  pack: string;
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
  ecole?: string;
  date: string;
  heure: string;
  notes?: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  appointment_id?: number;
  data?: {
    date: string;
    heure: string;
    pack: string;
    statut: string;
  };
}

export const api = {
  async getWorkingHours(): Promise<WorkingHours> {
    const response = await fetch(`${API_URL}/working-hours`);
    if (!response.ok) {
      throw new Error('Failed to fetch working hours');
    }
    const result = await response.json();
    return result.data;
  },

  async getAvailableSlots(date: string, pack: string): Promise<string[]> {
    const packValue = pack === 'school' ? 'École' : 'Domicile';
    const response = await fetch(
      `${API_URL}/available-slots?date=${date}&pack=${encodeURIComponent(packValue)}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch available slots');
    }
    const result = await response.json();
    return result.slots || [];
  },

  async createAppointment(data: AppointmentData): Promise<AppointmentResponse> {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create appointment');
    }

    return result;
  },
};
