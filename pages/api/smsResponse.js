import { supabase } from "../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "POST") {
    // test required
    const twilioResponse = req.body;
    // console.log("twilioData", twilioResponse);
    // console.log("req.body", req.body);
    // console.log("req", req);
    // console.log(twilioResponse);
    // fetch user details
    const receiverData = await supabase
      .from("sms_messages")
      .filter("receiver_phone", "eq", twilioResponse.From)
      .limit(1)
      .single();
    console.log("receiverData",receiverData);
    const messageObj = {
      sender_name: receiverData.receiver_name,
      sender_user_id: null,
      sender_email: receiverData.receiver_email,
      receiver_name: receiverData.sender_name,
      receiver_email: receiverData.sender_email,
      receiver_phone: twilioResponse.From,
      message: twilioResponse.Body,
      direction: "inbound"
    };
    await supabase.from('sms_messages').insert(messageObj)
    res.status(200).json({ message: "success" });
  } else {
    res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
