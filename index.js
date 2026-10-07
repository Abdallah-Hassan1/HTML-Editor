let htmlCode = document.getElementById("htmlCode"); // HTML الوصول لكود ال
let cssCode = document.getElementById("cssCode"); // CSS الوصول لكود ال
let javascriptCode = document.getElementById("javascriptCode"); // JS الوصول لكود ال

// live Rendering - تعديل شاشة العرض للكود
function update() {
  let text = `<!doctype html>
  <html style="all: revert;">
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        ${cssCode.value}
      </style>
    </head>
    
    <body style="margin: 0 !important; padding: 0 !important; display: flex !important; flex-direction: column-reverse !important; all: revert;">
      <console-viewer style="margin: 8px !important; padding-bottom: 10px !important; all: revert;">
        <console-head style="margin-bottom: 8px !important; text-align: center !important; font-size: 30px !important; display: block !important; all: revert;">console output</console-head>
        <console-output style="display: block !important; background: #f4f4f4 !important; padding: 10px !important; border: 2px solid #ccc !important; font-falmily: monospace !important; height: 150px !important; overflow: auto !important; all: revert;"></console-output>
      </console-viewer>

      <mainHTML style="border-bottom: 2px solid #ccc !important; display: block !important; height: 100vh !important; overflow: auto !important; all: revert;">${htmlCode.value}</mainHTML>
      
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
          const element = document.querySelector("console-output");
          
          if(element) {
            element?.appendChild(message);
            element.scrollTop = element.scrollHeight;
          }
        }
          
        ${javascriptCode.value}
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

// Console الذهاب إلى شاشة ال
function goToConsole() {
  const element = document.getElementById("viewer");
  element.contentWindow.scrollTo({
    top: element.contentWindow.document.querySelector("body").scrollHeight,
    behavior: "smooth",
  });

  window.scrollTo({
    top: document.querySelector("html").scrollHeight,
    behavior: "smooth",
  });
}

function downloadFile() {
  let content = `<!doctype html>
  <html style="all: revert;">
    <head>
      <title>Real-Time Editor</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        ${cssCode.value}
      </style>
    </head>
    <body style="margin: 0 !important; padding: 0 !important; all: revert">
      ${htmlCode.value}

       <h1 style="position: fixed !important; bottom: 0 !important; background-color: white !important; color: black !important; mix-blend-mode: difference !important; padding: 10px !important; all: revert;">
        Author: 
        <a href="https://abdallah-hassan.vercel.app" target="_blank" style="all: revert !important;">
          Eng.Abdallah Hassan
        </a>
      </h1>
      
      <script>
        ${javascriptCode.value}
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

// لو قام بإعادة تحميل الصفحة ينبه بإن أي تعديل من الممكن أن لن يتم حفظه
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
});

// لو فيه كود مدمج في الرابط يتم وضعه في الصفحة
window.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(document.location.search);
  if (params.get("h")) htmlCode.value = params.get("h");
  if (params.get("c")) cssCode.value = params.get("c");
  if (params.get("j")) javascriptCode.value = params.get("j");

  update();
});

// توليد لينك للكود الحالي للوصول له من أي مكان
function generateParams() {
  const params = new URLSearchParams();
  let fullLink = location.origin + location.pathname;

  if (htmlCode.value != "") params.append("h", htmlCode.value);
  if (cssCode.value != "") params.append("c", cssCode.value);
  if (javascriptCode.value != "") params.append("j", javascriptCode.value);

  fullLink += params.toString() ? "?" + params.toString() : params.toString();

  try {
    navigator.clipboard.writeText(fullLink);
    generateGetLinkMessage(200);
  } catch (err) {
    console.error(err);
    generateGetLinkMessage(500);
  }
}

function generateGetLinkMessage(status) {
  document.querySelector("span.icon").innerHTML =
    status == 200 ? "&#9989;" : "&#10060;";

  document.querySelector("span.text").innerHTML =
    status == 200 ? "Copied" : "Something went wrong";

  document.querySelector(".message").classList.toggle("hide");
  setTimeout(() => {
    document.querySelector(".message").classList.toggle("hide");
  }, 2000);
}
