import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { Equipment } from '@/types/equipment';

interface PDFExportProps {
  equipment: Equipment[];
}

const PDFExport: React.FC<PDFExportProps> = ({ equipment }) => {
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportWindow, setReportWindow] = useState<Window | null>(null);

  const generateHospitalSummaryReport = () => {
    const hospitalGroups = equipment.reduce((groups, eq) => {
      const hospital = eq.hospital || 'Unknown Hospital';
      if (!groups[hospital]) {
        groups[hospital] = [];
      }
      groups[hospital].push(eq);
      return groups;
    }, {} as Record<string, Equipment[]>);

    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Create HTML content for PDF
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hospital Equipment Summary Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .hospital-section { margin-bottom: 30px; page-break-inside: avoid; }
        .hospital-title { background: #f0f0f0; padding: 10px; border-left: 4px solid #007bff; font-size: 18px; font-weight: bold; }
        .summary-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 15px 0; }
        .stat-card { background: #f8f9fa; padding: 10px; border-radius: 5px; text-align: center; border: 1px solid #dee2e6; }
        .stat-number { font-size: 24px; font-weight: bold; color: #007bff; }
        .stat-label { font-size: 12px; color: #6c757d; }
        .section-title { font-weight: bold; margin: 15px 0 10px 0; color: #dc3545; }
        .equipment-list { margin-left: 20px; }
        .equipment-item { margin: 5px 0; padding: 8px; background: #fff; border-left: 3px solid #28a745; }
        .overdue { border-left-color: #dc3545; }
        .due-soon { border-left-color: #ffc107; }
        .repair { border-left-color: #dc3545; }
        .pullout { border-left-color: #6c757d; }
        .equipment-details { font-size: 12px; color: #6c757d; margin-top: 3px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HOSPITAL EQUIPMENT SUMMARY REPORT</h1>
        <p>Generated on: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}</p>
      </div>
    `;

    Object.entries(hospitalGroups).forEach(([hospital, equipmentList]) => {
      const forRepair = equipmentList.filter(eq => eq.status === 'for-repair');
      const forPullout = equipmentList.filter(eq => eq.status === 'for-pullout');
      const upToDate = equipmentList.filter(eq => eq.status === 'operational');
      const overduePM = equipmentList.filter(eq => {
        const nextDate = new Date(eq.nextMaintenanceDate);
        return nextDate < today;
      });
      const dueSoonPM = equipmentList.filter(eq => {
        const nextDate = new Date(eq.nextMaintenanceDate);
        return nextDate <= oneWeekFromNow && nextDate >= today;
      });

      htmlContent += `
      <div class="hospital-section">
        <div class="hospital-title">${hospital}</div>
        <div class="summary-stats">
          <div class="stat-card">
            <div class="stat-number">${equipmentList.length}</div>
            <div class="stat-label">Total Equipment</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #dc3545;">${forRepair.length}</div>
            <div class="stat-label">For Repair</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #6c757d;">${forPullout.length}</div>
            <div class="stat-label">For Pullout</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #dc3545;">${overduePM.length}</div>
            <div class="stat-label">Overdue PM</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #28a745;">${upToDate.length}</div>
            <div class="stat-label">Up to Date</div>
          </div>
        </div>
      `;

      if (forRepair.length > 0) {
        htmlContent += '<div class="section-title">🔧 EQUIPMENT FOR REPAIR</div><div class="equipment-list">';
        forRepair.forEach(eq => {
          htmlContent += `
          <div class="equipment-item repair">
            <strong>${eq.name}</strong> - ${eq.model}
            <div class="equipment-details">
              Location: ${eq.location} | Serial: ${eq.serialNumber} | Acquired: ${new Date(eq.dateAcquired).toLocaleDateString()}
            </div>
          </div>`;
        });
        htmlContent += '</div>';
      }

      if (forPullout.length > 0) {
        htmlContent += '<div class="section-title">📦 EQUIPMENT FOR PULLOUT</div><div class="equipment-list">';
        forPullout.forEach(eq => {
          htmlContent += `
          <div class="equipment-item pullout">
            <strong>${eq.name}</strong> - ${eq.model}
            <div class="equipment-details">
              Location: ${eq.location} | Serial: ${eq.serialNumber} | Acquired: ${new Date(eq.dateAcquired).toLocaleDateString()}
            </div>
          </div>`;
        });
        htmlContent += '</div>';
      }

      if (overduePM.length > 0) {
        htmlContent += '<div class="section-title">⚠️ OVERDUE PREVENTIVE MAINTENANCE</div><div class="equipment-list">';
        overduePM.forEach(eq => {
          const daysOverdue = Math.floor((today.getTime() - new Date(eq.nextMaintenanceDate).getTime()) / (1000 * 60 * 60 * 24));
          htmlContent += `
          <div class="equipment-item overdue">
            <strong>${eq.name}</strong> - ${eq.model}
            <div class="equipment-details">
              Due: ${new Date(eq.nextMaintenanceDate).toLocaleDateString()} (${daysOverdue} days overdue) | Location: ${eq.location}
            </div>
          </div>`;
        });
        htmlContent += '</div>';
      }

      if (dueSoonPM.length > 0) {
        htmlContent += '<div class="section-title">📅 UPCOMING MAINTENANCE (Next 7 Days)</div><div class="equipment-list">';
        dueSoonPM.forEach(eq => {
          htmlContent += `
          <div class="equipment-item due-soon">
            <strong>${eq.name}</strong> - ${eq.model}
            <div class="equipment-details">
              Due: ${new Date(eq.nextMaintenanceDate).toLocaleDateString()} | Location: ${eq.location}
            </div>
          </div>`;
        });
        htmlContent += '</div>';
      }

      htmlContent += '</div>';
    });

    htmlContent += '</body></html>';

    // Open in new window without auto-printing
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      newWindow.focus();
      setReportWindow(newWindow);
      setReportGenerated(true);
    }
  };

  const printReport = () => {
    if (reportWindow && !reportWindow.closed) {
      reportWindow.focus();
      reportWindow.print();
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={generateHospitalSummaryReport} className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Export Hospital Summary Report
      </Button>
      {reportGenerated && (
        <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      )}
    </div>
  );
};

export default PDFExport;