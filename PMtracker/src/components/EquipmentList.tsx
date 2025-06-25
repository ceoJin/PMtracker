import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Equipment } from '@/types/equipment';
import { Search, Plus, Edit, Trash2, Calendar, Building2, AlertCircle, XCircle, CheckCircle } from 'lucide-react';

interface EquipmentListProps {
  equipment: Equipment[];
  onAdd: () => void;
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
  sortByHospital: (equipment: Equipment[]) => Equipment[];
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onAdd, onEdit, onDelete, sortByHospital }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterHospital, setFilterHospital] = useState('');
  const [sortedByHospital, setSortedByHospital] = useState(false);

  const departments = [...new Set(equipment.map(eq => eq.department))];
  const hospitals = [...new Set(equipment.map(eq => eq.hospital))];
  
  let filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || eq.department === filterDepartment;
    const matchesHospital = !filterHospital || eq.hospital === filterHospital;
    return matchesSearch && matchesDepartment && matchesHospital;
  });

  if (sortedByHospital) {
    filteredEquipment = sortByHospital(filteredEquipment);
  }

  const getMaintenanceStatus = (nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', text: 'Overdue' };
    if (diffDays <= 7) return { status: 'due-soon', color: 'bg-yellow-100 text-yellow-800', text: 'Due Soon' };
    return { status: 'up-to-date', color: 'bg-green-100 text-green-800', text: 'Up to Date' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'for-repair': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'for-pullout': return <XCircle className="h-4 w-4 text-purple-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'for-repair': return 'bg-orange-100 text-orange-800';
      case 'for-pullout': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Equipment Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setSortedByHospital(!sortedByHospital)}
            variant={sortedByHospital ? "default" : "outline"}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Sort by Hospital
          </Button>
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={filterHospital}
          onChange={(e) => setFilterHospital(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Hospitals</option>
          {hospitals.map(hospital => (
            <option key={hospital} value={hospital}>{hospital}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(eq => {
          const maintenanceStatus = getMaintenanceStatus(eq.nextMaintenanceDate);
          return (
            <Card key={eq.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {eq.name}
                    {getStatusIcon(eq.status)}
                  </CardTitle>
                  <Badge className={maintenanceStatus.color}>
                    {maintenanceStatus.text}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{eq.serialNumber}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p><span className="font-medium">Hospital:</span> {eq.hospital}</p>
                  <p><span className="font-medium">Department:</span> {eq.department}</p>
                  <p><span className="font-medium">Manufacturer:</span> {eq.manufacturer}</p>
                  <p><span className="font-medium">Frequency:</span> {eq.maintenanceFrequency}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge className={getStatusBadge(eq.status)}>
                      {eq.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Next: {new Date(eq.nextMaintenanceDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(eq)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(eq.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No equipment found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;