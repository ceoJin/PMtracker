import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';
import { AlertTriangle, Calendar, CheckCircle, Wrench, AlertCircle, XCircle } from 'lucide-react';
import PDFExport from './PDFExport';

interface DashboardProps {
  equipment: Equipment[];
}

const Dashboard: React.FC<DashboardProps> = ({ equipment }) => {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const dueSoon = equipment.filter(eq => {
    const nextDate = new Date(eq.nextMaintenanceDate);
    return nextDate <= oneWeekFromNow && nextDate >= today;
  });
  
  const overdue = equipment.filter(eq => {
    const nextDate = new Date(eq.nextMaintenanceDate);
    return nextDate < today;
  });
  
  const upToDate = equipment.filter(eq => {
    const nextDate = new Date(eq.nextMaintenanceDate);
    return nextDate > oneWeekFromNow;
  });

  const forRepair = equipment.filter(eq => eq.status === 'for-repair');
  const forPullout = equipment.filter(eq => eq.status === 'for-pullout');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/684d7347e34bfae91fd4706c_1749918895704_f06eac30.jpg" 
            alt="Undecim Medical Supplies" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Equipment Tracker</h1>
            <p className="text-gray-600">Undecim Medical Supplies Management System</p>
          </div>
        </div>
        <PDFExport equipment={equipment} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{overdue.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Due Soon</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{dueSoon.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Up to Date</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{upToDate.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">For Repair</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{forRepair.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">For Pullout</CardTitle>
            <XCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{forPullout.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{equipment.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;