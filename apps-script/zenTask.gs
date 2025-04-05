// Replace `GOOGLE_SCRIPT_URL` in the .env with your own deployed Google Apps Script Web App
// This file is for reference and not connected to any deployment

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Tasks");

  // ✅ Logs sheet (create if missing)
  let logSheet = ss.getSheetByName("Logs");
  if (!logSheet) {
    logSheet = ss.insertSheet("Logs");
    logSheet.appendRow([
      "Timestamp",
      "Raw JSON",
      "ID",
      "Done",
      "Update",
      "Update Type"
    ]);
  }

  const data = JSON.parse(e.postData.contents);

  // ✅ Always log the request
  logSheet.appendRow([
    new Date(),
    JSON.stringify(data),
    data.id,
    data.done,
    data.update,
    typeof data.update
  ]);

  const deleteFlag = data.delete === true || data.delete === "true";
  const updateFlag =
    data.update === true ||
    data.update === "true" ||
    String(data.update) === "true";

  // 🗑️ DELETE
  if (deleteFlag) {
    const range = sheet.getDataRange();
    const values = range.getValues();

    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(data.id)) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(
          JSON.stringify({ result: "Deleted row " + (i + 1) })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "ID not found for delete" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 🔁 UPDATE DONE STATUS
  if (updateFlag) {
    const range = sheet.getDataRange();
    const values = range.getValues();

    for (let i = 1; i < values.length; i++) {
      Logger.log(`🔍 Row ${i + 1}: Sheet ID = ${values[i][0]}, Incoming ID = ${data.id}`);
      if (String(values[i][0]) === String(data.id)) {
        Logger.log(`✅ Match found. Updating row ${i + 1} with done = ${data.done}`);
        sheet.getRange(i + 1, 3).setValue(data.done);
        return ContentService.createTextOutput(
          JSON.stringify({ result: "Updated task" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    Logger.log("❌ No match found for update.");
    return ContentService.createTextOutput(
      JSON.stringify({ result: "Task not found for update" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // ➕ ADD TASK
  if (!data.id || !data.text) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "Invalid data for add" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([data.id, data.text, data.done]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: "Task added" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tasks");
  const data = sheet.getDataRange().getValues();

  const tasks = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      tasks.push({
        id: row[0],
        text: row[1],
        done: row[2] === true || row[2] === "TRUE",
      });
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify(tasks)
  ).setMimeType(ContentService.MimeType.JSON);
}