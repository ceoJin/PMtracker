import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './Dashboard';
import EquipmentList from './EquipmentList';
import EquipmentForm from './EquipmentForm';
import { useEquipment } from '@/hooks/useEquipment';
import { Equipment } from '@/types/equipment';
import { Home, Settings, FileText } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { equipment, loading, addEquipment, updateEquipment, deleteEquipment, sortByHospital } = useEquipment();
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleSaveEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
    if (editingEquipment) {
      updateEquipment(editingEquipment.id, equipmentData);
    } else {
      addEquipment(equipmentData);
    }
    setShowForm(false);
    setEditingEquipment(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const generateReport = () => {
    const reportData = equipment.map(eq => ({
      'Equipment Name': eq.name,
      'Serial Number': eq.serialNumber,
      'Hospital': eq.hospital,
      'Department': eq.department,
      'Manufacturer': eq.manufacturer,
      'Last Maintenance': eq.lastMaintenanceDate,
      'Next Maintenance': eq.nextMaintenanceDate,
      'Frequency': eq.maintenanceFrequency,
      'Status': eq.status,
      'Notes': eq.notes
    }));
    
    const csv = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipment-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Equipment
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <Button onClick={generateReport} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard equipment={equipment} />
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <EquipmentList
              equipment={equipment}
              onAdd={handleAddEquipment}
              onEdit={handleEditEquipment}
              onDelete={deleteEquipment}
              sortByHospital={sortByHospital}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Equipment Reports</h3>
              <p className="text-gray-600 mb-4">Generate and download equipment maintenance reports</p>
              <Button onClick={generateReport}>
                Download CSV Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showForm && (
        <EquipmentForm
          equipment={editingEquipment}
          onSave={handleSaveEquipment}
          onCancel={handleCancelForm}
        />
      )}
      
      <Toaster />
    </div>
  );
};

export default AppLayout;