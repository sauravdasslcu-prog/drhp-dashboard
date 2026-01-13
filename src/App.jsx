import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [debug, setDebug] = useState([]);

  useEffect(() => {
    fetch("/Project Srisha8 - Division of Work (Jan 13 2025).xlsx")
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const wb = XLSX.read(buf, { type: "array" });
        const output = [];

        wb.SheetNames.forEach((sheet) => {
          const rows = XLSX.utils.sheet_to_json(
            wb.Sheets[sheet],
            { header: 1, blankrows: false }
          );

          output.push({
            sheet,
            rows: rows.slice(0, 10) // first 10 rows only
          });
        });

        setDebug(output);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>DRHP Work Allocation Dashboard</h1>

      <h2>DEBUG VIEW (temporary)</h2>

      {debug.map((s, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <h3>{s.sheet}</h3>
          <pre
            style={{
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto"
            }}
          >
            {JSON.stringify(s.rows, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
