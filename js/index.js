const plus_icon = document.querySelector("#plus-icon");
const file_chooser = document.querySelector('input[type="file"]');
const content = document.querySelector("#content");
const search_icon = document.querySelector("#search-icon");
const header = document.querySelector("#header");
const arrow_up_icon = document.querySelector("#arrow-up-icon");
const arrow_down_icon = document.querySelector("#arrow-down-icon");
const header_text = document.querySelector("#header-text");
let content_text = "";
let toggle = true;
let input_box = "";
let i = 0;
let file_name = "";
let matches = "";

plus_icon.onclick = () => {
  file_chooser.click();
};

file_chooser.onchange = () => {
  const file = file_chooser.files[0];

  if (file) {
    file_name = file.name;
    const fname_area_width = document.querySelector("#header").offsetWidth - 64;

    for (let i = 0; i <= file_name.length; i++) {
      header_text.innerHTML = file_name.slice(0, i);
      console.log(fname_area_width, header_text.offsetWidth);
      if (header_text.offsetWidth > fname_area_width) {
        header_text.innerHTML = file_name.slice(0, i - 4) + "...";

        break;
      }
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      content.removeAttribute("style");
      content.style.position = "static";
      content.style.fontSize = "medium";
      content.style.overflowX = "auto";
      content.style.padding = "20px";
      content.style.marginTop = "60px";
      content_text = reader.result;
      content.innerHTML = `<pre>${content_text.replace(/</g, "&lt;")}</pre>`;
    };
  }
};

search_icon.onclick = () => {
  if (toggle) {
    search_icon.innerHTML = "close";
    search_icon.style.color = "green";
    arrow_up_icon.style.display = "inline";
    arrow_down_icon.style.display = "inline";
    // arrow_up_icon.style.marginRight = "20px";
    // arrow_down_icon.style.marginRight = "20px";

    const input = document.createElement("input");
    input.style.width = "100%";
    input.style.fontSize = "20px";
    input.style.padding = "20px";
    input.style.paddingRight = "160px";
    input.style.boxShadow = "2px 2px 10px grey";
    input.style.border = "none";
    input.style.borderBottom = "none";
    input.style.outline = "none";
    input.style.position = "fixed";
    input.style.top = 0;
    input.setAttribute("placeholder", "search...");
    input_box = input;
    document.body.replaceChild(input, header);

    // function to scroll to matched text
    function scrolldiv() {
      window.scroll(0, findPosition(matches[i]));
    }
    function findPosition(obj) {
      var currenttop = 0;
      if (obj.offsetParent) {
        do {
          currenttop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return [currenttop - 100];
      }
    }

    input.onfocus = () => {
      input.style.borderBottom = "solid green";
      input.onkeypress = (e) => {
        if (e.keyCode === 13) {
          const regex = new RegExp(`(${input.value})`, "gi");

          content.innerHTML = `<pre>${content_text.replace(
            regex,
            "<span class='highlighted-text' style='background: yellow'>$1</span>"
          )}</pre>`;
          matches = document.querySelectorAll(".highlighted-text");
          matches[i].style.background = "orange";
          scrolldiv();
        }
      };
      input.onblur = () => {
        input.style.borderBottom = "none";
      };
    };

    arrow_down_icon.onclick = () => {
      if (matches.length === i + 1) {
        i = 0;
      } else {
        i += 1;
      }
      matches[i].style.background = "orange";
      if (matches[i - 1]) {
        matches[i - 1].style.background = "yellow";
      } else {
        matches[matches.length - 1].style.background = "yellow";
      }
      scrolldiv();
    };

    arrow_up_icon.onclick = () => {
      if (i === 0) {
        i = matches.length - 1;
      } else {
        i -= 1;
      }
      matches[i].style.background = "orange";
      if (matches[i + 1]) {
        matches[i + 1].style.background = "yellow";
      } else {
        matches[0].style.background = "yellow";
      }
      scrolldiv();
    };

    input.focus();
  } else {
    document.body.replaceChild(header, input_box);
    search_icon.innerHTML = "search";
    search_icon.style.color = "white";
    arrow_up_icon.style.display = "none";
    arrow_down_icon.style.display = "none";
  }
  toggle = !toggle;
};

// Registering serviceworker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("SW Registegreen!");
      console.log(registration);
    })
    .catch((error) => {
      console.log("SW Registration Failed!");
      console.log(error);
    });
}
