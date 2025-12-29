import path from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "!(*.js|*.jsx|*.ts|*.tsx)": ["prettier --ignore-unknown --write"],
};
