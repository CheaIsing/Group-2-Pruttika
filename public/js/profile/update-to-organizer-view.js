document.addEventListener("DOMContentLoaded", function () {
    window.descQuill = new Quill('#editor', { theme: 'snow' , placeholder: "Enter your bio here..."});

});
async function getOrganizerView() {
    try {
        // Fetch data from the API
        const response = await axiosInstance.get('organizer/detail');

        // Check if the request was successful
        if (response.data.result) {
            const organizerData = response.data.data[0]; // Assuming the data is an array and we take the first item

            // Map status to a badge text and class
            const statusMap = {
                1: { text: 'Pending', class: 'bg-warning' },
                2: { text: 'Approved', class: 'bg-success' },
                3: { text: 'Rejected', class: 'bg-danger' },
            };
            const statusInfo = statusMap[organizerData.status] || { text: 'Unknown', class: 'bg-secondary' }; // Default to 'Unknown' if status is not in the map

            // Set the badge text and class
            const statusBadge = document.getElementById('status-badge');
            statusBadge.textContent = statusInfo.text;
            statusBadge.classList.add('badge', statusInfo.class);
                            // Show rejection reason if status is Rejected
                            const rejectionReasonWrapper = document.getElementById('rejection-reason-wrapper');
                            const rejectionReason = document.getElementById('rejection-reason');
                            if (organizerData.status === 3 && organizerData.rejection_reason) {
                                rejectionReasonWrapper.style.display = 'block'; // Show the rejection reason wrapper
                                rejectionReason.textContent = organizerData.rejection_reason; // Set the rejection reason text
                            } else {
                                rejectionReasonWrapper.style.display = 'none'; // Hide the rejection reason wrapper
                            }

            if(organizerData.status != 3){
                document.getElementById("btnRequestAgain").classList.add("d-none")
            }else{
                document.getElementById("btnRequestAgain").classList.remove("d-none")
            }

            document.getElementById("editor").style.pointerEvents = "none";
            

            // Populate the form fields with the fetched data
            document.getElementById('organization-name').value = organizerData.organization_name;
            descQuill.root.innerHTML = organizerData.bio; // Assuming you're using a text editor for bio
            document.getElementById('phone').value = organizerData.business_phone;
            document.getElementById('email').value = organizerData.business_email;
            document.getElementById('location').value = organizerData.location;
            document.getElementById('facebook').value = organizerData.facebook;
            document.getElementById('telegram').value = organizerData.telegram;
            document.getElementById('tiktok').value = organizerData.tiktok;
            document.getElementById('linkin').value = organizerData.linkin;

            // Disable all input fields
            const inputFields = document.querySelectorAll('#frmOrganizerRequest input, #frmOrganizerRequest textarea');
            inputFields.forEach(function (input) {
                input.disabled = true;
            });
        } else {
            // console.error('Failed to fetch organizer data:', response.data.message);
            // window.location.href = "/profile/organizer"
            document.getElementById("frmOrganizerRequest").classList.add("d-none")
            document.getElementById("btnUpdateToOrganizer").classList.remove("d-none")
        }
    } catch (error) {
        // console.error('Error fetching organizer data:', error);
    }
}

getOrganizerView()