import { Activity, Schedule } from "./scheduleparser";
import { ScheduleItem } from "./schedule_item";

var schedule : Schedule;
var currentStartDay : Date;

export function init_ui(s : Schedule) {
    schedule = s;
    //Get current week date range
    var curr = new Date; // get current date
    curr.setHours(0, 0, 0, 0);
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 

    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    document.getElementById("date_range").innerHTML = firstday.getDate() + "-" + (firstday.getMonth() + 1) + " / " + lastday.getDate() + "-" + (lastday.getMonth() + 1);
    currentStartDay = firstday;
    displayScheduleForRange(firstday);
} 

export function goForwardWeek() {
    let newday = new Date(currentStartDay);
    newday.setDate(newday.getDate() + 14);
    if (newday > schedule.endsAt) {
        document.getElementById("forward_week").disabled = true;
    }
    let backward = document.getElementById("back_week");
    if (backward.disabled) {
        backward.disabled = false;
    }
    currentStartDay.setDate(currentStartDay.getDate() + 7)

    displayScheduleForRange(currentStartDay, true);
}

export function goBackwardWeek() {
    let newday = new Date(currentStartDay);
    newday.setDate(newday.getDate() - 14);
    if (newday < schedule.startsAt) {
        document.getElementById("back_week").disabled = true;
    }
    let forward = document.getElementById("forward_week");
    if (forward.disabled) {
        forward.disabled = false;
    }
    currentStartDay.setDate(currentStartDay.getDate() - 7)

    displayScheduleForRange(currentStartDay, true);
}

function displayScheduleForRange(start: Date, header = false) {
    let copy = new Date(start);
    let scheduleholder = document.getElementById("schedule_holder");
    scheduleholder.innerHTML = "";
    for (var i = 0; i < 7; i++) {
        let newday = start.getDate() + i;
        let newdate = new Date(start.setDate(newday));
        let newindex = newdate.getTime();
        if (schedule.entries.has(newindex)) {
            scheduleholder.appendChild(generateScheduleEntry(newdate, schedule.entries.get(newindex)));
        } else {
            scheduleholder.append(generateScheduleEntry(newdate));
        }
        start = new Date(copy)
    }

    if (header) {
        var first = start.getDate() - start.getDay() + 1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 
    
        var firstday = new Date(start.setDate(first));
        var lastday = new Date(start.setDate(last));
        document.getElementById("date_range").innerHTML = firstday.getDate() + "-" + (firstday.getMonth() + 1) + " / " + lastday.getDate() + "-" + (lastday.getMonth() + 1);
    }
}

export function generateScheduleEntry(date : Date, entries : Array<Activity> = []) {
    let timestr = date.toLocaleString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    timestr = timestr.charAt(0).toUpperCase() + timestr.slice(1);
    var item = new ScheduleItem(timestr, entries);
    item.className = "schedule_item_wrapper";
    return item
}