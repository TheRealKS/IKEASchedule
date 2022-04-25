import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('schedule_item')
class ScheduleItem extends LitElement {
  @property()

  render() {
    return html`
    <div class="schedule_item">
      <div class="schedule_item_header">&nbsp; Dinsdag 25-04</div>
      <div class="schedule_item_details">
        <span class="schedule_period">&nbsp; 18:00 - 19:00</span>
        <i class="schedule_activity">Herverpakken</i>
      </div>
      <div class="schedule_item_details">
        <span class="schedule_period">&nbsp; 18:00 - 19:00</span>
        <i class="schedule_activity">Herverpakken</i>
      </div>
      <div class="schedule_item_details">
        <span class="schedule_period">&nbsp; 18:00 - 19:00</span>
        <i class="schedule_activity">Herverpakken</i>
      </div>
    </div>
    `;
  }
}