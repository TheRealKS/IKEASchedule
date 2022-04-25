import { parseSchedule, Schedule } from "./scheduleparser";

interface SessionID {
    error: boolean,
    id: string
}

export async function obtainSessionID(userid : String, pwd : String) : Promise<SessionID> {
    let result = await fetch("http://127.0.0.1:9615?pwd=" + pwd + "&name=" + userid);
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
    let raw = await(fetch("http://127.0.0.1:9615/schedule?sid=" + sid));
    try {
        let serverreturn = await raw.text();
        //TODO: Some error handling here
        return parseSchedule(serverreturn);
    } catch (err) {
        throw err;
    }
}