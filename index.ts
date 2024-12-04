import { exists, readFile } from "fs/promises";
import { $ } from "bun";
import { parseArgs } from "util";

const { positionals } = parseArgs({
  args: Bun.argv,
  allowPositionals: true,
});

const command = positionals[2];

const filePath = "/tmp/content.txt";

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const edit = async () => {
  const fileExists = await exists(filePath);
  if (!fileExists) await $`touch ${filePath}`;
  await $`open -a TextEdit ${filePath}`;
};
const run = async () => {
  const namesAndYears: { names: string[]; year: number }[] = [];
  const content = await readFile(filePath, "utf-8");
  l1: for (const line of content.split("\n")) {
    const parts = line
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    let tempNames: string[] = [];
    l2: for (const part of parts) {
      if (numbers.some((number) => part.startsWith(number.toString()))) {
        const year = parseInt(part.substring(0, 10));
        namesAndYears.push({ names: tempNames, year });
        tempNames = [];
        continue l1;
      } else {
        const names = part.split("and").map((n) => n.trim());
        tempNames.push(...names);
      }
    }
  }
  const combinedItems: string[] = [];
  for (const { names, year } of namesAndYears) {
    combinedItems.push(
      `(${
        names.length > 2
          ? `${names[0]} et al., ${year}`
          : `${names.join(" & ")}, ${year}`
      })`
    );
  }
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const randomIndex = Math.floor(Math.random() * combinedItems.length);
    await $`echo "${combinedItems[randomIndex]}" | pbcopy`;
    console.log(`Copied ${combinedItems[randomIndex]} to clipboard`);
  }
};
// (async () => {
//   const namesAndYears: { names: string[]; year: number }[] = [];
//   const content = await readFile("content.txt", "utf-8");
//   l1: for (const line of content.split("\n")) {
//     const parts = line
//       .split(",")
//       .map((name) => name.trim())
//       .filter(Boolean);
//     let tempNames: string[] = [];
//     l2: for (const part of parts) {
//       if (numbers.some((number) => part.startsWith(number.toString()))) {
//         const year = parseInt(part.substring(0, 10));
//         namesAndYears.push({ names: tempNames, year });
//         tempNames = [];
//         continue l1;
//       } else {
//         const names = part.split("and").map((n) => n.trim());
//         tempNames.push(...names);
//       }
//     }
//   }
//   const combinedItems: string[] = [];
//   for (const { names, year } of namesAndYears) {
//     combinedItems.push(
//       `(${
//         names.length > 2
//           ? `${names[0]} et al., ${year}`
//           : `${names.join(" & ")}, ${year}`
//       })`
//     );
//   }
//   while (true) {
//     const randomIndex = Math.floor(Math.random() * combinedItems.length);
//     await $`echo "${combinedItems[randomIndex]}" | pbcopy`;
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }
// })();

switch (command) {
  case "edit":
    console.log("Editing...");
    edit();
    break;
  case "run":
    console.log("Running...");
    run();
    break;
  default:
    console.log("Invalid command, available commands are: edit, run");
    break;
}
