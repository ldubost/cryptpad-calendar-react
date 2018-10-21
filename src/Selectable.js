import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const propTypes = {}

var frameUpdate = function(events) {
   window.calendar.setState({ events : events });
}
var frameRead = function(events) {
   return window.calendar.state.events;
}

var checkFrameCB = function() {
   if (window.parent && window.parent.setFrameCB) {
     window.parent.setFrameCB(frameRead, frameUpdate);
     if (window.parent.latestContent) {
       frameUpdate(window.parent.latestContent);
       window.parent.latestContent = null;
     }
   } else {
     window.setTimeout(checkFrameCB, 1000);
   }
}

class Selectable extends Component {
  constructor(...args) {
    super(...args)

    checkFrameCB();

    var events = []
    this.state = { events : events}

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
  }

  localChange() {
      if (window.parent && window.parent.cryptpad)
        window.parent.cryptpad.localChange();
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    this.localChange();
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    this.localChange();
  }

  newEvent(event) {

  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    if (window.parent && window.parent.setFrameCB)
      window.parent.setFrameCB(frameRead, frameUpdate);
    if (title) {
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
      this.localChange();
    }
  }

  render() {
    return (
        <DragAndDropCalendar
          selectable
          events={this.state.events}
          onEventDrop={this.moveEvent}
          resizable
          onEventResize={this.resizeEvent}
          defaultView={BigCalendar.Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2018, 1, 1)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
        />
    )
  }
}

Selectable.propTypes = propTypes
export default Selectable
