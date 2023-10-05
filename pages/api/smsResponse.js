import { supabase } from "../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const twilioResponse = req.body;
      // fetch user details
      const receiverData = await supabase
        .from("sms_messages")
        .select("*")
        .eq("receiver_phone", twilioResponse.From)
        .limit(1)
        .single();
      console.log(receiverData)
      // console.log(receiverData)
      // create object
      const messageObj = {
        sender_name: receiverData.data.receiver_name,
        sender_user_id: null,
        sender_email: receiverData.data.receiver_email,
        receiver_name: receiverData.data.sender_name,
        receiver_email: receiverData.data.sender_email,
        receiver_phone: twilioResponse.From,
        message: twilioResponse.Body,
        direction: "inbound",
        sms_message_sid: twilioResponse.SmsMessageSid,
        sms_sid: twilioResponse.SmsSid,
        message_sid: twilioResponse.MessageSid,
        from_country: twilioResponse.FromCountry,
        from_city: twilioResponse.FromCity,
        from_state: twilioResponse.FromState,
        from_zip: twilioResponse.FromZip,
      };
      await supabase.from("sms_messages").insert(messageObj);
      await supabase.from("applications")
        .update({ 'new_message_received': true })
        .eq('application_id', receiverData.data.application_id);
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: "Some Error Occured!" });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
