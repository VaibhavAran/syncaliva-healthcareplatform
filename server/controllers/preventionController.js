import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "dailyTips.json");

function readContent() {
  const raw = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(raw);
}

function pickByDate(arr, offset = 0) {
  if (!arr || arr.length === 0) return null;
  const today = dayjs().format("YYYY-MM-DD");
  const days = Math.abs(dayjs(today).diff("2020-01-01", "day"));
  const idx = (days + offset) % arr.length;
  const item = arr[idx];
  return { ...item, _index: idx }; // include index if you ever need it
}

export const getPreventionContent = async (req, res) => {
  try {
    const content = readContent();

    const oneChangeToday = pickByDate(content.one_changes, 0);
    const todaysPhysical = pickByDate(content.challenges.physical, 0);
    const todaysMental = pickByDate(content.challenges.mental, 1);

    res.json({
      date: dayjs().format("YYYY-MM-DD"),
      eye: content.eye,
      immunity: content.immunity,
      oneChangeToday,
      challengesToday: {
        physical: todaysPhysical,
        mental: todaysMental
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reading prevention content" });
  }
};
