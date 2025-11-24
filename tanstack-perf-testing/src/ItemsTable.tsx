import { useItems, useToggleStatus } from "./hooks";

export default function ItemsTable() {
  const { data, isPending, error } = useItems();
  const toggleStatus = useToggleStatus();

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleToggle = (id: number, currentStatus: "active" | "inactive") => {
    toggleStatus.mutate({
      id,
      newStatus: currentStatus === "active" ? "inactive" : "active",
    });
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "500px" }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Toggle</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.id}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.status}</td>
            <td style={tdStyle}>
              <button
                onClick={() =>
                  handleToggle(item.id, item.status as "active" | "inactive")
                }
              >
                Toggle Status
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Same styles as before
const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  background: "#f5f5f5",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px 12px",
  textAlign: "left",
};
