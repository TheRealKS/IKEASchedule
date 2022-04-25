var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let ScheduleItem = class ScheduleItem extends LitElement {
    constructor(h, act) {
        super();
        this.header = h;
        this.activities = act;
    }
    render() {
        return html `
    <div class="schedule_item">
      <div class="schedule_item_header">&nbsp; ${this.header}</div>
      ${this.activities.length > 0 ? this.activities.map(act => {
            return html `
          <div class="schedule_item_details" style="background-color: ${act.color}">
            <span class="schedule_period ${this.computeColorInversion(act.color)}">&nbsp; ${this.convertTime(act.startTime)} - ${this.convertTime(act.endTime)}</span>
            <i class="schedule_activity ${this.computeColorInversion(act.color)}">${act.name}</i>
          </div>
        `;
        }) : html `<div class="schedule_item_details"><span class="schedule_period">&nbsp; Niet ingepland</div>`}
    `;
    }
    computeColorInversion(hexcolor) {
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 50) ? 'btxt' : 'wtxt';
    }
    convertTime(t) {
        return t.toLocaleTimeString("nl-NL", { hour: '2-digit', minute: '2-digit' });
    }
};
ScheduleItem.styles = css `
    .schedule_item {
      width: 100%;
      margin-bottom: 2em;
    }

    .schedule_item_header {
        width: 100%;
        background-color: #616161;
        font-size: 1.5em;
        padding-top: 1em;
        padding-bottom: 1em;
    }
    .schedule_item_details {
        width: 100%;
        background-color: #90908d;
        padding-top: 1em;
        padding-bottom: 1em;
        z-index: 1;
    }
    .btxt {
      color: black;
    }
    .wtxt {
      color: white;
    }

    .schedule_activity {
        font-size: 0.8rem;
    }
  `;
__decorate([
    property({ type: String })
], ScheduleItem.prototype, "header", void 0);
__decorate([
    property({ type: Array })
], ScheduleItem.prototype, "activities", void 0);
ScheduleItem = __decorate([
    customElement('schedule-item')
], ScheduleItem);
export { ScheduleItem };
