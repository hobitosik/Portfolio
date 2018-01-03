<?php
    if($_POST)
    {
        $usermail = $_POST['email-notify']; // сохраняем в переменную данные полученные

        $to = "to@mail.ru"; //куда отправлять письмо
        // $from = $usermail; // от кого

        $subject = "Notify me"; //тема
        $headers = "Content-type: text/html; charset=UTF-8 \r\n";
        $headers .= "From: <".$usermail.">\r\n";
 
        // Формирование тела письма
        $msg  = "<html><body style='font-family:Arial,sans-serif;'>";
        $msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Notify the android version</h2>\r\n";
        $msg .= "<p><strong>Notified by e-mail:</strong> ".$usermail."</p>\r\n";
        $msg .= "</body></html>";


        // $result = 1;
        $result_mail = mail($to, $subject, $msg, $headers);
        if ($result_mail) {
            echo "<p>Awesome! You will have news from us soon.</p>";
        }
    }
      
 ?>