function emitTicketApprovalNotification(
  io,
  buyerId,
  eventId,
  engName,
  eventType
) {
  let engMessage, khMessage;

  if (eventType == 1) {
    // Online event
    engMessage = `Congratulations! Your registration for the event ${engName} has been approved. Please wait until the event day, as the organizer will send the link to join the event through a notification.`;
    khMessage = `អបអរសាទរ! ការចុះឈ្មោះរបស់អ្នកសម្រាប់ព្រឹត្តិការណ៍ ${engName} នេះត្រូវបានអនុម័តជោគជ័យ។ សូមរង់ចាំរហូតដល់ថ្ងៃព្រឹត្តិការណ៍មកដល់ ព្រោះអ្នករៀបចំនឹងផ្ញើតំណភ្ជាប់ដើម្បីចូលរួមកម្មវិធីតាមរយៈការជូនដំណឹង។`;
  } else if (eventType == 2) {
    // Offline event
    engMessage = `Congratulations! Your ticket for ${engName} has been successfully approved. Enjoy the event! Check your details here.`;
    khMessage = `អបអរសាទរ! សំបុត្ររបស់អ្នកសម្រាប់កម្មវិធី ${engName} ត្រូវបានអនុម័តដោយជោគជ័យ។ សូមរីករាយជាមួយព្រឹត្តិការណ៍នេះ! ពិនិត្យព័ត៌មានលម្អិតរបស់អ្នកនៅទីនេះ។`;
  } else {
    // Handle other event types or throw an error
    // console.error(`Unknown event type: ${eventType}`);
    return; // Or throw an error
  }

  console.log("approve ticket run here");

  io.to(buyerId).emit("notification", {
    event_id: eventId,
    eng_message: engMessage,
    kh_message: khMessage,
    type_id: 1,
  });
}

function emitTicketRejectNotification(
  io,
  buyerId,
  eventId,
  engName,
  rejectedReason
) {
  io.to(buyerId).emit("notification", {
    event_id: eventId,
    eng_message: `Unfortunately, your request for a ticket to event ${engName} has been denied. Reason: ${rejectedReason}. We appreciate your understanding.`,
    kh_message: `គួរឲ្យសោកស្ដាយណាស់ សំណើរបស់អ្នកសម្រាប់សំបុត្រចូលរួមកម្មវិធី ${engName} ត្រូវបានបដិសេធ។ ហេតុផល៖ ${rejectedReason} ។ យើងសូមកោតសរសើរចំពោះការយោគយល់របស់អ្នក។`,
    type_id: 2, // Assuming 2 is the type_id for rejection notifications
  });
}

function emitOrganizerApprovalNotification(io, receiverId, requestId) {
  io.to(receiverId).emit("notification", {
    eng_message: `Congratulations! Your request to become an organizer has been approved. We are excited to have you on board! You can now create and manage events.`,
    kh_message: `អបអរសាទរ! ការដាក់ស្នើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំព្រឹត្តិការណ៍ត្រូវបានយល់ព្រម។ យើងរីករាយដែលមានអ្នកនៅជាមួយ! ពេលនេះអ្នកអាចបង្កើត និងគ្រប់គ្រងព្រឹត្តិការណ៍ផ្ទាល់ខ្លួនបាន​ហើយ។`,
    organizer_req_id: requestId,
    type_id: 3, // Assuming 3 is the type_id for organizer approval notifications
  });
}

function emitOrganizerRejectionNotification(
  io,
  receiverId,
  requestId,
  rejectionReason
) {
  io.to(receiverId).emit("notification", {
    eng_message: `We regret to inform you that your request to become an organizer has been rejected.Reason: ${rejectionReason}. We appreciate your interest and hope you consider applying again.`,
    kh_message: `យើងសោកស្ដាយក្នុងការជូនដំណឹងដល់អ្នកថាសំណើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំត្រូវបានបដិសេធ។ ហេតុផល៖ ${rejectionReason}។ យើងសូមកោតសរសើរចំពោះចំណាប់អារម្មណ៍របស់អ្នក ហើយសង្ឃឹមថាអ្នកពិចារណាដាក់ពាក្យម្តងទៀត។`,
    organizer_req_id: requestId,
    type_id: 4, // Assuming 4 is the type_id for organizer rejection notifications
  });
}

function emitNotificationForReminder(
  io,
  buyerId,
  eventId,
  engMessage,
  khMessage
) {
  io.to(buyerId).emit("notification", {
    event_id: eventId,
    eng_message: engMessage,
    kh_message: khMessage,
    type_id: 6,
  });
}
function emitNotificationForOnlineLink(
  io,
  buyerId,
  eventId,
  engMessage,
  khMessage
) {
  io.to(buyerId).emit("notification", {
    event_id: eventId,
    eng_message: engMessage,
    kh_message: khMessage,
    type_id: 8,
  });
}

function emitNotificationForInputOnlineLink(
  io,
  creatorId,
  eventId,
  engMessage,
  khMessage
) {
  io.to(creatorId).emit("notification", {
    event_id: eventId,
    eng_message: engMessage,
    kh_message: khMessage,
    type_id: 7,
  });
}

function emitNotificationForEventUpdate(
  io,
  buyerId,
  eventId,
  engMessage,
  khMessage
) {
  // If you don't have socketId, emit to room based on buyerId
  io.to(buyerId).emit("notification", {
    event_id: eventId,
    eng_message: engMessage,
    kh_message: khMessage,
    type_id: 5,
  });
}

module.exports = {
  emitTicketApprovalNotification,
  emitTicketRejectNotification,
  emitOrganizerApprovalNotification,
  emitOrganizerRejectionNotification,
  emitNotificationForReminder,
  emitNotificationForEventUpdate,
  emitNotificationForOnlineLink,
  emitNotificationForInputOnlineLink,
};
