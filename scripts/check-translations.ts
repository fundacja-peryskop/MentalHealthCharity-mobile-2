// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

const files = ["locales/i18n/pl.json"];

let hasError = false;

for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    if (content.includes("__NOT_TRANSLATED__")) {
        console.error(`❌ ${file} contains __NOT_TRANSLATED__`);
        hasError = true;
    }
}

if (hasError) {
    process.exit(1);
}

console.log("✅ All translations are complete.");
