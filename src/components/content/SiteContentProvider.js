"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SiteContentContext = createContext({
  content: {},
  ready: false,
  refresh: () => {},
});

export function SiteContentProvider({ children }) {
  const pathname = usePathname();
  const [content, setContent] = useState({});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setReady(true);
      return;
    }

    const { data, error } = await supabase
      .from("site_content")
      .select("key, content");

    if (!error && data) {
      setContent(
        Object.fromEntries(data.map((row) => [row.key, row.content])),
      );
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setReady(true);
      return;
    }
    refresh();
  }, [pathname, refresh]);

  const value = useMemo(
    () => ({ content, ready, refresh }),
    [content, ready, refresh],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useRemoteContent(key, fallback) {
  const { content } = useContext(SiteContentContext);
  const value = content?.[key];
  if (value === undefined || value === null) return fallback;
  return value;
}
