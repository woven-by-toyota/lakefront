import { Row } from '@tanstack/react-table';

/**
 * Safely converts a value to string, using custom toString() if available
 */
function safeToString(value: any): string {
  if (value == null) return '';

  // If it has a custom toString method (not the default Object.prototype.toString)
  if (
    typeof value === 'object' &&
    value.toString &&
    value.toString !== Object.prototype.toString
  ) {
    return value.toString();
  }

  return String(value);
}

/**
 * Resolves a single cell's export value, in the same order `convertToCSV` uses:
 * 1. `columnDef.meta.csvValue`, if the column defines one
 * 2. the column's own cell renderer, if it returns a plain string or number
 * 3. the raw cell value
 *
 * Exported so a consumer replacing the built-in download (e.g. `tableSettings.onDownloadPress`)
 * can reproduce the same per-cell values instead of re-deriving this precedence itself.
 */
export function resolveCsvCellValue(row: Row<any>, col: any): string {
  // 1. Check if column has a custom csvValue accessor for CSV export
  if (col.columnDef.meta?.csvValue && typeof col.columnDef.meta.csvValue === 'function') {
    try {
      return safeToString(col.columnDef.meta.csvValue(row.getValue(col.id), row));
    } catch (error) {
      return safeToString(row.getValue(col.id));
    }
  }

  // 2. Try to use the column's cell renderer if it exists
  const cell = row.getAllCells().find(c => c.column.id === col.id);
  if (cell && col.columnDef.cell && typeof col.columnDef.cell === 'function') {
    try {
      const rendered = col.columnDef.cell(cell.getContext());
      // Handle the rendered value - could be string, number, or React element
      if (typeof rendered === 'string' || typeof rendered === 'number') {
        return String(rendered);
      }
      // If it's a React element or other object, fall back to raw value
      return safeToString(row.getValue(col.id));
    } catch (error) {
      // If cell renderer errors, fall back to raw value
      return safeToString(row.getValue(col.id));
    }
  }

  // 3. No cell renderer, use raw value
  return safeToString(row.getValue(col.id));
}

/**
 * Converts table rows and columns to CSV format
 * @param rows - The table rows to convert
 * @param columns - The visible columns to include
 * @returns CSV string
 *
 * Column definitions can include meta.csvValue for custom CSV export:
 * ```
 * {
 *   accessorKey: 'metadata',
 *   cell: ({ getValue }) => <div>{getValue().created}</div>,
 *   meta: {
 *     csvValue: (value) => value.created
 *   }
 * }
 * ```
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
      const stringValue = resolveCsvCellValue(row, col);

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
