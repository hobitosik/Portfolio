<?php
  
  require './PHPMailer/class.phpmailer.php';
  //подключаем класс phpmailer
  // очень важно в этом классе class.phpmailer.php если будут проблемы с кодировкой, я поменял строку 62 на такую.  public $CharSet = 'utf-8'; там была кодировка не utf-8

  $mail = new PHPMailer;


  $mail->From = 'from@gmail.com';
  // отправитель
  $mail->FromName = $_POST['name']; 
  // имя отправителя
  $mail->AddAddress('address@5agency.ru', 'Ямойка');
  // Тот кому прийдет письмо
  $mail->AddReplyTo('reply@gmail.com', 'Ямойка');
  // Тот кому прийдет ответ на это письмо

  $mail->IsHTML(true);
  // Письмо в формате HTML

  $mail->Subject = 'Лендинг Ямойка / Получить скидку';
  // Тема письма в моем случае это имя отправителя
  $mail->Body    = '<p>Имя: ' . $_POST['name']. '</p><p>Телефон: ' . $_POST['phone'] .'</p>';
  // Текст письма

  // $mail->Send();

  if(!$mail->Send()) {
    // если письмо не отправилось
    echo 'Извените, произошла ошибка при отправке сообщения';

  } else {

    $body=file_get_contents("http://sms.ru/sms/send?api_id=APIID&to=NUMBERPHONE&text=".urlencode("Получить скидку. Имя: " . $_POST['name']. ". Телефон: " . $_POST['phone']));
    echo 'Сообщение отправлено';
    // Если письмо отправилось
  }

?>