
function emitTicketApprovalNotification(io, buyerId, eventId, engName, eventType) {
    let engMessage, khMessage;
  
    if (eventType === 1) { // Online event
      engMessage = `Congratulations! Your registration for the event ${engName} has been approved. Please wait until the event day, as the organizer will send the link to join the event through a notification.`;
      khMessage = `អបអរសាទរ! ការចុះឈ្មោះរបស់អ្នកសម្រាប់ព្រឹត្តិការណ៍ ${engName} នេះត្រូវបានអនុម័តជោគជ័យ។ សូមរង់ចាំរហូតដល់ថ្ងៃព្រឹត្តិការណ៍មកដល់ ព្រោះអ្នករៀបចំនឹងផ្ញើតំណភ្ជាប់ដើម្បីចូលរួមកម្មវិធីតាមរយៈការជូនដំណឹង។`;
    } else if (eventType === 2) { // Offline event
      engMessage = `Congratulations! Your ticket for ${engName} has been successfully approved. Enjoy the event! Check your details here.`;
      khMessage = `អបអរសាទរ! សំបុត្ររបស់អ្នកសម្រាប់កម្មវិធី ${engName} ត្រូវបានអនុម័តដោយជោគជ័យ។ សូមរីករាយជាមួយព្រឹត្តិការណ៍នេះ! ពិនិត្យព័ត៌មានលម្អិតរបស់អ្នកនៅទីនេះ។`;
    } else {
      // Handle other event types or throw an error
      console.error(`Unknown event type: ${eventType}`);
      return; // Or throw an error
    }
  
    io.to(buyerId).emit('notification', {
      event_id: eventId,
      eng_message: engMessage,
      kh_message: khMessage,
      type_id: 1,
    });
  }
  
  module.exports = {
    emitTicketApprovalNotification,
  };