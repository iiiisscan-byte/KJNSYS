import { supabase } from "./src/lib/supabase";

async function checkBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .limit(1);
  
  if (error) {
    console.error("Error fetching banners:", error);
  } else {
    console.log("Banner columns:", Object.keys(data[0] || {}));
    console.log("Sample data:", data[0]);
  }
}

checkBanners();
