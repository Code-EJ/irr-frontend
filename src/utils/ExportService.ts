import { toast } from "react-toastify";

type CSVRow = Record<string, string | number | boolean | null | undefined>;

function convertToCSV(data: CSVRow[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      const escaped = String(value ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}

function exportToCSV(filename: string, data: CSVRow[]) {
  const csvString = convertToCSV(data);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function handleExport(fetchData: Function, page: number, fileName: string) {
  if (page) {
    const data = await fetchData(page)
    if ( data ) {
      exportToCSV(fileName, data);
    } else {
      toast.error("Dados nao puderam ser reivindicados!")
    }
  }
}
