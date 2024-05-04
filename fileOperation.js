const fs = require("fs");

// Read file
fs.readFile("text.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Modify content (For example, just converting text to uppercase)
  const modifiedContent = data.toUpperCase();

  //Writing to a file
  fs.writeFile("output.txt", modifiedContent, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("File has been written successfully.");
  });

  //Appending to text.txt file
  const contentToAppend = "This text will be appended to the file.\n";
  fs.appendFile("text.txt", contentToAppend, (err) => {
    if (err) {
      console.error("Error appending to file:", err);
      return;
    }
    console.log("Content appended to file successfully.");
  });
});
