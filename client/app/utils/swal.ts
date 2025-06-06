import Swal from 'sweetalert2';

export const showSuccess = (title: string, message: string) =>
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#961C1E',
    background: 'white',
    backdrop: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal-custom-popup',
    },
  });

export const showError = (title: string, message: string) =>
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#961C1E',
    background: 'white',
    backdrop: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal-custom-popup',
    },
  });

export const showWarning = (title: string, message: string) =>
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#961C1E',
    background: 'white',
    backdrop: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal-custom-popup',
    },
  });

export const showConfirmation = async (message: string) =>
  Swal.fire({
    title: 'Confirmation',
    html: message,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    confirmButtonColor: '#961C1E',
    cancelButtonColor: '#ECECEC',
    background: 'white',
    backdrop: false,
    customClass: {
      popup: 'swal-custom-popup',
    },
  });