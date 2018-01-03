<?php
    if($_POST)
    {
        $username = $_POST['msgName'];   // сохраняем в переменную данные полученные из поля c именем
        $usermail = $_POST['msgMail']; // сохраняем в переменную данные полученные
        $usermessage = $_POST['message'];

        $to = "to@mail.ru"; //куда отправлять письмо
        $from = $usermail; // от кого

        $subject = "Message from Landing Page"; //тема
        $headers = "Content-type: text/html; charset=UTF-8 \r\n";
        $headers .= "From: <".$usermail.">\r\n";
 
        // Формирование тела письма
        $msg  = "<html><body style='font-family:Arial,sans-serif;'>";
        $msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Message from Landing Page</h2>\r\n";
        $msg .= "<p><strong>From:</strong> ".$username."</p>\r\n";
        $msg .= "<p><strong>E-mail:</strong> ".$usermail."</p>\r\n";
        $msg .= "<p><strong>Message:</strong> ".$usermessage."</p>\r\n";
        $msg .= "</body></html>";


        // $result = 1;
        $result_mail = mail($to, $subject, $msg, $headers);
        if ($result_mail) {
            echo "<p>Awesome! You will have news from us soon.</p>";
        }
    }
      
 ?>