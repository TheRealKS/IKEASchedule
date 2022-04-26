export interface Schedule {
    startsAt : Date,
    endsAt: Date,
    entries : Map<Number, Array<Activity>>
}

export interface Activity {
    startTime : Date,
    endTime : Date,
    name : string,
    color? : string
}

export function parseSchedule(rawhtml : string) : Schedule {
    var parser = new DOMParser();
    var doc = parser.parseFromString(rawhtml, 'text/html');

    //Check if it's a valid doc
    if (doc.head.title != "") {
        throw "Invalid schedule";
    }

    //Get elements most likely to be schedule entries and filter them to actual schedule entries
    let candidates = doc.getElementsByClassName("bar");
    let scheduleentries : Array<Element> = [];
    for (var i = 0; i < candidates.length; i++) {
        let candidate = candidates[i];
        if (candidate.hasAttribute("info") && candidate.getAttribute("info") != "") {
            scheduleentries.push(candidate);
        }
    }

    //The retrieved schedule entries are actually activities, so we parse the schedule bottom-up
    let allactivities = new Map<Number, Array<Activity>>();
    let earliestdate = new Date("01-01-2099");
    let latestdate = new Date("01-01-1970");
    for (var entry of scheduleentries) {
        let parsedact = parseInfoString(entry.getAttribute("info"));
        parsedact.color = rgba2hex((<HTMLElement>entry).style.backgroundColor);
        let indexdate = new Date(parsedact.startTime);
        indexdate.setHours(0, 0, 0, 0);
        let indextime = indexdate.getTime();
        if (allactivities.has(indextime)) {
            let oldarr = allactivities.get(indextime);
            oldarr.push(parsedact);
            allactivities.set(indextime, oldarr);
        } else {
            allactivities.set(indextime, [parsedact]);
        }
        if (indexdate <= earliestdate) {
            earliestdate = indexdate;
        }
        if (indexdate >= latestdate) {
            latestdate = indexdate;
        }
    }
    
    //Now that we have the activities per date, we can complete the parsed schedule
    if (earliestdate.getDay() != 1)
        earliestdate.setDate(earliestdate.getDate() - earliestdate.getDay() + 1);
    if (latestdate.getDay() != 0)
        latestdate.setDate(latestdate.getDate() + (6 - latestdate.getDay()));
    return {
        startsAt: earliestdate,
        endsAt : latestdate,
        entries : allactivities
    };
}

function parseInfoString(i : string) : Activity {
    let parts = i.split(';');
    //First part is the date, we use this in the startTime only
    let date = parts[0];
    let dateparts = (date.split('-'));
    let datepartsint = dateparts.map(r => parseInt(r));
    let startdate = new Date();
    startdate.setFullYear(datepartsint[2], datepartsint[1] - 1, datepartsint[0]);
    //Second part is the start time
    let starttime = parts[1].substring(1);
    let starttimep = starttime.split(":");
    let starttimeparts = starttimep.map(r => parseInt(r));
    startdate.setHours(starttimeparts[0], starttimeparts[1], 0);

    //Do the same for end time
    let enddate = new Date();
    let endtime = parts[2].substring(1);
    let endtimep = endtime.split(":");
    let endtimeparts = endtimep.map(r => parseInt(r));
    enddate.setHours(endtimeparts[0], endtimeparts[1], 0);

    //Last part is the activity name
    let activityname = parts[3].substring(1);

    return {
        startTime: startdate,
        endTime: enddate,
        name: activityname
    };
}

const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
 