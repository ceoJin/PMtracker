import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Equipment } from '@/types/equipment';
import { X } from 'lucide-react';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    serialNumber: equipment?.serialNumber || '',
    department: equipment?.department || '',
    manufacturer: equipment?.manufacturer || '',
    hospital: equipment?.hospital || '',
    lastMaintenanceDate: equipment?.lastMaintenanceDate || '',
    nextMaintenanceDate: equipment?.nextMaintenanceDate || '',
    maintenanceFrequency: equipment?.maintenanceFrequency || 'monthly' as const,
    status: equipment?.status || 'operational' as const,
    notes: equipment?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {equipment ? 'Edit Equipment' : 'Add Equipment'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hospital">Hospital</Label>
            <Input
              id="hospital"
              value={formData.hospital}
              onChange={(e) => handleChange('hospital', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
            <Input
              id="nextMaintenanceDate"
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={(e) => handleChange('nextMaintenanceDate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="frequency">Maintenance Frequency</Label>
            <Select value={formData.maintenanceFrequency} onValueChange={(value) => handleChange('maintenanceFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="for-repair">For Repair</SelectItem>
                <SelectItem value="for-pullout">For Pullout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Save</Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;