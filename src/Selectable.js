import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

const propTypes = {}

class Selectable extends Component {
  constructor(...args) {
    super(...args)

    this.state = { events : []}
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    console.log("State ", this.state.events);
    console.log("Cryptpad frame", window.cryptpad);
    if (title)
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
