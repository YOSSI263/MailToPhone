/*
Written by: abaye
Contact: abaye.ym@gmail.com
*/

function MailToPhone() {
/*
דברים שצריך לשפר: קבלת כמה מיילים יחד, מגיע בסדר הפוך
*/
 let user = '079999999' // מספר המערכת
 let pass = '111111' // סיסמא
 let up = ':'
 let ph1 = 'ivr2:/'
 let ph2 = '5' //מס' השלוחה להשמעה
 let ph3 = '/'
 let path = (`${ph1}${ph2}${ph3}`) //נתיב
 let token = (`${user}${up}${pass}`)
 let tag = 'ToPhone'
 let tzintuk = '1'
  
   let label = GmailApp.getUserLabelByName(tag)
   let messages = label.getThreads()
  if (messages.length > 0) {
     for (let message of messages) {
     let firstmessage = message.getMessages()[0]
      let subject = firstmessage.getSubject()
      let sender = firstmessage.getFrom()
      let to = firstmessage.getTo()
      let boddy = firstmessage.getPlainBody()
       boddy = boddy.replace(/\s{2,}/g, ' ')
       boddy = boddy.substring(0,2200) + ' עד כאן ההודעה!'
       boddy = boddy.replace(new RegExp(`"|>|<`, 'g',), '')
       subject = subject.replace(new RegExp(`"|>|<`, 'g'), '')
       sender = sender.replace(new RegExp(`"|>|<`, 'g'), '')
       to = to.replace(new RegExp(`"|>|<`, 'g'), '')
      let textms = (`להלן הודעת המייל שהתקבלה: מאת "${sender} אל ${to} :הנושא ${subject} גוף ההודעה: ${boddy}"`)
      
  let listfile = JSON.parse(UrlFetchApp.fetch(`https://call2all.co.il/ym/api/GetIVR2Dir?token=${token}&path=${path}`));
   if (listfile.responseStatus === 'OK') {
    let lastFileName = listfile.files
      .filter(file => file.fileType === 'AUDIO' || file.fileType === 'TTS')
      .map(file => file.name.split('.')[0])
      .find(fileName => !isNaN(fileName));
    let newNumber = Number(lastFileName || -1) + 1;
    let newName = newNumber.toString().padStart(3, '0');
    let filePath = `${path}${newName}.tts`;

        let data = {
         'token': token,
         'what': filePath,
         'contents': textms
        };
 
        let options = {
         'method' : 'post',
         'payload' : data
        };

          let response = UrlFetchApp.fetch('https://call2all.co.il/ym/api/UploadTextFile', options);
                         UrlFetchApp.fetch(`https://www.call2all.co.il/ym/api/RunTzintuk?token=${token}&phones=tzl:${tzintuk}`)
           Logger.log(response.getContentText());
           message.removeLabel(label)
    }
  }
}
}
