//Function for live Rendering
function update() {
  let htmlCode = document.getElementById("htmlCode").value; // HTML الوصول لكود ال
  let cssCode = document.getElementById("cssCode").value; // CSS الوصول لكود ال
  let javascriptCode = document.getElementById("javascriptCode").value; // JS الوصول لكود ال
  let text = `<!doctype html>
  <html>
    <head>
      <style>
        ${cssCode}
      </style>
    </head>
    <body style="display: flex; flex-direction: column-reverse;">
      <console-viewer style="border-top: 2px solid #ccc;">
        <console-head style="text-align: center; font-size: 30px; display: block;">console output</console-head>
        <console-output style="display: block; background: #f4f4f4; padding: 10px; border: 1px solid #ccc; font-falmily: monospace; height: 100px; overflow: auto;"></console-output>
      </console-viewer>
      <mainHTML style="display: block; height: 100vh; overflow: auto;">${htmlCode}</mainHTML>
      
      <script>
        const originalConsoleLog = console.log;
        console.log = function(...args){
          originalConsoleLog.apply(console, args);

          const message = document.createElement("console-message");
          message.setAttribute("style", "display: block;")

          const ouputMessage = args
          .map((arg) => {
            if (typeof arg === "object" && arg != null) return JSON.stringify(arg);
            return String(arg);
          })
          .join(" ");

          message.textContent = ouputMessage;
          document.querySelector("console-output").appendChild(message);
        }
        ${javascriptCode}
      </script>
    </body>
  </html>`;

  let iframe = document.getElementById("viewer");
  iframe.remove();
  iframe = document.createElement("iframe");
  iframe.setAttribute("id", "viewer");
  document.querySelector(".iframe-container").appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(text); // عرض ناتج الكود
  iframe.contentWindow.document.close();
}

function downloadFile() {
  let content = `<!doctype html>
  <html>
    <head>
      <title>Real-Time Editor</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        ${document.getElementById("cssCode").value}
      </style>
    </head>
    <body>
      ${document.getElementById("htmlCode").value}
      <h1>
        Author: 
        <a href="https://abdallah-hassan.vercel.app" target="_blank">
          Eng.Abdallah Hassan
        </a>
      </h1>
      <script>
        ${document.getElementById("javascriptCode").value}
      </script>
    </body>
  </html>`;

  // HTML يحتوي على كود ال  Bolb إنشاء
  const blob = new Blob([content], { type: "text/html" });

  // Blob موقت لهذا ال  URL إنشاء رابط
  const url = URL.createObjectURL(blob);

  // مخفي لتنفيذ التحميل <a> إنشاء عنصر
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html"; // اسم الملف عند التحميل

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // تنظيف الذاكرة بحذف الرابط المؤقت
  URL.revokeObjectURL(url);
}

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
});

window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(document.location.search);
  console.log(params.get("h"));
  if (params.get("h"))
    document.getElementById("htmlCode").value = params.get("h");
  if (params.get("c"))
    document.getElementById("cssCode").value = params.get("c");
  if (params.get("j"))
    document.getElementById("javascriptCode").value = params.get("f");
  update();
});
