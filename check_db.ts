import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "./src/db";
import { bibleQuizModules } from "./src/db/schema";

async function main() {
  try {
    const modules = await db.select().from(bibleQuizModules);
    console.log("Modules in database:", modules.length);
    console.log(modules);
  } catch (error) {
    console.error("Error checking modules:", error);
  }
}

main();
