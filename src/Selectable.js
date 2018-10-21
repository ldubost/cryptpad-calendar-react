import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

const propTypes = {}

var frameUpdate = function(events) {
   window.calendar.setState({ events : events });
}
var frameRead = function(events) {
   return window.calendar.state.events;
}

var checkFrameCB = function() {
   if (window.parent.setFrameCB) {
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
    if (window.parent.latestContent)
     events = window.latestContent;
    this.state = { events : events}
  }


  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    console.log("Cryptpad frame", window.parent.cryptpad);
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
      window.parent.cryptpad.localChange();
    }
  }

  render() {
    return (
      <>
        <BigCalendar
          selectable
          events={this.state.events}
          defaultView={BigCalendar.Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2018, 1, 1)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
        />
      </>
    )
  }
}

Selectable.propTypes = propTypes
export default Selectable
