const { google } = require('googleapis')
const { OAuth2 } = google.auth

require('dotenv').config();

const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
})

const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

const event = {
    summary: 'Project Meeting',
    location: 'Conference Hall',
    description: 'Discuss about the new client integration',
    start: {
        dateTime: eventStartTime,
        timeZone: 'Africa/Nairobi'
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'Africa/Nairobi'
    },
    colorId: 1,
}

calendar.freebusy.query({
    resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'Africa/Nairobi',
        items: [{id: 'primary'}]
    }
}, (err, res) => {
    if(err) return console.error('Error: ', err)
    const eventsArr = res.data.calendars.primary.busy
    if(eventsArr.length === 0) return calendar.events.insert({
        calendarId: 'primary', resource: event
    }, err => {
        if(err) return console.error('Error: ', err)
        return console.log('Event created')
    })
    return console.log('Busy day')
})
