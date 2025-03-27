function toggleOrganizer() {
    // console.log(document.getElementById('btnUpdateToOrganizer'));
    
    document.getElementById('btnUpdateToOrganizer').remove();
    document.getElementById('frmOrganizerRequest').classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", function () {
    window.descQuill = new Quill('#editor', { theme: 'snow' , placeholder: "Enter your bio here..."});
    getOrganizerView()
});

async function getOrganizerView() {
  try {
      // Fetch data from the API
      const response = await axiosInstance.get('organizer/detail');
      // console.log(response);
      

      // Check if the request was successful
      if (response.data.result) {
        // console.log("true");
        
        if(response.data.data.length > 0 && response.data.data[0].status != 3){
          
          
          window.location.href = "/profile/organizer-view"
        }
          
          
      } else {
          // console.log('Failed to fetch organizer data:', response.data.message);
          // window.location.href = "/profile/organizer"
      }
  } catch (error) {
      console.error('Error fetching organizer data:', error);
  }
}

let isSubmit = false;

const frm = document.getElementById("frmOrganizerRequest");

const formData = {
    organization_name: "",
    bio: "",
    business_email: "",
    business_phone: "",
    location: "",
    facebook: "",
    telegram: "",
    tiktok: "",
    linkin: ""
};

const fields = [
  {
    name: "organization name",
    id: "input-field-organization-name",
    textErrorElement: "#invalid_feedback_organization_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "email",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "phone",
    id: "input-field-phone",
    textErrorElement: "#invalid_feedback_phone div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "location",
    id: "input-field-location",
    textErrorElement: "#invalid_feedback_location div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "facebook",
    id: "input-field-facebook",
    textErrorElement: "#invalid_feedback_facebook div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "bio",
    id: "editor",
    textErrorElement: "#invalid_feedback_bio div",
    isInvalidClass: "is_invalid",
  }
];
const fieldsKh = [
  {
    name: isEnglish ? "organization name" : "ឈ្មោះអង្គការ",
    id: "input-field-organization-name",
    textErrorElement: "#invalid_feedback_organization_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "email": "អ៊ីមែល",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "phone": "លេខទូរស័ព្ទ",
    id: "input-field-phone",
    textErrorElement: "#invalid_feedback_phone div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "location":"ទីតាំង",
    id: "input-field-location",
    textErrorElement: "#invalid_feedback_location div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "facebook",
    id: "input-field-facebook",
    textErrorElement: "#invalid_feedback_facebook div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "bio",
    id: "editor",
    textErrorElement: "#invalid_feedback_bio div",
    isInvalidClass: "is_invalid",
  }
];

frm.addEventListener(
  "submit",
  async (e) => {
    // alert("submitted");
    isSubmit = true;
    e.preventDefault();
    let isValid = false;

    formData.organization_name = document.getElementById("organization-name").value;
    formData.bio = descQuill.root.innerHTML;
    formData.business_phone = document.getElementById("phone").value;
    formData.business_email = document.getElementById("email").value;
    formData.location = document.getElementById("location").value;
    formData.facebook = document.getElementById("facebook").value;
    formData.telegram = document.getElementById("telegram").value;
    formData.linkin = document.getElementById("linkin").value;
    formData.tiktok = document.getElementById("tiktok").value;

    const { error } = vOrganizerRequest.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fieldsKh);
      return;
    }

    handleErrorMessages([], fieldsKh);

    isValid = true;

    if (!isValid) return;

    try {
      // console.log(formData);
      btnShowLoading("btnSubmit");

      await axiosInstance.post("/organizer/promote", formData);

      showToast(true, isEnglish ? "Organizer Request Submitted. Please wait for confirmation from admin." : "សំណើអ្នករៀបចំត្រូវបានបញ្ជូន។ សូមរង់ចាំការបញ្ជាក់ពីអ្នកគ្រប់គ្រង");

      clearInput();

      setTimeout(()=>{
        window.location.href = "/profile/organizer-view"
      }, 1200)
    } catch (error) {
      console.log(error);

      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnSubmit", "Submit");
      document.getElementById("btnSubmit").disabled = true
    }
  }

  //
);

const frmData = {
  newPassword: formData.confirmNewPassword,
  confirmNewPassword: formData.newPassword,
};

function clearInput (){
    document.getElementById("organization-name").value = "";
descQuill.root.innerHTML = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("location").value = "";
    document.getElementById("facebook").value = "";
    document.getElementById("telegram").value = "";
    document.getElementById("linkin").value = "";
    document.getElementById("tiktok").value = "";
}