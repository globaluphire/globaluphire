import { supabase } from "../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const twilioData = req.body;
    console.log(twilioData);
    // fetch user details
    await supabase.from('sms_messages').insert(messageObj)
    
    const messageObj = {
        sender_name: user.name,
        sender_user_id: user.id,
        sender_email: user.email,
        receiver_name: receiversName ? receiversName : selectedUserData.name,
        receiver_email: selectedUserData.email,
        receiver_phone: receiversPhoneNumber,
        message: message,
    }
    await supabase.from('sms_messages').insert(messageObj)
    res.status(200).json({ message: "success" });
  } else {
    res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
