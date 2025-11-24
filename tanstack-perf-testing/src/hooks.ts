import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

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

export function useToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn receives the item you want to update
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: number;
      newStatus: "active" | "inactive";
    }) => {
      const res = await fetch(`http://localhost:4000/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    // After a successful mutation, refetch the items list
    onSuccess: (mutationResult) => {
      console.log(`Invalidating ID:${JSON.stringify(mutationResult.id)}`);
      queryClient.setQueryData(["items"], (old: any) => {
        if (!old) return;
        console.log(
          "Old cache hit: " + JSON.stringify(old[mutationResult.id - 1])
        );
        return old.map((item: any) =>
          item.id === mutationResult.id ? mutationResult : item
        );
      });
    },
  });
}
