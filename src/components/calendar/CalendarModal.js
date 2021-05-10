import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import {
  eventAddNew,
  eventClearActive,
  eventUpdated,
} from '../../actions/events';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlusOne = now.clone().add(1, 'hours');
const initialEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowPlusOne.toDate(),
};

const CalendarModal = () => {
  const { modalOpen } = useSelector((state) => state.ui);
  const { activeEvent } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();
  const [dateStart, setDateStart] = useState(now.toDate());
  const [dateEnd, setDateEnd] = useState(nowPlusOne.toDate());
  const [titleValid, setTitleValid] = useState(true);
  const [formValues, setFormValues] = useState(initialEvent);

  const { title, notes, start, end } = formValues;

  useEffect(() => {
    if (activeEvent) {
      setFormValues(activeEvent);
    } else {
      setFormValues(initialEvent);
    }
  }, [activeEvent]);

  const handleInputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const handleCloseModal = () => {
    setFormValues(initialEvent);
    dispatch(uiCloseModal());
    dispatch(eventClearActive());
  };

  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({ ...formValues, start: e });
  };

  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setFormValues({ ...formValues, end: e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);

    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire(
        'Error',
        'La fecha fin debe ser mayor a la fecha inicio',
        'error'
      );
    }

    if (title.trim().length < 2) {
      return setTitleValid(false);
    }

    if (activeEvent) {
      dispatch(eventUpdated(formValues));
    } else {
      dispatch(
        eventAddNew({
          ...formValues,
          id: new Date().getTime(),
          user: {
            _id: 123,
            name: 'Fernando',
          },
        })
      );
    }

    setFormValues(initialEvent);
    setTitleValid(true);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> {activeEvent ? 'Editar Evento' : 'Nuevo Evento'} </h1>
      <hr />
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={dateStart}
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={dateEnd}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group mb-3">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'}`}
            placeholder="Título del evento"
            name="title"
            value={title}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-3">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};

export default CalendarModal;
