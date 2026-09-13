import React from 'react';
import { toast } from 'react-toastify';

export const notify = {
  success: (title, message = '', options = {}) => {
    return toast(
      <div className="modern-toast-wrapper">
        <div className="modern-toast-icon success">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <div className="modern-toast-body">
          <div className="modern-toast-title">{title}</div>
          {message && <div className="modern-toast-message">{message}</div>}
        </div>
      </div>,
      {
        className: 'modern-toast modern-toast-success',
        icon: false,
        ...options,
      }
    );
  },

  error: (title, message = '', options = {}) => {
    return toast(
      <div className="modern-toast-wrapper">
        <div className="modern-toast-icon error">
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
        <div className="modern-toast-body">
          <div className="modern-toast-title">{title}</div>
          {message && <div className="modern-toast-message">{message}</div>}
        </div>
      </div>,
      {
        className: 'modern-toast modern-toast-error',
        icon: false,
        ...options,
      }
    );
  },

  info: (title, message = '', options = {}) => {
    return toast(
      <div className="modern-toast-wrapper">
        <div className="modern-toast-icon info">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div className="modern-toast-body">
          <div className="modern-toast-title">{title}</div>
          {message && <div className="modern-toast-message">{message}</div>}
        </div>
      </div>,
      {
        className: 'modern-toast modern-toast-info',
        icon: false,
        ...options,
      }
    );
  },

  warning: (title, message = '', options = {}) => {
    return toast(
      <div className="modern-toast-wrapper">
        <div className="modern-toast-icon warning">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className="modern-toast-body">
          <div className="modern-toast-title">{title}</div>
          {message && <div className="modern-toast-message">{message}</div>}
        </div>
      </div>,
      {
        className: 'modern-toast modern-toast-warning',
        icon: false,
        ...options,
      }
    );
  },
};

export default notify;
