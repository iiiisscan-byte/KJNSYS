import { supabase } from "./src/lib/supabase";

async function checkPromotionsTable() {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .limit(1);
  
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes("does not exist")) {
      console.log("Promotions table does not exist.");
    } else {
      console.error("Error checking promotions table:", error);
    }
  } else {
    console.log("Promotions table exists.");
    console.log("Columns:", Object.keys(data[0] || {}));
  }
}

checkPromotionsTable();
