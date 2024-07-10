import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parse, unparse } from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const result = parse(text, { header: true });
        setCsvData(result.data);
      };
      reader.readAsText(file);
    }
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][columnName] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownload = () => {
    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">CSV Management Tool</h1>
      </header>

      <section className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button onClick={handleDownload}>Download CSV</Button>
        </div>
        {fileName && <p className="text-center mt-2">Uploaded File: {fileName}</p>}
      </section>

      <section>
        <Table>
          <TableHeader>
            <TableRow>
              {csvData.length > 0 &&
                Object.keys(csvData[0]).map((columnName) => (
                  <TableHead key={columnName}>{columnName}</TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map((columnName) => (
                  <TableCell key={columnName}>
                    <Input
                      value={row[columnName] || ""}
                      onChange={(e) => handleCellChange(rowIndex, columnName, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-center mt-4">
          <Button onClick={handleAddRow}>Add Row</Button>
        </div>
      </section>
    </div>
  );
};

export default Index;