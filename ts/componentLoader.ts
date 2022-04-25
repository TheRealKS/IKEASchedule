import 'carbon-web-components/es/components/button/index.js';
import 'carbon-web-components/es/components/modal/index.js';
import 'carbon-web-components/es/components/input/index.js';
import 'carbon-web-components/es/components/inline-loading/index.js';
import 'carbon-web-components/es/components/loading/index.js';
import {default as PullToRefresh} from 'pulltorefreshjs/dist/index.esm.js' 

import { obtainSessionID } from './io';
import { get, set } from 'idb-keyval';
import { parseSchedule } from './scheduleparser';
import { generateScheduleEntry, goBackwardWeek, goForwardWeek, init_ui } from './ui';

window.onload = function() {
    document.getElementById("logon_btn").addEventListener("click", async function () {
        let spinner = document.getElementById("logon_spinner");
        spinner.style.display = "block";
        let pwd = document.getElementById("uname_field").value;
        let uname = document.getElementById("pwd_field").value;
        let sid = await obtainSessionID("05719033", "210501ko!!");
        spinner.style.display = "none";
        if (sid.error) {
            document.getElementById("modal-login-body").innerHTML += "Niet goed";
        } else {
            set("sid", sid.id);
            set("sid_data", Date.now());
            set("uname", uname);
            set("pwd", pwd);
            document.getElementById("modal-login").open = false;
        }
    });

    fetch("schedule.html").then(res => res.text()).then(res => {
        let schedule = parseSchedule(res);

        setTimeout(function() {init_ui(schedule);}, 5000);
    });

    const ptr = PullToRefresh.init({
        mainElement: '#schedule_holder',
        async onRefresh() {
            let res = await fetch("schedule.html");
            let a = await res.text();
            document.getElementById("schedule_holder").innerHTML = "";
            let schedule = parseSchedule(a);
            init_ui(schedule);
        }
    }); 

    document.getElementById("back_week").addEventListener("click", () => {
        goBackwardWeek();
    });

    document.getElementById("forward_week").addEventListener("click", () => {
        goForwardWeek();
    });
}
