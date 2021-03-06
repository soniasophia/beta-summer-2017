import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import Events from './Events';
import Loader from '../../components/Loader';
import '../../redux/modules/actions/eventActions';
import { colors, typography } from '../../config/styles';
import { auth } from '../../config/firebase';
import { getTime } from '../../config/helpers';
import { idToObjsSpeakers } from '../Lib/helperFunctions';

class EventsContainer extends Component {
  static route = {
    navigationBar: {
      title: 'EVENTS',
    }  
  }

  componentWillMount() {
    this.displayAllEvents('ALL EVENTS')
  }
  displayAllEvents = (title) => {
    this.setState({ events: this.props.eventsData.events, selected: title })
  }
  displayPastEvents = (title) => {
    const now = getTime();
    const pastEvents = this.props.eventsData.events.filter(event => {
      return event.date < now
    })
    this.setState({ events: pastEvents, selected: title })
  }
  displayUpcomingEvents = (title) => {
    const now = getTime();
    const upcomingEvents = this.props.eventsData.events.filter(event => {
      return event.date > now
    })
    this.setState({events: upcomingEvents, selected: title })
  }
  displayAttendedEvents = (title) => {
    const attendedEvents = this.props.eventsData.events.filter(event =>{
      return event.attendees.includes(auth.currentUser.uid)
    })
    this.setState({events: attendedEvents, selected: title })
  }

  eventDate(date) {
    return (
      Moment.unix(date).format('dddd, MMMM Do YYYY')
    )
  }
  
  eventTime(time) {
    return (
      Moment.unix(time).format('h:mm a')    
    )
  }

  withAttendeeData = (events, users) => {
    return events.map(event => {
      return idToObjsSpeakers(event, users);
    });
  }

  render() {
    if(this.props.eventsData.loading) return (<Loader />);
    return (
      <Events
        eventsData={this.withAttendeeData(this.state.events, this.props.userData.users)}
        selected={this.state.selected}
        eventDate={this.eventDate}
        eventTime={this.eventTime}
        navigatorUID={'events'}
        displayAllEvents={this.displayAllEvents}
        displayPastEvents={this.displayPastEvents}
        displayUpcomingEvents={this.displayUpcomingEvents}
        displayAttendedEvents={this.displayAttendedEvents}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  eventsData: state.events,
  userData: state.users
});

export default connect(mapStateToProps)(EventsContainer);
