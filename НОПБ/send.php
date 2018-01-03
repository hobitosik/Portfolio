<?php
  require './PHPMailer/class.phpmailer.php';
  //подключаем класс phpmailer
  // очень важно в этом классе class.phpmailer.php если будут проблемы с кодировкой, я поменял строку 62 на такую.  public $CharSet = 'utf-8'; там была кодировка не utf-8
  $mail = new PHPMailer;


  $mail->From = 'from@test.ru';
  // отправитель
  $mail->FromName = $_POST['name']; 
  $mail->Sender = 'sender@test.ru';
  // имя отправителя

  $mail->AddAddress('address@yandex.ru', 'нопб.рф');
  // Тот кому прийдет письмо
  $mail->AddReplyTo('reply@yandex.ru', 'нопб.рф');
  // Тот кому прийдет ответ на это письмо

  $mail->IsHTML(true);
  // Письмо в формате HTML

  $mail->Subject = 'НОПБ - Вступить';
  // Тема письма в моем случае это имя отправителя
  $mail->Body    = '<p>Имя: ' . $_POST['name']. '</p><p>Телефон: ' . $_POST['phone'] .'</p><p>E-mail: ' . $_POST['email'] .'</p><p>Сообщение: ' . $_POST['message']. '</p>';
  // Текст письма

  if(!$mail->Send()) {
    // если письмо не отправилось
    echo 'Извените, произошла ошибка при отправке сообщения';

  } else {

    echo 'Сообщение отправлено';
    // Если письмо отправилось
  }

?>