import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database["public"]["Tables"];
export type Row<T extends TableName> = Database["public"]["Tables"][T]["Row"];

/** Live table data: loads rows and refreshes whenever anyone changes them. */
export function useTable<T extends TableName>(table: T, orderBy = "created_at") {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`live-${table}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => qc.invalidateQueries({ queryKey: ["table", table] }))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, qc]);
  return useQuery({
    queryKey: ["table", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy as never, { ascending: false });
      if (error) throw error;
      return data as unknown as Row<T>[];
    },
  });
}
