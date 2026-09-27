/**
 * This repo lives on an external volume where macOS writes AppleDouble
 * (`._*`) sidecar files next to every file it creates. Turbopack's build
 * persistence directory chokes on them ("invalid digit found in string"),
 * so every dev/build run clears them first.
 */
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const TARGETS = [".next"];

function clean(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }

  let removed = 0;
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.name.startsWith("._")) {
      rmSync(path, { force: true, recursive: true });
      removed += 1;
      continue;
    }
    if (entry.isDirectory()) {
      try {
        if (statSync(path).isDirectory()) removed += clean(path);
      } catch {
        /* ignore unreadable entries */
      }
    }
  }
  return removed;
}

let total = 0;
for (const target of TARGETS) total += clean(target);

if (total > 0) {
  console.log(`clean-appledouble: removed ${total} macOS sidecar file(s)`);
}
