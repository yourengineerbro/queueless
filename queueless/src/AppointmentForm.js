import React, { useState } from 'react';

function AppointmentForm() {
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const availableSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '01:00 PM - 01:30 PM',
    '01:30 PM - 02:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
  ];

  const handleAddAppointment = (e) => {
    e.preventDefault();

    if (patientName && appointmentDate && selectedSlot) {
      const currentDateTime = new Date();
      const selectedDateTime = new Date(`${appointmentDate} ${convertSlotTo24Hour(selectedSlot)}`);

      if (selectedDateTime > currentDateTime) {
        const newAppointment = {
          id: appointments.length + 1,
          patientName,
          appointmentDate,
          appointmentTime: selectedSlot,
        };

        setAppointments([...appointments, newAppointment]);
        setPatientName('');
        setAppointmentDate('');
        setSelectedSlot('');
      } else {
        alert('Please select a future date and time.');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  const convertSlotTo24Hour = (slot) => {
    const [time, modifier] = slot.split(' - ')[0].split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}:00`;
  };

  const getAvailableSlotsForDate = () => {
    const bookedSlots = appointments
      .filter(appointment => appointment.appointmentDate === appointmentDate)
      .map(appointment => appointment.appointmentTime);

    let availSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));
    availSlots = availSlots.filter(slot => {
        const currentDateTime = new Date();
        const selectedDateTime = new Date(`${appointmentDate} ${convertSlotTo24Hour(slot)}`);
        if(selectedDateTime > currentDateTime) {
            return true;
        }
        return false;
    })
    return availSlots;
  };

  return (
    <div>
      <h2>Add Appointment</h2>
      <form onSubmit={handleAddAppointment}>
        <div>
          <label>Patient Name:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Appointment Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]} // Restrict to today or future
          />
        </div>
        <div>
          <label>Available Slots:</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
          >
            <option value="" disabled>Select a slot</option>
            {getAvailableSlotsForDate().map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Appointment</button>
      </form>

      <h3>Appointments</h3>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.patientName} - {appointment.appointmentDate} at {appointment.appointmentTime}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentForm;
