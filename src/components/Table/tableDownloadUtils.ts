import { Row } from '@tanstack/react-table';

/**
 * Converts table rows and columns to CSV format
 * @param rows - The table rows to convert
 * @param columns - The visible columns to include
 * @returns CSV string
 */
export function convertToCSV(rows: Row<any>[], columns: any[]): string {
  // Header row
  const headers = columns.map(col => {
    const header = col.columnDef.header;
    return typeof header === 'string' ? header : col.id;
  });

  // Data rows
  const dataRows = rows.map(row =>
    columns.map(col => {
      const cellValue = row.getValue(col.id);
      // Convert to string
      const stringValue = String(cellValue ?? '');
      // Escape quotes and wrap in quotes if contains comma/quote/newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  return [headers, ...dataRows].map(row => row.join(',')).join('\n');
}

/**
 * Triggers a browser download of the provided content
 * @param content - The file content to download
 * @param filename - The name of the file to download
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}
