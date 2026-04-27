import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Generate timestamp like: 2026-04-27_21-30-10
function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_` +
         `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

export function generateReport(data, testName = "report") {
  const timestamp = getTimestamp();

  // Unique file per run
  const fileName = `${testName}-${timestamp}.html`;

  // ✅ RELATIVE PATH (works in Jenkins + local)
  const reportDir = "Load_tests/reports";
  const reportPath = `${reportDir}/${fileName}`;

  console.log(`📊 Generating HTML report: ${reportPath}`);

  return {
    // Timestamped report (history)
    [reportPath]: htmlReport(data),

    // Latest report (always overwritten)
    [`${reportDir}/${testName}.html`]: htmlReport(data),

    // Console summary
    stdout: textSummary(data, {
      indent: " ",
      enableColors: true,
    }),
  };
}