"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Popup from "./Popup";

interface PopupData {
  id: string;
  title: string;
  content: string;
  link_url: string | null;
  width: number;
  height: number;
  top_pos: number;
  left_pos: number;
}

export default function PopupManager() {
  const [activePopups, setActivePopups] = useState<PopupData[]>([]);

  useEffect(() => {
    async function loadPopups() {
      try {
        const { data, error } = await supabase
          .from("popups")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;
        if (data) {
          // Filter out popups that the user chose to hide for today
          const now = new Date().getTime();
          const filtered = data.filter((p: PopupData) => {
            const hideUntil = localStorage.getItem(`popup_hide_${p.id}`);
            if (hideUntil && parseInt(hideUntil) > now) {
              return false;
            }
            return true;
          });
          setActivePopups(filtered);
        }
      } catch (error) {
        console.error("Error loading popups:", error);
      }
    }
    loadPopups();
  }, []);

  const closePopup = (id: string) => {
    setActivePopups((prev) => prev.filter((p) => p.id !== id));
  };

  if (activePopups.length === 0) return null;

  return (
    <>
      {activePopups.map((popup) => (
        <Popup 
          key={popup.id}
          id={popup.id}
          title={popup.title}
          content={popup.content}
          linkUrl={popup.link_url}
          width={popup.width}
          height={popup.height}
          top={popup.top_pos}
          left={popup.left_pos}
          onClose={() => closePopup(popup.id)}
        />
      ))}
    </>
  );
}
