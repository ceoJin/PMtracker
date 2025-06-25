export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  manufacturer: string;
  hospital: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceFrequency: 'monthly' | 'quarterly';
  status: 'operational' | 'for-repair' | 'for-pullout';
  notes: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  type: 'preventive' | 'corrective';
  technician: string;
  notes: string;
}