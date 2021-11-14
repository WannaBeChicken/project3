document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#compose-form").onsubmit = post;
  // By default, load the inbox
  load_mailbox('inbox');


});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    for(i=0 ; i < emails.length; i++) {
      mail = emails[i];
      const button = document.createElement('button')
      button.setAttribute("data-id" , mail.id);
      button.setAttribute("class" , "open_mail");
      const div = document.createElement('div');
      const rec = document.createElement('h5');
      rec.innerHTML = mail.recipients;
      div.append(rec);
      const sub = document.createElement('h5');
      sub.innerHTML = mail.subject;
      div.append(sub);
      button.append(div);
      document.querySelector("#emails-view").append(button);
      //console.log(mail);
    }
      document.querySelectorAll(".open_mail").forEach(button => {
        button.onclick = () => {
          id = Number(button.dataset.id);
          load_mail(id);
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector("#mails-view").style.display = 'block';
        }
      })

      });

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#mails-view").style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


};

function post(event) {
  fetch('/emails',{
    method : "POST",
    body : JSON.stringify({
      recipients : document.querySelector('#compose-recipients').value,
      subject : document.querySelector('#compose-subject').value,
      body : document.querySelector('#compose-body').value,
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "Email sent successfully."){
      load_mailbox('sent');
    }
    else{
      document.querySelector("#error").innerHTML = data.error;
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector("#mails-view").style.display = 'none';

    }
  });
  return false;
}

function load_mail(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(mail => {
    console.log(mail);
    document.querySelector("#mails-view").innerHTML = `
    <div id = "detailed_view">
      <h5> To : ${mail.recipients}
      <h5> From : ${mail.sender}
      <h5> Subject : ${mail.subject}
      <h5> ${mail.timestamp}
      <h5> ${mail.body}
      `;
      if (mail.recipients.includes(document.querySelector("#user").innerHTML)) {
        div = document.querySelector("#detailed_view");
        reply = document.createElement("button");
        reply.id = "reply";
        reply.innerHTML = "Reply";
        div.append(reply);

        document.querySelector("#reply").onclick = () => {
          compose_email;

          document.querySelector('#compose-recipients').value = mail.sender;
          document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          document.querySelector("#mails-view").style.display = 'none';
        }
      }



  });



}
