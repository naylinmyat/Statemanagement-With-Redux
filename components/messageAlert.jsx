import Swal from 'sweetalert2';
const messageAlert = (type,message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        toast: 'my-toast'
      }
    });
    Toast.fire({
      icon: type,
      title: message
    });
};

export default messageAlert