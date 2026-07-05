import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, RotateCcw, Check, Plus, Edit2, Calculator, Sparkles, Cloud, CloudOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DayData {
  checked: boolean;
  emoji: string;
  note: string;
  price: string;
  updatedAt?: string;
}

interface CategoryConfig {
  id: string; // matches category_id
  uuid: string; // database UUID (id) of category
  name: string;
  principal: string;
  rate: string;
  isPaused: boolean;
  days: DayData[];
}

interface LogData {
  id: string;
  category_id: string;
  category_name: string;
  day_index: number;
  checked: boolean;
  emoji: string;
  note: string;
  price: string;
  logged_at: string;
}


const CATEGORY_THEMES: Record<
  string,
  {
    primary: string;
    accent: string;
    cardChecked: string;
    cardUnchecked: string;
    badge: string;
  }
> = {
  p1: {
    primary: "from-blue-600 to-indigo-600",
    accent: "text-blue-400 border-blue-500/20",
    cardChecked: "bg-blue-950/20 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-blue-500/10",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  p2: {
    primary: "from-emerald-600 to-teal-600",
    accent: "text-emerald-400 border-emerald-500/20",
    cardChecked: "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-emerald-500/10",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  d1: {
    primary: "from-purple-600 to-fuchsia-600",
    accent: "text-purple-400 border-purple-500/20",
    cardChecked: "bg-purple-950/20 border-purple-500/40 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-purple-500/10",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  d2: {
    primary: "from-amber-600 to-orange-600",
    accent: "text-amber-400 border-amber-500/20",
    cardChecked: "bg-amber-950/20 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-emerald-500/10",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  o1: {
    primary: "from-rose-600 to-pink-600",
    accent: "text-rose-400 border-rose-500/20",
    cardChecked: "bg-rose-950/20 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-rose-500/10",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  o2: {
    primary: "from-cyan-600 to-sky-600",
    accent: "text-cyan-400 border-cyan-500/20",
    cardChecked: "bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    cardUnchecked: "bg-card/40 border-border/40 hover:border-cyan-500/10",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  }
};

const POPULAR_EMOJIS = ["💯", "❓", "✅"];

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

// Safe price parser to prevent NaN database query exceptions
const safeParseFloat = (val: string | number | null | undefined): number | null => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (str === "") return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
};

const CalTool: React.FC = () => {
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [dbLogs, setDbLogs] = useState<LogData[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("p1");
  const [isEditingTabName, setIsEditingTabName] = useState<string | null>(null);
  const [editTabNameVal, setEditTabNameVal] = useState<string>("");
  const [showEmojiPickerForDay, setShowEmojiPickerForDay] = useState<number | null>(null);
  
  // Database connection syncing state
  const [dbStatus, setDbStatus] = useState<"syncing" | "synced" | "error">("syncing");

  // Show calculated targets flag (display-only, not stored in DB)
  const [showCalculatedTargets, setShowCalculatedTargets] = useState<boolean>(false);

  // Custom Confirmation Dialog Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete / Reset",
    onConfirm: () => {}
  });

  // Track active inputs
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(null);

  // Temp state for editing values
  const [tempNoteText, setTempNoteText] = useState<string>("");
  const [tempPriceText, setTempPriceText] = useState<string>("");

  // Draggable category index state for local visual feedback
  const [draggedCatIndex, setDraggedCatIndex] = useState<number | null>(null);

  // Dedicated Notepad State
  const [isNotepadActive, setIsNotepadActive] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [dbNoteContent, setDbNoteContent] = useState<string>("");

  // Dedicated History State
  const [isHistoryActive, setIsHistoryActive] = useState<boolean>(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "checked" | "pending" | "notes" | "prices">("all");
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>("all");

  // Load tracker state directly from database on mount (no admin login required)
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  const loadDataFromSupabase = async () => {
    setDbStatus("syncing");
    try {
      // 1. Fetch categories sorted by is_paused (active first) and position
      const { data: catData, error: catError } = await supabase
        .from("tracker_categories")
        .select("*")
        .order("is_paused", { ascending: true })
        .order("position", { ascending: true });

      if (catError) {
        console.error("Supabase load categories error:", catError);
        setDbStatus("error");
        return;
      }

      // If no categories in DB, initialize with default seed values
      if (!catData || catData.length === 0) {
        await initializeDefaultDbData();
        return;
      }

      // 2. Fetch days
      const { data: dayData, error: dayError } = await supabase
        .from("tracker_days")
        .select("*")
        .order("day_index", { ascending: true });

      if (dayError) {
        console.error("Supabase load days error:", dayError);
        setDbStatus("error");
        return;
      }

      // 3. Fetch notepad content
      const { data: noteData, error: noteError } = await supabase
        .from("tracker_notes")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000000")
        .maybeSingle();

      if (noteError) {
        console.error("Supabase load notes error:", noteError);
      } else {
        if (noteData) {
          setNoteContent(noteData.content || "");
          setDbNoteContent(noteData.content || "");
        } else {
          // If no note found, insert default empty note
          await supabase.from("tracker_notes").insert({ id: "00000000-0000-0000-0000-000000000000", content: "" });
        }
      }

      console.log("Supabase Load: tracker_categories fetched =", catData);
      console.log("Supabase Load: tracker_days fetched =", dayData);

      // 3. Format relational records into categories config structure
      const formattedCategories: CategoryConfig[] = catData.map((cat) => {
        const catDays = dayData ? dayData.filter((d) => {
          const match = d.category_uuid === cat.id;
          return match;
        }) : [];

        console.log(`Mapping category "${cat.category_id}" (UUID: ${cat.id}): found ${catDays.length} days.`);

        // Build 30 days grid ensuring all slots are filled correctly
        const days = Array.from({ length: 30 }, (_, index) => {
          const dayIndex = index + 1;
          const dbDay = catDays.find((d) => d.day_index === dayIndex);

          return dbDay
            ? {
                checked: dbDay.checked,
                emoji: dbDay.emoji || "✅",
                note: dbDay.note || "",
                price: (dbDay.price !== null && dbDay.price !== undefined) ? String(dbDay.price) : "",
                updatedAt: dbDay.updated_at
              }
            : {
                checked: false,
                emoji: "✅",
                note: "",
                price: ""
              };
        });

        return {
          id: cat.category_id,
          uuid: cat.id,
          name: cat.name,
          principal: String(cat.principal ?? 100),
          rate: String(cat.rate ?? 25),
          isPaused: !!cat.is_paused,
          days
        };
      });

      // 4. Fetch history logs
      const { data: logsData, error: logsError } = await supabase
        .from("tracker_logs")
        .select("*")
        .order("logged_at", { ascending: false });

      if (logsError) {
        console.error("Supabase load logs error:", logsError);
      } else if (logsData) {
        const formattedLogs: LogData[] = logsData.map((l) => ({
          id: l.id,
          category_id: l.category_id,
          category_name: l.category_name,
          day_index: l.day_index,
          checked: l.checked,
          emoji: l.emoji || "✅",
          note: l.note || "",
          price: (l.price !== null && l.price !== undefined) ? String(l.price) : "",
          logged_at: l.logged_at
        }));
        setDbLogs(formattedLogs);
      }

      setCategories(formattedCategories);
      setDbStatus("synced");
    } catch (err) {
      console.error("Exception loading from Supabase:", err);
      setDbStatus("error");
    }
  };

  const initializeDefaultDbData = async () => {
    try {
      const defaultCats = [
        { category_id: "p1", name: "p1", principal: 100, rate: 25, position: 0 },
        { category_id: "p2", name: "p2", principal: 100, rate: 25, position: 1 },
        { category_id: "d1", name: "d1", principal: 100, rate: 25, position: 2 },
        { category_id: "d2", name: "d2", principal: 100, rate: 25, position: 3 },
        { category_id: "o1", name: "Optional 1", principal: 100, rate: 25, position: 4 },
        { category_id: "o2", name: "Optional 2", principal: 100, rate: 25, position: 5 }
      ];

      const { error } = await supabase
        .from("tracker_categories")
        .insert(defaultCats);

      if (error) {
        console.error("Error seeding default categories:", error);
        setDbStatus("error");
      } else {
        await loadDataFromSupabase();
      }
    } catch (err) {
      console.error("Exception seeding DB:", err);
      setDbStatus("error");
    }
  };

  // HTML5 Drag & Drop Category Sort Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCatIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === index) return;

    // Swap ordering locally in state for a smooth real-time preview
    const reorderedCategories = [...categories];
    const draggedItem = reorderedCategories[draggedCatIndex];
    reorderedCategories.splice(draggedCatIndex, 1);
    reorderedCategories.splice(index, 0, draggedItem);

    setCategories(reorderedCategories);
    setDraggedCatIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedCatIndex(null);
    setDbStatus("syncing");
    try {
      // Sync the new positions of all categories back to Supabase tracker_categories
      const updates = categories.map((cat, index) =>
        supabase
          .from("tracker_categories")
          .update({ position: index })
          .eq("id", cat.uuid)
      );

      const results = await Promise.all(updates);
      const hasError = results.some((res) => res.error);

      if (hasError) {
        console.error("Error updating sorted categories order in Supabase.");
        setDbStatus("error");
      } else {
        setDbStatus("synced");
      }
    } catch (err) {
      console.error("Exception writing sorting changes to Supabase:", err);
      setDbStatus("error");
    }
  };

  // Helper trigger for custom confirmation modals
  const triggerConfirm = (title: string, message: string, onConfirm: () => void, confirmText: string = "Delete / Reset") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Generate completely empty days for initial state
  function generateDefaultDays(): DayData[] {
    return Array.from({ length: 30 }, () => ({
      checked: false,
      emoji: "✅",
      note: "",
      price: ""
    }));
  }

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const theme = CATEGORY_THEMES[activeCategoryId] || CATEGORY_THEMES.p1;

  if (dbStatus === "error" && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground bg-background p-4">
        <div className="bg-card border border-destructive/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
          <h3 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
            <CloudOff className="w-5 h-5 text-destructive" /> Database Connection Error
          </h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            The application failed to load data from Supabase. This happens if your Supabase environment keys in <code className="bg-background px-1 py-0.5 rounded text-destructive font-mono">.env</code> are incorrect or if you haven't created the database tables yet.
          </p>
          <div className="mb-4">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block mb-1">
              Required SQL Query (Run this in Supabase SQL Editor):
            </span>
            <pre className="bg-background text-[10px] p-3 rounded-lg overflow-x-auto text-muted-foreground border border-border/50 max-h-48 text-left select-all font-mono leading-relaxed">
{`DROP TABLE IF EXISTS public.tracker_days CASCADE;
DROP TABLE IF EXISTS public.tracker_categories CASCADE;
DROP TABLE IF EXISTS public.tracker_notes CASCADE;
DROP TABLE IF EXISTS public.tracker_logs CASCADE;

CREATE TABLE IF NOT EXISTS public.tracker_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    principal NUMERIC NOT NULL DEFAULT 100,
    rate NUMERIC NOT NULL DEFAULT 25,
    position INT NOT NULL DEFAULT 0,
    is_paused BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tracker_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_uuid UUID REFERENCES public.tracker_categories(id) ON DELETE CASCADE NOT NULL,
    day_index INT NOT NULL CHECK (day_index >= 1 AND day_index <= 30),
    checked BOOLEAN NOT NULL DEFAULT false,
    emoji VARCHAR(10) NOT NULL DEFAULT '✅',
    note TEXT DEFAULT '',
    price NUMERIC,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category_uuid, day_index)
);

CREATE TABLE IF NOT EXISTS public.tracker_notes (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tracker_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    day_index INT NOT NULL CHECK (day_index >= 1 AND day_index <= 30),
    checked BOOLEAN NOT NULL DEFAULT false,
    emoji VARCHAR(10) NOT NULL DEFAULT '✅',
    note TEXT DEFAULT '',
    price NUMERIC,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tracker_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_days DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_logs DISABLE ROW LEVEL SECURITY;`}
            </pre>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setDbStatus("syncing");
                loadDataFromSupabase();
              }}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold shadow transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeCategory) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground bg-background">
        <p className="text-sm animate-pulse">Loading tracker...</p>
      </div>
    );
  }

  // Toggle check/uncheck (relational update)
  const handleToggleDay = async (dayIndex: number, chosenEmoji?: string) => {
    if (!activeCategory) return;
    
    const currentChecked = activeCategory.days[dayIndex].checked;
    const nextChecked = !currentChecked;
    const emojiToSet = chosenEmoji || activeCategory.days[dayIndex].emoji || "✅";

    // Update locally
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCategoryId) return cat;
        const newDays = [...cat.days];
        newDays[dayIndex] = {
          ...newDays[dayIndex],
          checked: nextChecked,
          emoji: emojiToSet,
          updatedAt: new Date().toISOString()
        };
        return { ...cat, days: newDays };
      })
    );

    // Sync to DB
    if (activeCategory.uuid) {
      const updatedDay = activeCategory.days[dayIndex];
      setDbStatus("syncing");
      console.log(`Supabase Sync: Toggling day index ${dayIndex + 1} checked status to "${nextChecked}" for category UUID ${activeCategory.uuid}`);

      const { error } = await supabase
        .from("tracker_days")
        .upsert(
          {
            category_uuid: activeCategory.uuid,
            day_index: dayIndex + 1,
            checked: nextChecked,
            emoji: emojiToSet,
            note: updatedDay.note,
            price: safeParseFloat(updatedDay.price),
            updated_at: new Date().toISOString()
          },
          { onConflict: "category_uuid,day_index" }
        );

      if (error) {
        console.error("Error upserting day checked status to Supabase:", error);
        setDbStatus("error");
      } else {
        console.log("Supabase Sync success: Checked status updated successfully.");
        setDbStatus("synced");

        // Insert history log
        const { data: newLog, error: logError } = await supabase
          .from("tracker_logs")
          .insert({
            category_id: activeCategory.id,
            category_name: activeCategory.name,
            day_index: dayIndex + 1,
            checked: nextChecked,
            emoji: emojiToSet,
            note: updatedDay.note,
            price: safeParseFloat(updatedDay.price),
            logged_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!logError && newLog) {
          const formattedLog: LogData = {
            id: newLog.id,
            category_id: newLog.category_id,
            category_name: newLog.category_name,
            day_index: newLog.day_index,
            checked: newLog.checked,
            emoji: newLog.emoji || "✅",
            note: newLog.note || "",
            price: (newLog.price !== null && newLog.price !== undefined) ? String(newLog.price) : "",
            logged_at: newLog.logged_at
          };
          setDbLogs((prev) => [formattedLog, ...prev]);
        } else if (logError) {
          console.error("Error inserting history log to Supabase:", logError);
        }
      }
    }
  };

  // Update notes, emojis or manual price overrides in DB
  const handleUpdateDayText = async (dayIndex: number, field: "note" | "price" | "emoji", val: string) => {
    // Update locally
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCategoryId) return cat;
        const newDays = [...cat.days];
        newDays[dayIndex] = {
          ...newDays[dayIndex],
          [field]: val,
          updatedAt: new Date().toISOString()
        };
        return { ...cat, days: newDays };
      })
    );

    // Sync to DB
    if (activeCategory.uuid) {
      const currentDay = activeCategory.days[dayIndex];
      const updatedDay = {
        ...currentDay,
        [field]: val
      };

      setDbStatus("syncing");
      console.log(`Supabase Sync: Updating day index ${dayIndex + 1} field "${field}" to "${val}" for category UUID ${activeCategory.uuid}`);
      
      const { error } = await supabase
        .from("tracker_days")
        .upsert(
          {
            category_uuid: activeCategory.uuid,
            day_index: dayIndex + 1,
            checked: updatedDay.checked,
            emoji: updatedDay.emoji,
            note: updatedDay.note,
            price: safeParseFloat(updatedDay.price),
            updated_at: new Date().toISOString()
          },
          { onConflict: "category_uuid,day_index" }
        );

      if (error) {
        console.error("Error updating day field in Supabase:", error);
        setDbStatus("error");
      } else {
        console.log("Supabase Sync success: Day field updated successfully.");
        setDbStatus("synced");

        // Insert history log
        const { data: newLog, error: logError } = await supabase
          .from("tracker_logs")
          .insert({
            category_id: activeCategory.id,
            category_name: activeCategory.name,
            day_index: dayIndex + 1,
            checked: updatedDay.checked,
            emoji: updatedDay.emoji,
            note: updatedDay.note,
            price: safeParseFloat(updatedDay.price),
            logged_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!logError && newLog) {
          const formattedLog: LogData = {
            id: newLog.id,
            category_id: newLog.category_id,
            category_name: newLog.category_name,
            day_index: newLog.day_index,
            checked: newLog.checked,
            emoji: newLog.emoji || "✅",
            note: newLog.note || "",
            price: (newLog.price !== null && newLog.price !== undefined) ? String(newLog.price) : "",
            logged_at: newLog.logged_at
          };
          setDbLogs((prev) => [formattedLog, ...prev]);
        } else if (logError) {
          console.error("Error inserting history log to Supabase:", logError);
        }
      }
    }
  };

  // Update principal/rate locally
  const handleUpdateCalculatorConfig = (field: "principal" | "rate", val: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCategoryId) return cat;
        return { ...cat, [field]: val };
      })
    );
  };

  // Sync calculator changes to DB on blur (prevents database spamming on every keystroke)
  const saveCalculatorConfigToDb = async (catId: string, principal: string, rate: string) => {
    const targetCat = categories.find((c) => c.id === catId);
    if (!targetCat?.uuid) return;

    setDbStatus("syncing");
    const { error } = await supabase
      .from("tracker_categories")
      .update({
        principal: parseFloat(principal) || 100,
        rate: parseFloat(rate) || 25
      })
      .eq("id", targetCat.uuid);

    if (error) {
      console.error("Error updating config values in database:", error);
      setDbStatus("error");
    } else {
      setDbStatus("synced");
    }
  };

  // Save notepad content to Supabase
  const saveNoteToDb = async (content: string) => {
    if (content === dbNoteContent) return; // Skip if identical

    setDbStatus("syncing");
    console.log("Supabase Sync: Saving notepad content...");

    const { error } = await supabase
      .from("tracker_notes")
      .upsert({
        id: "00000000-0000-0000-0000-000000000000",
        content,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error saving notepad to Supabase:", error);
      setDbStatus("error");
    } else {
      console.log("Supabase Sync success: Notepad saved successfully.");
      setDbStatus("synced");
      setDbNoteContent(content);
    }
  };

  // Toggle display-only target values without updating permanent DB day state
  const handleGenerateTargets = () => {
    setShowCalculatedTargets(true);
  };

  // Reset tab (deletes days from tracker_days relational table with Custom Dialog Confirmation)
  const handleResetCurrentCategory = () => {
    triggerConfirm(
      "Reset Category Board",
      `Are you sure you want to permanently clear all checked checkboxes, notes, and overrides for the tracker tab "${activeCategory.name}"? This will delete the data from Supabase.`,
      async () => {
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id !== activeCategoryId) return cat;
            return {
              ...cat,
              days: generateDefaultDays()
            };
          })
        );
        setShowCalculatedTargets(false);
        setEditingNoteIndex(null);
        setEditingPriceIndex(null);

        if (activeCategory.uuid) {
          setDbStatus("syncing");
          const { error } = await supabase
            .from("tracker_days")
            .delete()
            .eq("category_uuid", activeCategory.uuid);

          if (error) {
            console.error("Error clearing days from database:", error);
            setDbStatus("error");
          } else {
            setDbStatus("synced");
          }
        }
      },
      "Reset"
    );
  };
  // Reset all categories (re-seeds default categories in database with Custom Dialog Confirmation)
  const handleResetAllData = () => {
    triggerConfirm(
      "Factory Reset Board System",
      "Are you sure you want to permanently delete ALL custom trackers, tabs, notes, and price information from Supabase? This action is irreversible.",
      async () => {
        setDbStatus("syncing");
        const { error } = await supabase
          .from("tracker_categories")
          .delete()
          .neq("category_id", "force_non_empty_delete"); // Deletes everything via cascade

        if (error) {
          console.error("Error factory resetting categories:", error);
          setDbStatus("error");
          return;
        }

        // Clear Notepad
        setNoteContent("");
        setDbNoteContent("");
        await supabase
          .from("tracker_notes")
          .update({ content: "" })
          .eq("id", "00000000-0000-0000-0000-000000000000");

        await initializeDefaultDbData();
        setShowCalculatedTargets(false);
        setEditingNoteIndex(null);
        setEditingPriceIndex(null);
      },
      "Reset All"
    );
  };

  // Toggle pause status on a category
  const handleTogglePauseCategory = async (catId: string, currentPaused: boolean) => {
    const targetCat = categories.find((c) => c.id === catId);
    if (!targetCat?.uuid) return;

    const actionText = currentPaused ? "Resume" : "Pause";
    const confirmTitle = `${actionText} Tracker Category`;
    const confirmMsg = currentPaused
      ? `Would you like to resume "${targetCat.name}"? It will move back to the active section of your sidebar.`
      : `Are you sure you want to pause "${targetCat.name}"? It will move to the bottom of your sidebar list and be dimmed.`;

    triggerConfirm(
      confirmTitle,
      confirmMsg,
      async () => {
        setDbStatus("syncing");
        const { error } = await supabase
          .from("tracker_categories")
          .update({ is_paused: !currentPaused })
          .eq("id", targetCat.uuid);

        if (error) {
          console.error(`Error toggling pause for category ${catId}:`, error);
          setDbStatus("error");
        } else {
          console.log(`Supabase Sync: Category ${catId} is now ${currentPaused ? "active" : "paused"}.`);
          await loadDataFromSupabase();
        }
      },
      actionText
    );
  };

  // Rename categories
  const handleStartRename = (catId: string, currentName: string) => {
    setIsEditingTabName(catId);
    setEditTabNameVal(currentName);
  };

  const handleSaveRename = async (catId: string) => {
    if (editTabNameVal.trim() === "") return;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, name: editTabNameVal.trim() };
      })
    );
    setIsEditingTabName(null);

    const targetCat = categories.find((c) => c.id === catId);
    if (targetCat?.uuid) {
      setDbStatus("syncing");
      const { error } = await supabase
        .from("tracker_categories")
        .update({ name: editTabNameVal.trim() })
        .eq("id", targetCat.uuid);

      if (error) {
        console.error("Error renaming category in database:", error);
        setDbStatus("error");
      } else {
        setDbStatus("synced");
      }
    }
  };

  // Add category (inserts new category in database at the bottom position)
  const handleAddCategory = async () => {
    const name = window.prompt("Enter name for the new tracker:");
    if (!name || name.trim() === "") return;

    const newId = `custom_${Date.now()}`;
    setDbStatus("syncing");

    const { data, error } = await supabase
      .from("tracker_categories")
      .insert({
        category_id: newId,
        name: name.trim(),
        principal: 100,
        rate: 25,
        position: categories.length
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting category row:", error);
      setDbStatus("error");
      return;
    }

    const newCategory: CategoryConfig = {
      id: newId,
      uuid: data.id,
      name: name.trim(),
      principal: "100",
      rate: "25",
      days: generateDefaultDays()
    };

    setCategories((prev) => [...prev, newCategory]);
    setActiveCategoryId(newId);
    setIsNotepadActive(false);
    setIsHistoryActive(false);
    setDbStatus("synced");
  };

  // Delete category (deletes category row from database with Custom Dialog Confirmation)
  const handleDeleteCategory = (catId: string, catName: string) => {
    if (categories.length <= 1) {
      window.alert("Cannot delete the only remaining tracker. Please add a new tracker first.");
      return;
    }

    triggerConfirm(
      "Delete Tracker",
      `Are you sure you want to permanently delete the tracker "${catName}"? This will delete the tracker and all its 30 days of notes and prices from Supabase.`,
      async () => {
        const targetCat = categories.find((c) => c.id === catId);
        if (targetCat?.uuid) {
          setDbStatus("syncing");
          const { error } = await supabase
            .from("tracker_categories")
            .delete()
            .eq("id", targetCat.uuid);

          if (error) {
            console.error("Error deleting category row:", error);
            setDbStatus("error");
            return;
          }
        }

        const next = categories.filter((c) => c.id !== catId);
        setCategories(next);
        if (activeCategoryId === catId) {
          setActiveCategoryId(next[0].id);
        }
        setDbStatus("synced");
        setEditingNoteIndex(null);
        setEditingPriceIndex(null);
      },
      "Delete"
    );
  };

  // Delete a specific history log item
  const handleDeleteLog = (logId: string) => {
    triggerConfirm(
      "Delete History Log",
      "Are you sure you want to permanently delete this log entry? This action is irreversible.",
      async () => {
        setDbStatus("syncing");
        const { error } = await supabase
          .from("tracker_logs")
          .delete()
          .eq("id", logId);

        if (error) {
          console.error("Error deleting history log from Supabase:", error);
          setDbStatus("error");
        } else {
          setDbLogs((prev) => prev.filter((log) => log.id !== logId));
          setDbStatus("synced");
        }
      },
      "Delete"
    );
  };

  // Delete all history logs
  const handleResetLogs = () => {
    triggerConfirm(
      "Clear All History Logs",
      "Are you sure you want to permanently clear all activity history logs from Supabase? This action is irreversible.",
      async () => {
        setDbStatus("syncing");
        const { error } = await supabase
          .from("tracker_logs")
          .delete()
          .neq("category_id", "force_non_empty_delete");

        if (error) {
          console.error("Error resetting history logs in Supabase:", error);
          setDbStatus("error");
        } else {
          setDbLogs([]);
          setDbStatus("synced");
        }
      },
      "Clear All"
    );
  };

  // Note edit handlers
  const triggerNoteEdit = (idx: number, currentText: string) => {
    setTempNoteText(currentText);
    setEditingNoteIndex(idx);
    setEditingPriceIndex(null);
  };

  const saveNoteEdit = (idx: number) => {
    handleUpdateDayText(idx, "note", tempNoteText.trim());
    setEditingNoteIndex(null);
  };

  // Price edit handlers
  const triggerPriceEdit = (idx: number, currentText: string) => {
    setTempPriceText(currentText);
    setEditingPriceIndex(idx);
    setEditingNoteIndex(null);
  };

  const savePriceEdit = (idx: number) => {
    handleUpdateDayText(idx, "price", tempPriceText.trim());
    setEditingPriceIndex(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 font-sans pb-12">
      {/* CSS Styles for Checkbox Bounces and Dropdown Popups */}
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0.85); opacity: 0; }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check-pop {
          animation: checkPop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes fadeScaleIn {
          0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-fade-scale-in {
          animation: fadeScaleIn 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

      {/* Custom Confirmation Dialog Modal Overlay */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border/80 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-scale-in relative">
            <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="text-destructive">⚠️</span> {confirmModal.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-colors ${
                  confirmModal.confirmText && (confirmModal.confirmText.includes("Pause") || confirmModal.confirmText.includes("Resume"))
                    ? "bg-primary hover:bg-primary/95 shadow-primary/10"
                    : "bg-destructive hover:bg-destructive/95 shadow-destructive/10"
                }`}
              >
                {confirmModal.confirmText || "Delete / Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Simple Top Header */}
        <header className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Calendar Board</h1>
            
            {/* Database Sync Status Indicator */}
            <div className="flex items-center gap-1.5 ml-2">
              {dbStatus === "synced" && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <Cloud className="w-3 h-3" /> Synced
                </span>
              )}
              {dbStatus === "syncing" && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
                  <Cloud className="w-3 h-3" /> Syncing
                </span>
              )}
              {dbStatus === "error" && (
                <span className="flex items-center gap-1 text-[10px] text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 rounded-full">
                  <CloudOff className="w-3 h-3" /> Sync Error
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetAllData}
              className="flex items-center gap-1 text-xs border border-destructive/20 px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        </header>

        {/* Two Column Layout: Vertical Sidebar Selectors on left, Grid on right */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Sidebar Tab Selectors */}
          <aside className="w-full md:w-48 shrink-0 bg-card/10 p-3 rounded-xl border border-border/20">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider px-2 mb-1 md:block hidden">
              Select Tracker
            </span>
            <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 items-center md:items-stretch scrollbar-none w-full min-w-0">
              {categories.map((cat, idx) => {
                const isActive = cat.id === activeCategoryId && !isNotepadActive && !isHistoryActive;
                const isEditing = isEditingTabName === cat.id;
                const isManageable = true; // Make all categories editable and deletable
                const hasPending = cat.days.some((d) => d.checked && d.emoji === "❓");
                const hasRecentProgress = cat.days.some((d) => {
                  if (!d.checked || (d.emoji !== "✅" && d.emoji !== "💯")) return false;
                  if (!d.updatedAt) return false;
                  const updatedTime = new Date(d.updatedAt).getTime();
                  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
                  return updatedTime > twoDaysAgo;
                });

                return (
                  <div
                    key={cat.id}
                    draggable={!isEditing}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`relative flex items-center w-auto md:w-full cursor-grab active:cursor-grabbing transition-all shrink-0 ${
                      draggedCatIndex === idx ? "opacity-35 scale-95 border-primary/20" : ""
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center bg-card border border-primary/50 rounded-lg px-2.5 py-1.5 w-full">
                        <input
                          type="text"
                          value={editTabNameVal}
                          onChange={(e) => setEditTabNameVal(e.target.value)}
                          onBlur={() => handleSaveRename(cat.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(cat.id);
                            if (e.key === "Escape") setIsEditingTabName(null);
                          }}
                          className="bg-transparent border-none text-xs outline-none w-full text-foreground font-semibold"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center group relative w-full">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setActiveCategoryId(cat.id);
                            setIsNotepadActive(false);
                            setIsHistoryActive(false);
                            setShowCalculatedTargets(false); // Reset targets view on tab switch
                            setEditingNoteIndex(null);
                            setEditingPriceIndex(null);
                          }}
                          onDoubleClick={() => handleTogglePauseCategory(cat.id, cat.isPaused)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setActiveCategoryId(cat.id);
                              setIsNotepadActive(false);
                              setIsHistoryActive(false);
                              setShowCalculatedTargets(false);
                              setEditingNoteIndex(null);
                              setEditingPriceIndex(null);
                            }
                          }}
                          title="Double-click to Pause / Resume tracker"
                          className={`text-xs font-semibold px-3 py-2.5 rounded-lg border w-full text-left flex justify-between items-center transition-all cursor-pointer ${
                            cat.isPaused
                              ? "bg-zinc-800/10 text-zinc-500 border-zinc-800/25 grayscale blur-[0.6px] opacity-40 hover:opacity-60"
                              : isActive
                                ? hasPending
                                  ? "bg-amber-500 text-zinc-950 border-transparent shadow-sm font-bold"
                                  : hasRecentProgress
                                    ? "bg-emerald-600 text-white border-transparent shadow-sm font-bold"
                                    : "bg-primary text-primary-foreground border-transparent shadow-sm"
                                : hasPending
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-300"
                                  : hasRecentProgress
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-300"
                                    : "bg-card/30 text-muted-foreground border-border/30 hover:bg-card/50 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {/* Visual Grip Handle for dragging */}
                            <span className="text-muted-foreground/35 group-hover:text-muted-foreground/60 transition-colors text-xs select-none">
                              ⋮⋮
                            </span>
                            <span className="capitalize truncate max-w-[80px]">{cat.name}</span>
                            {cat.isPaused && (
                              <span className="text-[7px] font-bold text-zinc-500 bg-zinc-800/30 border border-zinc-700/30 px-1 rounded uppercase tracking-wider shrink-0 select-none ml-1.5">
                                paused
                              </span>
                            )}
                            {(() => {
                              const completedDays = cat.days
                                .map((day, idx) => ({ ...day, dayIndex: idx + 1 }))
                                .filter((d) => d.checked);
                              const maxCompletedDay = completedDays.length > 0
                                ? Math.max(...completedDays.map((d) => d.dayIndex))
                                : 0;
                              const topDay = cat.days[maxCompletedDay - 1];
                              const isTopDayPending = topDay && topDay.checked && topDay.emoji === "❓";

                              const badgeClass = cat.isPaused
                                ? "bg-zinc-800/50 text-zinc-500 border border-zinc-700/20"
                                : isTopDayPending
                                  ? "bg-red-600 text-white font-black border border-red-700/30 shadow-[0_0_8px_rgba(220,38,38,0.25)] animate-pulse"
                                  : isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-primary/10 text-primary border border-primary/20";

                              return (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${badgeClass}`}>
                                  {maxCompletedDay}
                                </span>
                              );
                            })()}
                          </div>
                          
                          {isManageable && (
                            <div className="flex items-center gap-1 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartRename(cat.id, cat.name);
                                }}
                                className="hover:scale-105 p-0.5 rounded text-muted-foreground hover:text-foreground"
                                title="Rename"
                              >
                                <Edit2 className="w-3 h-3" />
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(cat.id, cat.name);
                                }}
                                className="hover:scale-105 p-0.5 rounded text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Tracker Button */}
              <button
                onClick={handleAddCategory}
                className="text-[11px] font-semibold px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:text-primary transition-all text-muted-foreground flex items-center justify-center gap-1.5 w-auto md:w-full mt-0 md:mt-2 shrink-0 h-[38px] md:h-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tracker
              </button>

              {/* Responsive Divider */}
              <div className="border-l md:border-l-0 md:border-t border-border/20 h-6 md:h-0 my-0 md:my-2 mx-1.5 md:mx-0 pt-0 md:pt-2 shrink-0 self-center" />
              
              {/* Notepad Button */}
              <button
                onClick={() => {
                  setIsNotepadActive(true);
                  setIsHistoryActive(false);
                  setShowCalculatedTargets(false);
                  setEditingNoteIndex(null);
                  setEditingPriceIndex(null);
                }}
                className={`text-xs font-semibold px-3 py-2.5 rounded-lg border w-auto md:w-full text-left flex items-center gap-2 transition-all shrink-0 ${
                  isNotepadActive
                    ? "bg-primary text-primary-foreground border-transparent shadow-sm"
                    : "bg-card/30 text-muted-foreground border-border/30 hover:bg-card/50 hover:text-foreground"
                }`}
              >
                <span>📓</span>
                <span>Notepad</span>
              </button>

              {/* History Button */}
              <button
                onClick={() => {
                  setIsHistoryActive(true);
                  setIsNotepadActive(false);
                  setShowCalculatedTargets(false);
                  setEditingNoteIndex(null);
                  setEditingPriceIndex(null);
                }}
                className={`text-xs font-semibold px-3 py-2.5 rounded-lg border w-auto md:w-full text-left flex items-center gap-2 transition-all shrink-0 ${
                  isHistoryActive
                    ? "bg-primary text-primary-foreground border-transparent shadow-sm"
                    : "bg-card/30 text-muted-foreground border-border/30 hover:bg-card/50 hover:text-foreground"
                }`}
              >
                <span>📜</span>
                <span>History</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col gap-6 w-full">
            
            {isNotepadActive ? (
              /* Dedicated Notepad Panel */
              <section className="bg-card/30 border border-border/40 backdrop-blur-md rounded-xl p-6 shadow-sm w-full flex flex-col gap-4 min-h-[500px]">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📓</span>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Global Notepad / Scratch</h2>
                      <p className="text-[10px] text-muted-foreground">Auto-saves to your database on typing pause or text area blur</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerConfirm(
                        "Clear Notepad Content",
                        "Are you sure you want to permanently clear all text in your notepad? This will delete the content from Supabase.",
                        () => {
                          setNoteContent("");
                          saveNoteToDb("");
                        },
                        "Clear"
                      );
                    }}
                    className="flex items-center gap-1.5 text-xs text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Notes
                  </button>
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                    // Fast auto-save triggers on blur or change with state tracking
                  }}
                  onBlur={() => saveNoteToDb(noteContent)}
                  placeholder="Type your notes, reminders, math calculations, or daily thoughts here... Everything you write here will automatically save to your Supabase database."
                  className="w-full flex-grow min-h-[380px] bg-white border border-border/80 rounded-lg p-4 text-xs font-mono leading-relaxed outline-none focus:border-primary/60 text-black resize-y shadow-inner transition-colors placeholder:text-zinc-400"
                />
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>Characters: {noteContent.length} | Lines: {noteContent.split('\n').length}</span>
                  {dbStatus === "synced" && <span className="text-emerald-400 font-semibold">● Saved to Cloud</span>}
                  {dbStatus === "syncing" && <span className="text-amber-400 animate-pulse font-semibold">● Saving Changes...</span>}
                  {dbStatus === "error" && <span className="text-destructive font-semibold">● Save Failed</span>}
                </div>
              </section>
            ) : isHistoryActive ? (
              /* Dedicated History Panel */
              <section className="bg-card/30 border border-border/40 backdrop-blur-md rounded-xl p-6 shadow-sm w-full flex flex-col gap-6 min-h-[500px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg animate-pulse">📜</span>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Tracker History & Activity Logs</h2>
                      <p className="text-[10px] text-muted-foreground">Detailed logs of checked days, custom prices, and notes categorized by category</p>
                    </div>
                  </div>

                  {/* Category & Status Filter Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Dropdown Selector */}
                    <select
                      value={historyCategoryFilter}
                      onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                      className="bg-background border border-border/80 text-foreground text-[10px] font-semibold rounded-lg px-2.5 py-1.5 focus:border-primary/50 outline-none cursor-pointer shadow-sm capitalize"
                    >
                      <option value="all">All Trackers</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap items-center gap-1.5 bg-background/50 border border-border/50 p-1 rounded-lg">
                      {[
                        { id: "all", label: "All Logs", icon: "📁" },
                        { id: "checked", label: "Checked", icon: "✅" },
                        { id: "pending", label: "Pending", icon: "❓" },
                        { id: "notes", label: "With Notes", icon: "📝" },
                        { id: "prices", label: "With Prices", icon: "💰" }
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setHistoryFilter(btn.id as any)}
                          className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                            historyFilter === btn.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{btn.icon}</span>
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Clear Logs Button */}
                    <button
                      onClick={handleResetLogs}
                      className="flex items-center gap-1.5 text-xs text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      title="Clear all activity history logs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Logs
                    </button>
                  </div>
                </div>

                {/* History Content - Chronological Timeline Log */}
                <div className="flex flex-col gap-6">
                  {(() => {
                    const recentLogs = [...dbLogs].filter((log) => {
                      // Apply category filter selection
                      if (historyCategoryFilter !== "all" && log.category_id !== historyCategoryFilter) {
                        return false;
                      }
                      // Apply status filter selection
                      if (historyFilter === "all") {
                        return true;
                      }
                      if (historyFilter === "checked") {
                        return log.checked && (log.emoji === "✅" || log.emoji === "💯");
                      }
                      if (historyFilter === "pending") {
                        return log.checked && log.emoji === "❓";
                      }
                      if (historyFilter === "notes") {
                        return log.note && log.note.trim() !== "";
                      }
                      if (historyFilter === "prices") {
                        return log.price && log.price.trim() !== "";
                      }
                      return false;
                    }).sort((a, b) => {
                      const timeA = a.logged_at ? new Date(a.logged_at).getTime() : 0;
                      const timeB = b.logged_at ? new Date(b.logged_at).getTime() : 0;
                      return timeB - timeA; // Most recent first
                    });

                    if (recentLogs.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-xl bg-background/20 text-center animate-fade-in">
                          <span className="text-2xl mb-2">⏱️</span>
                          <h4 className="text-xs font-semibold text-foreground mb-1">No Recent Logs Found</h4>
                          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                            No logs match the current filter selection or no actions have been taken on your trackers yet.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="border border-border/50 rounded-xl bg-card/20 overflow-hidden shadow-sm divide-y divide-border/30">
                        {recentLogs.map((log, logIdx) => {
                          const isCompleted = log.checked && (log.emoji === "✅" || log.emoji === "💯");
                          const catTheme = CATEGORY_THEMES[log.category_id] || CATEGORY_THEMES.p1;
                          
                          // Format date nicely in local format
                          const formattedTime = (() => {
                            if (!log.logged_at) return "Recently Updated";
                            try {
                              const d = new Date(log.logged_at);
                              return d.toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short"
                              });
                            } catch {
                              return "Recently Updated";
                            }
                          })();

                          return (
                            <div key={`${log.category_id}-d${log.day_index}-${logIdx}`} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-card/40 transition-colors">
                              {/* Left details: Timestamp, Category Indicator, Day Index, Status */}
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* Time display */}
                                <div className="text-[9px] font-black text-muted-foreground/60 bg-background border border-border/40 px-2 py-1 rounded shrink-0">
                                  {formattedTime}
                                </div>

                                {/* Category Tag */}
                                <div className={`text-[10px] font-bold text-white bg-gradient-to-r ${catTheme.primary} px-2.5 py-0.5 rounded-full shrink-0 shadow-sm capitalize`}>
                                  {log.category_name}
                                </div>

                                {/* Day label */}
                                <div className="text-[10px] font-black text-foreground bg-accent/25 border border-border/30 px-2 py-0.5 rounded shrink-0">
                                  Day {log.day_index}
                                </div>

                                {/* Emoji Status */}
                                {log.checked ? (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 ${
                                    isCompleted
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  }`}>
                                    <span>{log.emoji}</span>
                                    <span>{isCompleted ? "Completed" : "Pending"}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/25 shrink-0">
                                    Unchecked
                                  </span>
                                )}
                              </div>

                              {/* Right details: Custom Note, Custom Price & Log Deletion */}
                              <div className="flex flex-grow items-center justify-end gap-6 flex-wrap md:flex-nowrap">
                                {/* Note bubble */}
                                {log.note ? (
                                  <div className="text-[10px] text-foreground bg-background/50 border border-border/40 px-2.5 py-1.5 rounded-lg max-w-md flex-grow whitespace-pre-wrap leading-normal font-medium text-left">
                                    <span className="text-muted-foreground font-semibold block text-[8px] uppercase tracking-wider mb-0.5">Note:</span>
                                    {log.note}
                                  </div>
                                ) : (
                                  <div className="text-[9px] text-muted-foreground/30 italic">No note added</div>
                                )}

                                {/* Price indicator */}
                                {log.price ? (
                                  <div className="text-[10px] font-black text-foreground bg-primary/10 border border-primary/20 px-2 py-1 rounded shrink-0">
                                    ₹{log.price}
                                  </div>
                                ) : (
                                  <div className="text-[9px] text-muted-foreground/30 italic shrink-0">No price override</div>
                                )}

                                {/* Delete log button */}
                                <button
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="p-1.5 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all shrink-0 ml-2"
                                  title="Delete log entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </section>
            ) : (
              <>
                {/* Target Calculator Panel */}
                <section className="bg-card/30 border border-border/40 backdrop-blur-md rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm w-full">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                      <Calculator className="w-4 h-4" />
                      <span>Target Calculator</span>
                    </div>
                    
                    {/* Input Principal */}
                    <div className="flex items-center bg-background/50 border border-border/50 rounded-lg px-2.5 py-1 focus-within:border-primary/50 transition-colors">
                      <span className="text-[11px] text-muted-foreground mr-1.5">Start Principal (₹)</span>
                      <input
                        type="number"
                        value={activeCategory.principal}
                        onChange={(e) => handleUpdateCalculatorConfig("principal", e.target.value)}
                        onBlur={() => saveCalculatorConfigToDb(activeCategoryId, activeCategory.principal, activeCategory.rate)}
                        className="bg-transparent border-none text-xs outline-none w-16 text-foreground font-semibold"
                        placeholder="100"
                      />
                    </div>

                    {/* Input Rate */}
                    <div className="flex items-center bg-background/50 border border-border/50 rounded-lg px-2.5 py-1 focus-within:border-primary/50 transition-colors">
                      <span className="text-[11px] text-muted-foreground mr-1.5">Compounding Rate (%)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={activeCategory.rate}
                        onChange={(e) => handleUpdateCalculatorConfig("rate", e.target.value)}
                        onBlur={() => saveCalculatorConfigToDb(activeCategoryId, activeCategory.principal, activeCategory.rate)}
                        className="bg-transparent border-none text-xs outline-none w-12 text-foreground font-semibold"
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={handleGenerateTargets}
                      className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all duration-200"
                      title="Generate compound target prices"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Calculate & Set Targets
                    </button>
                    <button
                      onClick={handleResetCurrentCategory}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-border/80 transition-all text-muted-foreground hover:text-foreground"
                      title="Reset current tracker items"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Tab
                    </button>
                  </div>
                </section>

                {/* Small grid of 30 blocks */}
                <section className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {activeCategory.days.map((day, idx) => {
                      const dayIndex = idx + 1;
                      const isChecked = day.checked;
                      const isRecentDayProgress = isChecked && (day.emoji === "✅" || day.emoji === "💯") && (() => {
                        if (!day.updatedAt) return false;
                        const updatedTime = new Date(day.updatedAt).getTime();
                        const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
                        return updatedTime > twoDaysAgo;
                      })();

                      const isPending = isChecked && day.emoji === "❓";

                      const cardClass = isPending
                        ? "bg-amber-950/20 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)] text-amber-400"
                        : isRecentDayProgress
                          ? "bg-emerald-950/25 border-emerald-500/45 shadow-[0_0_10px_rgba(16,185,129,0.15)] text-emerald-400"
                          : isChecked
                            ? theme.cardChecked
                            : theme.cardUnchecked;

                      const isEditingNote = editingNoteIndex === idx;
                      const isEditingPrice = editingPriceIndex === idx;

                      // Calculate target price on the fly (for display only, not stored in DB)
                      const principalNum = parseFloat(activeCategory.principal) || 0;
                      const rateNum = parseFloat(activeCategory.rate) || 0;
                      const targetVal = principalNum * Math.pow(1 + rateNum / 100, dayIndex);
                      const targetValStr = targetVal.toFixed(2);

                      return (
                        <div
                          key={idx}
                          className={`relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-200 aspect-[1/1.05] min-h-[110px] group ${cardClass}`}
                        >
                          {/* Small uncheck trigger if emoji shows up */}
                          {isChecked && (
                            <button
                              onClick={() => handleToggleDay(idx)}
                              className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive/80 text-white text-[9px] flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all z-10"
                              title="Uncheck Day"
                            >
                              ×
                            </button>
                          )}

                          {/* Top line: Day label only */}
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground w-full">
                            <span className="font-semibold">Day {dayIndex}</span>
                          </div>

                          {/* Above Checkbox Note Area: positioned below the Day X title using free space */}
                          <div className="w-full mt-0.5 flex justify-start relative">
                            {isEditingNote ? (
                              <textarea
                                value={tempNoteText}
                                onChange={(e) => setTempNoteText(e.target.value)}
                                onBlur={() => saveNoteEdit(idx)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      saveNoteEdit(idx);
                                    }
                                    if (e.key === "Escape") setEditingNoteIndex(null);
                                  }}
                                className="absolute top-0 left-0 bg-card border border-primary/50 rounded-lg p-1.5 text-[9px] w-full h-24 outline-none shadow-xl z-20 resize-none font-mono text-foreground leading-normal"
                                autoFocus
                                placeholder="Note..."
                                rows={5}
                              />
                            ) : day.note ? (
                              <button
                                onClick={() => triggerNoteEdit(idx, day.note)}
                                className="text-[9px] text-foreground bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded w-full font-medium leading-tight text-left whitespace-pre-wrap line-clamp-5 hover:bg-primary/20 transition-all"
                                title={day.note}
                              >
                                {day.note}
                              </button>
                            ) : (
                              <button
                                onClick={() => triggerNoteEdit(idx, "")}
                                className="text-[9px] hover:text-foreground text-muted-foreground/50 flex items-center gap-0.5"
                              >
                                <Plus className="w-2.5 h-2.5" /> Note
                              </button>
                            )}
                          </div>

                          {/* Middle Checkbox (Centered with Pop Animation) */}
                          <div className="flex items-center justify-center my-1.5 relative">
                            {isChecked ? (
                              <div className="relative animate-check-pop">
                                <button
                                  onClick={() => setShowEmojiPickerForDay(showEmojiPickerForDay === idx ? null : idx)}
                                  className="text-2xl hover:scale-110 active:scale-95 transition-transform p-1 select-none"
                                  title="Change Emoji"
                                >
                                  {day.emoji}
                                </button>

                                {/* Inline Emoji Selector Popup with Smooth Fade/Scale */}
                                {showEmojiPickerForDay === idx && (
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 bg-card border border-border p-1.5 rounded-lg shadow-xl grid grid-cols-3 gap-1.5 w-24 animate-fade-scale-in">
                                    {POPULAR_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => {
                                          handleUpdateDayText(idx, "emoji", emoji);
                                          setShowEmojiPickerForDay(null);
                                        }}
                                        className="text-sm p-1 hover:bg-accent rounded active:scale-95 transition-all text-center select-none"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative">
                                <button
                                  onClick={() => setShowEmojiPickerForDay(showEmojiPickerForDay === idx ? null : idx)}
                                  className="w-7 h-7 rounded-lg border border-border/80 text-transparent hover:border-primary/50 hover:bg-primary/5 bg-background/20 transition-all flex items-center justify-center"
                                  title="Select Emoji Status"
                                >
                                  <Check className="w-4 h-4 text-transparent hover:text-muted-foreground/35 stroke-[3]" />
                                </button>

                                {/* Inline Emoji Selector Popup when unchecked */}
                                {showEmojiPickerForDay === idx && (
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 bg-card border border-border p-1.5 rounded-lg shadow-xl grid grid-cols-3 gap-1.5 w-24 animate-fade-scale-in">
                                    {POPULAR_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => {
                                          handleToggleDay(idx, emoji);
                                          setShowEmojiPickerForDay(null);
                                        }}
                                        className="text-sm p-1 hover:bg-accent rounded active:scale-95 transition-all text-center select-none text-foreground"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Below Checkbox: Price content or toggle */}
                          <div className="flex items-center justify-center w-full">
                            {isEditingPrice ? (
                              <input
                                type="text"
                                value={tempPriceText}
                                onChange={(e) => setTempPriceText(e.target.value)}
                                onBlur={() => savePriceEdit(idx)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") savePriceEdit(idx);
                                  if (e.key === "Escape") setEditingPriceIndex(null);
                                }}
                                className="bg-background/90 text-[10px] text-center border border-border rounded px-1 py-0.5 outline-none w-16"
                                autoFocus
                                placeholder="Price..."
                              />
                            ) : showCalculatedTargets && principalNum > 0 && rateNum > 0 ? (
                              /* Show calculated target value when overlay calculations are active */
                              <button
                                onClick={() => triggerPriceEdit(idx, targetValStr)}
                                className="text-[10px] font-medium text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-0.5 italic"
                                title="Calculated Target (not stored in DB)"
                              >
                                <span>₹{targetValStr}</span>
                                <span className="text-[7px] bg-primary/10 text-primary px-0.5 rounded font-black not-italic">T</span>
                              </button>
                            ) : day.price ? (
                              /* Show custom saved price if overlay is not active */
                              <button
                                onClick={() => triggerPriceEdit(idx, day.price)}
                                className="text-[10px] font-black text-foreground hover:text-primary transition-colors"
                              >
                                ₹{day.price}
                              </button>
                            ) : (
                              /* Show Add Price button */
                              <button
                                onClick={() => triggerPriceEdit(idx, "")}
                                className="text-[9px] hover:text-foreground text-muted-foreground/50 flex items-center gap-0.5"
                              >
                                <Plus className="w-2.5 h-2.5" /> Price
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalTool;
