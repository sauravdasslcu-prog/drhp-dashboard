import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4f46e5", "#e5e7eb"];

export default function App() {
  const [data, setData] = useState({});
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch("/Project Srisha8 - Division of Work (Jan 13 2025).xlsx")
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const wb = XLSX.read(buf, { type: "array" });
        const out = {};

        wb.SheetNames.forEach((sheet) => {
          const rows = XLSX.utils.sheet_to_json(
            wb.Sheets[sheet],
            { header: 1, blankrows: false }
          );

          rows.forEach((row) => {
            if (!row || row.length < 2) return;

            const section = row[0];
            const associates = row.slice(1).filter(Boolean);

            associates.forEach((name) => {
              if (!out[name]) out[name] = {};
              if (!out[name][sheet]) out[name][sheet] = [];
              out[name][sheet].push(section);
            });
          });
        });

        setData(out);
      });
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>DRHP Work Allocation Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24
        }}
      >
        {Object.keys(data).map((name) => {
          const count = Object.values(data[name]).flat().length;

          return (
            <div
              key={name}
              onClick={() => setActive(name)}
              style={{
                background: "white",
                borderRadius: 18,
                padding: 20,
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
              }}
            >
              <h2>{name}</h2>
              <p>{count} Sections</p>

              <PieChart width={140} height={140}>
                <Pie
                  data={[
                    { value: count },
                    { value: 30 - count }
                  ]}
                  innerRadius={45}
                  outerRadius={60}
                  dataKey="value"
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          );
        })}
      </div>

      {active && (
        <div
          style={{
            marginTop: 40,
            background: "white",
            padding: 24,
            borderRadius: 20
          }}
        >
          <h2>{active} – Assigned Sections</h2>

          {Object.keys(data[active]).map((tab) => (
            <div key={tab} style={{ marginTop: 20 }}>
              <h3 style={{ color: "#4f46e5" }}>{tab}</h3>
              {data[active][tab].map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    background: "#eef2ff",
                    borderRadius: 10,
                    marginBottom: 6
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

