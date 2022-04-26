import 'carbon-web-components/es/components/button/index.js';
import 'carbon-web-components/es/components/modal/index.js';
import 'carbon-web-components/es/components/input/index.js';
import 'carbon-web-components/es/components/inline-loading/index.js';
import 'carbon-web-components/es/components/loading/index.js';
import 'carbon-web-components/es/components/notification/index.js';

import {default as PullToRefresh} from 'pulltorefreshjs/dist/index.esm.js' 

import { checkCredentials, getSchedule, obtainSessionID, renewSessionID, verifySessionID } from './io';
import { get, set, clear } from 'idb-keyval';
import { fetchScheduleAndInit, generateScheduleEntry, goBackwardWeek, goForwardWeek, init_ui } from './ui';

window.onload = async function() {
    document.getElementById("logon_btn").addEventListener("click", async function () {
        let spinner = document.getElementById("logon_spinner");
        spinner.style.display = "block";
        let uname = document.getElementById("uname_field").value;
        let pwd = document.getElementById("pwd_field").value;
        let sid = await obtainSessionID(uname, pwd);
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
            await fetchScheduleAndInit(sid.id);
            document.getElementById("modal-login").open = false;
        }
    });

    document.getElementById("logoff_bttn").addEventListener("click", () => {
        clear();
        window.location.reload();
    });

    const ptr = PullToRefresh.init({
        mainElement: '#schedule_holder',
        async onRefresh() {
            if (await renewSessionID()) {
                let newsid = await get("sid");
                document.getElementById("schedule_holder").innerHTML = "";
                await fetchScheduleAndInit(newsid);
            } else {
                document.getElementById("modal-login").open = true;
            }
        }
    }); 

    document.getElementById("back_week").addEventListener("click", () => {
        goBackwardWeek();
    });

    document.getElementById("forward_week").addEventListener("click", () => {
        goForwardWeek();
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('serviceworker.js').then(() => {
          console.log('Service worker registered!');
        }).catch((error) => {
          console.warn('Error registering service worker:');
          console.warn(error);
        });
    }
    if (!navigator.onLine) {
        let toast = document.createElement("bx-toast-notification")
        toast.style.minWidth = "30rem";
        toast.style.marginBottom = "0.5rem";
        toast.style.position = "absolute";
        toast.setAttribute("title", "Offline");
        toast.setAttribute("subtitle", "Je bent offline. Het weergegeven rooster is misschien de laatste versie.");
        toast.setAttribute("kind", "error");
        toast.setAttribute("timeout", "undefined");
        document.body.insertBefore(toast, document.body.children[1]);
    }

    let creds = await checkCredentials();
    if (!creds) {
        document.getElementById("modal-login").open = true;
    } else {
        document.getElementById("logon_status").innerText = "Ingelogd als: " + creds.uname;
        document.getElementById("logoff_bttn").disabled = false;
        if (await(verifySessionID())) {
            let sid = await get("sid");
            await fetchScheduleAndInit(sid);
        } else {
            let newsid = await get("sid");
            await fetchScheduleAndInit(newsid);
        }
    }
}
