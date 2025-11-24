import { useItems } from "./hooks";

export default function ItemsTable() {
  const { data, isPending, error } = useItems();
  console.log(data);
  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <table style={{ borderCollapse: "collapse", width: "500px" }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Count</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.id}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.status}</td>
            <td style={tdStyle}>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  background: "#f5f5f5",
  textAlign: "left", // ✅ TypeScript accepts this literal
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  textAlign: "left", // ✅ TypeScript accepts this literal
};
