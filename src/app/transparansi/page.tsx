import { GoogleSheetsService } from "@/lib/google-sheets/google-sheets.service";
import { SheetParserEngine } from "@/lib/google-sheets/sheet-parser-engine";
import { TransparencyDashboard, Activity, Finance } from "@/components/transparency/TransparencyDashboard";

export const dynamic = 'force-dynamic'; // Ensure fresh data on request
export const revalidate = 300; // ISR Backup: Revalidate every 5 minutes

async function getTransparencyData() {
  try {
    const sheetsService = await GoogleSheetsService.getInstance();
    const parser = new SheetParserEngine();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!spreadsheetId) {
      console.error("SPREADSHEET_ID is not defined");
      return { activities: [], finances: [] };
    }

    // Parallel fetch for performance
    const [activitiesRaw, financesRaw] = await Promise.all([
      sheetsService.getSheetData(spreadsheetId, "Activities"),
      sheetsService.getSheetData(spreadsheetId, "Finances")
    ]);

    // Parse data
    const activities = parser.transformDataForWebsite(
      await parser.parseSheetData(spreadsheetId, "Activities"),
      "Activities"
    ) as Activity[];

    const finances = parser.transformDataForWebsite(
      await parser.parseSheetData(spreadsheetId, "Finances"),
      "Finances"
    ) as Finance[];

    return { activities, finances };
  } catch (error) {
    console.error("Failed to fetch transparency data:", error);
    return { activities: [], finances: [] };
  }
}

export default async function TransparansiPage() {
  const { activities, finances } = await getTransparencyData();

  return (
    <div className="min-h-screen bg-background">
      <TransparencyDashboard
        initialActivities={activities}
        initialFinances={finances}
      />
    </div>
  );
}
