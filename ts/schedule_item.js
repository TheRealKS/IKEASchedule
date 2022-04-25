var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
var ScheduleItem = /** @class */ (function (_super) {
    __extends(ScheduleItem, _super);
    function ScheduleItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScheduleItem.prototype.render = function () {
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <div class=\"schedule_item\">\n      <div class=\"schedule_item_header\">&nbsp; Dinsdag 25-04</div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n    </div>\n    "], ["\n    <div class=\"schedule_item\">\n      <div class=\"schedule_item_header\">&nbsp; Dinsdag 25-04</div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n      <div class=\"schedule_item_details\">\n        <span class=\"schedule_period\">&nbsp; 18:00 - 19:00</span>\n        <i class=\"schedule_activity\">Herverpakken</i>\n      </div>\n    </div>\n    "])));
    };
    __decorate([
        property()
    ], ScheduleItem.prototype, "render");
    ScheduleItem = __decorate([
        customElement('schedule_item')
    ], ScheduleItem);
    return ScheduleItem;
}(LitElement));
var templateObject_1;
