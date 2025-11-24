import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// Fetch all items
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

// Fetch single item by ID
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

// Toggle item status with optimistic updates and rollback
export function useToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: number;
      newStatus: "active" | "inactive";
    }) => {
      // Call the server to update status
      const res = await fetch(`http://localhost:4000/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // If the server returns the updated item, return it
      // Otherwise return null — we'll rely on optimistic update
      try {
        return await res.json();
      } catch {
        return null;
      }
    },

    // onMutate runs BEFORE the mutation is sent to the server
    // Use this to optimistically update the cache
    onMutate: async ({ id, newStatus }) => {
      // Cancel any outgoing refetches for this item
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      await queryClient.invalidateQueries({ queryKey: ["item", id] });

      // Snapshot the previous value so we can rollback if error occurs
      const previousItem = queryClient.getQueryData(["item", id]);
      const previousItems = queryClient.getQueryData(["items"]);

      // Optimistically update single-item cache
      queryClient.setQueryData(["item", id], (old: any) => {
        console.log(
          "Being optimistic and updating the single query cache with our front end value: " +
            JSON.stringify(newStatus)
        );
        if (!old) return { id, status: newStatus }; // fallback if cache missing
        return { ...old, status: newStatus };
      });

      // Optimistically update the list cache
      queryClient.setQueryData(["items"], (old: any) => {
        console.log(
          "Being optimistic and updating the big query cache with our front end value: " +
            JSON.stringify(newStatus)
        );
        if (!old) return old;
        return old.map((item: any) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
      });

      // Return context for rollback on error
      return { previousItem, previousItems };
    },

    // Rollback if mutation fails
    onError: (_err, _variables, context: any) => {
      console.log("Oh noes!");
      if (context?.previousItem) {
        queryClient.setQueryData(
          ["item", context.previousItem.id],
          context.previousItem
        );
      }
      if (context?.previousItems) {
        queryClient.setQueryData(["items"], context.previousItems);
      }
    },

    // Optionally refetch single item after mutation settles
    onSettled: (_data, _error, { id }) => {
      // Only refetch the item that changed, not the whole list
      console.log("Refetching just one row back");
      queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
  });
}
