var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

import "../node_modules/carbon-web-components/es/components/button/index.js";
import "../node_modules/carbon-web-components/es/components/modal/index.js";
import "../node_modules/carbon-web-components/es/components/input/index.js";
import "../node_modules/carbon-web-components/es/components/inline-loading/index.js";
import "../node_modules/carbon-web-components/es/components/loading/index.js";
import "../node_modules/carbon-web-components/es/components/notification/index.js";
import { default as PullToRefresh } from "../node_modules/pulltorefreshjs/dist/index.esm.js";
import { checkCredentials, obtainSessionID, renewSessionID, verifySessionID } from "./io.js";
import { get, set, clear } from "../node_modules/idb-keyval/dist/compat.js";
import { fetchScheduleAndInit, goBackwardWeek, goForwardWeek } from "./ui.js";

window.onload = function () {
  return __awaiter(this, void 0, void 0, function* () {
    document.getElementById("logon_btn").addEventListener("click", function () {
      return __awaiter(this, void 0, void 0, function* () {
        let spinner = document.getElementById("logon_spinner");
        spinner.style.display = "block";
        let uname = document.getElementById("uname_field").value;
        let pwd = document.getElementById("pwd_field").value;
        let sid = yield obtainSessionID(uname, pwd);
        spinner.style.display = "none";

        if (sid.error) {
          document.getElementById("modal-login-body").innerHTML += "Niet goed";
        } else {
          set("sid", sid.id);
          set("sid_date", Date.now());
          set("uname", uname);
          set("pwd", pwd);
          document.getElementById("logon_status").innerText = "Ingelogd als: " + uname;
          document.getElementById("logoff_bttn").disabled = false;
          yield fetchScheduleAndInit(sid.id);
          document.getElementById("modal-login").open = false;
        }
      });
    });
    document.getElementById("logoff_bttn").addEventListener("click", () => {
      clear();
      window.location.reload();
    });
    const ptr = PullToRefresh.init({
      mainElement: '#schedule_holder',

      onRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
          if (yield renewSessionID()) {
            let newsid = yield get("sid");
            document.getElementById("schedule_holder").innerHTML = "";
            yield fetchScheduleAndInit(newsid);
          } else {
            document.getElementById("modal-login").open = true;
          }
        });
      }

    });
    document.getElementById("back_week").addEventListener("click", () => {
      goBackwardWeek();
    });
    document.getElementById("forward_week").addEventListener("click", () => {
      goForwardWeek();
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceworker.js').then(() => {
        console.log('Service worker registered!');
      }).catch(error => {
        console.warn('Error registering service worker:');
        console.warn(error);
      });
    }

    if (!navigator.onLine) {
      let toast = document.createElement("bx-toast-notification");
      toast.style.minWidth = "30rem";
      toast.style.marginBottom = "0.5rem";
      toast.style.position = "absolute";
      toast.setAttribute("title", "Offline");
      toast.setAttribute("subtitle", "Je bent offline. Het weergegeven rooster is misschien de laatste versie.");
      toast.setAttribute("kind", "error");
      toast.setAttribute("timeout", "undefined");
      document.body.insertBefore(toast, document.body.children[1]);
    }

    let creds = yield checkCredentials();

    if (!creds) {
      document.getElementById("modal-login").open = true;
    } else {
      document.getElementById("logon_status").innerText = "Ingelogd als: " + creds.uname;
      document.getElementById("logoff_bttn").disabled = false;

      if (yield verifySessionID()) {
        let sid = yield get("sid");
        yield fetchScheduleAndInit(sid);
      } else {
        let newsid = yield get("sid");
        yield fetchScheduleAndInit(newsid);
      }
    }
  });
};