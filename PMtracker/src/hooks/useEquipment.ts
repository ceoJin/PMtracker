import { useState, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'medical-equipment-data';

const sampleData: Equipment[] = [
  {
    id: '1',
    name: 'MRI Scanner',
    serialNumber: 'MRI-001',
    department: 'Radiology',
    manufacturer: 'Siemens',
    hospital: 'General Hospital',
    lastMaintenanceDate: '2023-10-15',
    nextMaintenanceDate: '2024-01-15',
    maintenanceFrequency: 'quarterly',
    status: 'operational',
    notes: 'High-priority equipment'
  },
  {
    id: '2',
    name: 'Ventilator',
    serialNumber: 'VENT-002',
    department: 'ICU',
    manufacturer: 'Philips',
    hospital: 'City Medical Center',
    lastMaintenanceDate: '2023-12-10',
    nextMaintenanceDate: '2024-01-10',
    maintenanceFrequency: 'monthly',
    status: 'for-repair',
    notes: 'Critical care equipment'
  },
  {
    id: '3',
    name: 'X-Ray Machine',
    serialNumber: 'XRAY-003',
    department: 'Radiology',
    manufacturer: 'GE Healthcare',
    hospital: 'General Hospital',
    lastMaintenanceDate: '2023-09-20',
    nextMaintenanceDate: '2023-12-25',
    maintenanceFrequency: 'quarterly',
    status: 'for-pullout',
    notes: 'Portable unit'
  }
];

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEquipment(JSON.parse(stored));
    } else {
      setEquipment(sampleData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data: Equipment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipment_with_id = {
      ...newEquipment,
      id: Date.now().toString()
    };
    const updated = [...equipment, equipment_with_id];
    setEquipment(updated);
    saveToStorage(updated);
    toast({ title: 'Equipment added successfully' });
  };

  const updateEquipment = (id: string, updatedEquipment: Omit<Equipment, 'id'>) => {
    const updated = equipment.map(eq => 
      eq.id === id ? { ...updatedEquipment, id } : eq
    );
    setEquipment(updated);
    saveToStorage(updated);
    toast({ title: 'Equipment updated successfully' });
  };

  const deleteEquipment = (id: string) => {
    const updated = equipment.filter(eq => eq.id !== id);
    setEquipment(updated);
    saveToStorage(updated);
    toast({ title: 'Equipment deleted successfully' });
  };

  const sortByHospital = (equipmentList: Equipment[]) => {
    return [...equipmentList].sort((a, b) => a.hospital.localeCompare(b.hospital));
  };

  return {
    equipment,
    loading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    sortByHospital
  };
};