import { useQuery } from "@tanstack/react-query";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });
}

export function useItem(id: number | string) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:4000/items/${id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
    enabled: !!id, // prevents running when id is undefined
  });
}
