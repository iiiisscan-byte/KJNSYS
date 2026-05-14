import { supabase } from '../src/lib/supabase';

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkCategories();
