
const frm = document.getElementById("frm");
const btnSaveChange = document.getElementById("btnSaveChange");

let isSubmit = false;

const formData = {
  eng_name: "",
  kh_name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: ""
};

let defaultData = {}

const fields = [
  {
    name: "eng_name",
    id: "input-field-eng-name",
    textErrorElement: "#invalid_feedback_eng_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "kh_name",
    id: "input-field-kh-name",
    textErrorElement: "#invalid_feedback_kh_name div",
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
    name: "dob",
    id: "input-field-dob",
    textErrorElement: "#invalid_feedback_dob div",
    isInvalidClass: "is_invalid",
  },
];
const fieldsKh = [
  {
    name: isEnglish ? "english username" : "ឈ្មោះអ្នកប្រើអង់គ្លេស",
    id: "input-field-eng-name",
    textErrorElement: "#invalid_feedback_eng_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "khmer username" : "ឈ្មោះអ្នកប្រើខ្មែរ",
    id: "input-field-kh-name",
    textErrorElement: "#invalid_feedback_kh_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "email": "អ៊ីមែល",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "phone" : "លេខទូរស័ព្ទ",
    id: "input-field-phone",
    textErrorElement: "#invalid_feedback_phone div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "dob" : "dob",
    id: "input-field-dob",
    textErrorElement: "#invalid_feedback_dob div",
    isInvalidClass: "is_invalid",
  },
];


const khNameEle = document.getElementById("kh-name");
const engNameEle = document.getElementById("eng-name");
const emailEle = document.getElementById("email");
const phoneEle = document.getElementById("phone");
const dobEle = document.getElementById("dob");
const addressEle = document.getElementById("address");
const maleEle = document.getElementById('male')
const femaleEle = document.getElementById('female')
// const femaleEle = document.querySelectorAll('input[name="gender"]')
const avatarEle = document.getElementById("imagePreview");

const btnChangeProfile = document.getElementById("btnChangeProfile");


function checkForChanges() {
  const gender = maleEle.checked ? 1 : femaleEle.checked ? 2 : "";
  const avatarSrc = avatarEle.src || ""; // Get the image source

  const hasChanged =
    engNameEle.value.trim() !== (defaultData?.eng_name || "").trim() ||
    khNameEle.value.trim() !== (defaultData?.kh_name || "").trim() ||
    emailEle.value.trim() !== (defaultData?.email || "").trim() ||
    phoneEle.value.trim() !== (defaultData?.phone || "").trim() ||
    dobEle.value !== (defaultData?.dob || "") ||
    addressEle.value.trim() !== (defaultData?.address || "").trim() ||
    gender !== (defaultData?.gender || "") ||
    avatarSrc !== (defaultData?.avatar || "");

  btnSaveChange.disabled = !hasChanged;
}

// Attach event listeners to detect changes
[engNameEle, khNameEle, emailEle, phoneEle, dobEle, addressEle, maleEle, femaleEle, avatarEle].forEach(element => {
  element.addEventListener("input", checkForChanges);
});


async function getProfileInfo() {
  try {
    
    defaultData = {};

    
    const { data } = await axiosInstance.get("/auth/me");
    const { data: jsonData } = data;
    // console.log(jsonData);
    
    const { eng_name, kh_name, phone, email, avatar, address, dob, gender } = jsonData;

    khNameEle.value = kh_name;
    engNameEle.value = eng_name;
    emailEle.value = email;
    phoneEle.value = phone;
    addressEle.value = address;
    
    maleEle.checked = gender == 1;
    femaleEle.checked = gender == 2;
    
    
    dobEle.value = dob ? dob.split('T')[0] : "";

    avatarEle.src = avatar ? "/uploads/" + avatar : "/uploads/default.jpg";

   
    defaultData = { eng_name, kh_name, phone, email };

    btnSaveChange.disabled = true;

    if (avatarEle.src.endsWith("default.jpg")) {
      btnChangeProfile.removeAttribute("data-bs-toggle");
      btnChangeProfile.setAttribute("for", "imageUpload");
    } else {
      btnChangeProfile.setAttribute("data-bs-toggle", "dropdown");
    }
    
    // console.log(jsonData);
  } catch (error) {
    // console.log(error);

    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === "string"
    ) {
      return showToast();
    }
  }
}


getProfileInfo();


// Post Profile
frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  isSubmit = true;

  let isValid = false;

  formData.eng_name = engNameEle.value;
  formData.kh_name = khNameEle.value;
  formData.email = emailEle.value;
  formData.phone = phoneEle.value;
  formData.dob = dobEle.value;
  formData.address = addressEle.value;
  formData.gender = maleEle.checked ? "1" : femaleEle.checked ? "2" : "";

  // console.log(formData);
  

  const { error } = vProfileInfo.validate(formData);
  // console.log(error);
  

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    handleErrorMessages(errorMessages, fieldsKh);
    return;
  }

  handleErrorMessages([], fieldsKh);

  isValid = true;
  

  if (!isValid) return;
  // console.log("run here");
  
  try {
    btnShowLoading("btnSaveChange");
    await axiosInstance.put("/profile/info", formData);

    showToast(true, isEnglish ? "Update Profile Info Successfully." : "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានព័ត៌មានដោយជោគជ័យ");
    getProfileInfo()
  } catch (error) {
    // console.log(error);

    if (typeof error.response.data == "string") {
      return showToast();
    }

    const messages = error.response.data.message;

    const errorMessages = Array.isArray(messages) ? messages : [messages];

    handleErrorMessages(errorMessages, fields);
  } finally {
    btnCloseLoading("btnSaveChange", isEnglish ? "Save Changes":"រក្សាទុកការផ្លាស់ប្តូរ");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const imageUpload = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const deleteImage = document.getElementById("deleteImage");
  const cropImageModal = new bootstrap.Modal(
    document.getElementById("cropImageModal")
  );
  const cropperImage = document.getElementById("cropperImage");
  const cropImageBtn = document.getElementById("cropImageBtn");
  let cropper;

  // Delete image functionality
  deleteImage.addEventListener("click", async () => {
    await deleteProfile();
  });

  // Handle image upload
  imageUpload.addEventListener("change", function (event) {
    if (event.target.files && event.target.files[0]) {
      const validateResult = validateFile(event.target.files[0], 3);

      if(!(validateResult.valid)){
        showToast(false, validateResult.message)
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        // Show image in modal for cropping
        cropperImage.src = e.target.result;
        cropImageModal.show();

        // Initialize Cropper.js
        if (cropper) {
          cropper.destroy();
        }

        cropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 2,
          zoomable: false,
          autoCrop: true,
          responsive: true,
          preview: ".preview",
          background: true, // Enables a background outside the crop box
          backgroundColor: "rgba(0, 0, 0)",
          minContainerWidth: 400,
          minContainerHeight: 200,
        });
      //   cropper = new Cropper(cropperImage, {
      //     aspectRatio: 1,
      //     viewMode: 1,
      //     autoCropArea: 0.9,
      //     responsive: true,
      //     dragMode: 'move',
      //     minContainerWidth: 500,
      //     minContainerHeight: 500,
      //     minCropBoxWidth: 250,
      //     minCropBoxHeight: 250,
      //     strict: true,
      //     guides: true,
      //     center: true,
      //     highlight: true,
      //     background: true,
      //     scalable: true,
      //     zoomable: true,
      //     minZoom: 0.1,
      //     maxZoom: 2
      // });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  });

  // Crop image and update preview
  cropImageBtn.addEventListener("click", function () {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL("image/jpeg");

      // Update preview with cropped image
      imagePreview.src = croppedImage;
      deleteImage.style.display = "block";

      

      // Send the cropped image to the server via API
      uploadCroppedImage();
    }
  });

  async function uploadCroppedImage() {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      
      // Convert the cropped canvas to a Blob
      croppedCanvas.toBlob(async (blob) => {
        if (blob) {
          // Create a File object from the Blob
          const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
  
          // Create a FormData object and append the cropped image
          const formData = new FormData();
          formData.append("avatar", file);
  
          try {
            btnShowLoading("cropImageBtn");
            const response = await axiosInstance.post("/profile/avatar", formData);
  
            showToast(true, isEnglish ? "Profile Upload Successfully." : "បង្ហោះរូបភាពដោយជោគជ័យ");

            
            document.getElementById("userImgPf").src = document.getElementById("imagePreview").src
          } catch (error) {
            // console.log(error);
            showToast();
          } finally {
            btnCloseLoading("cropImageBtn", isEnglish ? "Save": "រក្សាទុក");
            cropImageModal.hide();
          }
        }
      }, "image/jpeg");
    }
  }
  async function deleteProfile() {
    try {
      const response = await axiosInstance.delete("/profile/avatar");

      // console.log(response);
      showToast(true, isEnglish ? "Profile Delete Successfully." : "លុបប្រវត្តិរូបដោយជោគជ័យ");

      getProfileInfo();
    } catch (error) {
      // console.log(error);
      showToast();
    }
  }

  // console.log(document.querySelector('.cropper-canvas img'));
});
