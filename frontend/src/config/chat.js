//الغرض: إرجاع اسم الشخص الآخر في المحادثة الثنائية.
export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2 || !users[0] || !users[1] || !loggedUser)
    return "";
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
//الغرض: إرجاع كامل معلومات الشخص الآخر في المحادثة الثنائية.
export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length < 2 || !users[0] || !users[1] || !loggedUser)
    return null;
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
// الغرض: تحديد الهامش الأيسر (left margin) لرسالة معينة حسب من أرسلها (لعرض الصورة أو لا).
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
//الغرض: معرفة هل يجب عرض اسم المرسل أو صورته مع هذه الرسالة.
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
//الغرض: التحقق هل هذه آخر رسالة في المحادثة ومن شخص آخر.
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
//الغرض: معرفة هل هذه الرسالة من نفس مرسل الرسالة السابقة.
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
