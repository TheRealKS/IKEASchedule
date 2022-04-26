import { parseSchedule, Schedule } from "./scheduleparser";
import { get, set, update } from 'idb-keyval';


interface SessionID {
    error: boolean,
    id: string
}

export async function obtainSessionID(userid : String, pwd : String) : Promise<SessionID> {
    let result = await fetch("http://localhost/test/logon.php?pwd=" + pwd + "&name=" + userid);
    try {
        let serverreturn = await result.text();
        if (serverreturn.includes("Error 403")) {
            return {error: true, id: ''};
        } else {
            serverreturn = serverreturn.replaceAll("'", "\"");
            let j = JSON.parse(serverreturn);
            return {error: false, id: j.SID};
        }
    } catch(err) {
        throw err;
    }
}

export async function getSchedule(sid : String) : Promise<Schedule> {
    let raw = await(fetch("http://localhost/test/schedule.php?sid=" + sid));
    try {
        let serverreturn = await raw.text();
        return parseSchedule(serverreturn);
    } catch (err) {
        throw err;
    }
}

export async function verifySessionID() {
    let sid = await get("sid");
    if (sid) {
        let setdate : Date= await get("sid_date");
        let now = new Date();
        now.setMinutes(now.getMinutes() - 15);
        if (setdate < now) {
            return false
        } else {
            return true
        }
    }
    return false;
}

export async function renewSessionID() {
    let creds = await checkCredentials();
    if (creds) {
        let sid = await obtainSessionID(creds.uname, creds.pwd);
        await update("sid", v => sid.id);
        await update("sid_date", v => Date.now());
        return true;
    } else {
        return false;
    }
}

export async function checkCredentials() {
    let pwd = await get("pwd");
    let uname = await get("uname");
    if (pwd && uname) {
        return {pwd: pwd, uname: uname};
    } else {
        return undefined;
    }
}